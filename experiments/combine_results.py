import csv,json, pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]
sim=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'experiments'/'runs'
mu_values=[1,5,10,20]
curves=[]
for mu in mu_values:
    src=sim/f'mu_{mu}.csv'
    assert src.exists(),f'Missing {src}'
    records=list(csv.DictReader(src.open()))
    if mu==5:
        alt=sim/'mu_5_hc384.csv'
        assert alt.exists(),f'Missing {alt}'
        records=[x for x in records if x['algorithm']!='HC']+[x for x in csv.DictReader(alt.open()) if x['algorithm']=='HC']
    for x in records:
        if x['algorithm']=='BC':continue
        curves.append({'mu':float(x['mu']),'k':int(x['k']),'algorithm':x['algorithm'],'success_count':int(x['success_count']),'trials':int(x['trials']),'rate':float(x['rate'])})
curves.sort(key=lambda r:(r['mu'],r['k'],r['algorithm']))
ks=sorted(set(v['k'] for v in curves));assert len(ks)==21
for mu in mu_values:
    for k in ks:
        for alg in ['VD','CN','HC']:
            v=[r for r in curves if (r['mu'],r['k'],r['algorithm'])==(mu,k,alg)]
            assert len(v)==1,(mu,k,alg)
            assert v[0]['trials']==(75 if alg=='HC' else 1000)
            assert 0<=v[0]['success_count']<=v[0]['trials']
            assert abs(v[0]['rate']-v[0]['success_count']/v[0]['trials'])<1e-8
meta={
  'model':'2D hard random geometric graph on unit torus, Euclidean toroidal metric',
  'vertex_count':'Poisson(10000)', 'n_expected':10000, 'dimension':2,
  'radius_formula':'sqrt(mu/(pi*10000))',
  'mu_values':mu_values,
  'slide_mu_values':[1,5,20],
  'additional_mu_values':[10],
  'k_values':ks,
  'trials_vd_cn':1000,
  'trials_hc':75,
  'hc_sources':{'1':'exact all vertices','5':384,'10':128,'20':128},
  'VD':'top k degrees; ties broken by ascending vertex index',
  'CN':'edge with k-2 common neighbours that induce a clique; first valid in a uniformly shuffled edge order (implemented by uniform selection from all valid edges)',
  'HC':'select top k approximate harmonic scores using sampled reference vertices; exact all-source HC for mu=1, Monte Carlo landmark approximation for mu=5,10,20',
  'sampling':'1000 independent graph instances per (mu,k) for VD/CN; 75 per (mu,k) for HC. For a fixed replicate, the same base graph is reused as k varies; HC mu=5 separately simulated with the same parameter distributions.',
  'seed':20261118,
  'source':'Avrachenkov, Bobu, Litvak, Michielan (2026), Planted clique recovery in random geometric graphs, Journal of Complex Networks, Fig 3; additional independently simulated results, not digitized paper curves.',
  'note':'Algorithm 2 results depend on edge iteration order for finite samples; random ordering is used here. HC approximations have additional error beyond binomial sample uncertainty.'
}
result={'metadata':meta,'curves':curves}
with (root/'experiments/results.json').open('w') as f:json.dump(result,f,indent=2)
with (root/'experiments/results.csv').open('w',newline='') as f:
 writer=csv.DictWriter(f,fieldnames=['mu','k','algorithm','success_count','trials','rate']);writer.writeheader();writer.writerows(curves)
print('Combined',len(curves),'points',len(ks),'k values, params',mu_values)
