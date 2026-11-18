"""Talk-ready qualitative diagrams built from cells 2 and 4 of Planted_clique_RGG.ipynb.

These are NOT finite-n probability plots. The colored regions originate from the notebook's case formulas but have
qualitative joins and slopes redrawn for the talk. Their schematic transitions
are not finite-size threshold estimates. The horizontal
position is a deliberately piecewise-logarithmic, regime-equalized mapping to
make the 3 asymptotic regimes equally legible in a talk.
"""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyBboxPatch, Patch
from scipy.special import lambertw
from scipy.interpolate import PchipInterpolator
from matplotlib.colors import ListedColormap

ROOT = Path(__file__).resolve().parent
N = 1e9
LOGN = np.log(N)
ST = 0.1
DT = 100.
EPS = 2/3
LOW, HI = 1e-2, N
B1, B2 = ST * LOGN, DT * LOGN

NAVY = '#17324F'
SLATE = '#4D6276'
GREY = '#9CA9B6'
GRID = '#71869A'
GREEN = '#A7D8B9'
ORANGE = '#FFD39E'
RED = '#F1A29A'
WHITE = '#FFFFFF'
BORDER = '#8194A5'
BLUE_LIGHT = '#E9F0F8'

plt.rcParams.update({
    'font.family':'DejaVu Sans',
    'font.size': 13,
    'axes.edgecolor': BORDER,
    'svg.fonttype': 'none',
    'pdf.fonttype': 42,
    'savefig.facecolor':'white',
})

# Piecewise log x axis, intentionally equal width by asymptotic regime.
def warp(mu):
    mu = np.clip(np.asarray(mu, dtype=float), LOW, HI)
    ln=np.log(mu)
    q1, q2=np.log(B1), np.log(B2)
    z=np.where(mu <= B1,
               (ln - np.log(LOW))/(q1-np.log(LOW)) / 3,
               np.where(mu <= B2,
                        1/3+(ln-q1)/(q2-q1)/3,
                        2/3+(ln-q2)/(np.log(HI)-q2)/3))
    return z


def H_inv(alpha, branch=0):
    return np.exp(lambertw((1/alpha - 1)/np.e, k=branch).real+1)


def vd_boundaries(mu):
    """Original notebook cell 2, vectorized and with explicit clipping.

    Upper curve: notebook 'curve_values' (boundary of guaranteed recovery).
    Lower curve: positive failure bound in connectivity and dense regimes.
    """
    mu=np.asarray(mu)
    upper=np.zeros_like(mu)
    lower=np.zeros_like(mu)
    sparse=mu < ST*LOGN
    conn=(mu >= ST*LOGN)&(mu <= DT*LOGN)
    dense=mu > DT*LOGN
    upper[sparse]=LOGN/np.log(LOGN/mu[sparse])
    alpha=mu[conn]/LOGN
    T=mu[conn]*H_inv(alpha,0)
    t=np.zeros_like(T)
    mask=alpha>=1
    t[mask]=mu[conn][mask]*H_inv(alpha[mask],-1)
    upper[conn]=T-t
    lower[conn]=T-mu[conn]
    upper[dense]=0.1*mu[dense]
    lower[dense]=np.sqrt(mu[dense])
    return np.clip(upper, 1, N), np.clip(lower, 1, N), sparse, conn, dense


def cn_logf(X,Y):
    """Original notebook cell 4, including numerical constant C=0.391."""
    C=.391
    st=.5*np.log(2*np.pi*Y)+Y*np.log(Y/np.e)
    mask1=Y>X
    mask2=(Y<C*X)&(~mask1)
    mask3=(~mask1)&(~mask2)
    out=np.zeros_like(Y)
    out[mask1]=st[mask1]-np.log(X[mask1])-Y[mask1]*np.log(X[mask1])-X[mask1]
    out[mask2]=st[mask2]-np.log(X[mask2])-Y[mask2]*np.log(C*X[mask2])+C*X[mask2]
    out[mask3]=st[mask3]-np.log(X[mask3])-Y[mask3]*np.log(Y[mask3]/np.e)
    return out


def common_axis(ax, title, subtitle, compact=False):
    ax.set_facecolor(WHITE)
    ax.set_yscale('log')
    ax.set_xlim(0,1)
    ax.set_ylim(1,N)
    ax.set_xticks([])
    ax.set_yticks([1, LOGN, N])
    ax.set_yticklabels(['1',r'$\log n$',r'$n$'])
    ax.tick_params(axis='y', labelsize=14 if not compact else 11, length=0, pad=12, colors=NAVY)
    for spine in ax.spines.values():
        spine.set_linewidth(1.3)
        spine.set_color(BORDER)
    ax.axhline(LOGN, color=GRID, alpha=.28, lw=1.0, ls=(0,(3,4)), zorder=8)
    # Two identical gray uncertainty bands at the boundaries of the three regimes.
    # Their widths are purely visual and the same in VD and CN.
    for edge in [1/3, 2/3]:
        ax.axvspan(edge-.013, edge+.013, facecolor='#85919C', alpha=.92, zorder=11)
        ax.axvline(edge, color='#657181', lw=1.4, alpha=.95, zorder=12)
    trans=ax.transAxes
    labels=[('SUB-CONNECTIVITY',r'$\mu\ll\log n$'),('CONNECTIVITY',r'$\mu\asymp\log n$'),('SUPER-CONNECTIVITY',r'$\mu\gg\log n$')]
    for j,(lab,math) in enumerate(labels):
        x0=j/3
        ax.add_patch(Rectangle((x0,.998),1/3,.148,transform=trans, facecolor=BLUE_LIGHT,edgecolor=WHITE,lw=3,clip_on=False,zorder=13))
        ax.text(x0+1/6,1.091,lab,fontsize=12 if not compact else 8.7,ha='center',va='center',transform=trans,color=NAVY,fontweight='bold',zorder=14)
        ax.text(x0+1/6,1.036,math,fontsize=13 if not compact else 10.5,ha='center',va='center',transform=trans,color=SLATE,zorder=14)
    ax.set_title(title, loc='left', pad=95 if not compact else 69, size=22 if not compact else 16.5, color=NAVY, weight='bold')
    if subtitle and not compact:
        ax.text(1.0,1.230, subtitle,transform=trans,ha='right',va='center',fontsize=10.5,color=SLATE,style='italic')
    ax.set_ylabel('$k$', fontsize=21 if not compact else 15, rotation=0, labelpad=22,color=NAVY)
    ax.text(.5,-.085,r'Increasing mean degree $\mu\quad\longrightarrow$',transform=trans,ha='center',va='center',fontsize=15 if not compact else 11.5,color=NAVY)
    # A small divider at the left and right end of regime bands to avoid the visual impression of sharp finite-n thresholds.


def smoothstep(t):
    t=np.clip(t,0.0,1.0)
    return t*t*(3.0-2.0*t)


def _interpolated_value(x,y,v):
    return float(np.interp(v,x,y))


def _slope(x,y,v,h=.005):
    return (_interpolated_value(x,y,v+h)-_interpolated_value(x,y,v-h))/(2*h)


def hermite_bridge(x, log_y, start, stop, left_slope=None, right_slope=None,
                   right_value=None):
    """C1 connector for log10(k) vs schematic x (not a fitted threshold)."""
    left_value = _interpolated_value(x,log_y,start)
    if right_value is None:
        right_value = _interpolated_value(x,log_y,stop)
    if left_slope is None:
        left_slope = _slope(x,log_y,start)
    if right_slope is None:
        right_slope = _slope(x,log_y,stop)
    t = (x-start)/(stop-start)
    mask=(x>=start)&(x<=stop)
    t=t[mask]
    h00=2*t**3-3*t**2+1
    h10=t**3-2*t**2+t
    h01=-2*t**3+3*t**2
    h11=t**3-t**2
    out=log_y.copy()
    out[mask]= (h00*left_value+h10*(stop-start)*left_slope
                +h01*right_value+h11*(stop-start)*right_slope)
    return out


def vd_schematic_curves():
    """Return a qualitative VD upper/lower construction on a common plot grid.

    - sub: original notebook upper trend; no red lower branch.
    - sub/conn: smoothly attach a slightly lowered connectivity upper boundary.
    - conn/super: continuous (a visible corner is allowed).
    - super: two straight lines in the displayed log-k coordinates.  The red
      failure limit is shallower than the upper green/orange boundary; neither
      has a plateau.  Super slopes are SCHEMATIC, not asymptotic estimates.
    """
    mu=np.logspace(np.log10(LOW),np.log10(HI),6000)
    xx=warp(mu)
    upper_raw,lower_raw,_,_,_=vd_boundaries(mu)
    edge=2/3
    # Lower the upper orange boundary gently across the middle of connectivity,
    # with no displacement at either end of that regime.
    t=np.clip((xx-1/3)/(1/3),0,1)
    in_conn=(xx>=1/3)&(xx<=edge)
    upper=upper_raw.copy()
    upper[in_conn]*=(1-0.12*np.sin(np.pi*t[in_conn])**2)
    log_up=np.log10(upper)
    # First join is C1, not merely continuous, and starts before the gray band.
    log_up=hermite_bridge(xx,log_up,.287,.415)
    # Within the second band, reach the start of the straight super branch.
    log_up=hermite_bridge(xx,log_up,.615,edge,
                          right_slope=5.6,right_value=np.log10(600.))
    right=xx>=edge
    log_up[right]=np.log10(600.)+(xx[right]-edge)/(1-edge)*(8-np.log10(600.))
    upper=10**log_up

    # Red area starts IN connectivity, not in sub-connectivity; the gray stripe
    # masks its vertical left boundary.  There is no invented sub-regime red.
    lower=lower_raw.copy()
    first=(xx>=1/3)&(xx<=.46)
    lmix=smoothstep((xx[first]-1/3)/(.46-1/3))
    lower[first]=(1-lmix)*(0.61*upper[first])+lmix*lower_raw[first]
    # Smoothly reach a designated super-regime origin, then use a straight
    # rising line on the log(k) axis with smaller slope than upper.
    llog=np.log10(np.maximum(1.,lower))
    llog=hermite_bridge(xx,llog,.615,edge,
                         right_slope=4.8,right_value=np.log10(300.))
    llog[right]=np.log10(300.)+(xx[right]-edge)/(1-edge)*(np.log10(3e6)-np.log10(300.))
    lower=10**llog
    lower=np.minimum(lower,upper*.87)
    return xx,upper,lower


def draw_vd(ax, compact=False):
    xx,upper,lower=vd_schematic_curves()
    ax.axhspan(1,N,color=GREEN,zorder=0)
    ax.fill_between(xx,1,upper,facecolor=ORANGE,lw=0,zorder=1)
    mask=xx>=1/3
    ax.fill_between(xx[mask],1,lower[mask],facecolor=RED,lw=0,zorder=2)
    ax.plot(xx,upper,color='#98754B',alpha=.76,lw=1.65,zorder=4)
    ax.plot(xx[mask],lower[mask],color='#B35D56',alpha=.82,lw=1.65,zorder=4)
    if not compact:
        ax.text(.50,2e7,'EXACT RECOVERY\nGUARANTEED',ha='center',va='center',fontsize=16,weight='bold',color='#285F4A',zorder=7,linespacing=1.3)
        ax.text(.855,1.3e4,'NO GUARANTEE',ha='center',va='center',fontsize=14,weight='bold',color='#875727',zorder=7)
        ax.text(.85,20,'VD FAILURE',ha='center',va='center',fontsize=14,weight='bold',color='#9E3D38',zorder=7)


def cn_schematic_curves():
    """Extract the notebook's orange band and smooth only the second join.

    A cubic Hermite bridge in log(k) enforces C1-continuity through the
    connectivity-to-super switch in the visually equalized horizontal scale.
    """
    c=(np.sqrt(3)/(3*np.pi))-(1/(2*np.pi))
    xline=lambertw(-c/N,k=-1).real/(-c)
    mu=np.logspace(np.log10(LOW),np.log10(8*xline),1550)
    y=np.logspace(0,np.log10(N),1100)
    X,Y=np.meshgrid(mu,y)
    orange=(cn_logf(X,Y)<=np.log(50*N))
    idx_first=np.argmax(orange,axis=0)
    idx_last=(orange.shape[0]-1)-np.argmax(orange[::-1,:],axis=0)
    lower=y[idx_first]
    upper=y[idx_last]
    xx=warp(mu)
    # At the left-hand transition (~1/3) keep the original source curve:
    # this join was already satisfactory.  The right-hand transition in the
    # equalized coordinate has a visible slope kink; adjust both boundaries.
    up_log=np.log10(upper)
    lo_log=np.log10(lower)
    up_log=hermite_bridge(xx,up_log,.610,.694)
    lo_log=hermite_bridge(xx,lo_log,.610,.694)
    up=10**up_log
    lo=10**lo_log
    lo=np.minimum(lo,up*.95)
    split=float(warp(8*xline))
    return xx,up,lo,split


def draw_cn(ax, compact=False):
    xx,upper,lower,split=cn_schematic_curves()
    ax.axhspan(1,N,color=GREEN,zorder=0)
    ax.fill_between(xx,lower,upper,facecolor=ORANGE,lw=0,zorder=1)
    ax.plot(xx,upper,color='#977448',lw=1.5,alpha=.75,zorder=5)
    # Do not outline the y=1 floor: it is the coordinate boundary, not a
    # theoretical curve.  The second branch rises inside connectivity.
    nonfloor=(lower>1.025)
    ax.plot(xx[nonfloor],lower[nonfloor],color='#977448',lw=1.5,alpha=.75,zorder=5)
    ax.axvline(split,color='#283F54',lw=2.5 if not compact else 2.0,
               linestyle=(0,(6,3.5)),alpha=.98,zorder=14)
    if not compact:
        ax.text(.47,2e7,'EXACT RECOVERY\nGUARANTEED',ha='center',va='center',fontsize=16,weight='bold',color='#285F4A',zorder=7,linespacing=1.3)
        ax.text(.40,5.7,'NO GUARANTEE',ha='center',va='center',fontsize=13.5,weight='bold',color='#875727',zorder=7)

def add_legend(fig, isvd, compact=False):
    items=[('Guaranteed exact recovery', GREEN), ('No theoretical guarantee',ORANGE)]
    if isvd:
        items.append(('VD failure guaranteed', RED))
    items.append(('Regime transition', '#85919C'))
    y=.096 if not compact else .07
    # Deliberately fixed x positions for consistent identical diagrams.
    xs=np.linspace(.135,.80,len(items)) if not compact else np.linspace(.14,.82,len(items))
    for (caption,color),x in zip(items,xs):
        fig.patches.append(Rectangle((x,y-.008),.025 if not compact else .018,.016 if not compact else .015,transform=fig.transFigure,facecolor=color,edgecolor='#A7B4C1',lw=.45))
        fig.text(x+(.032 if not compact else .023),y,caption,ha='left',va='center',fontsize=10.7 if not compact else 8.0,color=NAVY)
    fig.text(.51,.036,'Schematic regimes  •  gray bands mark regime changes; dashed CN line marks an additional qualitative split',ha='center',va='center',color=SLATE,fontsize=9 if not compact else 7.5)


def save_one(kind,compact=False):
    fig=plt.figure(figsize=(15.6,8.6) if not compact else (10.5,7.0),facecolor='white')
    ax=fig.add_axes([.09,.20,.86,.58] if not compact else [.09,.175,.86,.60])
    isvd=kind=='VD'
    common_axis(ax, 'VERTEX DEGREE  (VD)' if isvd else 'COMMON NEIGHBORS  (CN)',
                r'Recovery regions in the $(\mu,k)$ plane', compact)
    draw_vd(ax,compact) if isvd else draw_cn(ax,compact)
    add_legend(fig,isvd,compact)
    stem = f'Qualitative_{kind}'+('_compact' if compact else '')
    for ext in ['svg','pdf','png']:
        opts={'dpi':215} if ext=='png' else {}
        fig.savefig(ROOT/(stem+'.'+ext),facecolor='white',**opts)
    plt.close(fig)


def save_pair():
    fig=plt.figure(figsize=(18.0,8.8),facecolor='white')
    axs=[fig.add_axes([.07,.23,.42,.54]),fig.add_axes([.57,.23,.42,.54])]
    for ax,isvd in zip(axs,[True,False]):
        common_axis(ax, 'VERTEX DEGREE  (VD)' if isvd else 'COMMON NEIGHBORS  (CN)','',compact=True)
        draw_vd(ax,True) if isvd else draw_cn(ax,True)
    # A single collective legend with fixed swatches (no misleading red for CN).
    items=[('Guaranteed exact recovery', GREEN), ('No theorem / unresolved',ORANGE),('VD failure guaranteed', RED),('Regime transition', '#85919C')]
    for (lab,color),x in zip(items,[.12,.36,.58,.79]):
        fig.patches.append(Rectangle((x,.118),.022,.017,transform=fig.transFigure,facecolor=color,edgecolor='#A7B4C1',lw=.45))
        fig.text(x+.028,.126,lab,ha='left',va='center',fontsize=11,color=NAVY)
    fig.text(.5,.054,'Schematic regime widths  |  Shared gray transitions  |  CN dashed line marks a separate dense-regime split',ha='center',va='center',color=SLATE,fontsize=11)
    stem=ROOT/'Qualitative_VD_CN_comparison'
    for ext in ['svg','pdf','png']:
        opts={'dpi':210} if ext=='png' else {}
        fig.savefig(str(stem)+'.'+ext,facecolor='white',**opts)
    plt.close(fig)


if __name__ == '__main__':
    for kind in ['VD','CN']:
        save_one(kind,False)
        save_one(kind,True)
    save_pair()
    print('DONE')
