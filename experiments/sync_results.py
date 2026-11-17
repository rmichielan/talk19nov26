#!/usr/bin/env python3
"""Embed results.json as a source module used by HTML generation."""
import json, pathlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
source=pathlib.Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root/'experiments/results.json'
out=root/'src/talk/experimental-data.js'
data=json.loads(source.read_text())
out.write_text('/* Generated from '+source.name+'; use experiments/sync_results.py after recomputing. */\nconst RecoveryBenchmark='+json.dumps(data,separators=(',',':'))+';\n')
print('Updated',out)
