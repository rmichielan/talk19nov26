const fs=require('fs');
const {mathjax}=require('mathjax-full/js/mathjax.js');
const {TeX}=require('mathjax-full/js/input/tex.js');
const {SVG}=require('mathjax-full/js/output/svg.js');
const {liteAdaptor}=require('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler}=require('mathjax-full/js/handlers/html.js');
const {AllPackages}=require('mathjax-full/js/input/tex/AllPackages.js');
const a=liteAdaptor();RegisterHTMLHandler(a);
const doc=mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const out={};for(const tex of JSON.parse(fs.readFileSync(0,'utf8'))){const h=a.outerHTML(doc.convert(tex,{display:false}));if(h.includes('data-mjx-error'))throw Error(tex);out[tex]=h.match(/<svg[\s\S]*?<\/svg>/)[0];}
process.stdout.write(JSON.stringify(out));
