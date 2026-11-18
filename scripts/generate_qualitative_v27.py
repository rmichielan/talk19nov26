"""Regenerate text-free qualitative SVGs, keeping v3 curve geometry intact.
Run this script from anywhere with python scripts/generate_qualitative_v27.py
"""
from pathlib import Path
import subprocess,sys,xml.etree.ElementTree as ET
base=Path(__file__).resolve().parent
subprocess.run([sys.executable,str(base/'generate_qualitative_v26.py')],check=True)
ET.register_namespace('', 'http://www.w3.org/2000/svg')
for alg in ('vd','cn'):
 for mode in ('full','explore'):
  path=base.parent/'src/assets/qualitative'/f'qualitative-{alg}-v3-{mode}.svg'
  tree=ET.parse(path);root=tree.getroot()
  for parent in root.iter():
   for child in list(parent):
    tag=child.tag.split('}',1)[-1]
    if tag=='text' or (tag=='rect' and child.attrib.get('fill') in ('white','#e9f0f8')):
     parent.remove(child)
  x,y,w,h=(46,34,592,144) if mode=='explore' else ((62,32,678,330) if alg=='vd' else (62,86,678,344))
  root.set('viewBox',f'{x} {y} {w} {h}');root.set('width',str(w));root.set('height',str(h))
  root.set('aria-label',f'{alg.upper()} qualitative region geometry (text-free)')
  tree.write(path,encoding='unicode',xml_declaration=False)
  assert '<text' not in path.read_text()
