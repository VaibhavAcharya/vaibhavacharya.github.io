import{r as c}from"./index.CdJzaNS0.js";var d={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x;function v(){if(x)return n;x=1;var o=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function t(u,e,r){var i=null;if(r!==void 0&&(i=""+r),e.key!==void 0&&(i=""+e.key),"key"in e){r={};for(var a in e)a!=="key"&&(r[a]=e[a])}else r=e;return e=r.ref,{$$typeof:o,type:u,key:i,ref:e!==void 0?e:null,props:r}}return n.Fragment=s,n.jsx=t,n.jsxs=t,n}var R;function E(){return R||(R=1,d.exports=v()),d.exports}var p=E();function f(){const[o,s]=c.useState(!1);return c.useEffect(()=>{const t=window.matchMedia("(prefers-reduced-motion: reduce)");s(t.matches);const u=e=>s(e.matches);return t.addEventListener("change",u),()=>t.removeEventListener("change",u)},[]),o}export{p as j,f as u};
