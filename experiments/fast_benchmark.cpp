// Independent finite-size planted clique experiments on a Poisson 2-D toroidal hard RGG.
// VD and CN replicate Algorithms 1 and 2 of Avrachenkov et al. (2026).
// CN edge order: uniformly random among all valid candidate edges, equivalent to
// checking observed edges in uniformly random order and returning the first valid edge.
// HC uses uniformly sampled reference vertices for approximate harmonic centrality.
// Build: g++ -O3 -std=c++17 -o fast_benchmark experiments/fast_benchmark.cpp
#include <bits/stdc++.h>
using namespace std;
struct P {double x,y;};
struct Edge {int u,v;};
using G=vector<vector<int>>;
static uint64_t salt(uint64_t x) { x+=0x9e3779b97f4a7c15ull;x=(x^(x>>30))*0xbf58476d1ce4e5b9ull;x=(x^(x>>27))*0x94d049bb133111ebull;return x^(x>>31); }
static void add_sorted(vector<int>& v,int x){auto p=lower_bound(v.begin(),v.end(),x);if(p==v.end() || *p!=x)v.insert(p,x);}
struct World { G adj;vector<Edge> edges; vector<int> order; int n; };
static World build_world(mt19937_64 &rng,double mu,double mean_n){
 poisson_distribution<int> pd(mean_n); int n=pd(rng); if(n<60)throw runtime_error("unusually small N");
 uniform_real_distribution<double> U(0,1);
 vector<P> pts(n);for(auto &p:pts){p.x=U(rng);p.y=U(rng);}
 double r=sqrt(mu/(M_PI*mean_n)),r2=r*r;
 int g=max(3,int(floor(1.0/r)));vector<vector<int>> cells(g*g);
 for(int i=0;i<n;i++){
   int x=min(g-1,int(pts[i].x*g)),y=min(g-1,int(pts[i].y*g));cells[y*g+x].push_back(i);
 }
 G adj(n);vector<Edge> edges;edges.reserve(size_t(n*mu/2*1.3+100));
 for(int i=0;i<n;i++){
   int a=min(g-1,int(pts[i].x*g)),b=min(g-1,int(pts[i].y*g));
   for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++){
     int x=(a+dx+g)%g,y=(b+dy+g)%g;
     for(int j:cells[y*g+x])if(j>i){
       double xx=abs(pts[i].x-pts[j].x),yy=abs(pts[i].y-pts[j].y);
       xx=min(xx,1-xx);yy=min(yy,1-yy);
       if(xx*xx+yy*yy<=r2){adj[i].push_back(j);adj[j].push_back(i);edges.push_back({i,j});}
     }
   }
 }
 for(auto& v:adj)sort(v.begin(),v.end());
 vector<int> order(n);iota(order.begin(),order.end(),0);shuffle(order.begin(),order.end(),rng);
 return {move(adj),move(edges),move(order),n};
}
static int success_vd(const G& adj,const vector<int>& order,vector<uint8_t>& planted,int k){
 for(int j=0;j<k;j++)planted[order[j]]=1;
 // Higher degree wins; vertex ID ascending resolves tied degrees.
 pair<int,int> minimum={INT_MAX,INT_MAX};
 for(int j=0;j<k;j++){int v=order[j];minimum=min(minimum,make_pair(int(adj[v].size()),-v));}
 pair<int,int> maximum={INT_MIN,INT_MIN};
 for(int v=0;v<int(adj.size());v++)if(!planted[v])maximum=max(maximum,make_pair(int(adj[v].size()),-v));
 return minimum>maximum;
}
static void extend_clique(World& w,int former_k,int k){
 for(int t=former_k;t<k;t++){
    int u=w.order[t];
    for(int j=0;j<t;j++){
      int v=w.order[j];
      if(!binary_search(w.adj[u].begin(),w.adj[u].end(),v)){
         add_sorted(w.adj[u],v);add_sorted(w.adj[v],u);w.edges.push_back({u,v});
      }
    }
 }
}
static bool valid_cand(const G& adj,int u,int v,int needed,const vector<uint8_t>&planted,int& success){
 const auto &a=adj[u],&b=adj[v];
 if(int(min(a.size(),b.size()))<needed+1)return false;
 int count=0;bool all_planted=planted[u]&&planted[v];
 int tmp[128];int x=0,y=0;
 while(x<int(a.size())&&y<int(b.size())){
   int p=a[x],q=b[y];if(p<q){x++;continue;}if(q<p){y++;continue;}
   if(++count>needed)return false; if(count<=128)tmp[count-1]=p;
   all_planted&=planted[p];x++;y++;
 }
 if(count!=needed)return false;
 if(needed>128)return false;
 for(int i=0;i<needed;i++)for(int j=i+1;j<needed;j++)if(!binary_search(adj[tmp[i]].begin(),adj[tmp[i]].end(),tmp[j]))return false;
 success=all_planted?1:0;return true;
}
static int success_cn(const World& w,const vector<uint8_t>& planted,int k,mt19937_64& rng){
 // Uniformly choose among valid candidates: exactly the distribution of the
 // first valid edge encountered in a shuffled edge permutation.
 int valid=0,good=0,candidate;
 for(const Edge&e:w.edges){
   if(valid_cand(w.adj,e.u,e.v,k-2,planted,candidate)){
     valid++;good+=candidate;
   }
 }
 if(!valid)return 0;
 uniform_int_distribution<int> U(0,valid-1);return U(rng)<good;
}
static int success_hc_sampled(const World& w,const vector<uint8_t>& planted,int k,int pivots,mt19937_64& rng){
 int n=w.n;vector<int> sources(n);iota(sources.begin(),sources.end(),0);
 if(pivots==0)pivots=n;
 else for(int i=0;i<pivots;i++){uniform_int_distribution<int> U(i,n-1);int ix=U(rng);swap(sources[i],sources[ix]);}
 vector<float> score(n,0.0f);vector<int> distance(n),queue(n);vector<int> visited(n,0);
 for(int i=0;i<pivots;i++){
   int stamp=i+1;int st=sources[i],head=0,tail=0;queue[tail++]=st;visited[st]=stamp;distance[st]=0;
   while(head<tail){int v=queue[head++];int nd=distance[v]+1;
      for(int z:w.adj[v])if(visited[z]!=stamp){visited[z]=stamp;distance[z]=nd;queue[tail++]=z;}
   }
   for(int z=0;z<tail;z++){int v=queue[z];if(v!=st)score[v]+=1.0f/distance[v];}
 }
 vector<int> chosen(n);iota(chosen.begin(),chosen.end(),0);
 nth_element(chosen.begin(),chosen.begin()+k,chosen.end(),[&](int a,int b){return score[a]==score[b]?a<b:score[a]>score[b];});
 for(int j=0;j<k;j++)if(!planted[chosen[j]])return 0;
 return 1;
}
int main(int argc,char**argv){
 double mu=10;int trials=100, hc_trials=30,pivots=24,seed=773701;double mean_n=10000;
 string out="results_mu.csv";vector<int> ks={2,3,4,5,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30,33,36,40,44,48};
 for(int i=1;i<argc;i++){string s=argv[i];auto val=[&](){if(i+1>=argc)throw runtime_error("missing parameter for "+s);return string(argv[++i]);};
 if(s=="--mu")mu=stod(val());else if(s=="--trials")trials=stoi(val());else if(s=="--hc-trials")hc_trials=stoi(val());else if(s=="--pivots")pivots=stoi(val());else if(s=="--seed")seed=stoi(val());else if(s=="--out")out=val();else if(s=="--n")mean_n=stod(val());else if(s=="--ks"){ks.clear();stringstream ss(val());string z;while(getline(ss,z,','))ks.push_back(stoi(z));}else throw runtime_error("unknown arg "+s);
 }
 if(trials<1 || hc_trials>trials||pivots<0)throw runtime_error("bad trials or pivots");
 auto start=chrono::steady_clock::now();vector<array<int,3>> hits(ks.size(),{0,0,0});mt19937_64 rng(salt(seed)^salt((uint64_t)round(mu*1e4)));
 for(int rep=0;rep<trials;rep++){
   World w=build_world(rng,mu,mean_n);vector<uint8_t> planted(w.n,0);int prior=0;
   for(int j=0;j<int(ks.size());j++){
     int k=ks[j];if(k>=w.n)throw runtime_error("k >= n");
     extend_clique(w,prior,k);prior=k;
     hits[j][0]+=success_vd(w.adj,w.order,planted,k);
     hits[j][1]+=success_cn(w,planted,k,rng);
     if(rep<hc_trials)hits[j][2]+=success_hc_sampled(w,planted,k,pivots,rng);
   }
   if((rep+1)%max(1,trials/5)==0){auto sec=chrono::duration<double>(chrono::steady_clock::now()-start).count();cerr<<"mu="<<mu<<" rep="<<(rep+1)<<"/"<<trials<<" elapsed="<<setprecision(2)<<fixed<<sec<<"s\n";}
 }
 ofstream csv(out);csv<<"mu,k,algorithm,success_count,trials,rate\n";
 for(int j=0;j<int(ks.size());j++)for(int a=0;a<3;a++)if(a<2||hc_trials){int samples=a==2?hc_trials:trials;csv<<mu<<","<<ks[j]<<","<<(a==0?"VD":a==1?"CN":"HC")<<","<<hits[j][a]<<","<<samples<<","<<setprecision(9)<<(double(hits[j][a])/samples)<<"\n";}
 auto secs=chrono::duration<double>(chrono::steady_clock::now()-start).count();cout<<"DONE mu="<<mu<<" elapsed="<<secs<<" sec\n";
}
