import csv, matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter
from pathlib import Path
BASE=Path(__file__).resolve().parent
path=str(BASE/'runs/mu_10.csv')
rows=list(csv.DictReader(open(path)))
fig,ax=plt.subplots(figsize=(12,6.2),dpi=190)
fig.patch.set_facecolor('#ffffff')
ax.set_facecolor('#ffffff')
colors={'VD':'#367f9d','CN':'#dd8941','HC':'#518b61'}
labels={'VD':'Vertex Degree (VD)','CN':'Common Neighbors (CN)','HC':'Harmonic Centrality (HC)*'}
for alg in ['VD','CN','HC']:
 r=sorted([v for v in rows if v['algorithm']==alg],key=lambda x:int(x['k']))
 xx=[int(v['k']) for v in r]; yy=[float(v['rate']) for v in r]
 ax.plot(xx,yy,marker='o',ms=5.2,markerfacecolor='white',markeredgewidth=1.8,linewidth=2.9,linestyle='--' if alg=='HC' else '-',c=colors[alg],label=labels[alg])
ax.set_xlim(1.8,40.2);ax.set_ylim(-.025,1.025)
ax.set_xticks([2,5,10,15,20,25,30,35,40]);ax.set_yticks([0,.2,.4,.6,.8,1.0]);ax.yaxis.set_major_formatter(PercentFormatter(1.0))
ax.set_xlabel('Planted clique size  k',fontsize=14,labelpad=12,fontweight='bold',color='#36566a')
ax.set_ylabel('Exact recovery probability',fontsize=14,labelpad=14,fontweight='bold',color='#36566a')
ax.grid(axis='y',alpha=.55,color='#bfced7',lw=.9)
for spine in ('top','right'):ax.spines[spine].set_visible(False)
ax.spines['left'].set_color('#90adbc');ax.spines['bottom'].set_color('#90adbc')
ax.tick_params(axis='both',labelsize=12,colors='#4e7080')
fig.text(.083,.992,'μ = 10  |  ADDITIONAL EXPERIMENT',fontsize=18,fontweight='bold',color='#274f65',va='top')
fig.text(.083,.906,'2D toroidal hard RGG · N ~ Poisson(10,000) · d = 2 · 2 ≤ k ≤ 40',fontsize=12.5,color='#5a7b8a')
leg=ax.legend(loc='lower right',bbox_to_anchor=(.99,.10),fontsize=12,frameon=True,facecolor='white',edgecolor='#e0e8eb',framealpha=.96)
fig.text(.083,.025,'VD/CN: 1,000 independent samples per point     ·     * HC: 75 samples, estimated from 128 reference vertices',fontsize=10.5,color='#617d89')
fig.subplots_adjust(left=.086,right=.966,bottom=.18,top=.82)
out=str(BASE/'preview_mu10.png');fig.savefig(out,facecolor='white',bbox_inches='tight',pad_inches=.12)
print(out)
