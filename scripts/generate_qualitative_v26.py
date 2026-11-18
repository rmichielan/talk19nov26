from pathlib import Path
import sys, math, html
import numpy as np
sys.path.insert(0,str(Path(__file__).resolve().parent))
import qualitative_v3_reference as original

OUT=Path(__file__).resolve().parent.parent/'src/assets/qualitative';OUT.mkdir(parents=True,exist_ok=True)
C={'green':'#A7D8B9','orange':'#FFD39E','red':'#F1A29A','shade':'#85919C','blue':'#17324F','grid':'#d9e3eb','border':'#718698'}

def points_arr(xs,ys):return ' '.join((f'{x:.2f},{y:.2f}' for x,y in zip(xs,ys)))

def svggen(alg, variant):
    full = variant=='full'; titleheads = (alg=='cn' or not full)
    w=760 if full else 650;h=(530 if alg=='cn' else 448) if full else 214
    L=62 if full else 46;R=w-(20 if full else 12);top=86 if full and titleheads else (32 if full else 34)
    base=(430 if alg=='cn' else 362) if full else 178
    H=base-top;W=R-L
    min_log=0.0 if full else 0.0; max_log=9.0 if full else 3.3
    def X(a):return L+np.asarray(a)*W
    def Y(y):return base-(np.log10(np.clip(y,1,1e9))-min_log)/(max_log-min_log)*H
    if alg=='vd':
        xx, upper, lower=original.vd_schematic_curves()
        mask=xx >= (1/3)
        xmax=1.0
    else:
        xx, upper, lower, split=original.cn_schematic_curves()
        mask=None;xmax=float(xx.max())
    dense_samples = np.linspace(0,1,800)
    # Rendering samples follow the original v3 arrays; no new region equations.
    xu=X(xx); yu=Y(upper);yl=Y(lower)
    s=[]
    a=s.append
    a(f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{alg.upper()} qualitative exact-recovery regimes">')
    a(f'<defs><clipPath id="clip-{alg}-{variant}"><rect x="{L}" y="{top}" width="{W}" height="{H}"/></clipPath></defs>')
    a(f'<rect width="{w}" height="{h}" fill="white"/>')
    if titleheads:
        labs=['SUB-CONNECTIVITY','CONNECTIVITY','SUPER-CONNECTIVITY']; subs=['μ ≪ log n','μ ≍ log n','μ ≫ log n']
        for i in range(3):
            x=L+i*W/3
            a(f'<rect x="{x+1:.2f}" y="1" width="{W/3-2:.2f}" height="{top-3}" fill="#e9f0f8"/>')
            a(f'<text x="{x+W/6:.2f}" y="{13 if not full else 30}" text-anchor="middle" font-size="{10 if not full else 13}" fill="{C["blue"]}" font-weight="800" font-family="Arial, sans-serif">{labs[i]}</text>')
            a(f'<text x="{x+W/6:.2f}" y="{27 if not full else 52}" text-anchor="middle" font-size="{10 if not full else 14}" fill="#576d7d" font-family="Arial, sans-serif">{subs[i].replace('&','&amp;')}</text>')
    a(f'<g clip-path="url(#clip-{alg}-{variant})">')
    a(f'<rect x="{L}" y="{top}" width="{W}" height="{H}" fill="{C["green"]}"/>')
    if alg=='vd':
        poly=f'{L},{base} '+points_arr(xu,yu)+f' {R},{base}'
        a(f'<polygon points="{poly}" fill="{C["orange"]}"/>')
        poly=f'{X(xx[mask][0]):.2f},{base} '+points_arr(xu[mask],yl[mask])+f' {R},{base}'
        a(f'<polygon points="{poly}" fill="{C["red"]}"/>')
        a(f'<polyline points="{points_arr(xu,yu)}" fill="none" stroke="#99764b" stroke-width="{1.85 if full else 2}" opacity=".85"/>')
        a(f'<polyline points="{points_arr(xu[mask],yl[mask])}" fill="none" stroke="#b35d56" stroke-width="{1.85 if full else 2}" opacity=".85"/>')
    else:
        poly=points_arr(xu,yu)+' '+points_arr(xu[::-1],yl[::-1]);a(f'<polygon points="{poly}" fill="{C["orange"]}"/>')
        a(f'<polyline points="{points_arr(xu,yu)}" fill="none" stroke="#977448" stroke-width="{2 if full else 2.1}" opacity=".85"/>')
        nonfloor=lower>1.025
        a(f'<polyline points="{points_arr(xu[nonfloor],yl[nonfloor])}" fill="none" stroke="#977448" stroke-width="{2 if full else 2.1}" opacity=".85"/>')
    # The same two gray regime stripes for VD and CN, no additional gray CN stripe.
    for z in (1/3,2/3):
        px=X(z);a(f'<rect x="{px-(9 if full else 7):.2f}" y="{top}" width="{18 if full else 14}" height="{H}" fill="{C["shade"]}" opacity=".83"/>')
        a(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{base}" stroke="#657181" stroke-width="1.55"/>')
    if alg=='cn':
        px=X(split)
        a(f'<line x1="{px:.2f}" y1="{top}" x2="{px:.2f}" y2="{base}" stroke="#273e54" stroke-width="{2.5 if full else 2.3}" stroke-dasharray="9 6"/>')
    for value in (10,100,1000):
        py=Y(value)
        if top < py < base:a(f'<line x1="{L}" y1="{py:.2f}" x2="{R}" y2="{py:.2f}" stroke="#8494a5" opacity=".24" stroke-dasharray="3 5"/>')
    a('</g>')
    a(f'<path d="M{L} {top} V{base} H{R}" fill="none" stroke="#6c8395" stroke-width="1.8"/>')
    a(f'<text x="{L-10}" y="{top+5}" text-anchor="end" font-size="{13 if full else 11}" fill="{C["blue"]}" font-family="Arial, sans-serif">{ "n" if full else "k" }</text>')
    a(f'<text x="{L-10}" y="{base+5}" text-anchor="end" font-size="{13 if full else 11}" fill="{C["blue"]}" font-family="Arial, sans-serif">1</text>')
    if full:
        py=Y(original.LOGN)
        a(f'<text x="{L-10}" y="{py+5:.2f}" text-anchor="end" font-size="12" fill="{C["blue"]}" font-family="Arial, sans-serif">log n</text>')
    else:
        a(f'<text x="{L-10}" y="{top+16}" text-anchor="end" font-size="9" fill="#667b8d" font-family="Arial, sans-serif">cropped</text>')
    a(f'<text x="{(L+R)/2}" y="{base+22 if not full else base+25}" text-anchor="middle" font-size="{12 if full else 11}" fill="{C["blue"]}" font-family="Arial, sans-serif">Mean degree μ increasing  →</text>')
    if full:
        # Mini legend under the figure, no redundant chart title.
        ly=485 if alg=='cn' else 415
        items=[(C['green'],'Guaranteed recovery'),(C['orange'],'No theorem'),(C['shade'],'Regime change')]
        if alg=='vd':items.insert(2,(C['red'],'VD failure'))
        itemw= 180 if len(items)==4 else 215;xstart=22 if len(items)==4 else 60
        for j,(col,name) in enumerate(items):
            xx0=xstart+j*itemw
            a(f'<rect x="{xx0}" y="{ly-10}" width="16" height="11" fill="{col}"/>')
            a(f'<text x="{xx0+21}" y="{ly}" font-size="{11 if len(items)==4 else 12}" fill="{C["blue"]}" font-family="Arial, sans-serif">{name}</text>')
        if alg=='cn':a(f'<text x="{w/2}" y="{513 if alg=='cn' else 438}" text-anchor="middle" font-size="10" fill="#718597" font-family="Arial, sans-serif">Dashed line: additional qualitative split within super-connectivity</text>')
    a('</svg>')
    return '\n'.join(s)

for alg in ('vd','cn'):
 for mode in ('full','explore'):
  p=OUT/f'qualitative-{alg}-v3-{mode}.svg';p.write_text(svggen(alg,mode),encoding='utf-8');print(p,p.stat().st_size)
