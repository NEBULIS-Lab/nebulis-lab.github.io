import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeStatistics, naturalEarthPoint, pagePath} from '../js/visitor-data.js';

test('empty real statistics are zero with no invented locations',()=>{
  const data=normalizeStatistics({views:0,countries:0,startedAt:null,locations:[]});
  assert.equal(data.views,0);assert.equal(data.startedAt,null);assert.deepEqual(data.locations,[]);
});

test('malformed or unavailable data is rejected instead of converted to zero',()=>{
  for(const value of [null,{}, {error:'unavailable'}, {views:-1,countries:0,startedAt:null,locations:[]}, {views:1,countries:0,startedAt:null,locations:[]}]){
    assert.throws(()=>normalizeStatistics(value));
  }
});

test('valid real locations retain counts and approximate coordinates',()=>{
  const data=normalizeStatistics({views:3,countries:1,startedAt:'2026-10-25T08:00:00Z',locations:[{country:'CN',city:'Guangzhou',latitude:23.1,longitude:113.3,views:3}]});
  assert.equal(data.views,3);assert.equal(data.locations[0].views,3);
  assert.equal(data.locations[0].city,'Guangzhou');
});

test('projection matches the existing published basemap geometry',()=>{
  const point=naturalEarthPoint(113.3,23.1);
  assert.ok(Math.abs(point[0]-576.1555594092102)<1e-8);
  assert.ok(Math.abs(point[1]-150.70584046276815)<1e-8);
  assert.equal(naturalEarthPoint(181,23),null);
  assert.equal(naturalEarthPoint(113,91),null);
});

test('collector paths omit URL query strings and fragments',()=>{
  assert.equal(pagePath('https://nebulis-lab.com/project.html?id=private#notes'),'/project.html');
  assert.equal(pagePath('https://nebulis-lab.com/'),'/');
  assert.equal(pagePath('https://nebulis-lab.com/'+ 'a'.repeat(300)),null);
});
