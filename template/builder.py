"""Generic, offline single-file scientific-deck builder.

This module deliberately knows nothing about IRG, PAiNe, Alias, EBUS, or arXiv.
The chosen talk supplies its modules, optional details, assets and metadata through JSON.
"""
import argparse
import base64
import html
import importlib.util
import json
import mimetypes
import re
import subprocess
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'src'
CONTROLLER_TOKEN="  /* @CONTROLLER_REGISTRY@ */"
LOGO_TOKEN="__BRAND_LOGO_CSS__"

def read(path):
    return (ROOT/path).read_text(encoding='utf-8')

def require(condition,message):
    if not condition: raise ValueError(message)

def safe_relative_path(value,description):
    require(isinstance(value,str) and value.strip(),f'{description} needs a nonempty relative path')
    path=Path(value)
    require(not path.is_absolute() and '..' not in path.parts, f'Unsafe {description}: {value}')
    return path

def escaped(value,description):
    require(isinstance(value,str),f'Missing or invalid {description}')
    return html.escape(value,quote=True)

def load_build_config():
    build=json.loads(read('src/build.json'))
    require(isinstance(build,dict),'src/build.json must contain an object')
    for field in ('styles','runtime_modules','after_slides_modules','head_html','controls_html'):
        require(field in build,f'Missing {field} in src/build.json')
    return build

def flatten(data,prefix=''):
    result={}
    if isinstance(data,dict):
        for k,v in data.items():
            result.update(flatten(v,prefix+'_'+k if prefix else k))
    elif isinstance(data,(str,int,float)):
        result['__'+prefix.upper()+'__']=html.escape(str(data),quote=True)
    return result

def nested(data,path):
    for k in path.split('.'):
        data=data[k]
    return data

def load_config(build):
    config=json.loads(read('src/presentation.json'))
    require(isinstance(config,dict),'src/presentation.json must contain an object')
    logo_path=safe_relative_path(config['logo'],'Logo')
    file=ROOT/logo_path
    require(file.is_file(),f'Configured logo does not exist: {logo_path}')
    kind=mimetypes.guess_type(file.name)[0]
    require(kind and kind.startswith('image/'),'Logo must be an image')
    logo_css=f'url("data:{kind};base64,{base64.b64encode(file.read_bytes()).decode("ascii")}")'
    cover=config.get('cover',{})
    tokens=flatten(config)
    if 'title_lines' in cover:
        lines=[]
        for line in cover['title_lines']:
            line_text=escaped(line['text'],'cover line')
            lines.append(f'<em>{line_text}</em>' if line.get('emphasis') else line_text)
        tokens['__COVER_TITLE__']='<br>'.join(lines)
    if 'areas' in cover:
        tokens['__COVER_AREAS__']=' <span class="kicker-separator">/</span> '.join(
            escaped(area,'cover area') for area in cover['areas'])
    for alias,source in build.get('token_aliases',{}).items():
        tokens['__'+alias+'__']=html.escape(str(nested(config,source)),quote=True)
    tokens['__LANGUAGE__']=escaped(config.get('language','en'),'language')
    tokens['__DECK_TITLE__']=escaped(config['title'],'title')
    tokens['__LOGO_ALT__']=escaped(config.get('logo_alt','Logo'),'logo_alt')
    outputs=config.get('outputs',['index.html'])
    require(isinstance(outputs,list) and outputs,'Outputs must be a nonempty list')
    output_paths=[safe_relative_path(x,'Output') for x in outputs]
    require(all(x.suffix.lower()=='.html' for x in output_paths),'Output must be HTML')
    require(len(set(output_paths))==len(output_paths),'Output paths must be unique')
    return tokens,logo_css,output_paths

PARTIAL_RE=re.compile(r'<!--\s*@partial\s+([a-z0-9-]+)\s+(\{[^\n]*?\})\s*-->')
def expand_partials(source, slide_id=None):
    for _ in range(10):
        if not PARTIAL_RE.search(source):return source
        def substitute(match):
            name=match.group(1)
            args=json.loads(match.group(2))
            require(isinstance(args,dict),'Partial arguments must be an object')
            if name=='scientific-footer' and args.get('number')=='auto':
                require(slide_id is not None,'Automatic footer requires a manifest slide ID')
                args['number']=str(slide_id-1).zfill(2)
            path=safe_relative_path('src/layouts/'+name+'.html','Partial')
            source=read(path)
            for name,value in args.items():
                require(isinstance(value,str),'Partial values must be strings')
                source=source.replace('{{'+name+'}}',html.escape(value,quote=True))
            missing=re.findall(r'{{[a-zA-Z0-9_]+}}',source)
            require(not missing,f'Unresolved partial arguments {missing}')
            return source
        source=PARTIAL_RE.sub(substitute,source)
    raise ValueError('Too many nested partial levels')

def load_manifest():
    manifest=json.loads(read('src/slides/manifest.json'))
    require(isinstance(manifest,list) and manifest,'Manifest must be a nonempty list')
    for i,s in enumerate(manifest,1):
        require(s.get('id')==i and isinstance(s.get('reveals'),int) and s['reveals']>=0,
                f'Invalid slide {i}')
        for field in ('name','key','controller'):
            require(isinstance(s.get(field),str) and s[field],f'Missing {field} for slide {i}')
        for ext in ('html','js'):
            require((SRC/'slides'/(s['name']+'.'+ext)).is_file(),f'Missing slide source {s["name"]}.{ext}')
    require(len(set(s['key'] for s in manifest))==len(manifest),'Duplicate slide keys')
    return manifest

def load_details(build,manifest):
    if not build.get('details'):return [],{}
    details=json.loads(read(build['details']))
    keys={s['key']:s['id'] for s in manifest}
    metadata={}
    for d in details:
        require(d['parent_key'] in keys,f'Unknown detail parent key: {d["parent_key"]}')
        require(d['key'] not in metadata,f'Duplicate detail key: {d["key"]}')
        require((ROOT/d['html']).is_file(),f'Detail HTML missing: {d["html"]}')
        metadata[d['key']]={'parent':keys[d['parent_key']], 'label':d['label'], 'reveals':d['reveals']}
    return details,metadata

def assemble_embedded_assets(document, build):
    """Render all new TeX once at build time; no network or fonts at runtime."""
    tex = list(dict.fromkeys(html.unescape(t) for t in re.findall(r'data-math="([^"]+)"', document)))
    cache_path = ROOT / build["math_cache"]
    cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
    missing = [t for t in tex if t not in cache]
    if missing:
        result = subprocess.run(["node", str(ROOT / build["math_renderer"])], input=json.dumps(missing), text=True, capture_output=True, check=True)
        cache.update(json.loads(result.stdout))
        cache_path.write_text(json.dumps(cache), encoding="utf-8")
    def formula(match):
        raw = match.group(1)
        return match.group(0).replace("></span>", ">" + cache[html.unescape(raw)] + "</span>")
    document = re.sub(r'<span class="tex[^"]*" data-math="([^"]+)"></span>', formula, document)
    def asset(match):
        path = ROOT / match.group(1)
        kind = mimetypes.guess_type(path.name)[0]
        data = base64.b64encode(path.read_bytes()).decode()
        return 'src="data:' + kind + ';base64,' + data + '"'
    document = re.sub(r'data-asset="([^"]+)"', asset, document)
    for token, path in build.get('asset_tokens', {}).items():
        document = document.replace(token, read(path))
    return document



def run_talk_preprocessor(document,build):
    path=build.get('legacy_math_preprocessor')
    if not path:return document
    name=safe_relative_path(path,'Preprocessor')
    spec=importlib.util.spec_from_file_location('talk_math_preprocessor',ROOT/name)
    module=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.transform(document,ROOT)

def build_document():
    build=load_build_config()
    tokens,logo_css,outputs=load_config(build)
    manifest=load_manifest()
    details,detail_meta=load_details(build,manifest)
    source_order=(build['runtime_modules'] +
                  [f"src/slides/{slide['name']}.js" for slide in manifest] +
                  build['after_slides_modules'])
    registry='  const SLIDES='+json.dumps(
        [{'id':s['id'],'key':s['key'],'reveals':s['reveals']} for s in manifest],separators=(',',':'))+        ';\n  const slideCount=SLIDES.length;\n  const slideMeta=id=>SLIDES[id-1];\n'
    registry+='  const DECK_DETAILS='+json.dumps(detail_meta,separators=(',',':'))+';\n'
    controllers='  const sceneControllers={'+','.join(
        json.dumps(s['key'])+':'+s['controller'] for s in manifest)+'};'
    css='\n'.join(read(s) for s in build['styles'])
    require(css.count(LOGO_TOKEN)==1,'Logo CSS variable must occur exactly once')
    css=css.replace(LOGO_TOKEN,logo_css)
    modules='\n'.join(read(s) for s in source_order)
    require(modules.count(CONTROLLER_TOKEN)==1,'Missing controller registry placeholder')
    js=registry+'\n'+modules.replace(CONTROLLER_TOKEN,controllers)
    head=expand_partials(read(build['head_html']).strip(),1)
    after_head=''.join(expand_partials(read(s).strip()) for s in build.get('after_head_html',[]))
    slide_html='\n'.join(expand_partials(read(f"src/slides/{s['name']}.html").strip(),s['id']) for s in manifest[1:])
    detail_html=''.join(expand_partials(read(d['html'])) for d in details)
    controls=''.join(expand_partials(read(s)) for s in build['controls_html'])
    scripts=''.join('<script>'+read(s)+'</script>' for s in build.get('standalone_scripts',[]))
    document=('<!doctype html><html lang="__LANGUAGE__"><head><meta charset="utf-8">'
      '<meta name="viewport" content="width=device-width,initial-scale=1">'
      '<title>__DECK_TITLE__</title><style>'+css+'</style></head><body>'
      '<div id="deck-viewport"><div id="deck-frame">'+head+after_head+slide_html+detail_html+
      '</main></div></div>'+controls+scripts+
      "<script>(()=>{'use strict';\n"+js+'\n})();</script></body></html>')
    for token,value in tokens.items():document=document.replace(token,value)
    for source,replacement in build.get('html_replacements',{}).items():document=document.replace(source,replacement)
    document=run_talk_preprocessor(document,build)
    if build.get('math_cache'): document=assemble_embedded_assets(document,build)
    unresolved=re.findall(r'__[A-Z][A-Z0-9_]*__',document)
    require(not unresolved,f'Unresolved tokens: {sorted(set(unresolved))}')
    return document,source_order,outputs

def main():
    parser=argparse.ArgumentParser(description='Build standalone offline HTML presentation')
    parser.add_argument('--check',action='store_true',help='verify generated outputs')
    args=parser.parse_args()
    try:
        document,source_order,outputs=build_document()
        expected=document.encode('utf-8')
        if args.check:
            stale=[str(path) for path in outputs if not (ROOT/path).exists() or (ROOT/path).read_bytes()!=expected]
            if stale:
                print('Missing or stale generated files: '+', '.join(stale),file=sys.stderr)
                return 1
            print(f'Verified {len(outputs)} current, identical outputs.')
            return 0
        for path in outputs:
            target=ROOT/path;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(expected)
        print(f'Built {len(expected):,} bytes, {len(source_order)} modules, {len(outputs)} outputs')
        return 0
    except (OSError,ValueError,KeyError,TypeError,json.JSONDecodeError) as e:
        print('Build failed: '+str(e),file=sys.stderr)
        return 1

if __name__=='__main__':raise SystemExit(main())
