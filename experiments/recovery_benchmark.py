#!/usr/bin/env python3
"""Reproducible finite-n comparisons on 2-D toroidal hard RGGs with planted clique.

Exact n, not N~Poisson(n). Fixed placement and candidate ordering within each
(replication,mu); every k starts from the same natural graph and ordered planted
candidates. All four algorithms use only the observed graph.

VD: top k degrees.
CN: shuffle observed edges and return the first edge with exactly k-2 common
    neighbors that induce a clique. If none, return empty set.
HC: top k harmonic centrality via scipy unweighted shortest paths (exact for
    n <= 1000 by default; for larger n, sampled-source approximation).
BC: top k *approximated* betweenness via NetworkX sampled source pivots.

The recorded CN success depends on scan ordering; this is intentional and
reproducible. Each curve uses independent replications, and confidence intervals
are not inferred from a single visualization. Add --trials for precision.

Dependencies: numpy, scipy, networkx. Example:
python experiments/recovery_benchmark.py --n 300 --trials 30 --centrality-trials 20 --bc-pivots 24 --out experiments/results.json
"""
import argparse, csv, json, math, os, random, time
import numpy as np
import scipy.sparse as sp
from scipy.spatial import cKDTree
from scipy.sparse.csgraph import shortest_path
import networkx as nx

def stable_top(scores, k):
    return set(sorted(range(len(scores)), key=lambda i: (-float(scores[i]), i))[:k])

def planted_instance(coords, mu, clique_order, k, rng):
    n=len(coords);r=math.sqrt(mu/(math.pi*n))
    if r>=.25: raise ValueError(f"r={r:.4g} >=1/4; reduce mu or increase n")
    natural_pairs=np.array(list(cKDTree(coords,boxsize=1.0).query_pairs(r,output_type='set')), dtype=np.int32).reshape(-1,2)
    edges={tuple(sorted(map(int,p))) for p in natural_pairs}
    true=set(clique_order[:k]);all_edges=set(edges)
    for a in true:
        for b in true:
            if a<b:all_edges.add((a,b))
    neighbors=[set() for _ in range(n)]
    for a,b in all_edges:neighbors[a].add(b);neighbors[b].add(a)
    return edges,all_edges,neighbors,true

def run_vd(neighbors,k):
    return stable_top([len(a) for a in neighbors],k)

def run_cn(all_edges, neighbors, k, rng):
    pairs=list(all_edges);rng.shuffle(pairs)
    for u,v in pairs:
        common=neighbors[u].intersection(neighbors[v])
        if len(common)!=k-2:continue
        if all((b in neighbors[a]) for idx,a in enumerate(sorted(common)) for b in sorted(common)[idx+1:]):
            return common | {u,v}
    return set()

def run_hc(neighbors,k,pivots=0,seed=0):
    n=len(neighbors)
    rows=[];cols=[]
    for i,ns in enumerate(neighbors):
        rows.extend([i]*len(ns));cols.extend(ns)
    data=np.ones(len(rows),dtype=np.int8)
    g=sp.csr_matrix((data,(rows,cols)),shape=(n,n))
    if pivots and pivots<n:
        sources=np.random.default_rng(seed).choice(n,size=pivots,replace=False)
        dist=shortest_path(g, directed=False, unweighted=True,indices=sources)
        axis=0
    else:
        dist=shortest_path(g, directed=False, unweighted=True)
        axis=1
    with np.errstate(divide='ignore',invalid='ignore'):
        inv=np.where((dist>0)&np.isfinite(dist),1.0/dist,0.0)
    return stable_top(inv.sum(axis=axis),k)

def run_bc(neighbors,k,pivots,seed):
    g=nx.Graph();g.add_nodes_from(range(len(neighbors)))
    g.add_edges_from((i,j) for i,xs in enumerate(neighbors) for j in xs if j>i)
    num=min(len(neighbors),int(pivots))
    score=nx.betweenness_centrality(g,k=num,seed=seed,normalized=True)
    return stable_top([score[i] for i in range(len(neighbors))],k)

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--n',type=int,default=300)
    ap.add_argument('--trials',type=int,default=30)
    ap.add_argument('--centrality-trials',type=int,default=20)
    ap.add_argument('--bc-pivots',type=int,default=24)
    ap.add_argument('--hc-pivots',type=int,default=0,help='0=exact for n<=1000, automatic source sample above')
    ap.add_argument('--mu',type=float,nargs='+',default=[2.5,7.5,38.0])
    ap.add_argument('--medium-index',type=int,default=1)
    ap.add_argument('--ks',type=int,nargs='+',default=[2,3,4,5,6,8,10,12,15,20,25,30])
    ap.add_argument('--seed',type=int,default=20261117)
    ap.add_argument('--out',default='experiments/results.json')
    args=ap.parse_args()
    if not(0<=args.medium_index<len(args.mu)):ap.error('invalid --medium-index')
    if args.trials<1 or args.centrality_trials<0:ap.error('trials >= 1; centrality-trials >= 0')
    if max(args.ks)>args.n:ap.error('k > n')
    if max(args.mu)>=math.pi*args.n/16:ap.error('mu violates r<1/4')
    hp=args.hc_pivots or (min(args.n, max(64,2*args.bc_pivots)) if args.n>1000 else 0)
    start=time.monotonic();rows=[]
    for regime,mu in enumerate(args.mu):
        print(f'calculating mu={mu:g}, n={args.n} (regime {regime+1}/{len(args.mu)})',flush=True)
        # Same latent geometry and same ordered candidate set across all k in a repetition.
        for t in range(args.trials):
            gen=np.random.default_rng(np.random.SeedSequence([args.seed,regime,t]))
            coords=gen.random((args.n,2));candidates=gen.permutation(args.n).tolist()
            for k in args.ks:
                graph_edges,obs_edges,nb,true=planted_instance(coords,mu,candidates,k,gen)
                trial_seed=args.seed+100000*regime+1000*t+7*k
                results={'VD':int(run_vd(nb,k)==true),'CN':int(run_cn(obs_edges,nb,k,random.Random(trial_seed))==true)}
                if regime==args.medium_index and t<args.centrality_trials:
                    results['HC']=int(run_hc(nb,k,hp,trial_seed)==true)
                    results['BC']=int(run_bc(nb,k,args.bc_pivots,trial_seed)==true)
                for algorithm,success in results.items():
                    rows.append({'mu':float(mu),'regime':regime,'k':int(k),'replication':t,'algorithm':algorithm,'success':success})
            if (t+1)%max(1,args.trials//3)==0:print(f'  {t+1}/{args.trials} repetitions completed',flush=True)
    grouped={}
    for row in rows:
        key=(row['mu'],row['k'],row['algorithm'])
        if key not in grouped:grouped[key]=[0,0]
        grouped[key][0]+=row['success'];grouped[key][1]+=1
    curves=[{'mu':a,'k':b,'algorithm':c,'success_count':s,'trials':t,'rate':s/t}
            for (a,b,c),(s,t) in sorted(grouped.items())]
    result={'metadata':{'model':'2D periodic toroidal hard RGG, n fixed','n':args.n,
       'mu_values':args.mu,'k_values':args.ks,'trials_vd_cn':args.trials,
       'trials_hc_bc':min(args.trials,args.centrality_trials),'centralities_at_mu':args.mu[args.medium_index],
       'harmonic':f'approx sampled-source harmonic with {hp} sources' if hp else 'exact all-pairs unweighted shortest paths','betweenness':f'approximate NetworkX betweenness with {min(args.bc_pivots,args.n)} source pivots',
       'CN':'first valid edge in deterministically shuffled edge scan; size and clique test',
       'conditioning':'exactly n vertices, independent of Poisson(n) paper model',
       'seed':args.seed,'elapsed_seconds':round(time.monotonic()-start,3)}, 'curves':curves}
    os.makedirs(os.path.dirname(os.path.abspath(args.out)),exist_ok=True)
    with open(args.out,'w') as f:json.dump(result,f,indent=2)
    csvpath=os.path.splitext(args.out)[0]+'.csv'
    with open(csvpath,'w',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=['mu','k','algorithm','success_count','trials','rate'])
        writer.writeheader();writer.writerows([{x:c[x] for x in writer.fieldnames} for c in curves])
    print(f'Saved {args.out} and {csvpath}; {result["metadata"]["elapsed_seconds"]}s',flush=True)

if __name__=='__main__':main()
