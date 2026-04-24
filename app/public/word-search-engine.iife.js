var WordSearchEngine=(function(){"use strict";typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");let Et=!1,Br=!1;function _r(){Et=!0}_r();const Vr=1,Yr=2,Tl=4,Nr=8,kr=16,Sr=2,Rr=8,Hr=1,Jr=2,el="[",tl="[!",Kl="[?",wn="]",Ut={},ee=Symbol(),te=Symbol("filename"),El="http://www.w3.org/1999/xhtml",Fr=!0;var Wn=Array.isArray,zr=Array.prototype.indexOf,Bt=Array.prototype.includes,Bn=Array.from,_n=Object.keys,we=Object.defineProperty,ut=Object.getOwnPropertyDescriptor,Ul=Object.getOwnPropertyDescriptors,jr=Object.prototype,Dr=Array.prototype,nl=Object.getPrototypeOf,$l=Object.isExtensible;const tt=()=>{};function Lr(e){return e()}function Vn(e){for(var t=0;t<e.length;t++)e[t]()}function Pl(){var e,t,n=new Promise((l,i)=>{e=l,t=i});return{promise:n,resolve:e,reject:t}}const P=2,$t=4,an=8,Ql=1<<24,dt=16,Fe=32,Ct=64,ll=128,We=512,L=1024,le=2048,ze=4096,Ae=8192,Be=16384,ft=32768,il=1<<25,Pt=65536,Yn=1<<17,Or=1<<18,_t=1<<19,ql=1<<20,Ke=1<<25,Vt=65536,Nn=1<<21,kn=1<<22,bt=1<<23,Ee=Symbol("$state"),ei=Symbol("legacy props"),Mr=Symbol(""),ti=Symbol("proxy path"),nt=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},ni=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml"),Tr=1,gn=3,Qt=8,Kr=11;function Er(e){{const t=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}}function li(e){{const t=new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}}function Ur(e){{const t=new Error(`store_invalid_shape
\`${e}\` is not a store with a \`subscribe\` method
https://svelte.dev/e/store_invalid_shape`);throw t.name="Svelte error",t}}function $r(){{const e=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw e.name="Svelte error",e}}function Pr(e,t){{const n=new Error(`component_api_changed
Calling \`${e}\` on a component instance (of ${t}) is no longer valid in Svelte 5
https://svelte.dev/e/component_api_changed`);throw n.name="Svelte error",n}}function Qr(e,t){{const n=new Error(`component_api_invalid_new
Attempted to instantiate ${e} with \`new ${t}\`, which is no longer valid in Svelte 5. If this component is not under your control, set the \`compatibility.componentApi\` compiler option to \`4\` to keep it working.
https://svelte.dev/e/component_api_invalid_new`);throw n.name="Svelte error",n}}function qr(){{const e=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}}function es(e,t,n){{const l=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`);throw l.name="Svelte error",l}}function ts(e,t,n){{const l=new Error(`each_key_volatile
Keyed each block has key that is not idempotent — the key for item at index ${e} was \`${t}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw l.name="Svelte error",l}}function ns(e){{const t=new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}}function ls(){{const e=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}}function is(e){{const t=new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}}function rs(){{const e=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}}function ss(){{const e=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}}function cs(e){{const t=new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}}function as(e){{const t=new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}}function gs(){{const e=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}}function os(){{const e=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}}function Is(){{const e=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}}function us(){{const e=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}}var Yt="font-weight: bold",Nt="font-weight: normal";function ds(e){console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Yt,Nt)}function Cs(e,t,n){console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${e}\` attribute on \`${t}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Yt,Nt)}function Sn(e){console.warn(`%c[svelte] hydration_mismatch
%cHydration failed because the initial UI does not match what was rendered on the server
https://svelte.dev/e/hydration_mismatch`,Yt,Nt)}function fs(){console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Yt,Nt)}function Rn(e){console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Yt,Nt)}function bs(){console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,Yt,Nt)}function As(){console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Yt,Nt)}let W=!1;function lt(e){W=e}let _;function ae(e){if(e===null)throw Sn(),Ut;return _=e}function Hn(){return ae(Pe(_))}function G(e){if(W){if(Pe(_)!==null)throw Sn(),Ut;_=e}}function hs(e=1){if(W){for(var t=e,n=_;t--;)n=Pe(n);_=n}}function Jn(e=!0){for(var t=0,n=_;;){if(n.nodeType===Qt){var l=n.data;if(l===wn){if(t===0)return n;t-=1}else(l===el||l===tl||l[0]==="["&&!isNaN(Number(l.slice(1))))&&(t+=1)}var i=Pe(n);e&&n.remove(),n=i}}function ii(e){if(!e||e.nodeType!==Qt)throw Sn(),Ut;return e.data}function ri(e){return e===this.v}function si(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function ci(e){return!si(e,this.v)}function he(e,t){return e.label=t,ai(e.v,t),e}function ai(e,t){return e?.[ti]?.(t),e}function gi(e){const t=new Error,n=vs();return n.length===0?null:(n.unshift(`
`),we(t,"stack",{value:n.join(`
`)}),we(t,"name",{value:e}),t)}function vs(){const e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;const t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];const n=t.split(`
`),l=[];for(let i=0;i<n.length;i++){const r=n[i],s=r.replaceAll("\\","/");if(r.trim()!=="Error"){if(r.includes("validate_each_keys"))return[];s.includes("svelte/src/internal")||s.includes("node_modules/.vite")||l.push(r)}}return l}function ps(e,t){e||Er(t)}let N=null;function qt(e){N=e}let it=null;function Fn(e){it=e}function Ue(e,t,n,l,i,r){const s=it;it={type:t,file:n[te],line:l,column:i,parent:s,...r};try{return e()}finally{it=s}}let on=null;function oi(e){on=e}function zn(e,t=!1,n){N={p:N,i:!1,c:null,e:null,s:e,x:null,r:X,l:Et&&!t?{s:null,u:null,$:[]}:null},N.function=n,on=n}function jn(e){var t=N,n=t.e;if(n!==null){t.e=null;for(var l of n)Ji(l)}return e!==void 0&&(t.x=e),t.i=!0,N=t.p,on=N?.function??null,e??{}}function In(){return!Et||N!==null&&N.l===null}let kt=[];function Ii(){var e=kt;kt=[],Vn(e)}function rt(e){if(kt.length===0&&!un){var t=kt;queueMicrotask(()=>{t===kt&&Ii()})}kt.push(e)}function Gs(){for(;kt.length>0;)Ii()}const rl=new WeakMap;function ui(e){var t=X;if(t===null)return w.f|=bt,e;if(e instanceof Error&&!rl.has(e)&&rl.set(e,ms(e,t)),(t.f&ft)===0&&(t.f&$t)===0)throw!t.parent&&e instanceof Error&&di(e),e;At(e,t)}function At(e,t){for(;t!==null;){if((t.f&ll)!==0){if((t.f&ft)===0)throw e;try{t.b.error(e);return}catch(n){e=n}}t=t.parent}throw e instanceof Error&&di(e),e}function ms(e,t){const n=ut(e,"message");if(!(n&&!n.configurable)){for(var l=Al?"  ":"	",i=`
${l}in ${t.fn?.name||"<unknown>"}`,r=t.ctx;r!==null;)i+=`
${l}in ${r.function?.[te].split("/").pop()}`,r=r.p;return{message:e.message+`
${i}
`,stack:e.stack?.split(`
`).filter(s=>!s.includes("svelte/src/internal")).join(`
`)}}}function di(e){const t=rl.get(e);t&&(we(e,"message",{value:t.message}),we(e,"stack",{value:t.stack}))}const Zs=-7169;function j(e,t){e.f=e.f&Zs|t}function sl(e){(e.f&We)!==0||e.deps===null?j(e,L):j(e,ze)}function Ci(e){if(e!==null)for(const t of e)(t.f&P)===0||(t.f&Vt)===0||(t.f^=Vt,Ci(t.deps))}function fi(e,t,n){(e.f&le)!==0?t.add(e):(e.f&ze)!==0&&n.add(e),Ci(e.deps),j(e,L)}function cl(e,t,n){if(e==null)return t(void 0),n&&n(void 0),tt;const l=B(()=>e.subscribe(t,n));return l.unsubscribe?()=>l.unsubscribe():l}const en=[];function Xs(e,t){return{subscribe:bi(e,t).subscribe}}function bi(e,t=tt){let n=null;const l=new Set;function i(c){if(si(e,c)&&(e=c,n)){const a=!en.length;for(const o of l)o[1](),en.push(o,e);if(a){for(let o=0;o<en.length;o+=2)en[o][0](en[o+1]);en.length=0}}}function r(c){i(c(e))}function s(c,a=tt){const o=[c,a];return l.add(o),l.size===1&&(n=t(i,r)||tt),c(e),()=>{l.delete(o),l.size===0&&n&&(n(),n=null)}}return{set:i,update:r,subscribe:s}}function xs(e,t,n){const l=!Array.isArray(e),i=l?[e]:e;if(!i.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const r=t.length<2;return Xs(n,(s,c)=>{let a=!1;const o=[];let g=0,d=tt;const u=()=>{if(g)return;d();const f=t(l?o[0]:o,s,c);r?s(f):d=typeof f=="function"?f:tt},b=i.map((f,h)=>cl(f,C=>{o[h]=C,g&=~(1<<h),a&&u()},()=>{g|=1<<h}));return a=!0,u(),function(){Vn(b),d(),a=!1}})}function ys(e){let t;return cl(e,n=>t=n)(),t}let Dn=!1,al=Symbol();function Ai(e,t,n){const l=n[t]??={store:null,source:R(void 0),unsubscribe:tt};if(l.source.label=t,l.store!==e&&!(al in n))if(l.unsubscribe(),l.store=e??null,e==null)l.source.v=void 0,l.unsubscribe=tt;else{var i=!0;l.unsubscribe=cl(e,r=>{i?l.source.v=r:v(l.source,r)}),i=!1}return e&&al in n?ys(e):I(l.source)}function hi(){const e={};function t(){Zl(()=>{for(var n in e)e[n].unsubscribe();we(e,al,{enumerable:!1,value:!0})})}return[e,t]}function ws(e){var t=Dn;try{return Dn=!1,[e(),Dn]}finally{Dn=t}}const St=new Set;let S=null,je=null,gl=null,un=!1,ol=!1,tn=null,Ln=null;var vi=0,Ws=new Set;let Bs=1;class st{id=Bs++;current=new Map;previous=new Map;#e=new Set;#t=new Set;#n=0;#c=0;#i=null;#l=[];#r=new Set;#s=new Set;#a=new Map;is_fork=!1;#o=!1;#I(){return this.is_fork||this.#c>0}skip_effect(t){this.#a.has(t)||this.#a.set(t,{d:[],m:[]})}unskip_effect(t){var n=this.#a.get(t);if(n){this.#a.delete(t);for(var l of n.d)j(l,le),this.schedule(l);for(l of n.m)j(l,ze),this.schedule(l)}}#u(){if(vi++>1e3&&(St.delete(this),_s()),!this.#I()){for(const c of this.#r)this.#s.delete(c),j(c,le),this.schedule(c);for(const c of this.#s)j(c,ze),this.schedule(c)}const t=this.#l;this.#l=[],this.apply();var n=tn=[],l=[],i=Ln=[];for(const c of t)try{this.#d(c,n,l)}catch(a){throw Xi(c),a}if(S=null,i.length>0){var r=st.ensure();for(const c of i)r.schedule(c)}if(tn=null,Ln=null,this.#I()){this.#C(l),this.#C(n);for(const[c,a]of this.#a)Zi(c,a)}else{this.#n===0&&St.delete(this),this.#r.clear(),this.#s.clear();for(const c of this.#e)c(this);this.#e.clear(),pi(l),pi(n),this.#i?.resolve()}var s=S;if(this.#l.length>0){const c=s??=this;c.#l.push(...this.#l.filter(a=>!c.#l.includes(a)))}if(s!==null){St.add(s);for(const c of this.current.keys())Ws.add(c);s.#u()}St.has(this)||this.#g()}#d(t,n,l){t.f^=L;for(var i=t.first;i!==null;){var r=i.f,s=(r&(Fe|Ct))!==0,c=s&&(r&L)!==0,a=c||(r&Ae)!==0||this.#a.has(i);if(!a&&i.fn!==null){s?i.f^=L:(r&$t)!==0?n.push(i):sn(i)&&((r&dt)!==0&&this.#s.add(i),Dt(i));var o=i.first;if(o!==null){i=o;continue}}for(;i!==null;){var g=i.next;if(g!==null){i=g;break}i=i.parent}}}#C(t){for(var n=0;n<t.length;n+=1)fi(t[n],this.#r,this.#s)}capture(t,n){n!==ee&&!this.previous.has(t)&&this.previous.set(t,n),(t.f&bt)===0&&(this.current.set(t,t.v),je?.set(t,t.v))}activate(){S=this}deactivate(){S=null,je=null}flush(){var t=new Set;try{ol=!0,S=this,this.#u()}finally{vi=0,gl=null,tn=null,Ln=null,ol=!1,S=null,je=null,vt.clear();for(const n of t)n.updated=null}}discard(){for(const t of this.#t)t(this);this.#t.clear(),St.delete(this)}#g(){for(const a of St){var t=a.id<this.id,n=[];for(const[o,g]of this.current){if(a.current.has(o))if(t&&g!==a.current.get(o))a.current.set(o,g);else continue;n.push(o)}var l=[...a.current.keys()].filter(o=>!this.current.has(o));if(l.length===0)t&&a.discard();else if(n.length>0){ps(a.#l.length===0,"Batch has scheduled roots"),a.activate();var i=new Set,r=new Map;for(var s of n)Gi(s,l,i,r);if(a.#l.length>0){a.apply();for(var c of a.#l)a.#d(c,[],[]);a.#l=[]}a.deactivate()}}}increment(t){this.#n+=1,t&&(this.#c+=1)}decrement(t,n){this.#n-=1,t&&(this.#c-=1),!(this.#o||n)&&(this.#o=!0,rt(()=>{this.#o=!1,this.flush()}))}transfer_effects(t,n){for(const l of t)this.#r.add(l);for(const l of n)this.#s.add(l);t.clear(),n.clear()}oncommit(t){this.#e.add(t)}ondiscard(t){this.#t.add(t)}settled(){return(this.#i??=Pl()).promise}static ensure(){if(S===null){const t=S=new st;ol||(St.add(S),un||rt(()=>{S===t&&t.flush()}))}return S}apply(){{je=null;return}}schedule(t){if(gl=t,t.b?.is_pending&&(t.f&($t|an|Ql))!==0&&(t.f&ft)===0){t.b.defer_effect(t);return}for(var n=t;n.parent!==null;){n=n.parent;var l=n.f;if(tn!==null&&n===X&&(w===null||(w.f&P)===0))return;if((l&(Ct|Fe))!==0){if((l&L)===0)return;n.f^=L}}this.#l.push(n)}}function E(e){var t=un;un=!0;try{for(var n;;){if(Gs(),S===null)return n;S.flush()}}finally{un=t}}function _s(){{var e=new Map;for(const n of S.current.keys())for(const[l,i]of n.updated??[]){var t=e.get(l);t||(t={error:i.error,count:0},e.set(l,t)),t.count+=i.count}for(const n of e.values())n.error&&console.error(n.error)}try{rs()}catch(n){we(n,"stack",{value:""}),At(n,gl)}}let ct=null;function pi(e){var t=e.length;if(t!==0){for(var n=0;n<t;){var l=e[n++];if((l.f&(Be|Ae))===0&&sn(l)&&(ct=new Set,Dt(l),l.deps===null&&l.first===null&&l.nodes===null&&l.teardown===null&&l.ac===null&&ji(l),ct?.size>0)){vt.clear();for(const i of ct){if((i.f&(Be|Ae))!==0)continue;const r=[i];let s=i.parent;for(;s!==null;)ct.has(s)&&(ct.delete(s),r.push(s)),s=s.parent;for(let c=r.length-1;c>=0;c--){const a=r[c];(a.f&(Be|Ae))===0&&Dt(a)}}ct.clear()}}ct=null}}function Gi(e,t,n,l){if(!n.has(e)&&(n.add(e),e.reactions!==null))for(const i of e.reactions){const r=i.f;(r&P)!==0?Gi(i,t,n,l):(r&(kn|dt))!==0&&(r&le)===0&&mi(i,t,l)&&(j(i,le),Il(i))}}function mi(e,t,n){const l=n.get(e);if(l!==void 0)return l;if(e.deps!==null)for(const i of e.deps){if(Bt.call(t,i))return!0;if((i.f&P)!==0&&mi(i,t,n))return n.set(i,!0),!0}return n.set(e,!1),!1}function Il(e){S.schedule(e)}function Zi(e,t){if(!((e.f&Fe)!==0&&(e.f&L)!==0)){(e.f&le)!==0?t.d.push(e):(e.f&ze)!==0&&t.m.push(e),j(e,L);for(var n=e.first;n!==null;)Zi(n,t),n=n.next}}function Xi(e){j(e,L);for(var t=e.first;t!==null;)Xi(t),t=t.next}function Vs(e){let t=0,n=Rt(0),l;return he(n,"createSubscriber version"),()=>{ml()&&(I(n),bn(()=>(t===0&&(l=B(()=>e(()=>Cn(n)))),t+=1,()=>{rt(()=>{t-=1,t===0&&(l?.(),l=void 0,Cn(n))})})))}}var Ys=Pt|_t;function Ns(e,t,n,l){new ks(e,t,n,l)}class ks{parent;is_pending=!1;transform_error;#e;#t=W?_:null;#n;#c;#i;#l=null;#r=null;#s=null;#a=null;#o=0;#I=0;#u=!1;#d=new Set;#C=new Set;#g=null;#v=Vs(()=>(this.#g=Rt(this.#o),he(this.#g,"$effect.pending()"),()=>{this.#g=null}));constructor(t,n,l,i){this.#e=t,this.#n=n,this.#c=r=>{var s=X;s.b=this,s.f|=ll,l(r)},this.parent=X.b,this.transform_error=i??this.parent?.transform_error??(r=>r),this.#i=xl(()=>{if(W){const r=this.#t;Hn();const s=r.data===tl;if(r.data.startsWith(Kl)){const a=JSON.parse(r.data.slice(Kl.length));this.#G(a)}else s?this.#m():this.#p()}else this.#A()},Ys),W&&(this.#e=_)}#p(){try{this.#l=Ve(()=>this.#c(this.#e))}catch(t){this.error(t)}}#G(t){const n=this.#n.failed;n&&(this.#s=Ve(()=>{n(this.#e,()=>t,()=>()=>{})}))}#m(){const t=this.#n.pending;t&&(this.is_pending=!0,this.#r=Ve(()=>t(this.#e)),rt(()=>{var n=this.#a=document.createDocumentFragment(),l=ue();n.append(l),this.#l=this.#b(()=>Ve(()=>this.#c(l))),this.#I===0&&(this.#e.before(n),this.#a=null,Ft(this.#r,()=>{this.#r=null}),this.#f(S))}))}#A(){try{if(this.is_pending=this.has_pending_snippet(),this.#I=0,this.#o=0,this.#l=Ve(()=>{this.#c(this.#e)}),this.#I>0){var t=this.#a=document.createDocumentFragment();Wl(this.#l,t);const n=this.#n.pending;this.#r=Ve(()=>n(this.#e))}else this.#f(S)}catch(n){this.error(n)}}#f(t){this.is_pending=!1,t.transfer_effects(this.#d,this.#C)}defer_effect(t){fi(t,this.#d,this.#C)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#b(t){var n=X,l=w,i=N;ke(this.#i),Ne(this.#i),qt(this.#i.ctx);try{return st.ensure(),t()}catch(r){return ui(r),null}finally{ke(n),Ne(l),qt(i)}}#h(t,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#h(t,n);return}this.#I+=t,this.#I===0&&(this.#f(n),this.#r&&Ft(this.#r,()=>{this.#r=null}),this.#a&&(this.#e.before(this.#a),this.#a=null))}update_pending_count(t,n){this.#h(t,n),this.#o+=t,!(!this.#g||this.#u)&&(this.#u=!0,rt(()=>{this.#u=!1,this.#g&&ln(this.#g,this.#o)}))}get_effect_pending(){return this.#v(),I(this.#g)}error(t){var n=this.#n.onerror;let l=this.#n.failed;if(!n&&!l)throw t;this.#l&&(ge(this.#l),this.#l=null),this.#r&&(ge(this.#r),this.#r=null),this.#s&&(ge(this.#s),this.#s=null),W&&(ae(this.#t),hs(),ae(Jn()));var i=!1,r=!1;const s=()=>{if(i){As();return}i=!0,r&&us(),this.#s!==null&&Ft(this.#s,()=>{this.#s=null}),this.#b(()=>{this.#A()})},c=a=>{try{r=!0,n?.(a,s),r=!1}catch(o){At(o,this.#i&&this.#i.parent)}l&&(this.#s=this.#b(()=>{try{return Ve(()=>{var o=X;o.b=this,o.f|=ll,l(this.#e,()=>a,()=>s)})}catch(o){return At(o,this.#i.parent),null}}))};rt(()=>{var a;try{a=this.transform_error(t)}catch(o){At(o,this.#i&&this.#i.parent);return}a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(c,o=>At(o,this.#i&&this.#i.parent)):c(a)})}}function Ss(e,t,n,l){const i=In()?dl:ht;var r=e.filter(u=>!u.settled);if(n.length===0&&r.length===0){l(t.map(i));return}var s=X,c=Rs(),a=r.length===1?r[0].promise:r.length>1?Promise.all(r.map(u=>u.promise)):null;function o(u){c();try{l(u)}catch(b){(s.f&Be)===0&&At(b,s)}On()}if(n.length===0){a.then(()=>o(t.map(i)));return}var g=xi();function d(){Promise.all(n.map(u=>Js(u))).then(u=>o([...t.map(i),...u])).catch(u=>At(u,s)).finally(()=>g())}a?a.then(()=>{c(),d(),On()}):d()}function Rs(){var e=X,t=w,n=N,l=S,i=it;return function(s=!0){ke(e),Ne(t),qt(n),s&&(e.f&Be)===0&&(l?.activate(),l?.apply()),ul(null),Fn(i)}}async function dn(e){var t=at,n=await e;return()=>(ul(t),n)}function On(e=!0){ke(null),Ne(null),qt(null),e&&S?.deactivate(),ul(null),Fn(null)}function xi(){var e=X.b,t=S,n=e.is_rendered();return e.update_pending_count(1,t),t.increment(n),(l=!1)=>{e.update_pending_count(-1,t),t.decrement(n,l)}}let at=null;function ul(e){at=e}const Hs=new Set;function dl(e){var t=P|le,n=w!==null&&(w.f&P)!==0?w:null;return X!==null&&(X.f|=_t),{ctx:N,deps:null,effects:null,equals:ri,f:t,fn:e,reactions:null,rv:0,v:ee,wv:0,parent:n??X,ac:null}}function Js(e,t,n){let l=X;l===null&&$r();var i=void 0,r=Rt(ee);r.label=t;var s=!w,c=new Map;return ec(()=>{at={effect:X,warned:!1};var a=X,o=Pl();i=o.promise;try{Promise.resolve(e()).then(o.resolve,o.reject).finally(On)}catch(b){o.reject(b),On()}at=null;var g=S;if(s){if((a.f&ft)!==0)var d=xi();if(l.b.is_rendered())c.get(g)?.reject(nt),c.delete(g);else{for(const b of c.values())b.reject(nt);c.clear()}c.set(g,o)}const u=(b,f=void 0)=>{if(at=null,d){var h=f===nt;d(h)}if(!(f===nt||(a.f&Be)!==0)){if(g.activate(),f)r.f|=bt,ln(r,f);else{(r.f&bt)!==0&&(r.f^=bt),ln(r,b);for(const[C,Z]of c){if(c.delete(C),C===g)break;Z.reject(nt)}}g.deactivate()}};o.promise.then(u,b=>u(null,b||"unknown"))}),Zl(()=>{for(const a of c.values())a.reject(nt)}),r.f|=kn,new Promise(a=>{function o(g){function d(){g===i?a(r):o(i)}g.then(d,d)}o(i)})}function ht(e){const t=dl(e);return t.equals=ci,t}function Fs(e){var t=e.effects;if(t!==null){e.effects=null;for(var n=0;n<t.length;n+=1)ge(t[n])}}let Cl=[];function zs(e){for(var t=e.parent;t!==null;){if((t.f&P)===0)return(t.f&Be)===0?t:null;t=t.parent}return null}function fl(e){var t,n=X;ke(zs(e));{let l=nn;Wi(new Set);try{Bt.call(Cl,e)&&qr(),Cl.push(e),e.f&=~Vt,Fs(e),t=Ui(e)}finally{ke(n),Wi(l),Cl.pop()}}return t}function yi(e){var t=e.v,n=fl(e);if(!e.equals(n)&&(e.wv=Ki(),(!S?.is_fork||e.deps===null)&&(e.v=n,S?.capture(e,t),e.deps===null))){j(e,L);return}mt||(je!==null?(ml()||S?.is_fork)&&je.set(e,n):sl(e))}function js(e){if(e.effects!==null)for(const t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac?.abort(nt),t.teardown=tt,t.ac=null,An(t,0),yl(t))}function wi(e){if(e.effects!==null)for(const t of e.effects)t.teardown&&Dt(t)}let nn=new Set;const vt=new Map;function Wi(e){nn=e}let bl=!1;function Ds(){bl=!0}function Rt(e,t){var n={f:0,v:e,reactions:null,equals:ri,rv:0,wv:0};return n}function pt(e,t){const n=Rt(e);return lc(n),n}function R(e,t=!1,n=!0){const l=Rt(e);return t||(l.equals=ci),Et&&n&&N!==null&&N.l!==null&&(N.l.s??=[]).push(l),l}function v(e,t,n=!1){w!==null&&(!Ye||(w.f&Yn)!==0)&&In()&&(w.f&(P|dt|kn|Yn))!==0&&(Se===null||!Bt.call(Se,e))&&Is();let l=n?rn(t):t;return ai(l,e.label),ln(e,l,Ln)}function ln(e,t,n=null){if(!e.equals(t)){var l=e.v;mt?vt.set(e,t):vt.set(e,l),e.v=t;var i=st.ensure();i.capture(e,l);{if(X!==null){e.updated??=new Map;const r=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:r}),r>5){const s=gi("updated at");if(s!==null){let c=e.updated.get(s.stack);c||(c={error:s,count:0},e.updated.set(s.stack,c)),c.count++}}}X!==null&&(e.set_during_effect=!0)}if((e.f&P)!==0){const r=e;(e.f&le)!==0&&fl(r),je===null&&sl(r)}e.wv=Ki(),_i(e,le,n),In()&&X!==null&&(X.f&L)!==0&&(X.f&(Fe|Ct))===0&&(Re===null?ic([e]):Re.push(e)),!i.is_fork&&nn.size>0&&!bl&&Bi()}return t}function Bi(){bl=!1;for(const e of nn)(e.f&L)!==0&&j(e,ze),sn(e)&&Dt(e);nn.clear()}function Ls(e,t=1){var n=I(e),l=t===1?n++:n--;return v(e,n),l}function Cn(e){v(e,e.v+1)}function _i(e,t,n){var l=e.reactions;if(l!==null)for(var i=In(),r=l.length,s=0;s<r;s++){var c=l[s],a=c.f;if(!(!i&&c===X)){if((a&Yn)!==0){nn.add(c);continue}var o=(a&le)===0;if(o&&j(c,t),(a&P)!==0){var g=c;je?.delete(g),(a&Vt)===0&&(a&We&&(c.f|=Vt),_i(g,ze,n))}else if(o){var d=c;(a&dt)!==0&&ct!==null&&ct.add(d),n!==null?n.push(d):Il(d)}}}}const Os=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function rn(e){if(typeof e!="object"||e===null||Ee in e)return e;const t=nl(e);if(t!==jr&&t!==Dr)return e;var n=new Map,l=Wn(e),i=pt(0),r=jt,s=g=>{if(jt===r)return g();var d=w,u=jt;Ne(null),Ti(r);var b=g();return Ne(d),Ti(u),b};l&&(n.set("length",pt(e.length)),e=Ts(e));var c="";let a=!1;function o(g){if(!a){a=!0,c=g,he(i,`${c} version`);for(const[d,u]of n)he(u,Ht(c,d));a=!1}}return new Proxy(e,{defineProperty(g,d,u){(!("value"in u)||u.configurable===!1||u.enumerable===!1||u.writable===!1)&&gs();var b=n.get(d);return b===void 0?s(()=>{var f=pt(u.value);return n.set(d,f),typeof d=="string"&&he(f,Ht(c,d)),f}):v(b,u.value,!0),!0},deleteProperty(g,d){var u=n.get(d);if(u===void 0){if(d in g){const b=s(()=>pt(ee));n.set(d,b),Cn(i),he(b,Ht(c,d))}}else v(u,ee),Cn(i);return!0},get(g,d,u){if(d===Ee)return e;if(d===ti)return o;var b=n.get(d),f=d in g;if(b===void 0&&(!f||ut(g,d)?.writable)&&(b=s(()=>{var C=rn(f?g[d]:ee),Z=pt(C);return he(Z,Ht(c,d)),Z}),n.set(d,b)),b!==void 0){var h=I(b);return h===ee?void 0:h}return Reflect.get(g,d,u)},getOwnPropertyDescriptor(g,d){var u=Reflect.getOwnPropertyDescriptor(g,d);if(u&&"value"in u){var b=n.get(d);b&&(u.value=I(b))}else if(u===void 0){var f=n.get(d),h=f?.v;if(f!==void 0&&h!==ee)return{enumerable:!0,configurable:!0,value:h,writable:!0}}return u},has(g,d){if(d===Ee)return!0;var u=n.get(d),b=u!==void 0&&u.v!==ee||Reflect.has(g,d);if(u!==void 0||X!==null&&(!b||ut(g,d)?.writable)){u===void 0&&(u=s(()=>{var h=b?rn(g[d]):ee,C=pt(h);return he(C,Ht(c,d)),C}),n.set(d,u));var f=I(u);if(f===ee)return!1}return b},set(g,d,u,b){var f=n.get(d),h=d in g;if(l&&d==="length")for(var C=u;C<f.v;C+=1){var Z=n.get(C+"");Z!==void 0?v(Z,ee):C in g&&(Z=s(()=>pt(ee)),n.set(C+"",Z),he(Z,Ht(c,C)))}if(f===void 0)(!h||ut(g,d)?.writable)&&(f=s(()=>pt(void 0)),he(f,Ht(c,d)),v(f,rn(u)),n.set(d,f));else{h=f.v!==ee;var y=s(()=>rn(u));v(f,y)}var x=Reflect.getOwnPropertyDescriptor(g,d);if(x?.set&&x.set.call(b,u),!h){if(l&&typeof d=="string"){var k=n.get("length"),D=Number(d);Number.isInteger(D)&&D>=k.v&&v(k,D+1)}Cn(i)}return!0},ownKeys(g){I(i);var d=Reflect.ownKeys(g).filter(f=>{var h=n.get(f);return h===void 0||h.v!==ee});for(var[u,b]of n)b.v!==ee&&!(u in g)&&d.push(u);return d},setPrototypeOf(){os()}})}function Ht(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:Os.test(t)?`${e}.${t}`:/^\d+$/.test(t)?`${e}[${t}]`:`${e}['${t}']`}function fn(e){try{if(e!==null&&typeof e=="object"&&Ee in e)return e[Ee]}catch{}return e}const Ms=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Ts(e){return new Proxy(e,{get(t,n,l){var i=Reflect.get(t,n,l);return Ms.has(n)?function(...r){Ds();var s=i.apply(this,r);return Bi(),s}:i}})}function Ks(){const e=Array.prototype,t=Array.__svelte_cleanup;t&&t();const{indexOf:n,lastIndexOf:l,includes:i}=e;e.indexOf=function(r,s){const c=n.call(this,r,s);if(c===-1){for(let a=s??0;a<this.length;a+=1)if(fn(this[a])===r){Rn("array.indexOf(...)");break}}return c},e.lastIndexOf=function(r,s){const c=l.call(this,r,s??this.length-1);if(c===-1){for(let a=0;a<=(s??this.length-1);a+=1)if(fn(this[a])===r){Rn("array.lastIndexOf(...)");break}}return c},e.includes=function(r,s){const c=i.call(this,r,s);if(!c){for(let a=0;a<this.length;a+=1)if(fn(this[a])===r){Rn("array.includes(...)");break}}return c},Array.__svelte_cleanup=()=>{e.indexOf=n,e.lastIndexOf=l,e.includes=i}}function $e(e,t,n=!0){try{e===t!=(fn(e)===fn(t))&&Rn(n?"===":"!==")}catch{}return e===t===n}var Vi,Al,Yi,Ni;function hl(){if(Vi===void 0){Vi=window,Al=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,n=Text.prototype;Yi=ut(t,"firstChild").get,Ni=ut(t,"nextSibling").get,$l(e)&&(e.__click=void 0,e.__className=void 0,e.__attributes=null,e.__style=void 0,e.__e=void 0),$l(n)&&(n.__t=void 0),e.__svelte_meta=null,Ks()}}function ue(e=""){return document.createTextNode(e)}function Jt(e){return Yi.call(e)}function Pe(e){return Ni.call(e)}function m(e,t){if(!W)return Jt(e);var n=Jt(_);if(n===null)n=_.appendChild(ue());else if(t&&n.nodeType!==gn){var l=ue();return n?.before(l),ae(l),l}return t&&Mn(n),ae(n),n}function vl(e,t=!1){if(!W){var n=Jt(e);return n instanceof Comment&&n.data===""?Pe(n):n}if(t){if(_?.nodeType!==gn){var l=ue();return _?.before(l),ae(l),l}Mn(_)}return _}function H(e,t=1,n=!1){let l=W?_:e;for(var i;t--;)i=l,l=Pe(l);if(!W)return l;if(n){if(l?.nodeType!==gn){var r=ue();return l===null?i?.after(r):l.before(r),ae(r),r}Mn(l)}return ae(l),l}function ki(e){e.textContent=""}function Si(){return!1}function pl(e,t,n){return document.createElementNS(El,e,void 0)}function Mn(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===gn;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}let Ri=!1;function Es(){Ri||(Ri=!0,document.addEventListener("reset",e=>{Promise.resolve().then(()=>{if(!e.defaultPrevented)for(const t of e.target.elements)t.__on_r?.()})},{capture:!0}))}function Gl(e){var t=w,n=X;Ne(null),ke(null);try{return e()}finally{Ne(t),ke(n)}}function Hi(e){X===null&&(w===null&&is(e),ls()),mt&&ns(e)}function Us(e,t){var n=t.last;n===null?t.last=t.first=e:(n.next=e,e.prev=n,t.last=e)}function De(e,t){for(var n=X;n!==null&&(n.f&Yn)!==0;)n=n.parent;n!==null&&(n.f&Ae)!==0&&(e|=Ae);var l={ctx:N,deps:null,nodes:null,f:e|le|We,first:null,fn:t,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};l.component_function=on;var i=l;if((e&$t)!==0)tn!==null?tn.push(l):st.ensure().schedule(l);else if(t!==null){try{Dt(l)}catch(s){throw ge(l),s}i.deps===null&&i.teardown===null&&i.nodes===null&&i.first===i.last&&(i.f&_t)===0&&(i=i.first,(e&dt)!==0&&(e&Pt)!==0&&i!==null&&(i.f|=Pt))}if(i!==null&&(i.parent=n,n!==null&&Us(i,n),w!==null&&(w.f&P)!==0&&(e&Ct)===0)){var r=w;(r.effects??=[]).push(i)}return l}function ml(){return w!==null&&!Ye}function Zl(e){const t=De(an,null);return j(t,L),t.teardown=e,t}function Xl(e){Hi("$effect"),we(e,"name",{value:"$effect"});var t=X.f,n=!w&&(t&Fe)!==0&&(t&ft)===0;if(n){var l=N;(l.e??=[]).push(e)}else return Ji(e)}function Ji(e){return De($t|ql,e)}function $s(e){return Hi("$effect.pre"),we(e,"name",{value:"$effect.pre"}),De(an|ql,e)}function Ps(e){st.ensure();const t=De(Ct|_t,e);return()=>{ge(t)}}function Qs(e){st.ensure();const t=De(Ct|_t,e);return(n={})=>new Promise(l=>{n.outro?Ft(t,()=>{ge(t),l(void 0)}):(ge(t),l(void 0))})}function Fi(e){return De($t,e)}function Gt(e,t){var n=N,l={effect:null,ran:!1,deps:e};n.l.$.push(l),l.effect=bn(()=>{if(e(),!l.ran){l.ran=!0;var i=X;try{ke(i.parent),B(t)}finally{ke(i)}}})}function qs(){var e=N;bn(()=>{for(var t of e.l.$){t.deps();var n=t.effect;(n.f&L)!==0&&n.deps!==null&&j(n,ze),sn(n)&&Dt(n),t.ran=!1}})}function ec(e){return De(kn|_t,e)}function bn(e,t=0){return De(an|t,e)}function _e(e,t=[],n=[],l=[]){Ss(l,t,n,i=>{De(an,()=>e(...i.map(I)))})}function xl(e,t=0){var n=De(dt|t,e);return n.dev_stack=it,n}function Ve(e){return De(Fe|_t,e)}function zi(e){var t=e.teardown;if(t!==null){const n=mt,l=w;Oi(!0),Ne(null);try{t.call(null)}finally{Oi(n),Ne(l)}}}function yl(e,t=!1){var n=e.first;for(e.first=e.last=null;n!==null;){const i=n.ac;i!==null&&Gl(()=>{i.abort(nt)});var l=n.next;(n.f&Ct)!==0?n.parent=null:ge(n,t),n=l}}function tc(e){for(var t=e.first;t!==null;){var n=t.next;(t.f&Fe)===0&&ge(t),t=n}}function ge(e,t=!0){var n=!1;(t||(e.f&Or)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(nc(e.nodes.start,e.nodes.end),n=!0),j(e,il),yl(e,t&&!n),An(e,0);var l=e.nodes&&e.nodes.t;if(l!==null)for(const r of l)r.stop();zi(e),e.f^=il,e.f|=Be;var i=e.parent;i!==null&&i.first!==null&&ji(e),e.component_function=null,e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=null}function nc(e,t){for(;e!==null;){var n=e===t?null:Pe(e);e.remove(),e=n}}function ji(e){var t=e.parent,n=e.prev,l=e.next;n!==null&&(n.next=l),l!==null&&(l.prev=n),t!==null&&(t.first===e&&(t.first=l),t.last===e&&(t.last=n))}function Ft(e,t,n=!0){var l=[];Di(e,l,!0);var i=()=>{n&&ge(e),t&&t()},r=l.length;if(r>0){var s=()=>--r||i();for(var c of l)c.out(s)}else i()}function Di(e,t,n){if((e.f&Ae)===0){e.f^=Ae;var l=e.nodes&&e.nodes.t;if(l!==null)for(const c of l)(c.is_global||n)&&t.push(c);for(var i=e.first;i!==null;){var r=i.next,s=(i.f&Pt)!==0||(i.f&Fe)!==0&&(e.f&dt)!==0;Di(i,t,s?n:!1),i=r}}}function wl(e){Li(e,!0)}function Li(e,t){if((e.f&Ae)!==0){e.f^=Ae,(e.f&L)===0&&(j(e,le),st.ensure().schedule(e));for(var n=e.first;n!==null;){var l=n.next,i=(n.f&Pt)!==0||(n.f&Fe)!==0;Li(n,i?t:!1),n=l}var r=e.nodes&&e.nodes.t;if(r!==null)for(const s of r)(s.is_global||t)&&s.in()}}function Wl(e,t){if(e.nodes)for(var n=e.nodes.start,l=e.nodes.end;n!==null;){var i=n===l?null:Pe(n);t.append(n),n=i}}let Tn=!1,mt=!1;function Oi(e){mt=e}let w=null,Ye=!1;function Ne(e){w=e}let X=null;function ke(e){X=e}let Se=null;function lc(e){w!==null&&(Se===null?Se=[e]:Se.push(e))}let de=null,ve=0,Re=null;function ic(e){Re=e}let Mi=1,zt=0,jt=zt;function Ti(e){jt=e}function Ki(){return++Mi}function sn(e){var t=e.f;if((t&le)!==0)return!0;if(t&P&&(e.f&=~Vt),(t&ze)!==0){for(var n=e.deps,l=n.length,i=0;i<l;i++){var r=n[i];if(sn(r)&&yi(r),r.wv>e.wv)return!0}(t&We)!==0&&je===null&&j(e,L)}return!1}function Ei(e,t,n=!0){var l=e.reactions;if(l!==null&&!(Se!==null&&Bt.call(Se,e)))for(var i=0;i<l.length;i++){var r=l[i];(r.f&P)!==0?Ei(r,t,!1):t===r&&(n?j(r,le):(r.f&L)!==0&&j(r,ze),Il(r))}}function Ui(e){var t=de,n=ve,l=Re,i=w,r=Se,s=N,c=Ye,a=jt,o=e.f;de=null,ve=0,Re=null,w=(o&(Fe|Ct))===0?e:null,Se=null,qt(e.ctx),Ye=!1,jt=++zt,e.ac!==null&&(Gl(()=>{e.ac.abort(nt)}),e.ac=null);try{e.f|=Nn;var g=e.fn,d=g();e.f|=ft;var u=e.deps,b=S?.is_fork;if(de!==null){var f;if(b||An(e,ve),u!==null&&ve>0)for(u.length=ve+de.length,f=0;f<de.length;f++)u[ve+f]=de[f];else e.deps=u=de;if(ml()&&(e.f&We)!==0)for(f=ve;f<u.length;f++)(u[f].reactions??=[]).push(e)}else!b&&u!==null&&ve<u.length&&(An(e,ve),u.length=ve);if(In()&&Re!==null&&!Ye&&u!==null&&(e.f&(P|ze|le))===0)for(f=0;f<Re.length;f++)Ei(Re[f],e);if(i!==null&&i!==e){if(zt++,i.deps!==null)for(let h=0;h<n;h+=1)i.deps[h].rv=zt;if(t!==null)for(const h of t)h.rv=zt;Re!==null&&(l===null?l=Re:l.push(...Re))}return(e.f&bt)!==0&&(e.f^=bt),d}catch(h){return ui(h)}finally{e.f^=Nn,de=t,ve=n,Re=l,w=i,Se=r,qt(s),Ye=c,jt=a}}function rc(e,t){let n=t.reactions;if(n!==null){var l=zr.call(n,e);if(l!==-1){var i=n.length-1;i===0?n=t.reactions=null:(n[l]=n[i],n.pop())}}if(n===null&&(t.f&P)!==0&&(de===null||!Bt.call(de,t))){var r=t;(r.f&We)!==0&&(r.f^=We,r.f&=~Vt),sl(r),js(r),An(r,0)}}function An(e,t){var n=e.deps;if(n!==null)for(var l=t;l<n.length;l++)rc(e,n[l])}function Dt(e){var t=e.f;if((t&Be)===0){j(e,L);var n=X,l=Tn;X=e,Tn=!0;{var i=on;oi(e.component_function);var r=it;Fn(e.dev_stack??it)}try{(t&(dt|Ql))!==0?tc(e):yl(e),zi(e);var s=Ui(e);e.teardown=typeof s=="function"?s:null,e.wv=Mi;var c;Fr&&Br&&(e.f&le)!==0&&e.deps}finally{Tn=l,X=n,oi(i),Fn(r)}}}function I(e){var t=e.f,n=(t&P)!==0;if(w!==null&&!Ye){var l=X!==null&&(X.f&Be)!==0;if(!l&&(Se===null||!Bt.call(Se,e))){var i=w.deps;if((w.f&Nn)!==0)e.rv<zt&&(e.rv=zt,de===null&&i!==null&&i[ve]===e?ve++:de===null?de=[e]:de.push(e));else{(w.deps??=[]).push(e);var r=e.reactions;r===null?e.reactions=[w]:Bt.call(r,w)||r.push(w)}}}{if(!Ye&&at&&!at.warned&&(at.effect.f&Nn)===0){at.warned=!0,ds(e.label);var s=gi("traced at");s&&console.warn(s)}Hs.delete(e)}if(mt&&vt.has(e))return vt.get(e);if(n){var c=e;if(mt){var a=c.v;return((c.f&L)===0&&c.reactions!==null||Pi(c))&&(a=fl(c)),vt.set(c,a),a}var o=(c.f&We)===0&&!Ye&&w!==null&&(Tn||(w.f&We)!==0),g=(c.f&ft)===0;sn(c)&&(o&&(c.f|=We),yi(c)),o&&!g&&(wi(c),$i(c))}if(je?.has(e))return je.get(e);if((e.f&bt)!==0)throw e.v;return e.v}function $i(e){if(e.f|=We,e.deps!==null)for(const t of e.deps)(t.reactions??=[]).push(e),(t.f&P)!==0&&(t.f&We)===0&&(wi(t),$i(t))}function Pi(e){if(e.v===ee)return!0;if(e.deps===null)return!1;for(const t of e.deps)if(vt.has(t)||(t.f&P)!==0&&Pi(t))return!0;return!1}function B(e){var t=Ye;try{return Ye=!0,e()}finally{Ye=t}}function Lt(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(Ee in e)Bl(e);else if(!Array.isArray(e))for(let t in e){const n=e[t];typeof n=="object"&&n&&Ee in n&&Bl(n)}}}function Bl(e,t=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let l in e)try{Bl(e[l],t)}catch{}const n=nl(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const l=Ul(n);for(let i in l){const r=l[i].get;if(r)try{r.call(e)}catch{}}}}}const Kn=Symbol("events"),sc=new Set,Qi=new Set;function cc(e,t,n,l={}){function i(r){if(l.capture||_l.call(t,r),!r.cancelBubble)return Gl(()=>n?.call(this,r))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?rt(()=>{t.addEventListener(e,i,l)}):t.addEventListener(e,i,l),i}function ie(e,t,n,l,i){var r={capture:l,passive:i},s=cc(e,t,n,r);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&Zl(()=>{t.removeEventListener(e,s,r)})}let qi=null;function _l(e){var t=this,n=t.ownerDocument,l=e.type,i=e.composedPath?.()||[],r=i[0]||e.target;qi=e;var s=0,c=qi===e&&e[Kn];if(c){var a=i.indexOf(c);if(a!==-1&&(t===document||t===window)){e[Kn]=t;return}var o=i.indexOf(t);if(o===-1)return;a<=o&&(s=a)}if(r=i[s]||e.target,r!==t){we(e,"currentTarget",{configurable:!0,get(){return r||n}});var g=w,d=X;Ne(null),ke(null);try{for(var u,b=[];r!==null;){var f=r.assignedSlot||r.parentNode||r.host||null;try{var h=r[Kn]?.[l];h!=null&&(!r.disabled||e.target===r)&&h.call(r,e)}catch(C){u?b.push(C):u=C}if(e.cancelBubble||f===t||f===null)break;r=f}if(u){for(let C of b)queueMicrotask(()=>{throw C});throw u}}finally{e[Kn]=t,delete e.currentTarget,Ne(g),ke(d)}}}const ac=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function gc(e){return ac?.createHTML(e)??e}function oc(e){var t=pl("template");return t.innerHTML=gc(e.replaceAll("<!>","<!---->")),t.content}function Zt(e,t){var n=X;n.nodes===null&&(n.nodes={start:e,end:t,a:null,t:null})}function Qe(e,t){var n=(t&Hr)!==0,l=(t&Jr)!==0,i,r=!e.startsWith("<!>");return()=>{if(W)return Zt(_,null),_;i===void 0&&(i=oc(r?e:"<!>"+e),n||(i=Jt(i)));var s=l||Al?document.importNode(i,!0):i.cloneNode(!0);if(n){var c=Jt(s),a=s.lastChild;Zt(c,a)}else Zt(s,s);return s}}function er(e=""){if(!W){var t=ue(e+"");return Zt(t,t),t}var n=_;return n.nodeType!==gn?(n.before(n=ue()),ae(n)):Mn(n),Zt(n,n),n}function Ic(){if(W)return Zt(_,null),_;var e=document.createDocumentFragment(),t=document.createComment(""),n=ue();return e.append(t,n),Zt(t,n),e}function Ce(e,t){if(W){var n=X;((n.f&ft)===0||n.nodes.end===null)&&(n.nodes.end=_),Hn();return}e!==null&&e.before(t)}const uc=["touchstart","touchmove"];function dc(e){return uc.includes(e)}function F(e,t){var n=t==null?"":typeof t=="object"?`${t}`:t;n!==(e.__t??=e.nodeValue)&&(e.__t=n,e.nodeValue=`${n}`)}function tr(e,t){return nr(e,t)}function Cc(e,t){hl(),t.intro=t.intro??!1;const n=t.target,l=W,i=_;try{for(var r=Jt(n);r&&(r.nodeType!==Qt||r.data!==el);)r=Pe(r);if(!r)throw Ut;lt(!0),ae(r);const s=nr(e,{...t,anchor:r});return lt(!1),s}catch(s){if(s instanceof Error&&s.message.split(`
`).some(c=>c.startsWith("https://svelte.dev/e/")))throw s;return s!==Ut&&console.warn("Failed to hydrate: ",s),t.recover===!1&&ss(),hl(),ki(n),lt(!1),tr(e,t)}finally{lt(l),ae(i)}}const En=new Map;function nr(e,{target:t,anchor:n,props:l={},events:i,context:r,intro:s=!0,transformError:c}){hl();var a=void 0,o=Qs(()=>{var g=n??t.appendChild(ue());Ns(g,{pending:()=>{}},b=>{zn({});var f=N;if(r&&(f.c=r),i&&(l.$$events=i),W&&Zt(b,null),a=e(b,l)||{},W&&(X.nodes.end=_,_===null||_.nodeType!==Qt||_.data!==wn))throw Sn(),Ut;jn()},c);var d=new Set,u=b=>{for(var f=0;f<b.length;f++){var h=b[f];if(!d.has(h)){d.add(h);var C=dc(h);for(const x of[t,document]){var Z=En.get(x);Z===void 0&&(Z=new Map,En.set(x,Z));var y=Z.get(h);y===void 0?(x.addEventListener(h,_l,{passive:C}),Z.set(h,1)):Z.set(h,y+1)}}}};return u(Bn(sc)),Qi.add(u),()=>{for(var b of d)for(const C of[t,document]){var f=En.get(C),h=f.get(b);--h==0?(C.removeEventListener(b,_l),f.delete(b),f.size===0&&En.delete(C)):f.set(b,h)}Qi.delete(u),g!==n&&g.parentNode?.removeChild(g)}});return Vl.set(a,o),a}let Vl=new WeakMap;function fc(e,t){const n=Vl.get(e);return n?(Vl.delete(e),n(t)):(Ee in e?bs():fs(),Promise.resolve())}function lr(e,t){e!=null&&typeof e.subscribe!="function"&&Ur(t)}class bc{anchor;#e=new Map;#t=new Map;#n=new Map;#c=new Set;#i=!0;constructor(t,n=!0){this.anchor=t,this.#i=n}#l=t=>{if(this.#e.has(t)){var n=this.#e.get(t),l=this.#t.get(n);if(l)wl(l),this.#c.delete(n);else{var i=this.#n.get(n);i&&(this.#t.set(n,i.effect),this.#n.delete(n),i.fragment.lastChild.remove(),this.anchor.before(i.fragment),l=i.effect)}for(const[r,s]of this.#e){if(this.#e.delete(r),r===t)break;const c=this.#n.get(s);c&&(ge(c.effect),this.#n.delete(s))}for(const[r,s]of this.#t){if(r===n||this.#c.has(r))continue;const c=()=>{if(Array.from(this.#e.values()).includes(r)){var o=document.createDocumentFragment();Wl(s,o),o.append(ue()),this.#n.set(r,{effect:s,fragment:o})}else ge(s);this.#c.delete(r),this.#t.delete(r)};this.#i||!l?(this.#c.add(r),Ft(s,c,!1)):c()}}};#r=t=>{this.#e.delete(t);const n=Array.from(this.#e.values());for(const[l,i]of this.#n)n.includes(l)||(ge(i.effect),this.#n.delete(l))};ensure(t,n){var l=S,i=Si();if(n&&!this.#t.has(t)&&!this.#n.has(t))if(i){var r=document.createDocumentFragment(),s=ue();r.append(s),this.#n.set(t,{effect:Ve(()=>n(s)),fragment:r})}else this.#t.set(t,Ve(()=>n(this.anchor)));if(this.#e.set(l,t),i){for(const[c,a]of this.#t)c===t?l.unskip_effect(a):l.skip_effect(a);for(const[c,a]of this.#n)c===t?l.unskip_effect(a.effect):l.skip_effect(a.effect);l.oncommit(this.#l),l.ondiscard(this.#r)}else W&&(this.anchor=_),this.#l(l)}}{let e=function(t){if(!(t in globalThis)){let n;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(n!==void 0)return n;as(t)},set:l=>{n=l}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function Ac(e){N===null&&li("onMount"),Et&&N.l!==null?pc(N).m.push(e):Xl(()=>{const t=B(e);if(typeof t=="function")return t})}function hc(e,t,{bubbles:n=!1,cancelable:l=!1}={}){return new CustomEvent(e,{detail:t,bubbles:n,cancelable:l})}function vc(){const e=N;return e===null&&li("createEventDispatcher"),(t,n,l)=>{const i=e.s.$$events?.[t];if(i){const r=Wn(i)?i.slice():[i],s=hc(t,n,l);for(const c of r)c.call(e.x,s);return!s.defaultPrevented}return!0}}function pc(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}var ir=new Map;function Gc(e,t){var n=ir.get(e);n||(n=new Set,ir.set(e,n)),n.add(t)}function qe(e,t,n){return(...l)=>{const i=e(...l);var r=W?i:i.nodeType===Kr?i.firstChild:i;return rr(r,t,n),i}}function mc(e,t,n){e.__svelte_meta={parent:it,loc:{file:t,line:n[0],column:n[1]}},n[2]&&rr(e.firstChild,t,n[2])}function rr(e,t,n){for(var l=0,i=0;e&&l<n.length;){if(W&&e.nodeType===Qt){var r=e;r.data[0]===el?i+=1:r.data[0]===wn&&(i-=1)}i===0&&e.nodeType===Tr&&mc(e,t,n[l++]),e=e.nextSibling}}function Yl(e){e&&Qr(e[te]??"a component",e.name)}function Nl(){const e=N?.function;function t(n){Pr(n,e[te])}return{$destroy:()=>t("$destroy()"),$on:()=>t("$on(...)"),$set:()=>t("$set(...)")}}function hn(e,t,n=!1){var l;W&&(l=_,Hn());var i=new bc(e),r=n?Pt:0;function s(c,a){if(W){var o=ii(l);if(c!==parseInt(o.substring(1))){var g=Jn();ae(g),i.anchor=g,lt(!1),i.ensure(c,a),lt(!0);return}}i.ensure(c,a)}xl(()=>{var c=!1;t((a,o=0)=>{c=!0,s(o,a)}),c||s(-1,null)},r)}function kl(e,t){return t}function Zc(e,t,n){for(var l=[],i=t.length,r,s=t.length,c=0;c<i;c++){let d=t[c];Ft(d,()=>{if(r){if(r.pending.delete(d),r.done.add(d),r.pending.size===0){var u=e.outrogroups;Sl(e,Bn(r.done)),u.delete(r),u.size===0&&(e.outrogroups=null)}}else s-=1},!1)}if(s===0){var a=l.length===0&&n!==null;if(a){var o=n,g=o.parentNode;ki(g),g.append(o),e.items.clear()}Sl(e,t,!a)}else r={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(r)}function Sl(e,t,n=!0){var l;if(e.pending.size>0){l=new Set;for(const s of e.pending.values())for(const c of s)l.add(e.items.get(c).e)}for(var i=0;i<t.length;i++){var r=t[i];if(l?.has(r)){r.f|=Ke;const s=document.createDocumentFragment();Wl(r,s)}else ge(t[i],n)}}var sr;function Rl(e,t,n,l,i,r=null){var s=e,c=new Map,a=(t&Tl)!==0;if(a){var o=e;s=W?ae(Jt(o)):o.appendChild(ue())}W&&Hn();var g=null,d=ht(()=>{var x=n();return Wn(x)?x:x==null?[]:Bn(x)}),u,b=new Map,f=!0;function h(x){(y.effect.f&Be)===0&&(y.pending.delete(x),y.fallback=g,Xc(y,u,s,t,l),g!==null&&(u.length===0?(g.f&Ke)===0?wl(g):(g.f^=Ke,pn(g,null,s)):Ft(g,()=>{g=null})))}function C(x){y.pending.delete(x)}var Z=xl(()=>{u=I(d);var x=u.length;let k=!1;if(W){var D=ii(s)===tl;D!==(x===0)&&(s=Jn(),ae(s),lt(!1),k=!0)}for(var O=new Set,M=S,He=Si(),T=0;T<x;T+=1){W&&_.nodeType===Qt&&_.data===wn&&(s=_,k=!0,lt(!1));var z=u[T],pe=l(z,T);{var oe=l(z,T);pe!==oe&&ts(String(T),String(pe),String(oe))}var K=f?null:c.get(pe);K?(K.v&&ln(K.v,z),K.i&&ln(K.i,T),He&&M.unskip_effect(K.e)):(K=xc(c,f?s:sr??=ue(),z,pe,T,i,t,n),f||(K.e.f|=Ke),c.set(pe,K)),O.add(pe)}if(x===0&&r&&!g&&(f?g=Ve(()=>r(s)):(g=Ve(()=>r(sr??=ue())),g.f|=Ke)),x>O.size&&yc(u,l),W&&x>0&&ae(Jn()),!f)if(b.set(M,O),He){for(const[Ie,Ge]of c)O.has(Ie)||M.skip_effect(Ge.e);M.oncommit(h),M.ondiscard(C)}else h(M);k&&lt(!0),I(d)}),y={effect:Z,items:c,pending:b,outrogroups:null,fallback:g};f=!1,W&&(s=_)}function vn(e){for(;e!==null&&(e.f&Fe)===0;)e=e.next;return e}function Xc(e,t,n,l,i){var r=(l&Nr)!==0,s=t.length,c=e.items,a=vn(e.effect.first),o,g=null,d,u=[],b=[],f,h,C,Z;if(r)for(Z=0;Z<s;Z+=1)f=t[Z],h=i(f,Z),C=c.get(h).e,(C.f&Ke)===0&&(C.nodes?.a?.measure(),(d??=new Set).add(C));for(Z=0;Z<s;Z+=1){if(f=t[Z],h=i(f,Z),C=c.get(h).e,e.outrogroups!==null)for(const z of e.outrogroups)z.pending.delete(C),z.done.delete(C);if((C.f&Ae)!==0&&(wl(C),r&&(C.nodes?.a?.unfix(),(d??=new Set).delete(C))),(C.f&Ke)!==0)if(C.f^=Ke,C===a)pn(C,null,n);else{var y=g?g.next:a;C===e.effect.last&&(e.effect.last=C.prev),C.prev&&(C.prev.next=C.next),C.next&&(C.next.prev=C.prev),Xt(e,g,C),Xt(e,C,y),pn(C,y,n),g=C,u=[],b=[],a=vn(g.next);continue}if(C!==a){if(o!==void 0&&o.has(C)){if(u.length<b.length){var x=b[0],k;g=x.prev;var D=u[0],O=u[u.length-1];for(k=0;k<u.length;k+=1)pn(u[k],x,n);for(k=0;k<b.length;k+=1)o.delete(b[k]);Xt(e,D.prev,O.next),Xt(e,g,D),Xt(e,O,x),a=x,g=O,Z-=1,u=[],b=[]}else o.delete(C),pn(C,a,n),Xt(e,C.prev,C.next),Xt(e,C,g===null?e.effect.first:g.next),Xt(e,g,C),g=C;continue}for(u=[],b=[];a!==null&&a!==C;)(o??=new Set).add(a),b.push(a),a=vn(a.next);if(a===null)continue}(C.f&Ke)===0&&u.push(C),g=C,a=vn(C.next)}if(e.outrogroups!==null){for(const z of e.outrogroups)z.pending.size===0&&(Sl(e,Bn(z.done)),e.outrogroups?.delete(z));e.outrogroups.size===0&&(e.outrogroups=null)}if(a!==null||o!==void 0){var M=[];if(o!==void 0)for(C of o)(C.f&Ae)===0&&M.push(C);for(;a!==null;)(a.f&Ae)===0&&a!==e.fallback&&M.push(a),a=vn(a.next);var He=M.length;if(He>0){var T=(l&Tl)!==0&&s===0?n:null;if(r){for(Z=0;Z<He;Z+=1)M[Z].nodes?.a?.measure();for(Z=0;Z<He;Z+=1)M[Z].nodes?.a?.fix()}Zc(e,M,T)}}r&&rt(()=>{if(d!==void 0)for(C of d)C.nodes?.a?.apply()})}function xc(e,t,n,l,i,r,s,c){var a=(s&Vr)!==0?(s&kr)===0?R(n,!1,!1):Rt(n):null,o=(s&Yr)!==0?Rt(i):null;return a&&(a.trace=()=>{c()[o?.v??i]}),{v:a,i:o,e:Ve(()=>(r(t,a??n,o??i,c),()=>{e.delete(l)}))}}function pn(e,t,n){if(e.nodes)for(var l=e.nodes.start,i=e.nodes.end,r=t&&(t.f&Ke)===0?t.nodes.start:n;l!==null;){var s=Pe(l);if(r.before(l),l===i)return;l=s}}function Xt(e,t,n){t===null?e.effect.first=n:t.next=n,n===null?e.effect.last=t:n.prev=t}function yc(e,t){const n=new Map,l=e.length;for(let i=0;i<l;i++){const r=t(e[i],i);if(n.has(r)){const s=String(n.get(r)),c=String(i);let a=String(r);a.startsWith("[object ")&&(a=null),es(s,c,a)}n.set(r,i)}}function cr(e,t){Fi(()=>{var n=e.getRootNode(),l=n.host?n:n.head??n.ownerDocument.head;if(!l.querySelector("#"+t.hash)){const i=pl("style");i.id=t.hash,i.textContent=t.code,l.appendChild(i),Gc(t.hash,i)}})}const ar=[...` 	
\r\f \v\uFEFF`];function wc(e,t,n){var l=e==null?"":""+e;if(n){for(var i of Object.keys(n))if(n[i])l=l?l+" "+i:i;else if(l.length)for(var r=i.length,s=0;(s=l.indexOf(i,s))>=0;){var c=s+r;(s===0||ar.includes(l[s-1]))&&(c===l.length||ar.includes(l[c]))?l=(s===0?"":l.substring(0,s))+l.substring(c+1):s=c}}return l===""?null:l}function Wc(e,t){return e==null?null:String(e)}function Hl(e,t,n,l,i,r){var s=e.__className;if(W||s!==n||s===void 0){var c=wc(n,l,r);(!W||c!==e.getAttribute("class"))&&(c==null?e.removeAttribute("class"):e.className=c),e.__className=n}else if(r&&i!==r)for(var a in r){var o=!!r[a];(i==null||o!==!!i[a])&&e.classList.toggle(a,o)}return r}function Bc(e,t,n,l){var i=e.__style;if(W||i!==t){var r=Wc(t);(!W||r!==e.getAttribute("style"))&&(r==null?e.removeAttribute("style"):e.style.cssText=r),e.__style=t}return l}const _c=Symbol("is custom element"),Vc=Symbol("is html"),Yc=ni?"link":"LINK",Nc=ni?"progress":"PROGRESS";function kc(e){if(W){var t=!1,n=()=>{if(!t){if(t=!0,e.hasAttribute("value")){var l=e.value;Ot(e,"value",null),e.value=l}if(e.hasAttribute("checked")){var i=e.checked;Ot(e,"checked",null),e.checked=i}}};e.__on_r=n,rt(n),Es()}}function Sc(e,t){var n=gr(e);n.value===(n.value=t??void 0)||e.value===t&&(t!==0||e.nodeName!==Nc)||(e.value=t??"")}function Ot(e,t,n,l){var i=gr(e);if(W&&(i[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===Yc)){Hc(e,t,n??"");return}i[t]!==(i[t]=n)&&(t==="loading"&&(e[Mr]=n),n==null?e.removeAttribute(t):typeof n!="string"&&Rc(e).includes(t)?e[t]=n:e.setAttribute(t,n))}function gr(e){return e.__attributes??={[_c]:e.nodeName.includes("-"),[Vc]:e.namespaceURI===El}}var or=new Map;function Rc(e){var t=e.getAttribute("is")||e.nodeName,n=or.get(t);if(n)return n;or.set(t,n=[]);for(var l,i=e,r=Element.prototype;r!==i;){l=Ul(i);for(var s in l)l[s].set&&n.push(s);i=nl(i)}return n}function Hc(e,t,n){t==="srcset"&&Jc(e,n)||Jl(e.getAttribute(t)??"",n)||Cs(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(n))}function Jl(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function Ir(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function Jc(e,t){var n=Ir(e.srcset),l=Ir(t);return l.length===n.length&&l.every(([i,r],s)=>r===n[s][1]&&(Jl(n[s][0],i)||Jl(i,n[s][0])))}function ur(e,t){return e===t||e?.[Ee]===t}function Fc(e={},t,n,l){var i=N.r,r=X;return Fi(()=>{var s,c;return bn(()=>{s=c,c=[],B(()=>{e!==n(...c)&&(t(e,...c),s&&ur(n(...s),e)&&t(null,...s))})}),()=>{let a=r;for(;a!==i&&a.parent!==null&&a.parent.f&il;)a=a.parent;const o=()=>{c&&ur(n(...c),e)&&t(null,...c)},g=a.teardown;a.teardown=()=>{o(),g?.()}}}),e}function zc(e){return function(...t){var n=t[0];return n.stopPropagation(),e?.apply(this,t)}}function dr(e=!1){const t=N,n=t.l.u;if(!n)return;let l=()=>Lt(t.s);if(e){let i=0,r={};const s=dl(()=>{let c=!1;const a=t.s;for(const o in a)a[o]!==r[o]&&(r[o]=a[o],c=!0);return c&&i++,i});l=()=>I(s)}n.b.length&&$s(()=>{Cr(t,l),Vn(n.b)}),Xl(()=>{const i=B(()=>n.m.map(Lr));return()=>{for(const r of i)typeof r=="function"&&r()}}),n.a.length&&Xl(()=>{Cr(t,l),Vn(n.a)})}function Cr(e,t){if(e.l.s)for(const n of e.l.s)I(n);t()}function jc(e,t){var n=e.$$events?.[t.type],l=Wn(n)?n.slice():n==null?[]:[n];for(var i of l)i.call(this,t)}function Q(e,t,n,l){var i=!Et||(n&Sr)!==0,r=(n&Rr)!==0,s=l,c=!0,a=()=>(c&&(c=!1,s=l),s);let o;{var g=Ee in e||ei in e;o=ut(e,t)?.set??(g&&t in e?y=>e[t]=y:void 0)}var d,u=!1;[d,u]=ws(()=>e[t]),d===void 0&&l!==void 0&&(d=a(),o&&(i&&cs(t),o(d)));var b;if(i?b=()=>{var y=e[t];return y===void 0?a():(c=!0,y)}:b=()=>{var y=e[t];return y!==void 0&&(s=void 0),y===void 0?s:y},o){var f=e.$$legacy;return(function(y,x){return arguments.length>0?((!i||!x||f||u)&&o(x?b():y),y):b()})}var h=!1,C=ht(()=>(h=!1,b()));C.label=t,I(C);var Z=X;return(function(y,x){if(arguments.length>0){const k=x?I(C):i&&r?rn(y):y;return v(C,k),h=!0,s!==void 0&&(s=k),y}return mt&&h||(Z.f&Be)!==0?C.v:I(C)})}function Dc(e){return new Lc(e)}class Lc{#e;#t;constructor(t){var n=new Map,l=(r,s)=>{var c=R(s,!1,!1);return n.set(r,c),c};const i=new Proxy({...t.props||{},$$events:{}},{get(r,s){return I(n.get(s)??l(s,Reflect.get(r,s)))},has(r,s){return s===ei?!0:(I(n.get(s)??l(s,Reflect.get(r,s))),Reflect.has(r,s))},set(r,s,c){return v(n.get(s)??l(s,c),c),Reflect.set(r,s,c)}});this.#t=(t.hydrate?Cc:tr)(t.component,{target:t.target,anchor:t.anchor,props:i,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError}),(!t?.props?.$$host||t.sync===!1)&&E(),this.#e=i.$$events;for(const r of Object.keys(this.#t))r==="$set"||r==="$destroy"||r==="$on"||we(this,r,{get(){return this.#t[r]},set(s){this.#t[r]=s},enumerable:!0});this.#t.$set=r=>{Object.assign(i,r)},this.#t.$destroy=()=>{fc(this.#t)}}$set(t){this.#t.$set(t)}$on(t,n){this.#e[t]=this.#e[t]||[];const l=(...i)=>n.call(this,...i);return this.#e[t].push(l),()=>{this.#e[t]=this.#e[t].filter(i=>i!==l)}}$destroy(){this.#t.$destroy()}}let fr;typeof HTMLElement=="function"&&(fr=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,n){super(),this.$$ctor=e,this.$$s=t,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(e,t,n){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){const l=this.$$c.$on(e,t);this.$$l_u.set(t,l)}super.addEventListener(e,t,n)}removeEventListener(e,t,n){if(super.removeEventListener(e,t,n),this.$$c){const l=this.$$l_u.get(t);l&&(l(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(l){return i=>{const r=pl("slot");l!=="default"&&(r.name=l),Ce(i,r)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;const t={},n=Oc(this);for(const l of this.$$s)l in n&&(l==="default"&&!this.$$d.children?(this.$$d.children=e(l),t.default=!0):t[l]=e(l));for(const l of this.attributes){const i=this.$$g_p(l.name);i in this.$$d||(this.$$d[i]=Un(i,l.value,this.$$p_d,"toProp"))}for(const l in this.$$p_d)!(l in this.$$d)&&this[l]!==void 0&&(this.$$d[l]=this[l],delete this[l]);this.$$c=Dc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=Ps(()=>{bn(()=>{this.$$r=!0;for(const l of _n(this.$$c)){if(!this.$$p_d[l]?.reflect)continue;this.$$d[l]=this.$$c[l];const i=Un(l,this.$$d[l],this.$$p_d,"toAttribute");i==null?this.removeAttribute(this.$$p_d[l].attribute||l):this.setAttribute(this.$$p_d[l].attribute||l,i)}this.$$r=!1})});for(const l in this.$$l)for(const i of this.$$l[l]){const r=this.$$c.$on(l,i);this.$$l_u.set(i,r)}this.$$l={}}}attributeChangedCallback(e,t,n){this.$$r||(e=this.$$g_p(e),this.$$d[e]=Un(e,n,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return _n(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function Un(e,t,n,l){const i=n[e]?.type;if(t=i==="Boolean"&&typeof t!="boolean"?t!=null:t,!l||!n[e])return t;if(l==="toAttribute")switch(i){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(i){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function Oc(e){const t={};return e.childNodes.forEach(n=>{t[n.slot||"default"]=!0}),t}function Fl(e,t,n,l,i,r){let s=class extends fr{constructor(){super(e,n,i),this.$$p_d=t}static get observedAttributes(){return _n(t).map(c=>(t[c].attribute||c).toLowerCase())}};return _n(t).forEach(c=>{we(s.prototype,c,{get(){return this.$$c&&c in this.$$c?this.$$c[c]:this.$$d[c]},set(a){a=Un(c,a,t),this.$$d[c]=a;var o=this.$$c;if(o){var g=ut(o,c)?.get;g?o[c]=a:o.$set({[c]:a})}}})}),l.forEach(c=>{we(s.prototype,c,{get(){return this.$$c?.[c]}})}),e.element=s,s}const br={en:{crossword:{across:"Across",down:"Down",loading:"Loading puzzle...",congratulations:"Excellent!",solvedMessage:"You solved the crossword!",yourTime:"Your time:",share:"Share",shareTitle:"Share your result",shareSubtitle:"Copy the link to share with friends",copy:"Copy",copied:"✓ Copied",selectCell:"Select a cell",prevClue:"Previous clue",nextClue:"Next clue",mainWordTitle:"Daily crossword phrase",sharedSolvedMessage:"Your friend solved this crossword!",theirTime:"Their time:",startSolving:"Start solving",older:"Older",newer:"Newer"},wordgame:{loading:"Loading...",preview:"Preview",enterLetters:"Enter {0} letters",guessedCorrectly:"🎉 Excellent! You guessed it!",wordWas:"The word was: ",playAgain:"Play again",howToPlayTitle:"How to play",guessWord:"Guess the word in <strong>{0} attempts</strong>.",eachGuessMustBe:"Each guess must be a <strong>{0} letter</strong> word.",colorsShowHint:"Colors show how close your guess was.",correctLegend:"Correct",wrongPlaceLegend:"Wrong place",notInWordLegend:"Not in word",typeLetters:"Type letters using your keyboard",pressEnter:"Press <strong>Enter</strong> to submit your guess",pressBackspace:"Press <strong>Backspace</strong> to delete a letter",gameNotFound:"Game not found. Set the <code>game-id</code> attribute."},wordsearch:{loading:"Loading puzzle…",wordsToFind:"Words to Find",found:"found",congratulations:"Congratulations!",foundAllWords:"You found all {0} words!",playAgain:"Play Again",older:"Older",newer:"Newer"}},lt:{crossword:{across:"Horizontaliai",down:"Vertikaliai",loading:"Kraunamas galvosūkis...",congratulations:"Puiku!",solvedMessage:"Sėkmingai išsprendėte kryžiažodį!",yourTime:"Jūsų laikas:",share:"Dalintis",shareTitle:"Pasidalinkite rezultatu",shareSubtitle:"Nukopijuokite nuorodą ir pasidalinkite su draugais",copy:"Kopijuoti",copied:"✓ Nukopijuota",selectCell:"Pasirinkite langelį",prevClue:"Ankstesnė užuomina",nextClue:"Kita užuomina",mainWordTitle:"Dienos kryžiažodžio frazė",sharedSolvedMessage:"Jūsų draugas išsprendė šį kryžiažodį!",theirTime:"Jo laikas:",startSolving:"Spręsti kryžiažodį",older:"Ankstesnis",newer:"Naujausias"},wordgame:{loading:"Kraunama...",preview:"Peržiūra",enterLetters:"Įveskite {0} raides",guessedCorrectly:"🎉 Puiku! Atspėjote!",wordWas:"Žodis buvo: ",playAgain:"Žaisti iš naujo",howToPlayTitle:"Kaip žaisti",guessWord:"Atspėkite žodį per <strong>{0} bandymų</strong>.",eachGuessMustBe:"Kiekvienas spėjimas turi būti <strong>{0} raidžių</strong> žodis.",colorsShowHint:"Spalvos parodo, kaip arti buvo spėjimas.",correctLegend:"Teisinga",wrongPlaceLegend:"Ne ten",notInWordLegend:"Nėra",typeLetters:"Rašykite raides klaviatūra",pressEnter:"Spauskite <strong>Enter</strong>, kad pateiktumėte spėjimą",pressBackspace:"Spauskite <strong>Backspace</strong>, kad ištrintumėte raidę",gameNotFound:"Žaidimas nerastas. Nustatykite <code>game-id</code> atributą."},wordsearch:{loading:"Kraunamas galvosūkis…",wordsToFind:"Raskite žodžius",found:"rasta",congratulations:"Puiku!",foundAllWords:"Radote visus {0} žodžius!",playAgain:"Žaisti iš naujo",older:"Ankstesnis",newer:"Naujausias"}}},Ar=bi("lt"),$n=xs(Ar,e=>{const t=br[e]||br.lt;return function(l){const i=l.split(".");let r=t;for(const s of i)r=r?.[s];return typeof r=="string"?r:l}}),Mc={accent_color:["--accent"],accent_hover_color:["--accent-hover"],accent_light_color:["--accent-light"],selection_color:["--cell-selected-bg","--cell-selected"],selection_ring_color:["--cell-selected-ring"],highlight_color:["--cell-highlighted","--cell-related"],correct_color:["--correct"],correct_light_color:["--correct-light"],present_color:["--present"],absent_color:["--absent"],bg_primary_color:["--bg-primary"],bg_secondary_color:["--bg-secondary"],text_primary_color:["--text-primary"],text_secondary_color:["--text-secondary"],border_color:["--border-color"],cell_bg_color:["--cell-bg"],cell_blocked_color:["--cell-blocked"],sidebar_active_color:["--sidebar-active"],sidebar_active_bg_color:["--sidebar-active-bg"],grid_border_color:["--grid-border"],main_word_marker_color:["--main-word-marker"],font_sans:["--font-sans"],font_serif:["--font-serif"],border_radius:["--radius-md","--radius-lg","--radius-xl"]};function hr(e,t){if(!(!t||!e))for(const[n,l]of Object.entries(Mc)){const i=t[n];if(i){for(const r of l)e.style.setProperty(r,i);(n==="font_sans"||n==="font_serif")&&Tc(i)}}}const vr=new Set;function Tc(e){const t=e.split(",")[0].trim().replace(/["']/g,"");if(["serif","sans-serif","monospace","cursive","system-ui","-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Arial","Helvetica"].includes(t)||vr.has(t))return;vr.add(t);const l=document.createElement("link");l.rel="stylesheet",l.href=`https://fonts.googleapis.com/css2?family=${encodeURIComponent(t)}:wght@300;400;500;600;700&display=swap`,document.head.appendChild(l)}xt[te]="src/lib/crossword/CelebrationOverlay.svelte";var Kc=qe(Qe('<div class="share-overlay svelte-14o0mzm" role="presentation"><div class="share-modal svelte-14o0mzm" role="dialog" aria-label="Share result"><button class="modal-close svelte-14o0mzm">✕</button> <h3 class="modal-title svelte-14o0mzm"> </h3> <p class="modal-subtitle svelte-14o0mzm"> </p> <div class="url-row svelte-14o0mzm"><input class="share-url-input svelte-14o0mzm" type="text" readonly=""/> <button class="copy-btn svelte-14o0mzm"><!></button></div></div></div>'),xt[te],[[89,2,[[90,4,[[96,6],[97,6],[98,6],[101,6,[[102,8],[109,8]]]]]]]]),Ec=qe(Qe('<div class="celebration svelte-14o0mzm"><div class="celebration-header svelte-14o0mzm"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" class="check-icon svelte-14o0mzm"><path d="M170.83,101.17a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z" class="svelte-14o0mzm"></path></svg> <h2 class="svelte-14o0mzm"> </h2></div> <p class="svelte-14o0mzm"> </p> <div class="celebration-actions svelte-14o0mzm"><div class="time-badge svelte-14o0mzm"><span class="time-label svelte-14o0mzm"> </span> <span class="time-value svelte-14o0mzm"> </span></div> <button class="share-btn svelte-14o0mzm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="svelte-14o0mzm"><path d="M237.66,117.66l-80,80A8,8,0,0,1,144,192V152.23c-57.1,3.24-96.25,40.27-107.24,52h0a12,12,0,0,1-20.68-9.58c3.71-32.26,21.38-63.29,49.76-87.37,23.57-20,52.22-32.69,78.16-34.91V32a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,237.66,117.66Z" class="svelte-14o0mzm"></path></svg> </button></div></div> <!>',1),xt[te],[[48,0,[[49,2,[[50,4,[[57,7]]],[61,4]]],[64,2],[66,2,[[67,4,[[68,6],[69,6]]],[72,4,[[73,6,[[79,9]]]]]]]]]]);const Uc={hash:"svelte-14o0mzm",code:`
  .celebration.svelte-14o0mzm {
    margin-top: 16px;
    background: var(--correct-light, #e2f3ea);
    border: 1px solid var(--correct, #007a3c);
    border-radius: 8px;
    padding: 32px;
    text-align: center;
  }

  @keyframes svelte-14o0mzm-celebrationPop {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .celebration-header.svelte-14o0mzm {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .check-icon.svelte-14o0mzm {
    color: var(--correct, #007a3c);
    flex-shrink: 0;
  }

  .celebration.svelte-14o0mzm h2:where(.svelte-14o0mzm) {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    color: var(--correct, #007a3c);
    margin: 0;
  }

  .celebration.svelte-14o0mzm p:where(.svelte-14o0mzm) {
    font-family: var(--font-sans);
    color: var(--text-primary);
    margin: 0 0 16px;
  }

  .celebration-actions.svelte-14o0mzm {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .time-badge.svelte-14o0mzm {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--correct, #007a3c);
    color: #ffffff;
    padding: 10px;
  }

  .time-label.svelte-14o0mzm {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
  }

  .time-value.svelte-14o0mzm {
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 400;
    line-height: 17px;
  }

  .share-btn.svelte-14o0mzm {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 8px 12px;
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--correct, #007a3c);
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .share-btn.svelte-14o0mzm svg:where(.svelte-14o0mzm) {
    color: var(--correct, #007a3c);
  }

  .share-btn.svelte-14o0mzm:hover {
    background: var(--correct, #007a3c);
    color: #ffffff;
  }

  .share-btn.svelte-14o0mzm:hover svg:where(.svelte-14o0mzm) {
    color: #ffffff;
  }

  /* Share Modal */
  .share-overlay.svelte-14o0mzm {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: svelte-14o0mzm-fadeIn 0.15s ease;
  }

  @keyframes svelte-14o0mzm-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .share-modal.svelte-14o0mzm {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 12px;
    padding: 24px;
    max-width: 480px;
    width: calc(100% - 32px);
    position: relative;
    animation: svelte-14o0mzm-slideUp 0.2s ease;
  }

  @keyframes svelte-14o0mzm-slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-close.svelte-14o0mzm {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--text-secondary, #64748b);
    padding: 4px 8px;
    line-height: 1;
  }

  .modal-close.svelte-14o0mzm:hover {
    color: var(--text-primary, #0f172a);
  }

  .modal-title.svelte-14o0mzm {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary, #0f172a);
    margin: 0 0 4px;
  }

  .modal-subtitle.svelte-14o0mzm {
    font-family: var(--font-sans);
    font-size: 0.875rem;
    color: var(--text-secondary, #64748b);
    margin: 0 0 16px;
  }

  .url-row.svelte-14o0mzm {
    display: flex;
    gap: 8px;
  }

  .share-url-input.svelte-14o0mzm {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    color: var(--text-primary, #0f172a);
    background: var(--bg-secondary, #f3f4f6);
    outline: none;
    min-width: 0;
  }

  .share-url-input.svelte-14o0mzm:focus {
    border-color: var(--correct, #007a3c);
  }

  .copy-btn.svelte-14o0mzm {
    padding: 10px 16px;
    background: var(--correct, #007a3c);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease;
  }

  .copy-btn.svelte-14o0mzm:hover {
    background: var(--correct-hover, #005c2d);
  }

/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VsZWJyYXRpb25PdmVybGF5LnN2ZWx0ZSIsInNvdXJjZXMiOlsiQ2VsZWJyYXRpb25PdmVybGF5LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgeyB0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NoYXJlZC9nYW1lLWxpYi9pMThuL2luZGV4LmpzXCI7XG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcblxuICBleHBvcnQgbGV0IGVsYXBzZWRUaW1lID0gMDtcbiAgZXhwb3J0IGxldCBzaGFyZVVybCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdGl0bGVUZXh0ID0gXCJcIjtcbiAgZXhwb3J0IGxldCBtZXNzYWdlVGV4dCA9IFwiXCI7XG5cbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcblxuICBsZXQgc2hvd01vZGFsID0gZmFsc2U7XG4gIGxldCBjb3BpZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcbiAgICBjb25zdCBtID0gU3RyaW5nKE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKSkucGFkU3RhcnQoMiwgXCIwXCIpO1xuICAgIGNvbnN0IHMgPSBTdHJpbmcoc2Vjb25kcyAlIDYwKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gICAgcmV0dXJuIGAke219OiR7c31gO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlU2hhcmUoKSB7XG4gICAgZGlzcGF0Y2goXCJzaGFyZVwiKTtcbiAgICBzaG93TW9kYWwgPSB0cnVlO1xuICAgIGNvcGllZCA9IGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gY29weVVybCgpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2hhcmVVcmwpO1xuICAgICAgY29waWVkID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb3BpZWQgPSBmYWxzZTtcbiAgICAgIH0sIDIwMDApO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRmFsbGJhY2s6IHNlbGVjdCB0aGUgaW5wdXQgdGV4dFxuICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoYXJlLXVybC1pbnB1dFwiKTtcbiAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICBpbnB1dC5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgIHNob3dNb2RhbCA9IGZhbHNlO1xuICB9XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cImNlbGVicmF0aW9uXCI+XG4gIDxkaXYgY2xhc3M9XCJjZWxlYnJhdGlvbi1oZWFkZXJcIj5cbiAgICA8c3ZnXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgIHdpZHRoPVwiMzJcIlxuICAgICAgaGVpZ2h0PVwiMzJcIlxuICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDI1NiAyNTZcIlxuICAgICAgY2xhc3M9XCJjaGVjay1pY29uXCJcbiAgICAgID48cGF0aFxuICAgICAgICBkPVwiTTE3MC44MywxMDEuMTdhNCw0LDAsMCwxLDAsNS42NmwtNTYsNTZhNCw0LDAsMCwxLTUuNjYsMGwtMjQtMjRhNCw0LDAsMCwxLDUuNjYtNS42NkwxMTIsMTU0LjM0bDUzLjE3LTUzLjE3QTQsNCwwLDAsMSwxNzAuODMsMTAxLjE3Wk0yMjgsMTI4QTEwMCwxMDAsMCwxLDEsMTI4LDI4LDEwMC4xMSwxMDAuMTEsMCwwLDEsMjI4LDEyOFptLTgsMGE5Miw5MiwwLDEsMC05Miw5MkE5Mi4xLDkyLjEsMCwwLDAsMjIwLDEyOFpcIlxuICAgICAgPjwvcGF0aD48L3N2Z1xuICAgID5cbiAgICA8aDI+e3RpdGxlVGV4dCB8fCAkdChcImNyb3Nzd29yZC5jb25ncmF0dWxhdGlvbnNcIil9PC9oMj5cbiAgPC9kaXY+XG5cbiAgPHA+e21lc3NhZ2VUZXh0IHx8ICR0KFwiY3Jvc3N3b3JkLnNvbHZlZE1lc3NhZ2VcIil9PC9wPlxuXG4gIDxkaXYgY2xhc3M9XCJjZWxlYnJhdGlvbi1hY3Rpb25zXCI+XG4gICAgPGRpdiBjbGFzcz1cInRpbWUtYmFkZ2VcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidGltZS1sYWJlbFwiPnskdChcImNyb3Nzd29yZC55b3VyVGltZVwiKX08L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInRpbWUtdmFsdWVcIj57Zm9ybWF0VGltZShlbGFwc2VkVGltZSl9PC9zcGFuPlxuICAgIDwvZGl2PlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cInNoYXJlLWJ0blwiIG9uOmNsaWNrPXtoYW5kbGVTaGFyZX0+XG4gICAgICA8c3ZnXG4gICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgdmlld0JveD1cIjAgMCAyNTYgMjU2XCJcbiAgICAgICAgPjxwYXRoXG4gICAgICAgICAgZD1cIk0yMzcuNjYsMTE3LjY2bC04MCw4MEE4LDgsMCwwLDEsMTQ0LDE5MlYxNTIuMjNjLTU3LjEsMy4yNC05Ni4yNSw0MC4yNy0xMDcuMjQsNTJoMGExMiwxMiwwLDAsMS0yMC42OC05LjU4YzMuNzEtMzIuMjYsMjEuMzgtNjMuMjksNDkuNzYtODcuMzcsMjMuNTctMjAsNTIuMjItMzIuNjksNzguMTYtMzQuOTFWMzJhOCw4LDAsMCwxLDEzLjY2LTUuNjZsODAsODBBOCw4LDAsMCwxLDIzNy42NiwxMTcuNjZaXCJcbiAgICAgICAgPjwvcGF0aD48L3N2Z1xuICAgICAgPlxuICAgICAgeyR0KFwiY3Jvc3N3b3JkLnNoYXJlXCIpfVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG57I2lmIHNob3dNb2RhbH1cbiAgPGRpdiBjbGFzcz1cInNoYXJlLW92ZXJsYXlcIiBvbjpjbGljaz17Y2xvc2VNb2RhbH0gcm9sZT1cInByZXNlbnRhdGlvblwiPlxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwic2hhcmUtbW9kYWxcIlxuICAgICAgb246Y2xpY2t8c3RvcFByb3BhZ2F0aW9uXG4gICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgIGFyaWEtbGFiZWw9XCJTaGFyZSByZXN1bHRcIlxuICAgID5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1jbG9zZVwiIG9uOmNsaWNrPXtjbG9zZU1vZGFsfT7inJU8L2J1dHRvbj5cbiAgICAgIDxoMyBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+eyR0KFwiY3Jvc3N3b3JkLnNoYXJlVGl0bGVcIil9PC9oMz5cbiAgICAgIDxwIGNsYXNzPVwibW9kYWwtc3VidGl0bGVcIj5cbiAgICAgICAgeyR0KFwiY3Jvc3N3b3JkLnNoYXJlU3VidGl0bGVcIil9XG4gICAgICA8L3A+XG4gICAgICA8ZGl2IGNsYXNzPVwidXJsLXJvd1wiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzcz1cInNoYXJlLXVybC1pbnB1dFwiXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIHJlYWRvbmx5XG4gICAgICAgICAgdmFsdWU9e3NoYXJlVXJsfVxuICAgICAgICAgIG9uOmNsaWNrPXsoZSkgPT4gZS50YXJnZXQuc2VsZWN0KCl9XG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJjb3B5LWJ0blwiIG9uOmNsaWNrPXtjb3B5VXJsfT5cbiAgICAgICAgICB7I2lmIGNvcGllZH1cbiAgICAgICAgICAgIHskdChcImNyb3Nzd29yZC5jb3BpZWRcIil9XG4gICAgICAgICAgezplbHNlfVxuICAgICAgICAgICAgeyR0KFwiY3Jvc3N3b3JkLmNvcHlcIil9XG4gICAgICAgICAgey9pZn1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG57L2lmfVxuXG48c3R5bGU+XG4gIC5jZWxlYnJhdGlvbiB7XG4gICAgbWFyZ2luLXRvcDogMTZweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jb3JyZWN0LWxpZ2h0LCAjZTJmM2VhKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgcGFkZGluZzogMzJweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuICBAa2V5ZnJhbWVzIGNlbGVicmF0aW9uUG9wIHtcbiAgICAwJSB7XG4gICAgICBvcGFjaXR5OiAwO1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgpO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcbiAgICB9XG4gICAgMTAwJSB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICB9XG4gIH1cblxuICAuY2VsZWJyYXRpb24taGVhZGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICB9XG5cbiAgLmNoZWNrLWljb24ge1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgICBmbGV4LXNocmluazogMDtcbiAgfVxuXG4gIC5jZWxlYnJhdGlvbiBoMiB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2VyaWYpO1xuICAgIGZvbnQtc2l6ZTogMS43NXJlbTtcbiAgICBjb2xvcjogdmFyKC0tY29ycmVjdCwgIzAwN2EzYyk7XG4gICAgbWFyZ2luOiAwO1xuICB9XG5cbiAgLmNlbGVicmF0aW9uIHAge1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnkpO1xuICAgIG1hcmdpbjogMCAwIDE2cHg7XG4gIH1cblxuICAuY2VsZWJyYXRpb24tYWN0aW9ucyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxNnB4O1xuICB9XG5cbiAgLnRpbWUtYmFkZ2Uge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gIH1cblxuICAudGltZS1sYWJlbCB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGluZS1oZWlnaHQ6IDEycHg7XG4gIH1cblxuICAudGltZS12YWx1ZSB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGluZS1oZWlnaHQ6IDE3cHg7XG4gIH1cblxuICAuc2hhcmUtYnRuIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGdhcDogMTBweDtcbiAgICBwYWRkaW5nOiA4cHggMTJweDtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE1cyBlYXNlO1xuICB9XG5cbiAgLnNoYXJlLWJ0biBzdmcge1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5zaGFyZS1idG46aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICB9XG5cbiAgLnNoYXJlLWJ0bjpob3ZlciBzdmcge1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICB9XG5cbiAgLyogU2hhcmUgTW9kYWwgKi9cbiAgLnNoYXJlLW92ZXJsYXkge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBpbnNldDogMDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHotaW5kZXg6IDEwMDA7XG4gICAgYW5pbWF0aW9uOiBmYWRlSW4gMC4xNXMgZWFzZTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgZmFkZUluIHtcbiAgICBmcm9tIHtcbiAgICAgIG9wYWNpdHk6IDA7XG4gICAgfVxuICAgIHRvIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICB9XG5cbiAgLnNoYXJlLW1vZGFsIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1wcmltYXJ5LCAjZmZmZmZmKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgcGFkZGluZzogMjRweDtcbiAgICBtYXgtd2lkdGg6IDQ4MHB4O1xuICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAzMnB4KTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYW5pbWF0aW9uOiBzbGlkZVVwIDAuMnMgZWFzZTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc2xpZGVVcCB7XG4gICAgZnJvbSB7XG4gICAgICBvcGFjaXR5OiAwO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwcHgpO1xuICAgIH1cbiAgICB0byB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbiAgfVxuXG4gIC5tb2RhbC1jbG9zZSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMTJweDtcbiAgICByaWdodDogMTJweDtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSwgIzY0NzQ4Yik7XG4gICAgcGFkZGluZzogNHB4IDhweDtcbiAgICBsaW5lLWhlaWdodDogMTtcbiAgfVxuXG4gIC5tb2RhbC1jbG9zZTpob3ZlciB7XG4gICAgY29sb3I6IHZhcigtLXRleHQtcHJpbWFyeSwgIzBmMTcyYSk7XG4gIH1cblxuICAubW9kYWwtdGl0bGUge1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNlcmlmKTtcbiAgICBmb250LXNpemU6IDEuMjVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5LCAjMGYxNzJhKTtcbiAgICBtYXJnaW46IDAgMCA0cHg7XG4gIH1cblxuICAubW9kYWwtc3VidGl0bGUge1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gICAgY29sb3I6IHZhcigtLXRleHQtc2Vjb25kYXJ5LCAjNjQ3NDhiKTtcbiAgICBtYXJnaW46IDAgMCAxNnB4O1xuICB9XG5cbiAgLnVybC1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZ2FwOiA4cHg7XG4gIH1cblxuICAuc2hhcmUtdXJsLWlucHV0IHtcbiAgICBmbGV4OiAxO1xuICAgIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5LCAjMGYxNzJhKTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1zZWNvbmRhcnksICNmM2Y0ZjYpO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgbWluLXdpZHRoOiAwO1xuICB9XG5cbiAgLnNoYXJlLXVybC1pbnB1dDpmb2N1cyB7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5jb3B5LWJ0biB7XG4gICAgcGFkZGluZzogMTBweCAxNnB4O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAwLjhyZW07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMTVzIGVhc2U7XG4gIH1cblxuICAuY29weS1idG46aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QtaG92ZXIsICMwMDVjMmQpO1xuICB9XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJpZ25vcmVMaXN0IjpbXX0= */`};function xt(e,t){Yl(new.target),zn(t,!1,xt),cr(e,Uc);const n=()=>(lr($n,"t"),Ai($n,"$t",l)),[l,i]=hi();let r=Q(t,"elapsedTime",12,0),s=Q(t,"shareUrl",12,""),c=Q(t,"titleText",12,""),a=Q(t,"messageText",12,"");const o=vc();let g=R(!1),d=R(!1);function u(J){const $=String(Math.floor(J/60)).padStart(2,"0"),Je=String(J%60).padStart(2,"0");return`${$}:${Je}`}function b(){o("share"),v(g,!0),v(d,!1)}async function f(){try{(await dn(navigator.clipboard.writeText(s())))(),v(d,!0),setTimeout(()=>{v(d,!1)},2e3)}catch{const J=document.querySelector(".share-url-input");J&&J.select()}}function h(){v(g,!1)}var C={get elapsedTime(){return r()},set elapsedTime(J){r(J),E()},get shareUrl(){return s()},set shareUrl(J){s(J),E()},get titleText(){return c()},set titleText(J){c(J),E()},get messageText(){return a()},set messageText(J){a(J),E()},...Nl()};dr();var Z=Ec(),y=vl(Z),x=m(y),k=H(m(x),2),D=m(k,!0);G(k),G(x);var O=H(x,2),M=m(O,!0);G(O);var He=H(O,2),T=m(He),z=m(T),pe=m(z,!0);G(z);var oe=H(z,2),K=m(oe,!0);G(oe),G(T);var Ie=H(T,2),Ge=H(m(Ie));G(Ie),G(He),G(y);var fe=H(y,2);{var yt=J=>{var $=Kc(),Je=m($),Mt=m(Je),gt=H(Mt,2),be=m(gt,!0);G(gt);var mn=H(gt,2),Zn=m(mn,!0);G(mn);var Xn=H(mn,2),wt=m(Xn);kc(wt);var xn=H(wt,2),Pn=m(xn);{var Qn=me=>{var Le=er();_e(Tt=>F(Le,Tt),[()=>(n(),B(()=>n()("crossword.copied")))]),Ce(me,Le)},zl=me=>{var Le=er();_e(Tt=>F(Le,Tt),[()=>(n(),B(()=>n()("crossword.copy")))]),Ce(me,Le)};Ue(()=>hn(Pn,me=>{I(d)?me(Qn):me(zl,-1)}),"if",xt,110,10)}G(xn),G(Xn),G(Je),G($),_e((me,Le)=>{F(be,me),F(Zn,Le),Sc(wt,s())},[()=>(n(),B(()=>n()("crossword.shareTitle"))),()=>(n(),B(()=>n()("crossword.shareSubtitle")))]),ie("click",Mt,h),ie("click",wt,function(Le){return Le.target.select()}),ie("click",xn,f),ie("click",Je,zc(function(me){jc.call(this,t,me)})),ie("click",$,h),Ce(J,$)};Ue(()=>hn(fe,J=>{I(g)&&J(yt)}),"if",xt,88,0)}_e((J,$,Je,Mt,gt)=>{F(D,J),F(M,$),F(pe,Je),F(K,Mt),F(Ge,` ${gt??""}`)},[()=>(Lt(c()),n(),B(()=>c()||n()("crossword.congratulations"))),()=>(Lt(a()),n(),B(()=>a()||n()("crossword.solvedMessage"))),()=>(n(),B(()=>n()("crossword.yourTime"))),()=>(Lt(r()),B(()=>u(r()))),()=>(n(),B(()=>n()("crossword.share")))]),ie("click",Ie,b),Ce(e,Z);var et=jn(C);return i(),et}Fl(xt,{elapsedTime:{},shareUrl:{},titleText:{},messageText:{}},[],[],{mode:"open"}),U[te]="src/lib/WordSearchGame.svelte";var $c=qe(Qe('<div class="loading-state svelte-len5il"><div class="spinner svelte-len5il"></div> <p class="svelte-len5il"> </p></div>'),U[te],[[360,4,[[361,6],[362,6]]]]),Pc=qe(Qe('<div class="error-state svelte-len5il"><p class="svelte-len5il"> </p></div>'),U[te],[[365,4,[[366,6]]]]),Qc=qe(Qe('<li><span class="clue-num svelte-len5il"> </span> <span class="clue-text svelte-len5il"> </span></li>'),U[te],[[376,14,[[381,16],[384,16]]]]),qc=qe(Qe('<div role="gridcell"><span class="cell-letter svelte-len5il"> </span></div>'),U[te],[[440,18,[[449,20]]]]),ea=qe(Qe('<!> <div class="restart-row svelte-len5il"><button class="restart-btn svelte-len5il" tabindex="0"><span class="material-symbols-outlined svelte-len5il" style="font-size: 16px">replay</span> </button></div>',1),U[te],[[469,10,[[470,12,[[476,14]]]]]]),ta=qe(Qe('<div class="history-nav svelte-len5il"><button class="history-btn svelte-len5il" aria-label="Older puzzle" tabindex="0"> </button> <span class="history-count svelte-len5il"> </span> <button class="history-btn svelte-len5il" aria-label="Newer puzzle" tabindex="0"> </button></div>'),U[te],[[485,10,[[486,12],[495,12],[498,12]]]]),na=qe(Qe('<div class="game-layout svelte-len5il"><div class="clues-section svelte-len5il"><div class="clue-box svelte-len5il"><h4 class="svelte-len5il"> </h4> <ul class="svelte-len5il"></ul></div></div> <div class="grid-section svelte-len5il"><div class="clue-banner svelte-len5il"><div class="clue-banner-content svelte-len5il"><span class="clue-banner-text font-serif svelte-len5il"> </span> <div class="content-meta svelte-len5il"><div class="meta-item svelte-len5il"><span class="material-symbols-outlined meta-icon svelte-len5il">timer</span> <span class="svelte-len5il"> </span></div> <div class="meta-item svelte-len5il"><span class="meta-label svelte-len5il"> </span> <span class="meta-count svelte-len5il"> </span></div></div></div></div> <div class="grid-area svelte-len5il"><div class="grid-wrapper svelte-len5il" role="grid" aria-label="Word search grid" tabindex="0"><div class="grid svelte-len5il"></div></div></div> <!> <!></div></div>'),U[te],[[369,4,[[371,6,[[372,8,[[373,10],[374,10]]]]],[392,6,[[394,8,[[395,10,[[396,12],[397,12,[[398,14,[[399,16],[402,16]]],[404,14,[[405,16],[408,16]]]]]]]]],[417,8,[[418,10,[[431,12]]]]]]]]]]),la=qe(Qe('<div role="application" aria-label="Word Search Game"><!></div>'),U[te],[[352,0]]);const ia={hash:"svelte-len5il",code:`
  .svelte-len5il {
    box-sizing: border-box;
  }

  /* ─── Container ─────────────────────────────────────── */
  .word-search-container.svelte-len5il {
    /* Theme Colors (matching crossword light-theme) */
    --bg-primary: #ffffff;
    --bg-secondary: #f3f4f6;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --cell-bg: #ffffff;
    --cell-blocked: #1a1a1a;
    --cell-highlighted: #fcece8;
    --accent: #c25e40;
    --accent-hover: #a0492d;
    --accent-light: #fcece8;
    --correct: #007a3c;
    --correct-light: #e2f3ea;
    --correct-hover: #005c2d;

    font-family: var(--font-sans);
    padding: 0;
    margin: 0 auto;
    max-width: 1440px;
    background: var(--bg-primary);
    color: var(--text-primary);
    user-select: none;
    -webkit-user-select: none;
  }

  /* ─── Loading & Error ───────────────────────────────── */
  .loading-state.svelte-len5il,
  .error-state.svelte-len5il {
    text-align: center;
    padding: 48px;
  }

  .spinner.svelte-len5il {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color, #e2e8f0);
    border-top-color: #64748b;
    border-radius: 50%;
    animation: svelte-len5il-spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes svelte-len5il-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-state.svelte-len5il {
    color: #ef4444;
  }

  /* ─── Game Layout (matches crossword) ───────────────── */
  .game-layout.svelte-len5il {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  /* ─── Sidebar (reuses crossword CluesSidebar pattern) ─ */
  .clues-section.svelte-len5il {
    flex: 0 0 35%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 260px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    position: sticky;
    top: 16px;
  }

  .clues-section.svelte-len5il::-webkit-scrollbar {
    width: 6px;
  }

  .clues-section.svelte-len5il::-webkit-scrollbar-track {
    background: transparent;
  }

  .clues-section.svelte-len5il::-webkit-scrollbar-thumb {
    background-color: var(--border-color, #e2e8f0);
    border-radius: 3px;
  }

  .clue-box.svelte-len5il {
    background: var(--bg-primary, #ffffff);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 12px;
    padding: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  .clue-box.svelte-len5il h4:where(.svelte-len5il) {
    font-family: var(--font-sans);
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
    letter-spacing: 0.2px;
    color: var(--text-secondary, #64748b);
    margin: 0 0 6px;
    padding-bottom: 0;
    border-bottom: none;
  }

  .clue-box.svelte-len5il ul:where(.svelte-len5il) {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .clue-item.svelte-len5il {
    display: flex;
    gap: 8px;
    padding: 9px 10px;
    cursor: default;
    transition: all 0.15s ease;
  }

  .clue-item.svelte-len5il:hover {
    background: var(--bg-secondary, #f3f4f6);
  }

  /* Solved = green highlight + strikethrough (matches crossword) */
  .clue-item.solved.svelte-len5il {
    background: var(--correct-light, #e2f3ea);
    border-left: 1px solid var(--correct, #007a3c);
  }

  .clue-item.solved.svelte-len5il .clue-text:where(.svelte-len5il) {
    text-decoration: line-through;
    color: var(--text-secondary, #64748b);
  }

  .clue-item.solved.svelte-len5il .clue-num:where(.svelte-len5il) {
    color: var(--correct, #007a3c);
  }

  .clue-num.svelte-len5il {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.3px;
    color: var(--text-secondary, #64748b);
    min-width: 28px;
    flex-shrink: 0;
  }

  .clue-text.svelte-len5il {
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-primary, #0f172a);
  }

  /* ─── Grid Section (matches crossword) ──────────────── */
  .grid-section.svelte-len5il {
    flex: 1 1 65%;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: visible;
  }

  /* ─── Banner Header (reuses crossword ClueBanner pattern) */
  .clue-banner.svelte-len5il {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--cell-highlighted);
    border: 1px solid var(--border-color);
    border-radius: 12px 12px 0 0;
    padding: 8px 16px;
    min-height: 52px;
  }

  .clue-banner-content.svelte-len5il {
    flex: 1;
    text-align: center;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .clue-banner-text.svelte-len5il {
    display: block;
    font-size: 0.95rem;
    color: var(--text-primary);
  }

  .content-meta.svelte-len5il {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .meta-item.svelte-len5il {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: var(--font-sans);
    font-size: 12px;
    line-height: 12px;
    color: var(--text-secondary);
  }

  .meta-icon.svelte-len5il {
    font-size: 16px !important;
  }

  .meta-label.svelte-len5il {
    font-weight: 400;
  }

  .meta-count.svelte-len5il {
    font-weight: 400;
  }

  /* ─── History Navigation (bottom, matching crossword) ── */
  .history-nav.svelte-len5il {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 12px 0;
    border-top: 1px solid var(--border-color);
    margin-top: 8px;
  }

  .history-btn.svelte-len5il {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .history-btn.svelte-len5il:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
  }

  .history-btn.svelte-len5il:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .history-count.svelte-len5il {
    font-family: var(--font-sans);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* ─── Grid Area (gray zone) ─────────────────────────── */
  .grid-area.svelte-len5il {
    background: var(--bg-secondary, #f3f4f6);
    display: flex;
    justify-content: center;
    padding: 16px;
    cursor: crosshair;
    touch-action: none;
  }

  .grid-wrapper.svelte-len5il {
    cursor: crosshair;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .grid.svelte-len5il {
    display: grid;
    grid-template-columns: repeat(var(--grid-cols, 10), minmax(0, var(--cell-size, 40px)));
    gap: 1px;
    background: var(--cell-blocked, #1a1a1a);
    border-radius: 8px;
    overflow: hidden;
    padding: 1px;
    width: fit-content;
    max-width: 100%;
  }

  .cell.svelte-len5il {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cell-bg, #ffffff);
    cursor: crosshair;
    transition: background-color 0.1s ease;
    position: relative;
    aspect-ratio: 1;
    min-width: 0;
    font-size: var(--cell-font, 20px);
  }

  /* Fix: hover uses a subtle highlight, not black */
  .cell.svelte-len5il:hover:not(.found):not(.selecting) {
    background-color: var(--cell-highlighted, #fcece8);
  }

  .cell.selecting.svelte-len5il {
    background-color: #e6e8ff;
  }

  .cell.selecting.svelte-len5il .cell-letter:where(.svelte-len5il) {
    color: #2f357d;
  }

  .cell.found.svelte-len5il {
    background-color: var(--correct-light, #e2f3ea);
  }

  .cell.found.svelte-len5il .cell-letter:where(.svelte-len5il) {
    color: var(--correct, #007a3c);
  }

  .cell-letter.svelte-len5il {
    font-family: var(--font-sans);
    font-weight: 600;
    text-transform: uppercase;
    pointer-events: none;
    line-height: 1;
    letter-spacing: 0.4px;
    color: var(--text-primary, #0f172a);
  }

  /* ─── Restart ───────────────────────────────────────── */
  .restart-row.svelte-len5il {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }

  .restart-btn.svelte-len5il {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 8px 16px;
    background: transparent;
    color: var(--text-secondary, #64748b);
    border: 1px solid var(--border-color, #e2e8f0);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: var(--font-sans);
  }

  .restart-btn.svelte-len5il:hover {
    border-color: var(--correct, #007a3c);
    color: var(--correct, #007a3c);
  }

  /* ─── Responsive (matches crossword breakpoint) ─────── */
  @media (max-width: 1024px) {
    .game-layout.svelte-len5il {
      flex-direction: column;
      gap: 16px;
    }

    .grid-section.svelte-len5il {
      max-width: 100%;
      order: -1;
      flex: 1;
      flex-grow: 1;
      width: 100%;
    }

    .clues-section.svelte-len5il {
      flex: 1 1 auto;
      width: 100%;
      max-width: 100%;
      position: static;
      max-height: none;
      overflow-y: visible;
      min-width: 0;
    }
  }

  /* Phone: let the grid fill available width so it never overflows */
  @media (max-width: 640px) {
    .grid-area.svelte-len5il {
      padding: 8px;
    }

    .grid.svelte-len5il {
      grid-template-columns: repeat(var(--grid-cols, 10), minmax(0, 1fr));
      width: 100%;
      max-width: 100%;
    }

    .cell.svelte-len5il {
      /* Scale font with cell width: viewport minus grid-area padding, divided
         by column count, scaled down to leave margin for gaps. Capped at the
         desktop font-size so it doesn't grow on tablets. */
      font-size: min(
        var(--cell-font, 20px),
        calc((100vw - 16px) / var(--grid-cols, 10) * 0.55)
      );
    }
  }

/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29yZFNlYXJjaEdhbWUuc3ZlbHRlIiwic291cmNlcyI6WyJXb3JkU2VhcmNoR2FtZS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IFwiLi4vYXBwLmNzc1wiXG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCJcbiAgaW1wb3J0IHsgbG9jYWxlLCB0IH0gZnJvbSBcIi4uLy4uLy4uL3NoYXJlZC9nYW1lLWxpYi9pMThuL2luZGV4LmpzXCJcbiAgaW1wb3J0IHsgYXBwbHlCcmFuZGluZ0Zyb21EYXRhIH0gZnJvbSBcIi4uLy4uLy4uL3NoYXJlZC9nYW1lLWxpYi9icmFuZGluZy5qc1wiXG4gIGltcG9ydCBDZWxlYnJhdGlvbk92ZXJsYXkgZnJvbSBcIi4vY3Jvc3N3b3JkL0NlbGVicmF0aW9uT3ZlcmxheS5zdmVsdGVcIlxuXG4gIGV4cG9ydCBsZXQgcHV6emxlSWQgPSBcIlwiXG4gIGV4cG9ydCBsZXQgdXNlcklkID0gXCJcIlxuICBleHBvcnQgbGV0IHRoZW1lID0gXCJsaWdodFwiXG4gIGV4cG9ydCBsZXQgYXBpVXJsID0gXCJcIlxuICBleHBvcnQgbGV0IHRva2VuID0gXCJcIlxuICBleHBvcnQgbGV0IGNsaWVudCA9IFwiXCJcbiAgZXhwb3J0IGxldCBsYW5nID0gXCJsdFwiXG5cbiAgJDogbG9jYWxlLnNldChsYW5nKVxuXG4gIGxldCBjb250YWluZXJFbFxuXG4gIGxldCBncmlkID0gW11cbiAgbGV0IGdyaWRTaXplID0gMFxuICBsZXQgd29yZHMgPSBbXVxuICBsZXQgdGl0bGUgPSBcIlwiXG4gIGxldCBkaWZmaWN1bHR5ID0gXCJcIlxuICBsZXQgbG9hZGluZyA9IHRydWVcbiAgbGV0IGVycm9yID0gXCJcIlxuICBsZXQgYnJhbmRpbmcgPSBudWxsXG5cbiAgLy8gR2FtZSBzdGF0ZVxuICBsZXQgZm91bmRXb3JkcyA9IG5ldyBTZXQoKVxuICBsZXQgc2VsZWN0aW5nID0gZmFsc2VcbiAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gbnVsbFxuICBsZXQgc2VsZWN0aW9uRW5kID0gbnVsbFxuICBsZXQgc2VsZWN0aW9uQ2VsbHMgPSBbXVxuICBsZXQgZm91bmRIaWdobGlnaHRzID0gW10gLy8gQXJyYXkgb2YgeyBjZWxscyB9XG4gIGxldCB0aW1lciA9IDBcbiAgbGV0IHRpbWVySW50ZXJ2YWwgPSBudWxsXG4gIGxldCBnYW1lQ29tcGxldGUgPSBmYWxzZVxuICBsZXQgc2hhcmVVcmwgPSBcIlwiXG5cbiAgLy8gTGF0ZXN0L2hpc3RvcnkgbW9kZSDigJQgc3VwcG9ydHMgYm90aCBwdXp6bGUtaWQ9XCJsYXRlc3RcIiBhbmQgZW1wdHkgcHV6emxlSWQgd2l0aCB1c2VySWRcbiAgbGV0IGxhdGVzdE1vZGUgPSBwdXp6bGVJZCA9PT0gXCJsYXRlc3RcIiB8fCAoIXB1enpsZUlkICYmICEhdXNlcklkKVxuICBsZXQgaGlzdG9yeU9mZnNldCA9IDBcbiAgbGV0IGhpc3RvcnlNZXRhID0gbnVsbCAvLyB7IGN1cnJlbnQsIHRvdGFsLCBoYXNOZXdlciwgaGFzT2xkZXIgfVxuXG4gIC8vIFRvdWNoIHN1cHBvcnRcbiAgbGV0IHRvdWNoU3RhcnRDZWxsID0gbnVsbFxuXG4gICQ6IGNlbGxTaXplID0gZ3JpZFNpemUgPD0gMTAgPyA0MCA6IGdyaWRTaXplIDw9IDE0ID8gMzQgOiAyOFxuICAkOiBmb250U2l6ZSA9IGdyaWRTaXplIDw9IDEwID8gXCIyNHB4XCIgOiBncmlkU2l6ZSA8PSAxNCA/IFwiMjBweFwiIDogXCIxNnB4XCJcbiAgJDogZ3JpZFN0eWxlID0gYC0tZ3JpZC1jb2xzOiAke2dyaWRTaXplfTsgLS1jZWxsLXNpemU6ICR7Y2VsbFNpemV9cHg7IC0tY2VsbC1mb250OiAke2ZvbnRTaXplfTtgXG4gICQ6IHRvdGFsV29yZHMgPSB3b3Jkcy5sZW5ndGhcbiAgJDogZm91bmRDb3VudCA9IGZvdW5kV29yZHMuc2l6ZVxuXG4gIC8vIFJlYWN0aXZlIGhpZ2hsaWdodCBtYXAg4oCUIHJlYnVpbGRzIHdoZW5ldmVyIGZvdW5kSGlnaGxpZ2h0cyBjaGFuZ2VzXG4gICQ6IGNlbGxIaWdobGlnaHRNYXAgPSAoKCkgPT4ge1xuICAgIGNvbnN0IG1hcCA9IHt9XG4gICAgZm9yIChjb25zdCBoaWdobGlnaHQgb2YgZm91bmRIaWdobGlnaHRzKSB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgaGlnaGxpZ2h0LmNlbGxzKSB7XG4gICAgICAgIG1hcFtgJHtjLnJvd30sJHtjLmNvbH1gXSA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcFxuICB9KSgpXG5cbiAgLy8gUmVhY3RpdmUgc2VsZWN0aW9uIHNldCDigJQgcmVidWlsZHMgd2hlbmV2ZXIgc2VsZWN0aW9uQ2VsbHMgY2hhbmdlc1xuICAkOiBjZWxsU2VsZWN0aW9uU2V0ID0gbmV3IFNldChzZWxlY3Rpb25DZWxscy5tYXAoKGMpID0+IGAke2Mucm93fSwke2MuY29sfWApKVxuXG4gIG9uTW91bnQoKCkgPT4ge1xuICAgIC8vIExvYWQgU291cmNlIFNhbnMgUHJvIGZvciBMUlQgZGVzaWduXG4gICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWYqPVwiU291cmNlK1NhbnMrUHJvXCJdJykpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKVxuICAgICAgbGluay5yZWwgPSBcInN0eWxlc2hlZXRcIlxuICAgICAgbGluay5ocmVmID1cbiAgICAgICAgXCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVNvdXJjZStTYW5zK1Bybzp3Z2h0QDQwMDs2MDA7NzAwJmRpc3BsYXk9c3dhcFwiXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspXG4gICAgfVxuXG4gICAgaWYgKGxhdGVzdE1vZGUpIHtcbiAgICAgIGZldGNoTGF0ZXN0KClcbiAgICB9IGVsc2UgaWYgKHB1enpsZUlkKSB7XG4gICAgICBmZXRjaEdhbWUoKVxuICAgIH1cbiAgfSlcblxuICBhc3luYyBmdW5jdGlvbiBmZXRjaEdhbWUoKSB7XG4gICAgbG9hZGluZyA9IHRydWVcbiAgICBlcnJvciA9IFwiXCJcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmFzZSA9IGFwaVVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvcHVibGljL2dhbWVzP3R5cGU9d29yZHNlYXJjaGVzJmlkPSR7cHV6emxlSWR9YFxuICAgICAgY29uc3QgaGVhZGVycyA9IHt9XG4gICAgICBpZiAodG9rZW4pIGhlYWRlcnNbXCJBdXRob3JpemF0aW9uXCJdID0gYEJlYXJlciAke3Rva2VufWBcblxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnMgfSlcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gbG9hZCBnYW1lXCIpXG5cbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpXG4gICAgICBjb25zdCBkYXRhID0ganNvbi5kYXRhIHx8IGpzb25cblxuICAgICAgZ3JpZCA9IGRhdGEuZ3JpZCB8fCBbXVxuICAgICAgZ3JpZFNpemUgPSBkYXRhLmdyaWRfc2l6ZSB8fCBncmlkLmxlbmd0aFxuICAgICAgdGl0bGUgPSBkYXRhLnRpdGxlIHx8IFwiXCJcbiAgICAgIGRpZmZpY3VsdHkgPSBkYXRhLmRpZmZpY3VsdHkgfHwgXCJcIlxuICAgICAgYnJhbmRpbmcgPSBkYXRhLmJyYW5kaW5nIHx8IG51bGxcblxuICAgICAgLy8gV29yZHMgY29tZSB3aXRob3V0IHBsYWNlbWVudCBwb3NpdGlvbnMgKGFudGktY2hlYXQpXG4gICAgICB3b3JkcyA9IChkYXRhLndvcmRzIHx8IFtdKS5tYXAoKHcpID0+ICh7XG4gICAgICAgIHdvcmQ6IHcud29yZD8udG9VcHBlckNhc2UoKSB8fCBcIlwiLFxuICAgICAgICBoaW50OiB3LmhpbnQgfHwgXCJcIixcbiAgICAgIH0pKVxuXG4gICAgICBhcHBseUJyYW5kaW5nRnJvbURhdGEoY29udGFpbmVyRWwsIGJyYW5kaW5nKVxuICAgICAgc3RhcnRUaW1lcigpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBlcnJvciA9IGVyci5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgZ2FtZVwiXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGxvYWRpbmcgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGZldGNoTGF0ZXN0KG9mZnNldCA9IDApIHtcbiAgICBsb2FkaW5nID0gdHJ1ZVxuICAgIGVycm9yID0gXCJcIlxuICAgIHRyeSB7XG4gICAgICBjb25zdCBiYXNlID0gYXBpVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW5cbiAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9wdWJsaWMvZ2FtZXMvbGF0ZXN0P3R5cGU9d29yZHNlYXJjaGVzJm9yZz0ke3VzZXJJZH0mb2Zmc2V0PSR7b2Zmc2V0fWBcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fVxuICAgICAgaWYgKHRva2VuKSBoZWFkZXJzW1wiQXV0aG9yaXphdGlvblwiXSA9IGBCZWFyZXIgJHt0b2tlbn1gXG5cbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzIH0pXG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKFwiTm8gcHVibGlzaGVkIGdhbWVzIGZvdW5kXCIpXG5cbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpXG4gICAgICBjb25zdCBkYXRhID0ganNvbi5kYXRhIHx8IGpzb25cbiAgICAgIGhpc3RvcnlNZXRhID0ganNvbi5tZXRhIHx8IG51bGxcbiAgICAgIGhpc3RvcnlPZmZzZXQgPSBvZmZzZXRcblxuICAgICAgZ3JpZCA9IGRhdGEuZ3JpZCB8fCBbXVxuICAgICAgZ3JpZFNpemUgPSBkYXRhLmdyaWRfc2l6ZSB8fCBncmlkLmxlbmd0aFxuICAgICAgdGl0bGUgPSBkYXRhLnRpdGxlIHx8IFwiXCJcbiAgICAgIGRpZmZpY3VsdHkgPSBkYXRhLmRpZmZpY3VsdHkgfHwgXCJcIlxuICAgICAgYnJhbmRpbmcgPSBkYXRhLmJyYW5kaW5nIHx8IG51bGxcblxuICAgICAgd29yZHMgPSAoZGF0YS53b3JkcyB8fCBbXSkubWFwKCh3KSA9PiAoe1xuICAgICAgICB3b3JkOiB3LndvcmQ/LnRvVXBwZXJDYXNlKCkgfHwgXCJcIixcbiAgICAgICAgaGludDogdy5oaW50IHx8IFwiXCIsXG4gICAgICB9KSlcblxuICAgICAgLy8gUmVzZXQgZ2FtZSBzdGF0ZSBmb3IgbmV3IHB1enpsZVxuICAgICAgZm91bmRXb3JkcyA9IG5ldyBTZXQoKVxuICAgICAgZm91bmRIaWdobGlnaHRzID0gW11cbiAgICAgIHNlbGVjdGlvbkNlbGxzID0gW11cbiAgICAgIHNlbGVjdGlvblN0YXJ0ID0gbnVsbFxuICAgICAgc2VsZWN0aW9uRW5kID0gbnVsbFxuICAgICAgZ2FtZUNvbXBsZXRlID0gZmFsc2VcbiAgICAgIHNlbGVjdGluZyA9IGZhbHNlXG4gICAgICBzaGFyZVVybCA9IFwiXCJcblxuICAgICAgYXBwbHlCcmFuZGluZ0Zyb21EYXRhKGNvbnRhaW5lckVsLCBicmFuZGluZylcbiAgICAgIHN0YXJ0VGltZXIoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXJyb3IgPSBlcnIubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIGdhbWVcIlxuICAgIH0gZmluYWxseSB7XG4gICAgICBsb2FkaW5nID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb25zdCBuYXZpZ2F0ZUhpc3RvcnkgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJvbGRlclwiICYmIGhpc3RvcnlNZXRhPy5oYXNPbGRlcikge1xuICAgICAgZmV0Y2hMYXRlc3QoaGlzdG9yeU9mZnNldCArIDEpXG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwibmV3ZXJcIiAmJiBoaXN0b3J5TWV0YT8uaGFzTmV3ZXIpIHtcbiAgICAgIGZldGNoTGF0ZXN0KGhpc3RvcnlPZmZzZXQgLSAxKVxuICAgIH1cbiAgfVxuXG5cblxuICBmdW5jdGlvbiBzdGFydFRpbWVyKCkge1xuICAgIGlmICh0aW1lckludGVydmFsKSBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWwpXG4gICAgdGltZXIgPSAwXG4gICAgdGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICghZ2FtZUNvbXBsZXRlKSB0aW1lcisrXG4gICAgfSwgMTAwMClcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFRpbWUoc2Vjb25kcykge1xuICAgIGNvbnN0IG0gPSBTdHJpbmcoTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApKS5wYWRTdGFydCgyLCBcIjBcIilcbiAgICBjb25zdCBzID0gU3RyaW5nKHNlY29uZHMgJSA2MCkucGFkU3RhcnQoMiwgXCIwXCIpXG4gICAgcmV0dXJuIGAke219OiR7c31gXG4gIH1cblxuICAvLyDilIDilIDilIAgU2VsZWN0aW9uIExvZ2ljIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIGZ1bmN0aW9uIGdldENlbGxGcm9tRXZlbnQoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1yb3ddW2RhdGEtY29sXVwiKVxuICAgIGlmICghdGFyZ2V0KSByZXR1cm4gbnVsbFxuICAgIHJldHVybiB7XG4gICAgICByb3c6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LnJvdyksXG4gICAgICBjb2w6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LmNvbCksXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29tcHV0ZVNlbGVjdGlvbkNlbGxzKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpIHJldHVybiBbXVxuXG4gICAgY29uc3QgZHIgPSBNYXRoLnNpZ24oZW5kLnJvdyAtIHN0YXJ0LnJvdylcbiAgICBjb25zdCBkYyA9IE1hdGguc2lnbihlbmQuY29sIC0gc3RhcnQuY29sKVxuICAgIGNvbnN0IHJvd0Rpc3QgPSBNYXRoLmFicyhlbmQucm93IC0gc3RhcnQucm93KVxuICAgIGNvbnN0IGNvbERpc3QgPSBNYXRoLmFicyhlbmQuY29sIC0gc3RhcnQuY29sKVxuXG4gICAgLy8gTXVzdCBiZSBpbiBhIHN0cmFpZ2h0IGxpbmUgKGhvcml6b250YWwsIHZlcnRpY2FsLCBvciBkaWFnb25hbClcbiAgICBpZiAocm93RGlzdCAhPT0gY29sRGlzdCAmJiByb3dEaXN0ICE9PSAwICYmIGNvbERpc3QgIT09IDApIHJldHVybiBbXVxuXG4gICAgY29uc3Qgc3RlcHMgPSBNYXRoLm1heChyb3dEaXN0LCBjb2xEaXN0KVxuICAgIGNvbnN0IGNlbGxzID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICBjZWxscy5wdXNoKHsgcm93OiBzdGFydC5yb3cgKyBkciAqIGksIGNvbDogc3RhcnQuY29sICsgZGMgKiBpIH0pXG4gICAgfVxuICAgIHJldHVybiBjZWxsc1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRXb3JkKGNlbGxzKSB7XG4gICAgcmV0dXJuIGNlbGxzLm1hcCgoYykgPT4gZ3JpZFtjLnJvd10/LltjLmNvbF0gfHwgXCJcIikuam9pbihcIlwiKVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlckRvd24oZSkge1xuICAgIGNvbnN0IGNlbGwgPSBnZXRDZWxsRnJvbUV2ZW50KGUpXG4gICAgaWYgKCFjZWxsIHx8IGdhbWVDb21wbGV0ZSkgcmV0dXJuXG4gICAgc2VsZWN0aW5nID0gdHJ1ZVxuICAgIHNlbGVjdGlvblN0YXJ0ID0gY2VsbFxuICAgIHNlbGVjdGlvbkVuZCA9IGNlbGxcbiAgICBzZWxlY3Rpb25DZWxscyA9IFtjZWxsXVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlck1vdmUoZSkge1xuICAgIGlmICghc2VsZWN0aW5nIHx8IGdhbWVDb21wbGV0ZSkgcmV0dXJuXG4gICAgY29uc3QgY2VsbCA9IGdldENlbGxGcm9tRXZlbnQoZSlcbiAgICBpZiAoIWNlbGwpIHJldHVyblxuICAgIHNlbGVjdGlvbkVuZCA9IGNlbGxcbiAgICBzZWxlY3Rpb25DZWxscyA9IGNvbXB1dGVTZWxlY3Rpb25DZWxscyhzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlclVwKCkge1xuICAgIGlmICghc2VsZWN0aW5nIHx8IGdhbWVDb21wbGV0ZSkgcmV0dXJuXG4gICAgc2VsZWN0aW5nID0gZmFsc2VcblxuICAgIGlmIChzZWxlY3Rpb25DZWxscy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZFdvcmQgPSBnZXRTZWxlY3RlZFdvcmQoc2VsZWN0aW9uQ2VsbHMpXG4gICAgICBjb25zdCByZXZlcnNlZFdvcmQgPSBzZWxlY3RlZFdvcmQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIilcblxuICAgICAgLy8gQ2hlY2sgaWYgc2VsZWN0ZWQgd29yZCBtYXRjaGVzIGFueSB1bmZvdW5kIHdvcmRcbiAgICAgIGNvbnN0IG1hdGNoID0gd29yZHMuZmluZChcbiAgICAgICAgKHcpID0+XG4gICAgICAgICAgIWZvdW5kV29yZHMuaGFzKHcud29yZCkgJiZcbiAgICAgICAgICAody53b3JkID09PSBzZWxlY3RlZFdvcmQgfHwgdy53b3JkID09PSByZXZlcnNlZFdvcmQpLFxuICAgICAgKVxuXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgZm91bmRXb3JkcyA9IG5ldyBTZXQoWy4uLmZvdW5kV29yZHMsIG1hdGNoLndvcmRdKVxuICAgICAgICBmb3VuZEhpZ2hsaWdodHMgPSBbXG4gICAgICAgICAgLi4uZm91bmRIaWdobGlnaHRzLFxuICAgICAgICAgIHsgY2VsbHM6IFsuLi5zZWxlY3Rpb25DZWxsc10gfSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIENoZWNrIGNvbXBsZXRpb25cbiAgICAgICAgaWYgKGZvdW5kV29yZHMuc2l6ZSA9PT0gd29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgZ2FtZUNvbXBsZXRlID0gdHJ1ZVxuICAgICAgICAgIGlmICh0aW1lckludGVydmFsKSBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3Rpb25DZWxscyA9IFtdXG4gICAgc2VsZWN0aW9uU3RhcnQgPSBudWxsXG4gICAgc2VsZWN0aW9uRW5kID0gbnVsbFxuICB9XG5cbiAgLy8gVG91Y2ggZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgdG91Y2ggPSBlLnRvdWNoZXNbMF1cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSlcbiAgICBpZiAoIWVsKSByZXR1cm5cbiAgICBjb25zdCB0YXJnZXQgPSBlbC5jbG9zZXN0KFwiW2RhdGEtcm93XVtkYXRhLWNvbF1cIilcbiAgICBpZiAoIXRhcmdldCB8fCBnYW1lQ29tcGxldGUpIHJldHVyblxuICAgIHNlbGVjdGluZyA9IHRydWVcbiAgICBzZWxlY3Rpb25TdGFydCA9IHtcbiAgICAgIHJvdzogcGFyc2VJbnQodGFyZ2V0LmRhdGFzZXQucm93KSxcbiAgICAgIGNvbDogcGFyc2VJbnQodGFyZ2V0LmRhdGFzZXQuY29sKSxcbiAgICB9XG4gICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uU3RhcnRcbiAgICBzZWxlY3Rpb25DZWxscyA9IFtzZWxlY3Rpb25TdGFydF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgKCFzZWxlY3RpbmcgfHwgZ2FtZUNvbXBsZXRlKSByZXR1cm5cbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXVxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKVxuICAgIGlmICghZWwpIHJldHVyblxuICAgIGNvbnN0IHRhcmdldCA9IGVsLmNsb3Nlc3QoXCJbZGF0YS1yb3ddW2RhdGEtY29sXVwiKVxuICAgIGlmICghdGFyZ2V0KSByZXR1cm5cbiAgICBzZWxlY3Rpb25FbmQgPSB7XG4gICAgICByb3c6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LnJvdyksXG4gICAgICBjb2w6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LmNvbCksXG4gICAgfVxuICAgIHNlbGVjdGlvbkNlbGxzID0gY29tcHV0ZVNlbGVjdGlvbkNlbGxzKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVUb3VjaEVuZChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlUG9pbnRlclVwKClcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlc3RhcnQoKSB7XG4gICAgZm91bmRXb3JkcyA9IG5ldyBTZXQoKVxuICAgIGZvdW5kSGlnaGxpZ2h0cyA9IFtdXG4gICAgc2VsZWN0aW9uQ2VsbHMgPSBbXVxuICAgIHNlbGVjdGlvblN0YXJ0ID0gbnVsbFxuICAgIHNlbGVjdGlvbkVuZCA9IG51bGxcbiAgICBnYW1lQ29tcGxldGUgPSBmYWxzZVxuICAgIHNlbGVjdGluZyA9IGZhbHNlXG4gICAgc2hhcmVVcmwgPSBcIlwiXG4gICAgc3RhcnRUaW1lcigpXG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVNoYXJlVXJsKCkge1xuICAgIGNvbnN0IG1pbnMgPSBTdHJpbmcoTWF0aC5mbG9vcih0aW1lciAvIDYwKSkucGFkU3RhcnQoMiwgXCIwXCIpXG4gICAgY29uc3Qgc2VjcyA9IFN0cmluZyh0aW1lciAlIDYwKS5wYWRTdGFydCgyLCBcIjBcIilcbiAgICBjb25zdCB0aW1lU3RyID0gYCR7bWluc306JHtzZWNzfWBcblxuICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgICByZWRpcmVjdFVybC5zZWFyY2hQYXJhbXMuZGVsZXRlKFwicmVzdWx0XCIpXG5cbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgdDogdGltZXIsXG4gICAgICByOiByZWRpcmVjdFVybC50b1N0cmluZygpLFxuICAgICAgdGl0bGU6IGAke3RpdGxlfSDigJQgV29yZCBTZWFyY2hgLFxuICAgICAgZGVzYzogYFNvbHZlZCBpbiAke3RpbWVTdHJ9ISBDYW4geW91IGJlYXQgbXkgdGltZT9gLFxuICAgIH1cblxuICAgIGNvbnN0IHNoYXJlRGF0YSA9IGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKSlcbiAgICBjb25zdCBiYXNlID0gYXBpVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW5cbiAgICBjb25zdCBzaGFyZVBhZ2VVcmwgPSBuZXcgVVJMKFwiL3NoYXJlXCIsIGJhc2UpXG4gICAgc2hhcmVQYWdlVXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJkYXRhXCIsIHNoYXJlRGF0YSlcbiAgICBzaGFyZVVybCA9IHNoYXJlUGFnZVVybC50b1N0cmluZygpXG4gIH1cblxuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJ3b3JkLXNlYXJjaC1jb250YWluZXJcIlxuICBjbGFzczpkYXJrPXt0aGVtZSA9PT0gXCJkYXJrXCJ9XG4gIHJvbGU9XCJhcHBsaWNhdGlvblwiXG4gIGFyaWEtbGFiZWw9XCJXb3JkIFNlYXJjaCBHYW1lXCJcbiAgYmluZDp0aGlzPXtjb250YWluZXJFbH1cbj5cbiAgeyNpZiBsb2FkaW5nfVxuICAgIDxkaXYgY2xhc3M9XCJsb2FkaW5nLXN0YXRlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPjwvZGl2PlxuICAgICAgPHA+eyR0KFwid29yZHNlYXJjaC5sb2FkaW5nXCIpfTwvcD5cbiAgICA8L2Rpdj5cbiAgezplbHNlIGlmIGVycm9yfVxuICAgIDxkaXYgY2xhc3M9XCJlcnJvci1zdGF0ZVwiPlxuICAgICAgPHA+4pqg77iPIHtlcnJvcn08L3A+XG4gICAgPC9kaXY+XG4gIHs6ZWxzZX1cbiAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1sYXlvdXRcIj5cbiAgICAgIDwhLS0gU2lkZWJhcjogV29yZCBMaXN0IChyZXVzZXMgY3Jvc3N3b3JkIENsdWVzU2lkZWJhciBwYXR0ZXJuKSAtLT5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHVlcy1zZWN0aW9uXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHVlLWJveFwiPlxuICAgICAgICAgIDxoND57JHQoXCJ3b3Jkc2VhcmNoLndvcmRzVG9GaW5kXCIpfTwvaDQ+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgeyNlYWNoIHdvcmRzIGFzIHcsIGl9XG4gICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2x1ZS1pdGVtXCJcbiAgICAgICAgICAgICAgICBjbGFzczpzb2x2ZWQ9e2ZvdW5kV29yZHMuaGFzKHcud29yZCl9XG4gICAgICAgICAgICAgICAgdGl0bGU9e3cuaGludCB8fCBcIlwifVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHVlLW51bVwiXG4gICAgICAgICAgICAgICAgICA+e1N0cmluZyhpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfS48L3NwYW5cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHVlLXRleHRcIj57dy53b3JkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIE1haW4gQ29udGVudDogR3JpZCBTZWN0aW9uIChyZXVzZXMgY3Jvc3N3b3JkIGdyaWQtc2VjdGlvbiBwYXR0ZXJuKSAtLT5cbiAgICAgIDxkaXYgY2xhc3M9XCJncmlkLXNlY3Rpb25cIj5cbiAgICAgICAgPCEtLSBIZWFkZXIgYmFubmVyIChyZXVzZXMgY3Jvc3N3b3JkIENsdWVCYW5uZXIgcGF0dGVybikgLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHVlLWJhbm5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHVlLWJhbm5lci1jb250ZW50XCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsdWUtYmFubmVyLXRleHQgZm9udC1zZXJpZlwiPnt0aXRsZX08L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tZXRhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXRhLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgbWV0YS1pY29uXCJcbiAgICAgICAgICAgICAgICAgID50aW1lcjwvc3BhblxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3Bhbj57Zm9ybWF0VGltZSh0aW1lcil9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1ldGEtaXRlbVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWV0YS1sYWJlbFwiXG4gICAgICAgICAgICAgICAgICA+eyR0KFwid29yZHNlYXJjaC5mb3VuZFwiKX06PC9zcGFuXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWV0YS1jb3VudFwiXG4gICAgICAgICAgICAgICAgICA+e2ZvdW5kQ291bnR9IC8ge3RvdGFsV29yZHN9PC9zcGFuXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIEdyaWQgYXJlYSAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQtYXJlYVwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiZ3JpZC13cmFwcGVyXCJcbiAgICAgICAgICAgIG9uOm1vdXNlZG93bj17aGFuZGxlUG9pbnRlckRvd259XG4gICAgICAgICAgICBvbjptb3VzZW1vdmU9e2hhbmRsZVBvaW50ZXJNb3ZlfVxuICAgICAgICAgICAgb246bW91c2V1cD17aGFuZGxlUG9pbnRlclVwfVxuICAgICAgICAgICAgb246bW91c2VsZWF2ZT17aGFuZGxlUG9pbnRlclVwfVxuICAgICAgICAgICAgb246dG91Y2hzdGFydD17aGFuZGxlVG91Y2hTdGFydH1cbiAgICAgICAgICAgIG9uOnRvdWNobW92ZT17aGFuZGxlVG91Y2hNb3ZlfVxuICAgICAgICAgICAgb246dG91Y2hlbmQ9e2hhbmRsZVRvdWNoRW5kfVxuICAgICAgICAgICAgcm9sZT1cImdyaWRcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIldvcmQgc2VhcmNoIGdyaWRcIlxuICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzPVwiZ3JpZFwiXG4gICAgICAgICAgICAgIHN0eWxlPXtncmlkU3R5bGV9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHsjZWFjaCBncmlkIGFzIHJvdywgcm93SWR4fVxuICAgICAgICAgICAgICAgIHsjZWFjaCByb3cgYXMgbGV0dGVyLCBjb2xJZHh9XG4gICAgICAgICAgICAgICAgICB7QGNvbnN0IGNlbGxLZXkgPSBgJHtyb3dJZHh9LCR7Y29sSWR4fWB9XG4gICAgICAgICAgICAgICAgICB7QGNvbnN0IGlzRm91bmQgPSBjZWxsSGlnaGxpZ2h0TWFwW2NlbGxLZXldIHx8IGZhbHNlfVxuICAgICAgICAgICAgICAgICAge0Bjb25zdCBpc1NlbGVjdGluZyA9IGNlbGxTZWxlY3Rpb25TZXQuaGFzKGNlbGxLZXkpfVxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNlbGxcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzczpzZWxlY3Rpbmc9e2lzU2VsZWN0aW5nfVxuICAgICAgICAgICAgICAgICAgICBjbGFzczpmb3VuZD17aXNGb3VuZH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1yb3c9e3Jvd0lkeH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jb2w9e2NvbElkeH1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkxldHRlciB7bGV0dGVyfVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2VsbC1sZXR0ZXJcIj57bGV0dGVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICAgICAgey9lYWNofVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gQ29tcGxldGlvbiBTZWN0aW9uIOKAlCBPVVRTSURFIGdyYXkgem9uZSwgYmVsb3cgZ3JpZCAtLT5cbiAgICAgICAgeyNpZiBnYW1lQ29tcGxldGV9XG4gICAgICAgICAgPENlbGVicmF0aW9uT3ZlcmxheVxuICAgICAgICAgICAgZWxhcHNlZFRpbWU9e3RpbWVyfVxuICAgICAgICAgICAge3NoYXJlVXJsfVxuICAgICAgICAgICAgdGl0bGVUZXh0PXskdChcIndvcmRzZWFyY2guY29uZ3JhdHVsYXRpb25zXCIpfVxuICAgICAgICAgICAgbWVzc2FnZVRleHQ9eyR0KFwid29yZHNlYXJjaC5mb3VuZEFsbFdvcmRzXCIpLnJlcGxhY2UoXG4gICAgICAgICAgICAgIFwiezB9XCIsXG4gICAgICAgICAgICAgIFN0cmluZyh0b3RhbFdvcmRzKSxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICBvbjpzaGFyZT17Z2VuZXJhdGVTaGFyZVVybH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZXN0YXJ0LXJvd1wiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzcz1cInJlc3RhcnQtYnRuXCJcbiAgICAgICAgICAgICAgb246Y2xpY2s9e2hhbmRsZVJlc3RhcnR9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9eyR0KFwid29yZHNlYXJjaC5wbGF5QWdhaW5cIil9XG4gICAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZFwiIHN0eWxlPVwiZm9udC1zaXplOiAxNnB4XCJcbiAgICAgICAgICAgICAgICA+cmVwbGF5PC9zcGFuXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgeyR0KFwid29yZHNlYXJjaC5wbGF5QWdhaW5cIil9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgey9pZn1cblxuICAgICAgICB7I2lmIGxhdGVzdE1vZGUgJiYgaGlzdG9yeU1ldGF9XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImhpc3RvcnktbmF2XCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzPVwiaGlzdG9yeS1idG5cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWhpc3RvcnlNZXRhLmhhc09sZGVyfVxuICAgICAgICAgICAgICBvbjpjbGljaz17KCkgPT4gbmF2aWdhdGVIaXN0b3J5KFwib2xkZXJcIil9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPbGRlciBwdXp6bGVcIlxuICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICDihpAgeyR0KFwid29yZHNlYXJjaC5vbGRlclwiKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaXN0b3J5LWNvdW50XCI+XG4gICAgICAgICAgICAgIHtoaXN0b3J5TWV0YS5jdXJyZW50ICsgMX0gLyB7aGlzdG9yeU1ldGEudG90YWx9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzPVwiaGlzdG9yeS1idG5cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWhpc3RvcnlNZXRhLmhhc05ld2VyfVxuICAgICAgICAgICAgICBvbjpjbGljaz17KCkgPT4gbmF2aWdhdGVIaXN0b3J5KFwibmV3ZXJcIil9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOZXdlciBwdXp6bGVcIlxuICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7JHQoXCJ3b3Jkc2VhcmNoLm5ld2VyXCIpfSDihpJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB7L2lmfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIHsvaWZ9XG48L2Rpdj5cblxuPHN0eWxlPlxuICAqIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIENvbnRhaW5lciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgKi9cbiAgLndvcmQtc2VhcmNoLWNvbnRhaW5lciB7XG4gICAgLyogVGhlbWUgQ29sb3JzIChtYXRjaGluZyBjcm9zc3dvcmQgbGlnaHQtdGhlbWUpICovXG4gICAgLS1iZy1wcmltYXJ5OiAjZmZmZmZmO1xuICAgIC0tYmctc2Vjb25kYXJ5OiAjZjNmNGY2O1xuICAgIC0tdGV4dC1wcmltYXJ5OiAjMGYxNzJhO1xuICAgIC0tdGV4dC1zZWNvbmRhcnk6ICM2NDc0OGI7XG4gICAgLS1ib3JkZXItY29sb3I6ICNlMmU4ZjA7XG4gICAgLS1jZWxsLWJnOiAjZmZmZmZmO1xuICAgIC0tY2VsbC1ibG9ja2VkOiAjMWExYTFhO1xuICAgIC0tY2VsbC1oaWdobGlnaHRlZDogI2ZjZWNlODtcbiAgICAtLWFjY2VudDogI2MyNWU0MDtcbiAgICAtLWFjY2VudC1ob3ZlcjogI2EwNDkyZDtcbiAgICAtLWFjY2VudC1saWdodDogI2ZjZWNlODtcbiAgICAtLWNvcnJlY3Q6ICMwMDdhM2M7XG4gICAgLS1jb3JyZWN0LWxpZ2h0OiAjZTJmM2VhO1xuICAgIC0tY29ycmVjdC1ob3ZlcjogIzAwNWMyZDtcblxuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgbWF4LXdpZHRoOiAxNDQwcHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmctcHJpbWFyeSk7XG4gICAgY29sb3I6IHZhcigtLXRleHQtcHJpbWFyeSk7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuXG4gIC8qIOKUgOKUgOKUgCBMb2FkaW5nICYgRXJyb3Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovXG4gIC5sb2FkaW5nLXN0YXRlLFxuICAuZXJyb3Itc3RhdGUge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBwYWRkaW5nOiA0OHB4O1xuICB9XG5cbiAgLnNwaW5uZXIge1xuICAgIHdpZHRoOiA0MHB4O1xuICAgIGhlaWdodDogNDBweDtcbiAgICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci10b3AtY29sb3I6ICM2NDc0OGI7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XG4gICAgbWFyZ2luOiAwIGF1dG8gMTZweDtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc3BpbiB7XG4gICAgdG8ge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgICB9XG4gIH1cblxuICAuZXJyb3Itc3RhdGUge1xuICAgIGNvbG9yOiAjZWY0NDQ0O1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIEdhbWUgTGF5b3V0IChtYXRjaGVzIGNyb3Nzd29yZCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovXG4gIC5nYW1lLWxheW91dCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBnYXA6IDMycHg7XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gIH1cblxuICAvKiDilIDilIDilIAgU2lkZWJhciAocmV1c2VzIGNyb3Nzd29yZCBDbHVlc1NpZGViYXIgcGF0dGVybikg4pSAICovXG4gIC5jbHVlcy1zZWN0aW9uIHtcbiAgICBmbGV4OiAwIDAgMzUlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDE2cHg7XG4gICAgbWluLXdpZHRoOiAyNjBweDtcbiAgICBtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gODBweCk7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xuICAgIHRvcDogMTZweDtcbiAgfVxuXG4gIC5jbHVlcy1zZWN0aW9uOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDZweDtcbiAgfVxuXG4gIC5jbHVlcy1zZWN0aW9uOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIH1cblxuICAuY2x1ZXMtc2VjdGlvbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJvcmRlci1jb2xvciwgI2UyZThmMCk7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICB9XG5cbiAgLmNsdWUtYm94IHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1wcmltYXJ5LCAjZmZmZmZmKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgcGFkZGluZzogOHB4O1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMDQpO1xuICB9XG5cbiAgLmNsdWUtYm94IGg0IHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICBsaW5lLWhlaWdodDogMTJweDtcbiAgICBsZXR0ZXItc3BhY2luZzogMC4ycHg7XG4gICAgY29sb3I6IHZhcigtLXRleHQtc2Vjb25kYXJ5LCAjNjQ3NDhiKTtcbiAgICBtYXJnaW46IDAgMCA2cHg7XG4gICAgcGFkZGluZy1ib3R0b206IDA7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgfVxuXG4gIC5jbHVlLWJveCB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gIC5jbHVlLWl0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZ2FwOiA4cHg7XG4gICAgcGFkZGluZzogOXB4IDEwcHg7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE1cyBlYXNlO1xuICB9XG5cbiAgLmNsdWUtaXRlbTpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmctc2Vjb25kYXJ5LCAjZjNmNGY2KTtcbiAgfVxuXG4gIC8qIFNvbHZlZCA9IGdyZWVuIGhpZ2hsaWdodCArIHN0cmlrZXRocm91Z2ggKG1hdGNoZXMgY3Jvc3N3b3JkKSAqL1xuICAuY2x1ZS1pdGVtLnNvbHZlZCB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY29ycmVjdC1saWdodCwgI2UyZjNlYSk7XG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5jbHVlLWl0ZW0uc29sdmVkIC5jbHVlLXRleHQge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbGluZS10aHJvdWdoO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSwgIzY0NzQ4Yik7XG4gIH1cblxuICAuY2x1ZS1pdGVtLnNvbHZlZCAuY2x1ZS1udW0ge1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5jbHVlLW51bSB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2VyaWYpO1xuICAgIGZvbnQtc2l6ZTogMjJweDtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxNHB4O1xuICAgIGxldHRlci1zcGFjaW5nOiAwLjNweDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1zZWNvbmRhcnksICM2NDc0OGIpO1xuICAgIG1pbi13aWR0aDogMjhweDtcbiAgICBmbGV4LXNocmluazogMDtcbiAgfVxuXG4gIC5jbHVlLXRleHQge1xuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnksICMwZjE3MmEpO1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIEdyaWQgU2VjdGlvbiAobWF0Y2hlcyBjcm9zc3dvcmQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL1xuICAuZ3JpZC1zZWN0aW9uIHtcbiAgICBmbGV4OiAxIDEgNjUlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIH1cblxuICAvKiDilIDilIDilIAgQmFubmVyIEhlYWRlciAocmV1c2VzIGNyb3Nzd29yZCBDbHVlQmFubmVyIHBhdHRlcm4pICovXG4gIC5jbHVlLWJhbm5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTJweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jZWxsLWhpZ2hsaWdodGVkKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHggMTJweCAwIDA7XG4gICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgbWluLWhlaWdodDogNTJweDtcbiAgfVxuXG4gIC5jbHVlLWJhbm5lci1jb250ZW50IHtcbiAgICBmbGV4OiAxO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA0cHg7XG4gIH1cblxuICAuY2x1ZS1iYW5uZXItdGV4dCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnkpO1xuICB9XG5cbiAgLmNvbnRlbnQtbWV0YSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTZweDtcbiAgfVxuXG4gIC5tZXRhLWl0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDRweDtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgbGluZS1oZWlnaHQ6IDEycHg7XG4gICAgY29sb3I6IHZhcigtLXRleHQtc2Vjb25kYXJ5KTtcbiAgfVxuXG4gIC5tZXRhLWljb24ge1xuICAgIGZvbnQtc2l6ZTogMTZweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgLm1ldGEtbGFiZWwge1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIH1cblxuICAubWV0YS1jb3VudCB7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgfVxuXG4gIC8qIOKUgOKUgOKUgCBIaXN0b3J5IE5hdmlnYXRpb24gKGJvdHRvbSwgbWF0Y2hpbmcgY3Jvc3N3b3JkKSDilIDilIAgKi9cbiAgLmhpc3RvcnktbmF2IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZ2FwOiAxNnB4O1xuICAgIHBhZGRpbmc6IDEycHggMDtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yKTtcbiAgICBtYXJnaW4tdG9wOiA4cHg7XG4gIH1cblxuICAuaGlzdG9yeS1idG4ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDRweDtcbiAgICBwYWRkaW5nOiA2cHggMTRweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1wcmltYXJ5KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO1xuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5KTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMTVzIGVhc2U7XG4gIH1cblxuICAuaGlzdG9yeS1idG46aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tYWNjZW50KTtcbiAgICBjb2xvcjogdmFyKC0tYWNjZW50KTtcbiAgfVxuXG4gIC5oaXN0b3J5LWJ0bjpkaXNhYmxlZCB7XG4gICAgb3BhY2l0eTogMC40O1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbiAgfVxuXG4gIC5oaXN0b3J5LWNvdW50IHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSk7XG4gIH1cblxuICAvKiDilIDilIDilIAgR3JpZCBBcmVhIChncmF5IHpvbmUpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL1xuICAuZ3JpZC1hcmVhIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1zZWNvbmRhcnksICNmM2Y0ZjYpO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICBjdXJzb3I6IGNyb3NzaGFpcjtcbiAgICB0b3VjaC1hY3Rpb246IG5vbmU7XG4gIH1cblxuICAuZ3JpZC13cmFwcGVyIHtcbiAgICBjdXJzb3I6IGNyb3NzaGFpcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB9XG5cbiAgLmdyaWQge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQodmFyKC0tZ3JpZC1jb2xzLCAxMCksIG1pbm1heCgwLCB2YXIoLS1jZWxsLXNpemUsIDQwcHgpKSk7XG4gICAgZ2FwOiAxcHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY2VsbC1ibG9ja2VkLCAjMWExYTFhKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBwYWRkaW5nOiAxcHg7XG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgfVxuXG4gIC5jZWxsIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY2VsbC1iZywgI2ZmZmZmZik7XG4gICAgY3Vyc29yOiBjcm9zc2hhaXI7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGFzcGVjdC1yYXRpbzogMTtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgZm9udC1zaXplOiB2YXIoLS1jZWxsLWZvbnQsIDIwcHgpO1xuICB9XG5cbiAgLyogRml4OiBob3ZlciB1c2VzIGEgc3VidGxlIGhpZ2hsaWdodCwgbm90IGJsYWNrICovXG4gIC5jZWxsOmhvdmVyOm5vdCguZm91bmQpOm5vdCguc2VsZWN0aW5nKSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2VsbC1oaWdobGlnaHRlZCwgI2ZjZWNlOCk7XG4gIH1cblxuICAuY2VsbC5zZWxlY3Rpbmcge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlNmU4ZmY7XG4gIH1cblxuICAuY2VsbC5zZWxlY3RpbmcgLmNlbGwtbGV0dGVyIHtcbiAgICBjb2xvcjogIzJmMzU3ZDtcbiAgfVxuXG4gIC5jZWxsLmZvdW5kIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb3JyZWN0LWxpZ2h0LCAjZTJmM2VhKTtcbiAgfVxuXG4gIC5jZWxsLmZvdW5kIC5jZWxsLWxldHRlciB7XG4gICAgY29sb3I6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICB9XG5cbiAgLmNlbGwtbGV0dGVyIHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuNHB4O1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnksICMwZjE3MmEpO1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIFJlc3RhcnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovXG4gIC5yZXN0YXJ0LXJvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICB9XG5cbiAgLnJlc3RhcnQtYnRuIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMC41cmVtO1xuICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSwgIzY0NzQ4Yik7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCAjZTJlOGYwKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE1cyBlYXNlO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICB9XG5cbiAgLnJlc3RhcnQtYnRuOmhvdmVyIHtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC8qIOKUgOKUgOKUgCBSZXNwb25zaXZlIChtYXRjaGVzIGNyb3Nzd29yZCBicmVha3BvaW50KSDilIDilIDilIDilIDilIDilIDilIAgKi9cbiAgQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICAgIC5nYW1lLWxheW91dCB7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgZ2FwOiAxNnB4O1xuICAgIH1cblxuICAgIC5ncmlkLXNlY3Rpb24ge1xuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgb3JkZXI6IC0xO1xuICAgICAgZmxleDogMTtcbiAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgIC5jbHVlcy1zZWN0aW9uIHtcbiAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICBwb3NpdGlvbjogc3RhdGljO1xuICAgICAgbWF4LWhlaWdodDogbm9uZTtcbiAgICAgIG92ZXJmbG93LXk6IHZpc2libGU7XG4gICAgICBtaW4td2lkdGg6IDA7XG4gICAgfVxuICB9XG5cbiAgLyogUGhvbmU6IGxldCB0aGUgZ3JpZCBmaWxsIGF2YWlsYWJsZSB3aWR0aCBzbyBpdCBuZXZlciBvdmVyZmxvd3MgKi9cbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY0MHB4KSB7XG4gICAgLmdyaWQtYXJlYSB7XG4gICAgICBwYWRkaW5nOiA4cHg7XG4gICAgfVxuXG4gICAgLmdyaWQge1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQodmFyKC0tZ3JpZC1jb2xzLCAxMCksIG1pbm1heCgwLCAxZnIpKTtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgIC5jZWxsIHtcbiAgICAgIC8qIFNjYWxlIGZvbnQgd2l0aCBjZWxsIHdpZHRoOiB2aWV3cG9ydCBtaW51cyBncmlkLWFyZWEgcGFkZGluZywgZGl2aWRlZFxuICAgICAgICAgYnkgY29sdW1uIGNvdW50LCBzY2FsZWQgZG93biB0byBsZWF2ZSBtYXJnaW4gZm9yIGdhcHMuIENhcHBlZCBhdCB0aGVcbiAgICAgICAgIGRlc2t0b3AgZm9udC1zaXplIHNvIGl0IGRvZXNuJ3QgZ3JvdyBvbiB0YWJsZXRzLiAqL1xuICAgICAgZm9udC1zaXplOiBtaW4oXG4gICAgICAgIHZhcigtLWNlbGwtZm9udCwgMjBweCksXG4gICAgICAgIGNhbGMoKDEwMHZ3IC0gMTZweCkgLyB2YXIoLS1ncmlkLWNvbHMsIDEwKSAqIDAuNTUpXG4gICAgICApO1xuICAgIH1cbiAgfVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwiaWdub3JlTGlzdCI6W119 */`};function U(e,t){Yl(new.target),zn(t,!1,U),cr(e,ia);const n=()=>(lr($n,"t"),Ai($n,"$t",l)),[l,i]=hi(),r=R(),s=R(),c=R(),a=R(),o=R(),g=R(),d=R();let u=Q(t,"puzzleId",12,""),b=Q(t,"userId",12,""),f=Q(t,"theme",12,"light"),h=Q(t,"apiUrl",12,""),C=Q(t,"token",12,""),Z=Q(t,"client",12,""),y=Q(t,"lang",12,"lt"),x=R(),k=R([]),D=R(0),O=R([]),M=R(""),He="",T=R(!0),z=R(""),pe=null,oe=R(new Set),K=!1,Ie=null,Ge=null,fe=R([]),yt=R([]),et=R(0),J=null,$=R(!1),Je=R(""),Mt=$e(u(),"latest")||!u()&&!!b(),gt=0,be=R(null);Ac(()=>{if(!document.querySelector('link[href*="Source+Sans+Pro"]')){const A=document.createElement("link");A.rel="stylesheet",A.href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap",document.head.appendChild(A)}Mt?Zn():u()&&mn()});async function mn(){v(T,!0),v(z,"");try{const p=`${h()||window.location.origin}/api/public/games?type=wordsearches&id=${u()}`,V={};C()&&(V.Authorization=`Bearer ${C()}`);const Y=(await dn(fetch(p,{headers:V})))();if(!Y.ok)throw new Error("Failed to load game");const ne=(await dn(Y.json()))(),q=ne.data||ne;v(k,q.grid||[]),v(D,q.grid_size||I(k).length),v(M,q.title||""),He=q.difficulty||"",pe=q.branding||null,v(O,(q.words||[]).map(re=>({word:re.word?.toUpperCase()||"",hint:re.hint||""}))),hr(I(x),pe),wt()}catch(A){v(z,A.message||"Failed to load game")}finally{v(T,!1)}}async function Zn(A=0){v(T,!0),v(z,"");try{const V=`${h()||window.location.origin}/api/public/games/latest?type=wordsearches&org=${b()}&offset=${A}`,Y={};C()&&(Y.Authorization=`Bearer ${C()}`);const ne=(await dn(fetch(V,{headers:Y})))();if(!ne.ok)throw new Error("No published games found");const q=(await dn(ne.json()))(),re=q.data||q;v(be,q.meta||null),gt=A,v(k,re.grid||[]),v(D,re.grid_size||I(k).length),v(M,re.title||""),He=re.difficulty||"",pe=re.branding||null,v(O,(re.words||[]).map(Oe=>({word:Oe.word?.toUpperCase()||"",hint:Oe.hint||""}))),v(oe,new Set),v(yt,[]),v(fe,[]),Ie=null,Ge=null,v($,!1),K=!1,v(Je,""),hr(I(x),pe),wt()}catch(p){v(z,p.message||"Failed to load game")}finally{v(T,!1)}}const Xn=A=>{$e(A,"older")&&I(be)?.hasOlder?Zn(gt+1):$e(A,"newer")&&I(be)?.hasNewer&&Zn(gt-1)};function wt(){J&&clearInterval(J),v(et,0),J=setInterval(()=>{I($)||Ls(et)},1e3)}function xn(A){const p=String(Math.floor(A/60)).padStart(2,"0"),V=String(A%60).padStart(2,"0");return`${p}:${V}`}function Pn(A){const p=A.target.closest("[data-row][data-col]");return p?{row:parseInt(p.dataset.row),col:parseInt(p.dataset.col)}:null}function Qn(A,p){if(!A||!p)return[];const V=Math.sign(p.row-A.row),Y=Math.sign(p.col-A.col),ne=Math.abs(p.row-A.row),q=Math.abs(p.col-A.col);if($e(ne,q,!1)&&$e(ne,0,!1)&&$e(q,0,!1))return[];const re=Math.max(ne,q),Oe=[];for(let Wt=0;Wt<=re;Wt++)Oe.push({row:A.row+V*Wt,col:A.col+Y*Wt});return Oe}function zl(A){return A.map(p=>I(k)[p.row]?.[p.col]||"").join("")}function me(A){const p=Pn(A);!p||I($)||(K=!0,Ie=p,Ge=p,v(fe,[p]))}function Le(A){if(!K||I($))return;const p=Pn(A);p&&(Ge=p,v(fe,Qn(Ie,Ge)))}function Tt(){if(!(!K||I($))){if(K=!1,I(fe).length>1){const A=zl(I(fe)),p=A.split("").reverse().join(""),V=I(O).find(Y=>!I(oe).has(Y.word)&&($e(Y.word,A)||$e(Y.word,p)));V&&(v(oe,new Set([...I(oe),V.word])),v(yt,[...I(yt),{cells:[...I(fe)]}]),$e(I(oe).size,I(O).length)&&(v($,!0),J&&clearInterval(J)))}v(fe,[]),Ie=null,Ge=null}}function ra(A){A.preventDefault();const p=A.touches[0],V=document.elementFromPoint(p.clientX,p.clientY);if(!V)return;const Y=V.closest("[data-row][data-col]");!Y||I($)||(K=!0,Ie={row:parseInt(Y.dataset.row),col:parseInt(Y.dataset.col)},Ge=Ie,v(fe,[Ie]))}function sa(A){if(A.preventDefault(),!K||I($))return;const p=A.touches[0],V=document.elementFromPoint(p.clientX,p.clientY);if(!V)return;const Y=V.closest("[data-row][data-col]");Y&&(Ge={row:parseInt(Y.dataset.row),col:parseInt(Y.dataset.col)},v(fe,Qn(Ie,Ge)))}function ca(A){A.preventDefault(),Tt()}function aa(){v(oe,new Set),v(yt,[]),v(fe,[]),Ie=null,Ge=null,v($,!1),K=!1,v(Je,""),wt()}function ga(){const A=String(Math.floor(I(et)/60)).padStart(2,"0"),p=String(I(et)%60).padStart(2,"0"),V=`${A}:${p}`,Y=new URL(window.location.href);Y.searchParams.delete("result");const ne={t:I(et),r:Y.toString(),title:`${I(M)} — Word Search`,desc:`Solved in ${V}! Can you beat my time?`},q=btoa(encodeURIComponent(JSON.stringify(ne))),re=h()||window.location.origin,Oe=new URL("/share",re);Oe.searchParams.set("data",q),v(Je,Oe.toString())}Gt(()=>Lt(y()),()=>{Ar.set(y())}),Gt(()=>I(D),()=>{v(r,I(D)<=10?40:I(D)<=14?34:28)}),Gt(()=>I(D),()=>{v(s,I(D)<=10?"24px":I(D)<=14?"20px":"16px")}),Gt(()=>(I(D),I(r),I(s)),()=>{v(c,`--grid-cols: ${I(D)}; --cell-size: ${I(r)}px; --cell-font: ${I(s)};`)}),Gt(()=>I(O),()=>{v(a,I(O).length)}),Gt(()=>I(oe),()=>{v(o,I(oe).size)}),Gt(()=>I(yt),()=>{v(g,(()=>{const A={};for(const p of I(yt))for(const V of p.cells)A[`${V.row},${V.col}`]=!0;return A})())}),Gt(()=>I(fe),()=>{v(d,new Set(I(fe).map(A=>`${A.row},${A.col}`)))}),qs();var oa={get puzzleId(){return u()},set puzzleId(A){u(A),E()},get userId(){return b()},set userId(A){b(A),E()},get theme(){return f()},set theme(A){f(A),E()},get apiUrl(){return h()},set apiUrl(A){h(A),E()},get token(){return C()},set token(A){C(A),E()},get client(){return Z()},set client(A){Z(A),E()},get lang(){return y()},set lang(A){y(A),E()},...Nl()};dr();var yn=la();let pr;var Ia=m(yn);{var ua=A=>{var p=$c(),V=H(m(p),2),Y=m(V,!0);G(V),G(p),_e(ne=>F(Y,ne),[()=>(n(),B(()=>n()("wordsearch.loading")))]),Ce(A,p)},da=A=>{var p=Pc(),V=m(p),Y=m(V);G(V),G(p),_e(()=>F(Y,`⚠️ ${I(z)??""}`)),Ce(A,p)},Ca=A=>{var p=na(),V=m(p),Y=m(V),ne=m(Y),q=m(ne,!0);G(ne);var re=H(ne,2);Ue(()=>Rl(re,5,()=>I(O),kl,(Ze,se,ce)=>{var Xe=Qc();let xe;var It=m(Xe),ye=m(It);G(It);var Me=H(It,2),Te=m(Me,!0);G(Me),G(Xe),_e((cn,qn)=>{xe=Hl(Xe,1,"clue-item svelte-len5il",null,xe,cn),Ot(Xe,"title",(I(se),B(()=>I(se).hint||""))),F(ye,`${qn??""}.`),F(Te,(I(se),B(()=>I(se).word)))},[()=>({solved:I(oe).has(I(se).word)}),()=>B(()=>String(ce+1).padStart(2,"0"))]),Ce(Ze,Xe)}),"each",U,375,12),G(re),G(Y),G(V);var Oe=H(V,2),Wt=m(Oe),Gr=m(Wt),jl=m(Gr),ba=m(jl,!0);G(jl);var mr=H(jl,2),Dl=m(mr),Zr=H(m(Dl),2),Aa=m(Zr,!0);G(Zr),G(Dl);var Xr=H(Dl,2),Ll=m(Xr),ha=m(Ll);G(Ll);var xr=H(Ll,2),va=m(xr);G(xr),G(Xr),G(mr),G(Gr),G(Wt);var Ol=H(Wt,2),ot=m(Ol),Ml=m(ot);Ue(()=>Rl(Ml,5,()=>I(k),kl,(Ze,se,ce)=>{var Xe=Ic(),xe=vl(Xe);Ue(()=>Rl(xe,1,()=>I(se),kl,(It,ye,Me)=>{const Te=he(ht(()=>`${ce},${Me}`),"cellKey");I(Te);const cn=he(ht(()=>(I(g),Lt(I(Te)),B(()=>I(g)[I(Te)]||!1))),"isFound");I(cn);const qn=he(ht(()=>(I(d),Lt(I(Te)),B(()=>I(d).has(I(Te))))),"isSelecting");I(qn);var Kt=qc();let wr;Ot(Kt,"data-row",ce),Ot(Kt,"data-col",Me);var Wr=m(Kt),Za=m(Wr,!0);G(Wr),G(Kt),_e(()=>{wr=Hl(Kt,1,"cell svelte-len5il",null,wr,{selecting:I(qn),found:I(cn)}),Ot(Kt,"aria-label",`Letter ${I(ye)??""}`),F(Za,I(ye))}),Ce(It,Kt)}),"each",U,436,16),Ce(Ze,Xe)}),"each",U,435,14),G(Ml),G(ot),G(Ol);var yr=H(Ol,2);{var pa=Ze=>{var se=ea(),ce=vl(se);{let ye=ht(()=>(n(),B(()=>n()("wordsearch.congratulations")))),Me=ht(()=>(n(),I(a),B(()=>n()("wordsearch.foundAllWords").replace("{0}",String(I(a))))));Ue(()=>xt(ce,{get elapsedTime(){return I(et)},get shareUrl(){return I(Je)},get titleText(){return I(ye)},get messageText(){return I(Me)},$$events:{share:ga}}),"component",U,459,10,{componentTag:"CelebrationOverlay"})}var Xe=H(ce,2),xe=m(Xe),It=H(m(xe));G(xe),G(Xe),_e((ye,Me)=>{Ot(xe,"aria-label",ye),F(It,` ${Me??""}`)},[()=>(n(),B(()=>n()("wordsearch.playAgain"))),()=>(n(),B(()=>n()("wordsearch.playAgain")))]),ie("click",xe,aa),Ce(Ze,se)};Ue(()=>hn(yr,Ze=>{I($)&&Ze(pa)}),"if",U,458,8)}var Ga=H(yr,2);{var ma=Ze=>{var se=ta(),ce=m(se),Xe=m(ce);G(ce);var xe=H(ce,2),It=m(xe);G(xe);var ye=H(xe,2),Me=m(ye);G(ye),G(se),_e((Te,cn)=>{ce.disabled=(I(be),B(()=>!I(be).hasOlder)),F(Xe,`← ${Te??""}`),F(It,`${I(be),B(()=>I(be).current+1)??""} / ${I(be),B(()=>I(be).total)??""}`),ye.disabled=(I(be),B(()=>!I(be).hasNewer)),F(Me,`${cn??""} →`)},[()=>(n(),B(()=>n()("wordsearch.older"))),()=>(n(),B(()=>n()("wordsearch.newer")))]),ie("click",ce,function(){return Xn("older")}),ie("click",ye,function(){return Xn("newer")}),Ce(Ze,se)};Ue(()=>hn(Ga,Ze=>{Mt&&I(be)&&Ze(ma)}),"if",U,484,8)}G(Oe),G(p),_e((Ze,se,ce)=>{F(q,Ze),F(ba,I(M)),F(Aa,se),F(ha,`${ce??""}:`),F(va,`${I(o)??""} / ${I(a)??""}`),Bc(Ml,I(c))},[()=>(n(),B(()=>n()("wordsearch.wordsToFind"))),()=>(I(et),B(()=>xn(I(et)))),()=>(n(),B(()=>n()("wordsearch.found")))]),ie("mousedown",ot,me),ie("mousemove",ot,Le),ie("mouseup",ot,Tt),ie("mouseleave",ot,Tt),ie("touchstart",ot,ra),ie("touchmove",ot,sa),ie("touchend",ot,ca),Ce(A,p)};Ue(()=>hn(Ia,A=>{I(T)?A(ua):I(z)?A(da,1):A(Ca,-1)}),"if",U,359,2)}G(yn),Fc(yn,A=>v(x,A),()=>I(x)),_e(()=>pr=Hl(yn,1,"word-search-container svelte-len5il",null,pr,{dark:$e(f(),"dark")})),Ce(e,yn);var fa=jn(oa);return i(),fa}Fl(U,{puzzleId:{},userId:{},theme:{},apiUrl:{},token:{},client:{},lang:{}},[],[],{mode:"open"}),Gn[te]="src/lib/WordSearchGameElement.svelte";function Gn(e,t){Yl(new.target),zn(t,!1,Gn);let n=Q(t,"puzzleId",12,""),l=Q(t,"userId",12,""),i=Q(t,"theme",12,"light"),r=Q(t,"apiUrl",12,""),s=Q(t,"token",12,""),c=Q(t,"client",12,""),a=Q(t,"lang",12,"lt");var o={get puzzleId(){return n()},set puzzleId(g){n(g),E()},get userId(){return l()},set userId(g){l(g),E()},get theme(){return i()},set theme(g){i(g),E()},get apiUrl(){return r()},set apiUrl(g){r(g),E()},get token(){return s()},set token(g){s(g),E()},get client(){return c()},set client(g){c(g),E()},get lang(){return a()},set lang(g){a(g),E()},...Nl()};return Ue(()=>U(e,{get puzzleId(){return n()},get userId(){return l()},get theme(){return i()},get apiUrl(){return r()},get token(){return s()},get client(){return c()},get lang(){return a()}}),"component",Gn,26,0,{componentTag:"WordSearchGame"}),jn(o)}return customElements.define("word-search-game",Fl(Gn,{puzzleId:{attribute:"puzzle-id"},userId:{attribute:"user-id"},apiUrl:{attribute:"api-url"},theme:{},token:{},client:{},lang:{}},[],[])),Gn})();
