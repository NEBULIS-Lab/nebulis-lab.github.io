import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {normalizeStatistics,naturalEarthPoint,pagePath} from '../js/visitor-data.js';

class Element {
  constructor(fragment=false){this.children=[];this.textContent='';this.fragment=fragment;this.classList={add(){}};}
  setAttribute(){}
  append(...items){this.children.push(...items);}
  prepend(){}
  replaceChildren(...items){this.children=items.flatMap(item=>item.fragment?item.children:[item]);}
}

test('a failed BFCache refresh clears old counts and markers instead of presenting them as current',async()=>{
  const selectors=['.visitor-total','.visitor-countries','.visitor-period','.visitor-points','.visitor-land','.visitor-borders'];
  const nodes=Object.fromEntries(selectors.map(selector=>[selector,new Element()]));
  const widget={querySelector:selector=>nodes[selector]};
  const container={prepend(){},querySelector:()=>widget};
  const footer={classList:{add(){}},querySelector:()=>container};
  const handlers={};
  const document={
    querySelector:()=>footer,documentElement:{lang:'en'},prerendering:false,
    createElement:()=>({content:{}}),createElementNS:()=>new Element(),
    createDocumentFragment:()=>new Element(true),addEventListener(){},
  };
  let requests=0;
  const good={views:3,countries:1,startedAt:'2026-10-25T08:00:00Z',locations:[{country:'CN',city:'Guangzhou',latitude:23.1,longitude:113.3,views:3}]};
  const context={document,window:{addEventListener:(name,fn)=>{handlers[name]=fn;}},
    location:{hostname:'localhost',href:'http://localhost/'},
    fetch:async()=>++requests===1?Response.json(good):new Response(null,{status:503}),
    normalizeStatistics,naturalEarthPoint,pagePath,URL,Intl,AbortController,setTimeout,clearTimeout,queueMicrotask,
  };
  const source=readFileSync(new URL('../js/visitors.js',import.meta.url),'utf8')
    .replace(/^import[^\n]+\n/,'').replaceAll('import.meta.url',JSON.stringify('https://nebulis-lab.com/js/visitors.js'));
  vm.runInNewContext(source,context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(nodes['.visitor-total'].textContent,'3');
  assert.equal(nodes['.visitor-points'].children.length,1);
  handlers.pageshow({persisted:true});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(nodes['.visitor-total'].textContent,'—');
  assert.equal(nodes['.visitor-countries'].textContent,'—');
  assert.match(nodes['.visitor-period'].textContent,/unavailable/);
  assert.equal(nodes['.visitor-points'].children.length,0);
});
