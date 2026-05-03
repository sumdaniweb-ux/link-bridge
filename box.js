// باکس - آف لائن ڈیٹا کنٹینر
const BOX={
  k:"b_"+Math.random().toString(36).slice(2,8),
  put(n,d){try{localStorage.setItem("box_"+n,JSON.stringify({t:Date.now(),d:d}));return 1}catch(e){return 0}},
  get(n){try{const r=JSON.parse(localStorage.getItem("box_"+n));return r?r.d:null}catch(e){return null}},
  list(){const l=[],keys=Object.keys(localStorage);for(let k of keys){if(k.startsWith("box_")){const n=k.replace("box_","");l.push({name:n,time:new Date(JSON.parse(localStorage[k]).t).toLocaleString()})}}return l},
  del(n){localStorage.removeItem("box_"+n)},
  wipe(){Object.keys(localStorage).filter(k=>k.startsWith("box_")).forEach(k=>localStorage.removeItem(k))}
};