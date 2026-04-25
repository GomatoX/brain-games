var WordSearchEngine=(function(){"use strict";typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");let Kt=!1,Vr=!1;function Yr(){Kt=!0}Yr();const Nr=1,_r=2,Ti=4,kr=8,Sr=16,Rr=2,Hr=8,Jr=1,Fr=2,ei="[",ti="[!",Ei="[?",wn="]",Ut={},ee=Symbol(),te=Symbol("filename"),Ki="http://www.w3.org/1999/xhtml",zr=!0;var Wn=Array.isArray,jr=Array.prototype.indexOf,Bt=Array.prototype.includes,Bn=Array.from,Vn=Object.keys,we=Object.defineProperty,ut=Object.getOwnPropertyDescriptor,Ui=Object.getOwnPropertyDescriptors,Dr=Object.prototype,Lr=Array.prototype,ni=Object.getPrototypeOf,$i=Object.isExtensible;const tt=()=>{};function Or(e){return e()}function Yn(e){for(var t=0;t<e.length;t++)e[t]()}function Pi(){var e,t,n=new Promise((i,l)=>{e=i,t=l});return{promise:n,resolve:e,reject:t}}const P=2,$t=4,an=8,Qi=1<<24,dt=16,Fe=32,Ct=64,ii=128,We=512,L=1024,ie=2048,ze=4096,Ae=8192,Be=16384,ft=32768,li=1<<25,Pt=65536,Nn=1<<17,Mr=1<<18,Vt=1<<19,qi=1<<20,Ee=1<<25,Yt=65536,_n=1<<21,kn=1<<22,bt=1<<23,Ke=Symbol("$state"),el=Symbol("legacy props"),Tr=Symbol(""),tl=Symbol("proxy path"),nt=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},nl=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml"),Er=1,gn=3,Qt=8,Kr=11;function Ur(e){{const t=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${e}"
https://svelte.dev/e/invariant_violation`);throw t.name="Svelte error",t}}function il(e){{const t=new Error(`lifecycle_outside_component
\`${e}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw t.name="Svelte error",t}}function $r(e){{const t=new Error(`store_invalid_shape
\`${e}\` is not a store with a \`subscribe\` method
https://svelte.dev/e/store_invalid_shape`);throw t.name="Svelte error",t}}function Pr(){{const e=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw e.name="Svelte error",e}}function Qr(e,t){{const n=new Error(`component_api_changed
Calling \`${e}\` on a component instance (of ${t}) is no longer valid in Svelte 5
https://svelte.dev/e/component_api_changed`);throw n.name="Svelte error",n}}function qr(e,t){{const n=new Error(`component_api_invalid_new
Attempted to instantiate ${e} with \`new ${t}\`, which is no longer valid in Svelte 5. If this component is not under your control, set the \`compatibility.componentApi\` compiler option to \`4\` to keep it working.
https://svelte.dev/e/component_api_invalid_new`);throw n.name="Svelte error",n}}function es(){{const e=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw e.name="Svelte error",e}}function ts(e,t,n){{const i=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${e} and ${t}`:`Keyed each block has duplicate key at indexes ${e} and ${t}`}
https://svelte.dev/e/each_key_duplicate`);throw i.name="Svelte error",i}}function ns(e,t,n){{const i=new Error(`each_key_volatile
Keyed each block has key that is not idempotent — the key for item at index ${e} was \`${t}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw i.name="Svelte error",i}}function is(e){{const t=new Error(`effect_in_teardown
\`${e}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw t.name="Svelte error",t}}function ls(){{const e=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw e.name="Svelte error",e}}function rs(e){{const t=new Error(`effect_orphan
\`${e}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw t.name="Svelte error",t}}function ss(){{const e=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw e.name="Svelte error",e}}function cs(){{const e=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw e.name="Svelte error",e}}function as(e){{const t=new Error(`props_invalid_value
Cannot do \`bind:${e}={undefined}\` when \`${e}\` has a fallback value
https://svelte.dev/e/props_invalid_value`);throw t.name="Svelte error",t}}function gs(e){{const t=new Error(`rune_outside_svelte
The \`${e}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw t.name="Svelte error",t}}function os(){{const e=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw e.name="Svelte error",e}}function Is(){{const e=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw e.name="Svelte error",e}}function us(){{const e=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw e.name="Svelte error",e}}function ds(){{const e=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw e.name="Svelte error",e}}var Nt="font-weight: bold",_t="font-weight: normal";function Cs(e){console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${e}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Nt,_t)}function fs(e,t,n){console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${e}\` attribute on \`${t}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Nt,_t)}function Sn(e){console.warn(`%c[svelte] hydration_mismatch
%cHydration failed because the initial UI does not match what was rendered on the server
https://svelte.dev/e/hydration_mismatch`,Nt,_t)}function bs(){console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Nt,_t)}function Rn(e){console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${e}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Nt,_t)}function As(){console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,Nt,_t)}function hs(){console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Nt,_t)}let W=!1;function it(e){W=e}let V;function ae(e){if(e===null)throw Sn(),Ut;return V=e}function Hn(){return ae(Pe(V))}function G(e){if(W){if(Pe(V)!==null)throw Sn(),Ut;V=e}}function vs(e=1){if(W){for(var t=e,n=V;t--;)n=Pe(n);V=n}}function Jn(e=!0){for(var t=0,n=V;;){if(n.nodeType===Qt){var i=n.data;if(i===wn){if(t===0)return n;t-=1}else(i===ei||i===ti||i[0]==="["&&!isNaN(Number(i.slice(1))))&&(t+=1)}var l=Pe(n);e&&n.remove(),n=l}}function ll(e){if(!e||e.nodeType!==Qt)throw Sn(),Ut;return e.data}function rl(e){return e===this.v}function sl(e,t){return e!=e?t==t:e!==t||e!==null&&typeof e=="object"||typeof e=="function"}function cl(e){return!sl(e,this.v)}function he(e,t){return e.label=t,al(e.v,t),e}function al(e,t){return e?.[tl]?.(t),e}function gl(e){const t=new Error,n=ps();return n.length===0?null:(n.unshift(`
`),we(t,"stack",{value:n.join(`
`)}),we(t,"name",{value:e}),t)}function ps(){const e=Error.stackTraceLimit;Error.stackTraceLimit=1/0;const t=new Error().stack;if(Error.stackTraceLimit=e,!t)return[];const n=t.split(`
`),i=[];for(let l=0;l<n.length;l++){const r=n[l],s=r.replaceAll("\\","/");if(r.trim()!=="Error"){if(r.includes("validate_each_keys"))return[];s.includes("svelte/src/internal")||s.includes("node_modules/.vite")||i.push(r)}}return i}function Gs(e,t){e||Ur(t)}let _=null;function qt(e){_=e}let lt=null;function Fn(e){lt=e}function Ue(e,t,n,i,l,r){const s=lt;lt={type:t,file:n[te],line:i,column:l,parent:s,...r};try{return e()}finally{lt=s}}let on=null;function ol(e){on=e}function zn(e,t=!1,n){_={p:_,i:!1,c:null,e:null,s:e,x:null,r:X,l:Kt&&!t?{s:null,u:null,$:[]}:null},_.function=n,on=n}function jn(e){var t=_,n=t.e;if(n!==null){t.e=null;for(var i of n)Jl(i)}return e!==void 0&&(t.x=e),t.i=!0,_=t.p,on=_?.function??null,e??{}}function In(){return!Kt||_!==null&&_.l===null}let kt=[];function Il(){var e=kt;kt=[],Yn(e)}function rt(e){if(kt.length===0&&!un){var t=kt;queueMicrotask(()=>{t===kt&&Il()})}kt.push(e)}function ms(){for(;kt.length>0;)Il()}const ri=new WeakMap;function ul(e){var t=X;if(t===null)return w.f|=bt,e;if(e instanceof Error&&!ri.has(e)&&ri.set(e,Zs(e,t)),(t.f&ft)===0&&(t.f&$t)===0)throw!t.parent&&e instanceof Error&&dl(e),e;At(e,t)}function At(e,t){for(;t!==null;){if((t.f&ii)!==0){if((t.f&ft)===0)throw e;try{t.b.error(e);return}catch(n){e=n}}t=t.parent}throw e instanceof Error&&dl(e),e}function Zs(e,t){const n=ut(e,"message");if(!(n&&!n.configurable)){for(var i=Ai?"  ":"	",l=`
${i}in ${t.fn?.name||"<unknown>"}`,r=t.ctx;r!==null;)l+=`
${i}in ${r.function?.[te].split("/").pop()}`,r=r.p;return{message:e.message+`
${l}
`,stack:e.stack?.split(`
`).filter(s=>!s.includes("svelte/src/internal")).join(`
`)}}}function dl(e){const t=ri.get(e);t&&(we(e,"message",{value:t.message}),we(e,"stack",{value:t.stack}))}const Xs=-7169;function j(e,t){e.f=e.f&Xs|t}function si(e){(e.f&We)!==0||e.deps===null?j(e,L):j(e,ze)}function Cl(e){if(e!==null)for(const t of e)(t.f&P)===0||(t.f&Yt)===0||(t.f^=Yt,Cl(t.deps))}function fl(e,t,n){(e.f&ie)!==0?t.add(e):(e.f&ze)!==0&&n.add(e),Cl(e.deps),j(e,L)}function ci(e,t,n){if(e==null)return t(void 0),n&&n(void 0),tt;const i=B(()=>e.subscribe(t,n));return i.unsubscribe?()=>i.unsubscribe():i}const en=[];function xs(e,t){return{subscribe:bl(e,t).subscribe}}function bl(e,t=tt){let n=null;const i=new Set;function l(c){if(sl(e,c)&&(e=c,n)){const a=!en.length;for(const o of i)o[1](),en.push(o,e);if(a){for(let o=0;o<en.length;o+=2)en[o][0](en[o+1]);en.length=0}}}function r(c){l(c(e))}function s(c,a=tt){const o=[c,a];return i.add(o),i.size===1&&(n=t(l,r)||tt),c(e),()=>{i.delete(o),i.size===0&&n&&(n(),n=null)}}return{set:l,update:r,subscribe:s}}function ys(e,t,n){const i=!Array.isArray(e),l=i?[e]:e;if(!l.every(Boolean))throw new Error("derived() expects stores as input, got a falsy value");const r=t.length<2;return xs(n,(s,c)=>{let a=!1;const o=[];let g=0,d=tt;const u=()=>{if(g)return;d();const f=t(i?o[0]:o,s,c);r?s(f):d=typeof f=="function"?f:tt},b=l.map((f,h)=>ci(f,C=>{o[h]=C,g&=~(1<<h),a&&u()},()=>{g|=1<<h}));return a=!0,u(),function(){Yn(b),d(),a=!1}})}function ws(e){let t;return ci(e,n=>t=n)(),t}let Dn=!1,ai=Symbol();function Al(e,t,n){const i=n[t]??={store:null,source:R(void 0),unsubscribe:tt};if(i.source.label=t,i.store!==e&&!(ai in n))if(i.unsubscribe(),i.store=e??null,e==null)i.source.v=void 0,i.unsubscribe=tt;else{var l=!0;i.unsubscribe=ci(e,r=>{l?i.source.v=r:v(i.source,r)}),l=!1}return e&&ai in n?ws(e):I(i.source)}function hl(){const e={};function t(){Zi(()=>{for(var n in e)e[n].unsubscribe();we(e,ai,{enumerable:!1,value:!0})})}return[e,t]}function Ws(e){var t=Dn;try{return Dn=!1,[e(),Dn]}finally{Dn=t}}const St=new Set;let S=null,je=null,gi=null,un=!1,oi=!1,tn=null,Ln=null;var vl=0,Bs=new Set;let Vs=1;class st{id=Vs++;current=new Map;previous=new Map;#e=new Set;#t=new Set;#n=0;#c=0;#l=null;#i=[];#r=new Set;#s=new Set;#a=new Map;is_fork=!1;#o=!1;#I(){return this.is_fork||this.#c>0}skip_effect(t){this.#a.has(t)||this.#a.set(t,{d:[],m:[]})}unskip_effect(t){var n=this.#a.get(t);if(n){this.#a.delete(t);for(var i of n.d)j(i,ie),this.schedule(i);for(i of n.m)j(i,ze),this.schedule(i)}}#u(){if(vl++>1e3&&(St.delete(this),Ys()),!this.#I()){for(const c of this.#r)this.#s.delete(c),j(c,ie),this.schedule(c);for(const c of this.#s)j(c,ze),this.schedule(c)}const t=this.#i;this.#i=[],this.apply();var n=tn=[],i=[],l=Ln=[];for(const c of t)try{this.#d(c,n,i)}catch(a){throw Xl(c),a}if(S=null,l.length>0){var r=st.ensure();for(const c of l)r.schedule(c)}if(tn=null,Ln=null,this.#I()){this.#C(i),this.#C(n);for(const[c,a]of this.#a)Zl(c,a)}else{this.#n===0&&St.delete(this),this.#r.clear(),this.#s.clear();for(const c of this.#e)c(this);this.#e.clear(),pl(i),pl(n),this.#l?.resolve()}var s=S;if(this.#i.length>0){const c=s??=this;c.#i.push(...this.#i.filter(a=>!c.#i.includes(a)))}if(s!==null){St.add(s);for(const c of this.current.keys())Bs.add(c);s.#u()}St.has(this)||this.#g()}#d(t,n,i){t.f^=L;for(var l=t.first;l!==null;){var r=l.f,s=(r&(Fe|Ct))!==0,c=s&&(r&L)!==0,a=c||(r&Ae)!==0||this.#a.has(l);if(!a&&l.fn!==null){s?l.f^=L:(r&$t)!==0?n.push(l):sn(l)&&((r&dt)!==0&&this.#s.add(l),Dt(l));var o=l.first;if(o!==null){l=o;continue}}for(;l!==null;){var g=l.next;if(g!==null){l=g;break}l=l.parent}}}#C(t){for(var n=0;n<t.length;n+=1)fl(t[n],this.#r,this.#s)}capture(t,n){n!==ee&&!this.previous.has(t)&&this.previous.set(t,n),(t.f&bt)===0&&(this.current.set(t,t.v),je?.set(t,t.v))}activate(){S=this}deactivate(){S=null,je=null}flush(){var t=new Set;try{oi=!0,S=this,this.#u()}finally{vl=0,gi=null,tn=null,Ln=null,oi=!1,S=null,je=null,vt.clear();for(const n of t)n.updated=null}}discard(){for(const t of this.#t)t(this);this.#t.clear(),St.delete(this)}#g(){for(const a of St){var t=a.id<this.id,n=[];for(const[o,g]of this.current){if(a.current.has(o))if(t&&g!==a.current.get(o))a.current.set(o,g);else continue;n.push(o)}var i=[...a.current.keys()].filter(o=>!this.current.has(o));if(i.length===0)t&&a.discard();else if(n.length>0){Gs(a.#i.length===0,"Batch has scheduled roots"),a.activate();var l=new Set,r=new Map;for(var s of n)Gl(s,i,l,r);if(a.#i.length>0){a.apply();for(var c of a.#i)a.#d(c,[],[]);a.#i=[]}a.deactivate()}}}increment(t){this.#n+=1,t&&(this.#c+=1)}decrement(t,n){this.#n-=1,t&&(this.#c-=1),!(this.#o||n)&&(this.#o=!0,rt(()=>{this.#o=!1,this.flush()}))}transfer_effects(t,n){for(const i of t)this.#r.add(i);for(const i of n)this.#s.add(i);t.clear(),n.clear()}oncommit(t){this.#e.add(t)}ondiscard(t){this.#t.add(t)}settled(){return(this.#l??=Pi()).promise}static ensure(){if(S===null){const t=S=new st;oi||(St.add(S),un||rt(()=>{S===t&&t.flush()}))}return S}apply(){{je=null;return}}schedule(t){if(gi=t,t.b?.is_pending&&(t.f&($t|an|Qi))!==0&&(t.f&ft)===0){t.b.defer_effect(t);return}for(var n=t;n.parent!==null;){n=n.parent;var i=n.f;if(tn!==null&&n===X&&(w===null||(w.f&P)===0))return;if((i&(Ct|Fe))!==0){if((i&L)===0)return;n.f^=L}}this.#i.push(n)}}function K(e){var t=un;un=!0;try{for(var n;;){if(ms(),S===null)return n;S.flush()}}finally{un=t}}function Ys(){{var e=new Map;for(const n of S.current.keys())for(const[i,l]of n.updated??[]){var t=e.get(i);t||(t={error:l.error,count:0},e.set(i,t)),t.count+=l.count}for(const n of e.values())n.error&&console.error(n.error)}try{ss()}catch(n){we(n,"stack",{value:""}),At(n,gi)}}let ct=null;function pl(e){var t=e.length;if(t!==0){for(var n=0;n<t;){var i=e[n++];if((i.f&(Be|Ae))===0&&sn(i)&&(ct=new Set,Dt(i),i.deps===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&jl(i),ct?.size>0)){vt.clear();for(const l of ct){if((l.f&(Be|Ae))!==0)continue;const r=[l];let s=l.parent;for(;s!==null;)ct.has(s)&&(ct.delete(s),r.push(s)),s=s.parent;for(let c=r.length-1;c>=0;c--){const a=r[c];(a.f&(Be|Ae))===0&&Dt(a)}}ct.clear()}}ct=null}}function Gl(e,t,n,i){if(!n.has(e)&&(n.add(e),e.reactions!==null))for(const l of e.reactions){const r=l.f;(r&P)!==0?Gl(l,t,n,i):(r&(kn|dt))!==0&&(r&ie)===0&&ml(l,t,i)&&(j(l,ie),Ii(l))}}function ml(e,t,n){const i=n.get(e);if(i!==void 0)return i;if(e.deps!==null)for(const l of e.deps){if(Bt.call(t,l))return!0;if((l.f&P)!==0&&ml(l,t,n))return n.set(l,!0),!0}return n.set(e,!1),!1}function Ii(e){S.schedule(e)}function Zl(e,t){if(!((e.f&Fe)!==0&&(e.f&L)!==0)){(e.f&ie)!==0?t.d.push(e):(e.f&ze)!==0&&t.m.push(e),j(e,L);for(var n=e.first;n!==null;)Zl(n,t),n=n.next}}function Xl(e){j(e,L);for(var t=e.first;t!==null;)Xl(t),t=t.next}function Ns(e){let t=0,n=Rt(0),i;return he(n,"createSubscriber version"),()=>{mi()&&(I(n),bn(()=>(t===0&&(i=B(()=>e(()=>Cn(n)))),t+=1,()=>{rt(()=>{t-=1,t===0&&(i?.(),i=void 0,Cn(n))})})))}}var _s=Pt|Vt;function ks(e,t,n,i){new Ss(e,t,n,i)}class Ss{parent;is_pending=!1;transform_error;#e;#t=W?V:null;#n;#c;#l;#i=null;#r=null;#s=null;#a=null;#o=0;#I=0;#u=!1;#d=new Set;#C=new Set;#g=null;#v=Ns(()=>(this.#g=Rt(this.#o),he(this.#g,"$effect.pending()"),()=>{this.#g=null}));constructor(t,n,i,l){this.#e=t,this.#n=n,this.#c=r=>{var s=X;s.b=this,s.f|=ii,i(r)},this.parent=X.b,this.transform_error=l??this.parent?.transform_error??(r=>r),this.#l=xi(()=>{if(W){const r=this.#t;Hn();const s=r.data===ti;if(r.data.startsWith(Ei)){const a=JSON.parse(r.data.slice(Ei.length));this.#G(a)}else s?this.#m():this.#p()}else this.#A()},_s),W&&(this.#e=V)}#p(){try{this.#i=Ye(()=>this.#c(this.#e))}catch(t){this.error(t)}}#G(t){const n=this.#n.failed;n&&(this.#s=Ye(()=>{n(this.#e,()=>t,()=>()=>{})}))}#m(){const t=this.#n.pending;t&&(this.is_pending=!0,this.#r=Ye(()=>t(this.#e)),rt(()=>{var n=this.#a=document.createDocumentFragment(),i=ue();n.append(i),this.#i=this.#b(()=>Ye(()=>this.#c(i))),this.#I===0&&(this.#e.before(n),this.#a=null,Ft(this.#r,()=>{this.#r=null}),this.#f(S))}))}#A(){try{if(this.is_pending=this.has_pending_snippet(),this.#I=0,this.#o=0,this.#i=Ye(()=>{this.#c(this.#e)}),this.#I>0){var t=this.#a=document.createDocumentFragment();Wi(this.#i,t);const n=this.#n.pending;this.#r=Ye(()=>n(this.#e))}else this.#f(S)}catch(n){this.error(n)}}#f(t){this.is_pending=!1,t.transfer_effects(this.#d,this.#C)}defer_effect(t){fl(t,this.#d,this.#C)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#b(t){var n=X,i=w,l=_;ke(this.#l),_e(this.#l),qt(this.#l.ctx);try{return st.ensure(),t()}catch(r){return ul(r),null}finally{ke(n),_e(i),qt(l)}}#h(t,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#h(t,n);return}this.#I+=t,this.#I===0&&(this.#f(n),this.#r&&Ft(this.#r,()=>{this.#r=null}),this.#a&&(this.#e.before(this.#a),this.#a=null))}update_pending_count(t,n){this.#h(t,n),this.#o+=t,!(!this.#g||this.#u)&&(this.#u=!0,rt(()=>{this.#u=!1,this.#g&&ln(this.#g,this.#o)}))}get_effect_pending(){return this.#v(),I(this.#g)}error(t){var n=this.#n.onerror;let i=this.#n.failed;if(!n&&!i)throw t;this.#i&&(ge(this.#i),this.#i=null),this.#r&&(ge(this.#r),this.#r=null),this.#s&&(ge(this.#s),this.#s=null),W&&(ae(this.#t),vs(),ae(Jn()));var l=!1,r=!1;const s=()=>{if(l){hs();return}l=!0,r&&ds(),this.#s!==null&&Ft(this.#s,()=>{this.#s=null}),this.#b(()=>{this.#A()})},c=a=>{try{r=!0,n?.(a,s),r=!1}catch(o){At(o,this.#l&&this.#l.parent)}i&&(this.#s=this.#b(()=>{try{return Ye(()=>{var o=X;o.b=this,o.f|=ii,i(this.#e,()=>a,()=>s)})}catch(o){return At(o,this.#l.parent),null}}))};rt(()=>{var a;try{a=this.transform_error(t)}catch(o){At(o,this.#l&&this.#l.parent);return}a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(c,o=>At(o,this.#l&&this.#l.parent)):c(a)})}}function Rs(e,t,n,i){const l=In()?di:ht;var r=e.filter(u=>!u.settled);if(n.length===0&&r.length===0){i(t.map(l));return}var s=X,c=Hs(),a=r.length===1?r[0].promise:r.length>1?Promise.all(r.map(u=>u.promise)):null;function o(u){c();try{i(u)}catch(b){(s.f&Be)===0&&At(b,s)}On()}if(n.length===0){a.then(()=>o(t.map(l)));return}var g=xl();function d(){Promise.all(n.map(u=>Fs(u))).then(u=>o([...t.map(l),...u])).catch(u=>At(u,s)).finally(()=>g())}a?a.then(()=>{c(),d(),On()}):d()}function Hs(){var e=X,t=w,n=_,i=S,l=lt;return function(s=!0){ke(e),_e(t),qt(n),s&&(e.f&Be)===0&&(i?.activate(),i?.apply()),ui(null),Fn(l)}}async function dn(e){var t=at,n=await e;return()=>(ui(t),n)}function On(e=!0){ke(null),_e(null),qt(null),e&&S?.deactivate(),ui(null),Fn(null)}function xl(){var e=X.b,t=S,n=e.is_rendered();return e.update_pending_count(1,t),t.increment(n),(i=!1)=>{e.update_pending_count(-1,t),t.decrement(n,i)}}let at=null;function ui(e){at=e}const Js=new Set;function di(e){var t=P|ie,n=w!==null&&(w.f&P)!==0?w:null;return X!==null&&(X.f|=Vt),{ctx:_,deps:null,effects:null,equals:rl,f:t,fn:e,reactions:null,rv:0,v:ee,wv:0,parent:n??X,ac:null}}function Fs(e,t,n){let i=X;i===null&&Pr();var l=void 0,r=Rt(ee);r.label=t;var s=!w,c=new Map;return tc(()=>{at={effect:X,warned:!1};var a=X,o=Pi();l=o.promise;try{Promise.resolve(e()).then(o.resolve,o.reject).finally(On)}catch(b){o.reject(b),On()}at=null;var g=S;if(s){if((a.f&ft)!==0)var d=xl();if(i.b.is_rendered())c.get(g)?.reject(nt),c.delete(g);else{for(const b of c.values())b.reject(nt);c.clear()}c.set(g,o)}const u=(b,f=void 0)=>{if(at=null,d){var h=f===nt;d(h)}if(!(f===nt||(a.f&Be)!==0)){if(g.activate(),f)r.f|=bt,ln(r,f);else{(r.f&bt)!==0&&(r.f^=bt),ln(r,b);for(const[C,Z]of c){if(c.delete(C),C===g)break;Z.reject(nt)}}g.deactivate()}};o.promise.then(u,b=>u(null,b||"unknown"))}),Zi(()=>{for(const a of c.values())a.reject(nt)}),r.f|=kn,new Promise(a=>{function o(g){function d(){g===l?a(r):o(l)}g.then(d,d)}o(l)})}function ht(e){const t=di(e);return t.equals=cl,t}function zs(e){var t=e.effects;if(t!==null){e.effects=null;for(var n=0;n<t.length;n+=1)ge(t[n])}}let Ci=[];function js(e){for(var t=e.parent;t!==null;){if((t.f&P)===0)return(t.f&Be)===0?t:null;t=t.parent}return null}function fi(e){var t,n=X;ke(js(e));{let i=nn;Wl(new Set);try{Bt.call(Ci,e)&&es(),Ci.push(e),e.f&=~Yt,zs(e),t=Ul(e)}finally{ke(n),Wl(i),Ci.pop()}}return t}function yl(e){var t=e.v,n=fi(e);if(!e.equals(n)&&(e.wv=El(),(!S?.is_fork||e.deps===null)&&(e.v=n,S?.capture(e,t),e.deps===null))){j(e,L);return}mt||(je!==null?(mi()||S?.is_fork)&&je.set(e,n):si(e))}function Ds(e){if(e.effects!==null)for(const t of e.effects)(t.teardown||t.ac)&&(t.teardown?.(),t.ac?.abort(nt),t.teardown=tt,t.ac=null,An(t,0),yi(t))}function wl(e){if(e.effects!==null)for(const t of e.effects)t.teardown&&Dt(t)}let nn=new Set;const vt=new Map;function Wl(e){nn=e}let bi=!1;function Ls(){bi=!0}function Rt(e,t){var n={f:0,v:e,reactions:null,equals:rl,rv:0,wv:0};return n}function pt(e,t){const n=Rt(e);return lc(n),n}function R(e,t=!1,n=!0){const i=Rt(e);return t||(i.equals=cl),Kt&&n&&_!==null&&_.l!==null&&(_.l.s??=[]).push(i),i}function v(e,t,n=!1){w!==null&&(!Ne||(w.f&Nn)!==0)&&In()&&(w.f&(P|dt|kn|Nn))!==0&&(Se===null||!Bt.call(Se,e))&&us();let i=n?rn(t):t;return al(i,e.label),ln(e,i,Ln)}function ln(e,t,n=null){if(!e.equals(t)){var i=e.v;mt?vt.set(e,t):vt.set(e,i),e.v=t;var l=st.ensure();l.capture(e,i);{if(X!==null){e.updated??=new Map;const r=(e.updated.get("")?.count??0)+1;if(e.updated.set("",{error:null,count:r}),r>5){const s=gl("updated at");if(s!==null){let c=e.updated.get(s.stack);c||(c={error:s,count:0},e.updated.set(s.stack,c)),c.count++}}}X!==null&&(e.set_during_effect=!0)}if((e.f&P)!==0){const r=e;(e.f&ie)!==0&&fi(r),je===null&&si(r)}e.wv=El(),Vl(e,ie,n),In()&&X!==null&&(X.f&L)!==0&&(X.f&(Fe|Ct))===0&&(Re===null?rc([e]):Re.push(e)),!l.is_fork&&nn.size>0&&!bi&&Bl()}return t}function Bl(){bi=!1;for(const e of nn)(e.f&L)!==0&&j(e,ze),sn(e)&&Dt(e);nn.clear()}function Os(e,t=1){var n=I(e),i=t===1?n++:n--;return v(e,n),i}function Cn(e){v(e,e.v+1)}function Vl(e,t,n){var i=e.reactions;if(i!==null)for(var l=In(),r=i.length,s=0;s<r;s++){var c=i[s],a=c.f;if(!(!l&&c===X)){if((a&Nn)!==0){nn.add(c);continue}var o=(a&ie)===0;if(o&&j(c,t),(a&P)!==0){var g=c;je?.delete(g),(a&Yt)===0&&(a&We&&(c.f|=Yt),Vl(g,ze,n))}else if(o){var d=c;(a&dt)!==0&&ct!==null&&ct.add(d),n!==null?n.push(d):Ii(d)}}}}const Ms=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function rn(e){if(typeof e!="object"||e===null||Ke in e)return e;const t=ni(e);if(t!==Dr&&t!==Lr)return e;var n=new Map,i=Wn(e),l=pt(0),r=jt,s=g=>{if(jt===r)return g();var d=w,u=jt;_e(null),Tl(r);var b=g();return _e(d),Tl(u),b};i&&(n.set("length",pt(e.length)),e=Es(e));var c="";let a=!1;function o(g){if(!a){a=!0,c=g,he(l,`${c} version`);for(const[d,u]of n)he(u,Ht(c,d));a=!1}}return new Proxy(e,{defineProperty(g,d,u){(!("value"in u)||u.configurable===!1||u.enumerable===!1||u.writable===!1)&&os();var b=n.get(d);return b===void 0?s(()=>{var f=pt(u.value);return n.set(d,f),typeof d=="string"&&he(f,Ht(c,d)),f}):v(b,u.value,!0),!0},deleteProperty(g,d){var u=n.get(d);if(u===void 0){if(d in g){const b=s(()=>pt(ee));n.set(d,b),Cn(l),he(b,Ht(c,d))}}else v(u,ee),Cn(l);return!0},get(g,d,u){if(d===Ke)return e;if(d===tl)return o;var b=n.get(d),f=d in g;if(b===void 0&&(!f||ut(g,d)?.writable)&&(b=s(()=>{var C=rn(f?g[d]:ee),Z=pt(C);return he(Z,Ht(c,d)),Z}),n.set(d,b)),b!==void 0){var h=I(b);return h===ee?void 0:h}return Reflect.get(g,d,u)},getOwnPropertyDescriptor(g,d){var u=Reflect.getOwnPropertyDescriptor(g,d);if(u&&"value"in u){var b=n.get(d);b&&(u.value=I(b))}else if(u===void 0){var f=n.get(d),h=f?.v;if(f!==void 0&&h!==ee)return{enumerable:!0,configurable:!0,value:h,writable:!0}}return u},has(g,d){if(d===Ke)return!0;var u=n.get(d),b=u!==void 0&&u.v!==ee||Reflect.has(g,d);if(u!==void 0||X!==null&&(!b||ut(g,d)?.writable)){u===void 0&&(u=s(()=>{var h=b?rn(g[d]):ee,C=pt(h);return he(C,Ht(c,d)),C}),n.set(d,u));var f=I(u);if(f===ee)return!1}return b},set(g,d,u,b){var f=n.get(d),h=d in g;if(i&&d==="length")for(var C=u;C<f.v;C+=1){var Z=n.get(C+"");Z!==void 0?v(Z,ee):C in g&&(Z=s(()=>pt(ee)),n.set(C+"",Z),he(Z,Ht(c,C)))}if(f===void 0)(!h||ut(g,d)?.writable)&&(f=s(()=>pt(void 0)),he(f,Ht(c,d)),v(f,rn(u)),n.set(d,f));else{h=f.v!==ee;var y=s(()=>rn(u));v(f,y)}var x=Reflect.getOwnPropertyDescriptor(g,d);if(x?.set&&x.set.call(b,u),!h){if(i&&typeof d=="string"){var k=n.get("length"),D=Number(d);Number.isInteger(D)&&D>=k.v&&v(k,D+1)}Cn(l)}return!0},ownKeys(g){I(l);var d=Reflect.ownKeys(g).filter(f=>{var h=n.get(f);return h===void 0||h.v!==ee});for(var[u,b]of n)b.v!==ee&&!(u in g)&&d.push(u);return d},setPrototypeOf(){Is()}})}function Ht(e,t){return typeof t=="symbol"?`${e}[Symbol(${t.description??""})]`:Ms.test(t)?`${e}.${t}`:/^\d+$/.test(t)?`${e}[${t}]`:`${e}['${t}']`}function fn(e){try{if(e!==null&&typeof e=="object"&&Ke in e)return e[Ke]}catch{}return e}const Ts=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Es(e){return new Proxy(e,{get(t,n,i){var l=Reflect.get(t,n,i);return Ts.has(n)?function(...r){Ls();var s=l.apply(this,r);return Bl(),s}:l}})}function Ks(){const e=Array.prototype,t=Array.__svelte_cleanup;t&&t();const{indexOf:n,lastIndexOf:i,includes:l}=e;e.indexOf=function(r,s){const c=n.call(this,r,s);if(c===-1){for(let a=s??0;a<this.length;a+=1)if(fn(this[a])===r){Rn("array.indexOf(...)");break}}return c},e.lastIndexOf=function(r,s){const c=i.call(this,r,s??this.length-1);if(c===-1){for(let a=0;a<=(s??this.length-1);a+=1)if(fn(this[a])===r){Rn("array.lastIndexOf(...)");break}}return c},e.includes=function(r,s){const c=l.call(this,r,s);if(!c){for(let a=0;a<this.length;a+=1)if(fn(this[a])===r){Rn("array.includes(...)");break}}return c},Array.__svelte_cleanup=()=>{e.indexOf=n,e.lastIndexOf=i,e.includes=l}}function $e(e,t,n=!0){try{e===t!=(fn(e)===fn(t))&&Rn(n?"===":"!==")}catch{}return e===t===n}var Yl,Ai,Nl,_l;function hi(){if(Yl===void 0){Yl=window,Ai=/Firefox/.test(navigator.userAgent);var e=Element.prototype,t=Node.prototype,n=Text.prototype;Nl=ut(t,"firstChild").get,_l=ut(t,"nextSibling").get,$i(e)&&(e.__click=void 0,e.__className=void 0,e.__attributes=null,e.__style=void 0,e.__e=void 0),$i(n)&&(n.__t=void 0),e.__svelte_meta=null,Ks()}}function ue(e=""){return document.createTextNode(e)}function Jt(e){return Nl.call(e)}function Pe(e){return _l.call(e)}function m(e,t){if(!W)return Jt(e);var n=Jt(V);if(n===null)n=V.appendChild(ue());else if(t&&n.nodeType!==gn){var i=ue();return n?.before(i),ae(i),i}return t&&Mn(n),ae(n),n}function vi(e,t=!1){if(!W){var n=Jt(e);return n instanceof Comment&&n.data===""?Pe(n):n}if(t){if(V?.nodeType!==gn){var i=ue();return V?.before(i),ae(i),i}Mn(V)}return V}function H(e,t=1,n=!1){let i=W?V:e;for(var l;t--;)l=i,i=Pe(i);if(!W)return i;if(n){if(i?.nodeType!==gn){var r=ue();return i===null?l?.after(r):i.before(r),ae(r),r}Mn(i)}return ae(i),i}function kl(e){e.textContent=""}function Sl(){return!1}function pi(e,t,n){return document.createElementNS(Ki,e,void 0)}function Mn(e){if(e.nodeValue.length<65536)return;let t=e.nextSibling;for(;t!==null&&t.nodeType===gn;)t.remove(),e.nodeValue+=t.nodeValue,t=e.nextSibling}let Rl=!1;function Us(){Rl||(Rl=!0,document.addEventListener("reset",e=>{Promise.resolve().then(()=>{if(!e.defaultPrevented)for(const t of e.target.elements)t.__on_r?.()})},{capture:!0}))}function Gi(e){var t=w,n=X;_e(null),ke(null);try{return e()}finally{_e(t),ke(n)}}function Hl(e){X===null&&(w===null&&rs(e),ls()),mt&&is(e)}function $s(e,t){var n=t.last;n===null?t.last=t.first=e:(n.next=e,e.prev=n,t.last=e)}function De(e,t){for(var n=X;n!==null&&(n.f&Nn)!==0;)n=n.parent;n!==null&&(n.f&Ae)!==0&&(e|=Ae);var i={ctx:_,deps:null,nodes:null,f:e|ie|We,first:null,fn:t,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};i.component_function=on;var l=i;if((e&$t)!==0)tn!==null?tn.push(i):st.ensure().schedule(i);else if(t!==null){try{Dt(i)}catch(s){throw ge(i),s}l.deps===null&&l.teardown===null&&l.nodes===null&&l.first===l.last&&(l.f&Vt)===0&&(l=l.first,(e&dt)!==0&&(e&Pt)!==0&&l!==null&&(l.f|=Pt))}if(l!==null&&(l.parent=n,n!==null&&$s(l,n),w!==null&&(w.f&P)!==0&&(e&Ct)===0)){var r=w;(r.effects??=[]).push(l)}return i}function mi(){return w!==null&&!Ne}function Zi(e){const t=De(an,null);return j(t,L),t.teardown=e,t}function Xi(e){Hl("$effect"),we(e,"name",{value:"$effect"});var t=X.f,n=!w&&(t&Fe)!==0&&(t&ft)===0;if(n){var i=_;(i.e??=[]).push(e)}else return Jl(e)}function Jl(e){return De($t|qi,e)}function Ps(e){return Hl("$effect.pre"),we(e,"name",{value:"$effect.pre"}),De(an|qi,e)}function Qs(e){st.ensure();const t=De(Ct|Vt,e);return()=>{ge(t)}}function qs(e){st.ensure();const t=De(Ct|Vt,e);return(n={})=>new Promise(i=>{n.outro?Ft(t,()=>{ge(t),i(void 0)}):(ge(t),i(void 0))})}function Fl(e){return De($t,e)}function Gt(e,t){var n=_,i={effect:null,ran:!1,deps:e};n.l.$.push(i),i.effect=bn(()=>{if(e(),!i.ran){i.ran=!0;var l=X;try{ke(l.parent),B(t)}finally{ke(l)}}})}function ec(){var e=_;bn(()=>{for(var t of e.l.$){t.deps();var n=t.effect;(n.f&L)!==0&&n.deps!==null&&j(n,ze),sn(n)&&Dt(n),t.ran=!1}})}function tc(e){return De(kn|Vt,e)}function bn(e,t=0){return De(an|t,e)}function Ve(e,t=[],n=[],i=[]){Rs(i,t,n,l=>{De(an,()=>e(...l.map(I)))})}function xi(e,t=0){var n=De(dt|t,e);return n.dev_stack=lt,n}function Ye(e){return De(Fe|Vt,e)}function zl(e){var t=e.teardown;if(t!==null){const n=mt,i=w;Ol(!0),_e(null);try{t.call(null)}finally{Ol(n),_e(i)}}}function yi(e,t=!1){var n=e.first;for(e.first=e.last=null;n!==null;){const l=n.ac;l!==null&&Gi(()=>{l.abort(nt)});var i=n.next;(n.f&Ct)!==0?n.parent=null:ge(n,t),n=i}}function nc(e){for(var t=e.first;t!==null;){var n=t.next;(t.f&Fe)===0&&ge(t),t=n}}function ge(e,t=!0){var n=!1;(t||(e.f&Mr)!==0)&&e.nodes!==null&&e.nodes.end!==null&&(ic(e.nodes.start,e.nodes.end),n=!0),j(e,li),yi(e,t&&!n),An(e,0);var i=e.nodes&&e.nodes.t;if(i!==null)for(const r of i)r.stop();zl(e),e.f^=li,e.f|=Be;var l=e.parent;l!==null&&l.first!==null&&jl(e),e.component_function=null,e.next=e.prev=e.teardown=e.ctx=e.deps=e.fn=e.nodes=e.ac=null}function ic(e,t){for(;e!==null;){var n=e===t?null:Pe(e);e.remove(),e=n}}function jl(e){var t=e.parent,n=e.prev,i=e.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),t!==null&&(t.first===e&&(t.first=i),t.last===e&&(t.last=n))}function Ft(e,t,n=!0){var i=[];Dl(e,i,!0);var l=()=>{n&&ge(e),t&&t()},r=i.length;if(r>0){var s=()=>--r||l();for(var c of i)c.out(s)}else l()}function Dl(e,t,n){if((e.f&Ae)===0){e.f^=Ae;var i=e.nodes&&e.nodes.t;if(i!==null)for(const c of i)(c.is_global||n)&&t.push(c);for(var l=e.first;l!==null;){var r=l.next,s=(l.f&Pt)!==0||(l.f&Fe)!==0&&(e.f&dt)!==0;Dl(l,t,s?n:!1),l=r}}}function wi(e){Ll(e,!0)}function Ll(e,t){if((e.f&Ae)!==0){e.f^=Ae,(e.f&L)===0&&(j(e,ie),st.ensure().schedule(e));for(var n=e.first;n!==null;){var i=n.next,l=(n.f&Pt)!==0||(n.f&Fe)!==0;Ll(n,l?t:!1),n=i}var r=e.nodes&&e.nodes.t;if(r!==null)for(const s of r)(s.is_global||t)&&s.in()}}function Wi(e,t){if(e.nodes)for(var n=e.nodes.start,i=e.nodes.end;n!==null;){var l=n===i?null:Pe(n);t.append(n),n=l}}let Tn=!1,mt=!1;function Ol(e){mt=e}let w=null,Ne=!1;function _e(e){w=e}let X=null;function ke(e){X=e}let Se=null;function lc(e){w!==null&&(Se===null?Se=[e]:Se.push(e))}let de=null,ve=0,Re=null;function rc(e){Re=e}let Ml=1,zt=0,jt=zt;function Tl(e){jt=e}function El(){return++Ml}function sn(e){var t=e.f;if((t&ie)!==0)return!0;if(t&P&&(e.f&=~Yt),(t&ze)!==0){for(var n=e.deps,i=n.length,l=0;l<i;l++){var r=n[l];if(sn(r)&&yl(r),r.wv>e.wv)return!0}(t&We)!==0&&je===null&&j(e,L)}return!1}function Kl(e,t,n=!0){var i=e.reactions;if(i!==null&&!(Se!==null&&Bt.call(Se,e)))for(var l=0;l<i.length;l++){var r=i[l];(r.f&P)!==0?Kl(r,t,!1):t===r&&(n?j(r,ie):(r.f&L)!==0&&j(r,ze),Ii(r))}}function Ul(e){var t=de,n=ve,i=Re,l=w,r=Se,s=_,c=Ne,a=jt,o=e.f;de=null,ve=0,Re=null,w=(o&(Fe|Ct))===0?e:null,Se=null,qt(e.ctx),Ne=!1,jt=++zt,e.ac!==null&&(Gi(()=>{e.ac.abort(nt)}),e.ac=null);try{e.f|=_n;var g=e.fn,d=g();e.f|=ft;var u=e.deps,b=S?.is_fork;if(de!==null){var f;if(b||An(e,ve),u!==null&&ve>0)for(u.length=ve+de.length,f=0;f<de.length;f++)u[ve+f]=de[f];else e.deps=u=de;if(mi()&&(e.f&We)!==0)for(f=ve;f<u.length;f++)(u[f].reactions??=[]).push(e)}else!b&&u!==null&&ve<u.length&&(An(e,ve),u.length=ve);if(In()&&Re!==null&&!Ne&&u!==null&&(e.f&(P|ze|ie))===0)for(f=0;f<Re.length;f++)Kl(Re[f],e);if(l!==null&&l!==e){if(zt++,l.deps!==null)for(let h=0;h<n;h+=1)l.deps[h].rv=zt;if(t!==null)for(const h of t)h.rv=zt;Re!==null&&(i===null?i=Re:i.push(...Re))}return(e.f&bt)!==0&&(e.f^=bt),d}catch(h){return ul(h)}finally{e.f^=_n,de=t,ve=n,Re=i,w=l,Se=r,qt(s),Ne=c,jt=a}}function sc(e,t){let n=t.reactions;if(n!==null){var i=jr.call(n,e);if(i!==-1){var l=n.length-1;l===0?n=t.reactions=null:(n[i]=n[l],n.pop())}}if(n===null&&(t.f&P)!==0&&(de===null||!Bt.call(de,t))){var r=t;(r.f&We)!==0&&(r.f^=We,r.f&=~Yt),si(r),Ds(r),An(r,0)}}function An(e,t){var n=e.deps;if(n!==null)for(var i=t;i<n.length;i++)sc(e,n[i])}function Dt(e){var t=e.f;if((t&Be)===0){j(e,L);var n=X,i=Tn;X=e,Tn=!0;{var l=on;ol(e.component_function);var r=lt;Fn(e.dev_stack??lt)}try{(t&(dt|Qi))!==0?nc(e):yi(e),zl(e);var s=Ul(e);e.teardown=typeof s=="function"?s:null,e.wv=Ml;var c;zr&&Vr&&(e.f&ie)!==0&&e.deps}finally{Tn=i,X=n,ol(l),Fn(r)}}}function I(e){var t=e.f,n=(t&P)!==0;if(w!==null&&!Ne){var i=X!==null&&(X.f&Be)!==0;if(!i&&(Se===null||!Bt.call(Se,e))){var l=w.deps;if((w.f&_n)!==0)e.rv<zt&&(e.rv=zt,de===null&&l!==null&&l[ve]===e?ve++:de===null?de=[e]:de.push(e));else{(w.deps??=[]).push(e);var r=e.reactions;r===null?e.reactions=[w]:Bt.call(r,w)||r.push(w)}}}{if(!Ne&&at&&!at.warned&&(at.effect.f&_n)===0){at.warned=!0,Cs(e.label);var s=gl("traced at");s&&console.warn(s)}Js.delete(e)}if(mt&&vt.has(e))return vt.get(e);if(n){var c=e;if(mt){var a=c.v;return((c.f&L)===0&&c.reactions!==null||Pl(c))&&(a=fi(c)),vt.set(c,a),a}var o=(c.f&We)===0&&!Ne&&w!==null&&(Tn||(w.f&We)!==0),g=(c.f&ft)===0;sn(c)&&(o&&(c.f|=We),yl(c)),o&&!g&&(wl(c),$l(c))}if(je?.has(e))return je.get(e);if((e.f&bt)!==0)throw e.v;return e.v}function $l(e){if(e.f|=We,e.deps!==null)for(const t of e.deps)(t.reactions??=[]).push(e),(t.f&P)!==0&&(t.f&We)===0&&(wl(t),$l(t))}function Pl(e){if(e.v===ee)return!0;if(e.deps===null)return!1;for(const t of e.deps)if(vt.has(t)||(t.f&P)!==0&&Pl(t))return!0;return!1}function B(e){var t=Ne;try{return Ne=!0,e()}finally{Ne=t}}function Lt(e){if(!(typeof e!="object"||!e||e instanceof EventTarget)){if(Ke in e)Bi(e);else if(!Array.isArray(e))for(let t in e){const n=e[t];typeof n=="object"&&n&&Ke in n&&Bi(n)}}}function Bi(e,t=new Set){if(typeof e=="object"&&e!==null&&!(e instanceof EventTarget)&&!t.has(e)){t.add(e),e instanceof Date&&e.getTime();for(let i in e)try{Bi(e[i],t)}catch{}const n=ni(e);if(n!==Object.prototype&&n!==Array.prototype&&n!==Map.prototype&&n!==Set.prototype&&n!==Date.prototype){const i=Ui(n);for(let l in i){const r=i[l].get;if(r)try{r.call(e)}catch{}}}}}const En=Symbol("events"),cc=new Set,Ql=new Set;function ac(e,t,n,i={}){function l(r){if(i.capture||Vi.call(t,r),!r.cancelBubble)return Gi(()=>n?.call(this,r))}return e.startsWith("pointer")||e.startsWith("touch")||e==="wheel"?rt(()=>{t.addEventListener(e,l,i)}):t.addEventListener(e,l,i),l}function le(e,t,n,i,l){var r={capture:i,passive:l},s=ac(e,t,n,r);(t===document.body||t===window||t===document||t instanceof HTMLMediaElement)&&Zi(()=>{t.removeEventListener(e,s,r)})}let ql=null;function Vi(e){var t=this,n=t.ownerDocument,i=e.type,l=e.composedPath?.()||[],r=l[0]||e.target;ql=e;var s=0,c=ql===e&&e[En];if(c){var a=l.indexOf(c);if(a!==-1&&(t===document||t===window)){e[En]=t;return}var o=l.indexOf(t);if(o===-1)return;a<=o&&(s=a)}if(r=l[s]||e.target,r!==t){we(e,"currentTarget",{configurable:!0,get(){return r||n}});var g=w,d=X;_e(null),ke(null);try{for(var u,b=[];r!==null;){var f=r.assignedSlot||r.parentNode||r.host||null;try{var h=r[En]?.[i];h!=null&&(!r.disabled||e.target===r)&&h.call(r,e)}catch(C){u?b.push(C):u=C}if(e.cancelBubble||f===t||f===null)break;r=f}if(u){for(let C of b)queueMicrotask(()=>{throw C});throw u}}finally{e[En]=t,delete e.currentTarget,_e(g),ke(d)}}}const gc=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:e=>e});function oc(e){return gc?.createHTML(e)??e}function Ic(e){var t=pi("template");return t.innerHTML=oc(e.replaceAll("<!>","<!---->")),t.content}function Zt(e,t){var n=X;n.nodes===null&&(n.nodes={start:e,end:t,a:null,t:null})}function Qe(e,t){var n=(t&Jr)!==0,i=(t&Fr)!==0,l,r=!e.startsWith("<!>");return()=>{if(W)return Zt(V,null),V;l===void 0&&(l=Ic(r?e:"<!>"+e),n||(l=Jt(l)));var s=i||Ai?document.importNode(l,!0):l.cloneNode(!0);if(n){var c=Jt(s),a=s.lastChild;Zt(c,a)}else Zt(s,s);return s}}function er(e=""){if(!W){var t=ue(e+"");return Zt(t,t),t}var n=V;return n.nodeType!==gn?(n.before(n=ue()),ae(n)):Mn(n),Zt(n,n),n}function uc(){if(W)return Zt(V,null),V;var e=document.createDocumentFragment(),t=document.createComment(""),n=ue();return e.append(t,n),Zt(t,n),e}function Ce(e,t){if(W){var n=X;((n.f&ft)===0||n.nodes.end===null)&&(n.nodes.end=V),Hn();return}e!==null&&e.before(t)}const dc=["touchstart","touchmove"];function Cc(e){return dc.includes(e)}function F(e,t){var n=t==null?"":typeof t=="object"?`${t}`:t;n!==(e.__t??=e.nodeValue)&&(e.__t=n,e.nodeValue=`${n}`)}function tr(e,t){return nr(e,t)}function fc(e,t){hi(),t.intro=t.intro??!1;const n=t.target,i=W,l=V;try{for(var r=Jt(n);r&&(r.nodeType!==Qt||r.data!==ei);)r=Pe(r);if(!r)throw Ut;it(!0),ae(r);const s=nr(e,{...t,anchor:r});return it(!1),s}catch(s){if(s instanceof Error&&s.message.split(`
`).some(c=>c.startsWith("https://svelte.dev/e/")))throw s;return s!==Ut&&console.warn("Failed to hydrate: ",s),t.recover===!1&&cs(),hi(),kl(n),it(!1),tr(e,t)}finally{it(i),ae(l)}}const Kn=new Map;function nr(e,{target:t,anchor:n,props:i={},events:l,context:r,intro:s=!0,transformError:c}){hi();var a=void 0,o=qs(()=>{var g=n??t.appendChild(ue());ks(g,{pending:()=>{}},b=>{zn({});var f=_;if(r&&(f.c=r),l&&(i.$$events=l),W&&Zt(b,null),a=e(b,i)||{},W&&(X.nodes.end=V,V===null||V.nodeType!==Qt||V.data!==wn))throw Sn(),Ut;jn()},c);var d=new Set,u=b=>{for(var f=0;f<b.length;f++){var h=b[f];if(!d.has(h)){d.add(h);var C=Cc(h);for(const x of[t,document]){var Z=Kn.get(x);Z===void 0&&(Z=new Map,Kn.set(x,Z));var y=Z.get(h);y===void 0?(x.addEventListener(h,Vi,{passive:C}),Z.set(h,1)):Z.set(h,y+1)}}}};return u(Bn(cc)),Ql.add(u),()=>{for(var b of d)for(const C of[t,document]){var f=Kn.get(C),h=f.get(b);--h==0?(C.removeEventListener(b,Vi),f.delete(b),f.size===0&&Kn.delete(C)):f.set(b,h)}Ql.delete(u),g!==n&&g.parentNode?.removeChild(g)}});return Yi.set(a,o),a}let Yi=new WeakMap;function bc(e,t){const n=Yi.get(e);return n?(Yi.delete(e),n(t)):(Ke in e?As():bs(),Promise.resolve())}function ir(e,t){e!=null&&typeof e.subscribe!="function"&&$r(t)}class Ac{anchor;#e=new Map;#t=new Map;#n=new Map;#c=new Set;#l=!0;constructor(t,n=!0){this.anchor=t,this.#l=n}#i=t=>{if(this.#e.has(t)){var n=this.#e.get(t),i=this.#t.get(n);if(i)wi(i),this.#c.delete(n);else{var l=this.#n.get(n);l&&(this.#t.set(n,l.effect),this.#n.delete(n),l.fragment.lastChild.remove(),this.anchor.before(l.fragment),i=l.effect)}for(const[r,s]of this.#e){if(this.#e.delete(r),r===t)break;const c=this.#n.get(s);c&&(ge(c.effect),this.#n.delete(s))}for(const[r,s]of this.#t){if(r===n||this.#c.has(r))continue;const c=()=>{if(Array.from(this.#e.values()).includes(r)){var o=document.createDocumentFragment();Wi(s,o),o.append(ue()),this.#n.set(r,{effect:s,fragment:o})}else ge(s);this.#c.delete(r),this.#t.delete(r)};this.#l||!i?(this.#c.add(r),Ft(s,c,!1)):c()}}};#r=t=>{this.#e.delete(t);const n=Array.from(this.#e.values());for(const[i,l]of this.#n)n.includes(i)||(ge(l.effect),this.#n.delete(i))};ensure(t,n){var i=S,l=Sl();if(n&&!this.#t.has(t)&&!this.#n.has(t))if(l){var r=document.createDocumentFragment(),s=ue();r.append(s),this.#n.set(t,{effect:Ye(()=>n(s)),fragment:r})}else this.#t.set(t,Ye(()=>n(this.anchor)));if(this.#e.set(i,t),l){for(const[c,a]of this.#t)c===t?i.unskip_effect(a):i.skip_effect(a);for(const[c,a]of this.#n)c===t?i.unskip_effect(a.effect):i.skip_effect(a.effect);i.oncommit(this.#i),i.ondiscard(this.#r)}else W&&(this.anchor=V),this.#i(i)}}{let e=function(t){if(!(t in globalThis)){let n;Object.defineProperty(globalThis,t,{configurable:!0,get:()=>{if(n!==void 0)return n;gs(t)},set:i=>{n=i}})}};e("$state"),e("$effect"),e("$derived"),e("$inspect"),e("$props"),e("$bindable")}function hc(e){_===null&&il("onMount"),Kt&&_.l!==null?Gc(_).m.push(e):Xi(()=>{const t=B(e);if(typeof t=="function")return t})}function vc(e,t,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(e,{detail:t,bubbles:n,cancelable:i})}function pc(){const e=_;return e===null&&il("createEventDispatcher"),(t,n,i)=>{const l=e.s.$$events?.[t];if(l){const r=Wn(l)?l.slice():[l],s=vc(t,n,i);for(const c of r)c.call(e.x,s);return!s.defaultPrevented}return!0}}function Gc(e){var t=e.l;return t.u??={a:[],b:[],m:[]}}var lr=new Map;function mc(e,t){var n=lr.get(e);n||(n=new Set,lr.set(e,n)),n.add(t)}function qe(e,t,n){return(...i)=>{const l=e(...i);var r=W?l:l.nodeType===Kr?l.firstChild:l;return rr(r,t,n),l}}function Zc(e,t,n){e.__svelte_meta={parent:lt,loc:{file:t,line:n[0],column:n[1]}},n[2]&&rr(e.firstChild,t,n[2])}function rr(e,t,n){for(var i=0,l=0;e&&i<n.length;){if(W&&e.nodeType===Qt){var r=e;r.data[0]===ei?l+=1:r.data[0]===wn&&(l-=1)}l===0&&e.nodeType===Er&&Zc(e,t,n[i++]),e=e.nextSibling}}function Ni(e){e&&qr(e[te]??"a component",e.name)}function _i(){const e=_?.function;function t(n){Qr(n,e[te])}return{$destroy:()=>t("$destroy()"),$on:()=>t("$on(...)"),$set:()=>t("$set(...)")}}function hn(e,t,n=!1){var i;W&&(i=V,Hn());var l=new Ac(e),r=n?Pt:0;function s(c,a){if(W){var o=ll(i);if(c!==parseInt(o.substring(1))){var g=Jn();ae(g),l.anchor=g,it(!1),l.ensure(c,a),it(!0);return}}l.ensure(c,a)}xi(()=>{var c=!1;t((a,o=0)=>{c=!0,s(o,a)}),c||s(-1,null)},r)}function ki(e,t){return t}function Xc(e,t,n){for(var i=[],l=t.length,r,s=t.length,c=0;c<l;c++){let d=t[c];Ft(d,()=>{if(r){if(r.pending.delete(d),r.done.add(d),r.pending.size===0){var u=e.outrogroups;Si(e,Bn(r.done)),u.delete(r),u.size===0&&(e.outrogroups=null)}}else s-=1},!1)}if(s===0){var a=i.length===0&&n!==null;if(a){var o=n,g=o.parentNode;kl(g),g.append(o),e.items.clear()}Si(e,t,!a)}else r={pending:new Set(t),done:new Set},(e.outrogroups??=new Set).add(r)}function Si(e,t,n=!0){var i;if(e.pending.size>0){i=new Set;for(const s of e.pending.values())for(const c of s)i.add(e.items.get(c).e)}for(var l=0;l<t.length;l++){var r=t[l];if(i?.has(r)){r.f|=Ee;const s=document.createDocumentFragment();Wi(r,s)}else ge(t[l],n)}}var sr;function Ri(e,t,n,i,l,r=null){var s=e,c=new Map,a=(t&Ti)!==0;if(a){var o=e;s=W?ae(Jt(o)):o.appendChild(ue())}W&&Hn();var g=null,d=ht(()=>{var x=n();return Wn(x)?x:x==null?[]:Bn(x)}),u,b=new Map,f=!0;function h(x){(y.effect.f&Be)===0&&(y.pending.delete(x),y.fallback=g,xc(y,u,s,t,i),g!==null&&(u.length===0?(g.f&Ee)===0?wi(g):(g.f^=Ee,pn(g,null,s)):Ft(g,()=>{g=null})))}function C(x){y.pending.delete(x)}var Z=xi(()=>{u=I(d);var x=u.length;let k=!1;if(W){var D=ll(s)===ti;D!==(x===0)&&(s=Jn(),ae(s),it(!1),k=!0)}for(var O=new Set,M=S,He=Sl(),T=0;T<x;T+=1){W&&V.nodeType===Qt&&V.data===wn&&(s=V,k=!0,it(!1));var z=u[T],pe=i(z,T);{var oe=i(z,T);pe!==oe&&ns(String(T),String(pe),String(oe))}var E=f?null:c.get(pe);E?(E.v&&ln(E.v,z),E.i&&ln(E.i,T),He&&M.unskip_effect(E.e)):(E=yc(c,f?s:sr??=ue(),z,pe,T,l,t,n),f||(E.e.f|=Ee),c.set(pe,E)),O.add(pe)}if(x===0&&r&&!g&&(f?g=Ye(()=>r(s)):(g=Ye(()=>r(sr??=ue())),g.f|=Ee)),x>O.size&&wc(u,i),W&&x>0&&ae(Jn()),!f)if(b.set(M,O),He){for(const[Ie,Ge]of c)O.has(Ie)||M.skip_effect(Ge.e);M.oncommit(h),M.ondiscard(C)}else h(M);k&&it(!0),I(d)}),y={effect:Z,items:c,pending:b,outrogroups:null,fallback:g};f=!1,W&&(s=V)}function vn(e){for(;e!==null&&(e.f&Fe)===0;)e=e.next;return e}function xc(e,t,n,i,l){var r=(i&kr)!==0,s=t.length,c=e.items,a=vn(e.effect.first),o,g=null,d,u=[],b=[],f,h,C,Z;if(r)for(Z=0;Z<s;Z+=1)f=t[Z],h=l(f,Z),C=c.get(h).e,(C.f&Ee)===0&&(C.nodes?.a?.measure(),(d??=new Set).add(C));for(Z=0;Z<s;Z+=1){if(f=t[Z],h=l(f,Z),C=c.get(h).e,e.outrogroups!==null)for(const z of e.outrogroups)z.pending.delete(C),z.done.delete(C);if((C.f&Ae)!==0&&(wi(C),r&&(C.nodes?.a?.unfix(),(d??=new Set).delete(C))),(C.f&Ee)!==0)if(C.f^=Ee,C===a)pn(C,null,n);else{var y=g?g.next:a;C===e.effect.last&&(e.effect.last=C.prev),C.prev&&(C.prev.next=C.next),C.next&&(C.next.prev=C.prev),Xt(e,g,C),Xt(e,C,y),pn(C,y,n),g=C,u=[],b=[],a=vn(g.next);continue}if(C!==a){if(o!==void 0&&o.has(C)){if(u.length<b.length){var x=b[0],k;g=x.prev;var D=u[0],O=u[u.length-1];for(k=0;k<u.length;k+=1)pn(u[k],x,n);for(k=0;k<b.length;k+=1)o.delete(b[k]);Xt(e,D.prev,O.next),Xt(e,g,D),Xt(e,O,x),a=x,g=O,Z-=1,u=[],b=[]}else o.delete(C),pn(C,a,n),Xt(e,C.prev,C.next),Xt(e,C,g===null?e.effect.first:g.next),Xt(e,g,C),g=C;continue}for(u=[],b=[];a!==null&&a!==C;)(o??=new Set).add(a),b.push(a),a=vn(a.next);if(a===null)continue}(C.f&Ee)===0&&u.push(C),g=C,a=vn(C.next)}if(e.outrogroups!==null){for(const z of e.outrogroups)z.pending.size===0&&(Si(e,Bn(z.done)),e.outrogroups?.delete(z));e.outrogroups.size===0&&(e.outrogroups=null)}if(a!==null||o!==void 0){var M=[];if(o!==void 0)for(C of o)(C.f&Ae)===0&&M.push(C);for(;a!==null;)(a.f&Ae)===0&&a!==e.fallback&&M.push(a),a=vn(a.next);var He=M.length;if(He>0){var T=(i&Ti)!==0&&s===0?n:null;if(r){for(Z=0;Z<He;Z+=1)M[Z].nodes?.a?.measure();for(Z=0;Z<He;Z+=1)M[Z].nodes?.a?.fix()}Xc(e,M,T)}}r&&rt(()=>{if(d!==void 0)for(C of d)C.nodes?.a?.apply()})}function yc(e,t,n,i,l,r,s,c){var a=(s&Nr)!==0?(s&Sr)===0?R(n,!1,!1):Rt(n):null,o=(s&_r)!==0?Rt(l):null;return a&&(a.trace=()=>{c()[o?.v??l]}),{v:a,i:o,e:Ye(()=>(r(t,a??n,o??l,c),()=>{e.delete(i)}))}}function pn(e,t,n){if(e.nodes)for(var i=e.nodes.start,l=e.nodes.end,r=t&&(t.f&Ee)===0?t.nodes.start:n;i!==null;){var s=Pe(i);if(r.before(i),i===l)return;i=s}}function Xt(e,t,n){t===null?e.effect.first=n:t.next=n,n===null?e.effect.last=t:n.prev=t}function wc(e,t){const n=new Map,i=e.length;for(let l=0;l<i;l++){const r=t(e[l],l);if(n.has(r)){const s=String(n.get(r)),c=String(l);let a=String(r);a.startsWith("[object ")&&(a=null),ts(s,c,a)}n.set(r,l)}}function cr(e,t){Fl(()=>{var n=e.getRootNode(),i=n.host?n:n.head??n.ownerDocument.head;if(!i.querySelector("#"+t.hash)){const l=pi("style");l.id=t.hash,l.textContent=t.code,i.appendChild(l),mc(t.hash,l)}})}const ar=[...` 	
\r\f \v\uFEFF`];function Wc(e,t,n){var i=e==null?"":""+e;if(n){for(var l of Object.keys(n))if(n[l])i=i?i+" "+l:l;else if(i.length)for(var r=l.length,s=0;(s=i.indexOf(l,s))>=0;){var c=s+r;(s===0||ar.includes(i[s-1]))&&(c===i.length||ar.includes(i[c]))?i=(s===0?"":i.substring(0,s))+i.substring(c+1):s=c}}return i===""?null:i}function Bc(e,t){return e==null?null:String(e)}function Hi(e,t,n,i,l,r){var s=e.__className;if(W||s!==n||s===void 0){var c=Wc(n,i,r);(!W||c!==e.getAttribute("class"))&&(c==null?e.removeAttribute("class"):e.className=c),e.__className=n}else if(r&&l!==r)for(var a in r){var o=!!r[a];(l==null||o!==!!l[a])&&e.classList.toggle(a,o)}return r}function Vc(e,t,n,i){var l=e.__style;if(W||l!==t){var r=Bc(t);(!W||r!==e.getAttribute("style"))&&(r==null?e.removeAttribute("style"):e.style.cssText=r),e.__style=t}return i}const Yc=Symbol("is custom element"),Nc=Symbol("is html"),_c=nl?"link":"LINK",kc=nl?"progress":"PROGRESS";function Sc(e){if(W){var t=!1,n=()=>{if(!t){if(t=!0,e.hasAttribute("value")){var i=e.value;Ot(e,"value",null),e.value=i}if(e.hasAttribute("checked")){var l=e.checked;Ot(e,"checked",null),e.checked=l}}};e.__on_r=n,rt(n),Us()}}function Rc(e,t){var n=gr(e);n.value===(n.value=t??void 0)||e.value===t&&(t!==0||e.nodeName!==kc)||(e.value=t??"")}function Ot(e,t,n,i){var l=gr(e);if(W&&(l[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===_c)){Jc(e,t,n??"");return}l[t]!==(l[t]=n)&&(t==="loading"&&(e[Tr]=n),n==null?e.removeAttribute(t):typeof n!="string"&&Hc(e).includes(t)?e[t]=n:e.setAttribute(t,n))}function gr(e){return e.__attributes??={[Yc]:e.nodeName.includes("-"),[Nc]:e.namespaceURI===Ki}}var or=new Map;function Hc(e){var t=e.getAttribute("is")||e.nodeName,n=or.get(t);if(n)return n;or.set(t,n=[]);for(var i,l=e,r=Element.prototype;r!==l;){i=Ui(l);for(var s in i)i[s].set&&n.push(s);l=ni(l)}return n}function Jc(e,t,n){t==="srcset"&&Fc(e,n)||Ji(e.getAttribute(t)??"",n)||fs(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(n))}function Ji(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function Ir(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function Fc(e,t){var n=Ir(e.srcset),i=Ir(t);return i.length===n.length&&i.every(([l,r],s)=>r===n[s][1]&&(Ji(n[s][0],l)||Ji(l,n[s][0])))}function ur(e,t){return e===t||e?.[Ke]===t}function zc(e={},t,n,i){var l=_.r,r=X;return Fl(()=>{var s,c;return bn(()=>{s=c,c=[],B(()=>{e!==n(...c)&&(t(e,...c),s&&ur(n(...s),e)&&t(null,...s))})}),()=>{let a=r;for(;a!==l&&a.parent!==null&&a.parent.f&li;)a=a.parent;const o=()=>{c&&ur(n(...c),e)&&t(null,...c)},g=a.teardown;a.teardown=()=>{o(),g?.()}}}),e}function jc(e){return function(...t){var n=t[0];return n.stopPropagation(),e?.apply(this,t)}}function dr(e=!1){const t=_,n=t.l.u;if(!n)return;let i=()=>Lt(t.s);if(e){let l=0,r={};const s=di(()=>{let c=!1;const a=t.s;for(const o in a)a[o]!==r[o]&&(r[o]=a[o],c=!0);return c&&l++,l});i=()=>I(s)}n.b.length&&Ps(()=>{Cr(t,i),Yn(n.b)}),Xi(()=>{const l=B(()=>n.m.map(Or));return()=>{for(const r of l)typeof r=="function"&&r()}}),n.a.length&&Xi(()=>{Cr(t,i),Yn(n.a)})}function Cr(e,t){if(e.l.s)for(const n of e.l.s)I(n);t()}function Dc(e,t){var n=e.$$events?.[t.type],i=Wn(n)?n.slice():n==null?[]:[n];for(var l of i)l.call(this,t)}function Q(e,t,n,i){var l=!Kt||(n&Rr)!==0,r=(n&Hr)!==0,s=i,c=!0,a=()=>(c&&(c=!1,s=i),s);let o;{var g=Ke in e||el in e;o=ut(e,t)?.set??(g&&t in e?y=>e[t]=y:void 0)}var d,u=!1;[d,u]=Ws(()=>e[t]),d===void 0&&i!==void 0&&(d=a(),o&&(l&&as(t),o(d)));var b;if(l?b=()=>{var y=e[t];return y===void 0?a():(c=!0,y)}:b=()=>{var y=e[t];return y!==void 0&&(s=void 0),y===void 0?s:y},o){var f=e.$$legacy;return(function(y,x){return arguments.length>0?((!l||!x||f||u)&&o(x?b():y),y):b()})}var h=!1,C=ht(()=>(h=!1,b()));C.label=t,I(C);var Z=X;return(function(y,x){if(arguments.length>0){const k=x?I(C):l&&r?rn(y):y;return v(C,k),h=!0,s!==void 0&&(s=k),y}return mt&&h||(Z.f&Be)!==0?C.v:I(C)})}function Lc(e){return new Oc(e)}class Oc{#e;#t;constructor(t){var n=new Map,i=(r,s)=>{var c=R(s,!1,!1);return n.set(r,c),c};const l=new Proxy({...t.props||{},$$events:{}},{get(r,s){return I(n.get(s)??i(s,Reflect.get(r,s)))},has(r,s){return s===el?!0:(I(n.get(s)??i(s,Reflect.get(r,s))),Reflect.has(r,s))},set(r,s,c){return v(n.get(s)??i(s,c),c),Reflect.set(r,s,c)}});this.#t=(t.hydrate?fc:tr)(t.component,{target:t.target,anchor:t.anchor,props:l,context:t.context,intro:t.intro??!1,recover:t.recover,transformError:t.transformError}),(!t?.props?.$$host||t.sync===!1)&&K(),this.#e=l.$$events;for(const r of Object.keys(this.#t))r==="$set"||r==="$destroy"||r==="$on"||we(this,r,{get(){return this.#t[r]},set(s){this.#t[r]=s},enumerable:!0});this.#t.$set=r=>{Object.assign(l,r)},this.#t.$destroy=()=>{bc(this.#t)}}$set(t){this.#t.$set(t)}$on(t,n){this.#e[t]=this.#e[t]||[];const i=(...l)=>n.call(this,...l);return this.#e[t].push(i),()=>{this.#e[t]=this.#e[t].filter(l=>l!==i)}}$destroy(){this.#t.$destroy()}}let fr;typeof HTMLElement=="function"&&(fr=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(e,t,n){super(),this.$$ctor=e,this.$$s=t,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(e,t,n){if(this.$$l[e]=this.$$l[e]||[],this.$$l[e].push(t),this.$$c){const i=this.$$c.$on(e,t);this.$$l_u.set(t,i)}super.addEventListener(e,t,n)}removeEventListener(e,t,n){if(super.removeEventListener(e,t,n),this.$$c){const i=this.$$l_u.get(t);i&&(i(),this.$$l_u.delete(t))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let e=function(i){return l=>{const r=pi("slot");i!=="default"&&(r.name=i),Ce(l,r)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;const t={},n=Mc(this);for(const i of this.$$s)i in n&&(i==="default"&&!this.$$d.children?(this.$$d.children=e(i),t.default=!0):t[i]=e(i));for(const i of this.attributes){const l=this.$$g_p(i.name);l in this.$$d||(this.$$d[l]=Un(l,i.value,this.$$p_d,"toProp"))}for(const i in this.$$p_d)!(i in this.$$d)&&this[i]!==void 0&&(this.$$d[i]=this[i],delete this[i]);this.$$c=Lc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:t,$$host:this}}),this.$$me=Qs(()=>{bn(()=>{this.$$r=!0;for(const i of Vn(this.$$c)){if(!this.$$p_d[i]?.reflect)continue;this.$$d[i]=this.$$c[i];const l=Un(i,this.$$d[i],this.$$p_d,"toAttribute");l==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,l)}this.$$r=!1})});for(const i in this.$$l)for(const l of this.$$l[i]){const r=this.$$c.$on(i,l);this.$$l_u.set(l,r)}this.$$l={}}}attributeChangedCallback(e,t,n){this.$$r||(e=this.$$g_p(e),this.$$d[e]=Un(e,n,this.$$p_d,"toProp"),this.$$c?.$set({[e]:this.$$d[e]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(e){return Vn(this.$$p_d).find(t=>this.$$p_d[t].attribute===e||!this.$$p_d[t].attribute&&t.toLowerCase()===e)||e}});function Un(e,t,n,i){const l=n[e]?.type;if(t=l==="Boolean"&&typeof t!="boolean"?t!=null:t,!i||!n[e])return t;if(i==="toAttribute")switch(l){case"Object":case"Array":return t==null?null:JSON.stringify(t);case"Boolean":return t?"":null;case"Number":return t??null;default:return t}else switch(l){case"Object":case"Array":return t&&JSON.parse(t);case"Boolean":return t;case"Number":return t!=null?+t:t;default:return t}}function Mc(e){const t={};return e.childNodes.forEach(n=>{t[n.slot||"default"]=!0}),t}function Fi(e,t,n,i,l,r){let s=class extends fr{constructor(){super(e,n,l),this.$$p_d=t}static get observedAttributes(){return Vn(t).map(c=>(t[c].attribute||c).toLowerCase())}};return Vn(t).forEach(c=>{we(s.prototype,c,{get(){return this.$$c&&c in this.$$c?this.$$c[c]:this.$$d[c]},set(a){a=Un(c,a,t),this.$$d[c]=a;var o=this.$$c;if(o){var g=ut(o,c)?.get;g?o[c]=a:o.$set({[c]:a})}}})}),i.forEach(c=>{we(s.prototype,c,{get(){return this.$$c?.[c]}})}),e.element=s,s}const br={en:{crossword:{across:"Across",down:"Down",loading:"Loading puzzle...",congratulations:"Excellent!",solvedMessage:"You solved the crossword!",yourTime:"Your time:",share:"Share",shareTitle:"Share your result",shareSubtitle:"Copy the link to share with friends",copy:"Copy",copied:"✓ Copied",selectCell:"Select a cell",prevClue:"Previous clue",nextClue:"Next clue",mainWordTitle:"Daily crossword phrase",sharedSolvedMessage:"Your friend solved this crossword!",theirTime:"Their time:",startSolving:"Start solving",older:"Older",newer:"Newer"},wordgame:{loading:"Loading...",preview:"Preview",enterLetters:"Enter {0} letters",guessedCorrectly:"🎉 Excellent! You guessed it!",wordWas:"The word was: ",playAgain:"Play again",howToPlayTitle:"How to play",guessWord:"Guess the word in <strong>{0} attempts</strong>.",eachGuessMustBe:"Each guess must be a <strong>{0} letter</strong> word.",colorsShowHint:"Colors show how close your guess was.",correctLegend:"Correct",wrongPlaceLegend:"Wrong place",notInWordLegend:"Not in word",typeLetters:"Type letters using your keyboard",pressEnter:"Press <strong>Enter</strong> to submit your guess",pressBackspace:"Press <strong>Backspace</strong> to delete a letter",gameNotFound:"Game not found. Set the <code>game-id</code> attribute."},wordsearch:{loading:"Loading puzzle…",wordsToFind:"Words to Find",found:"found",congratulations:"Congratulations!",foundAllWords:"You found all {0} words!",playAgain:"Play Again",older:"Older",newer:"Newer"}},lt:{crossword:{across:"Horizontaliai",down:"Vertikaliai",loading:"Kraunamas galvosūkis...",congratulations:"Puiku!",solvedMessage:"Sėkmingai išsprendėte kryžiažodį!",yourTime:"Jūsų laikas:",share:"Dalintis",shareTitle:"Pasidalinkite rezultatu",shareSubtitle:"Nukopijuokite nuorodą ir pasidalinkite su draugais",copy:"Kopijuoti",copied:"✓ Nukopijuota",selectCell:"Pasirinkite langelį",prevClue:"Ankstesnė užuomina",nextClue:"Kita užuomina",mainWordTitle:"Dienos kryžiažodžio frazė",sharedSolvedMessage:"Jūsų draugas išsprendė šį kryžiažodį!",theirTime:"Jo laikas:",startSolving:"Spręsti kryžiažodį",older:"Ankstesnis",newer:"Naujausias"},wordgame:{loading:"Kraunama...",preview:"Peržiūra",enterLetters:"Įveskite {0} raides",guessedCorrectly:"🎉 Puiku! Atspėjote!",wordWas:"Žodis buvo: ",playAgain:"Žaisti iš naujo",howToPlayTitle:"Kaip žaisti",guessWord:"Atspėkite žodį per <strong>{0} bandymų</strong>.",eachGuessMustBe:"Kiekvienas spėjimas turi būti <strong>{0} raidžių</strong> žodis.",colorsShowHint:"Spalvos parodo, kaip arti buvo spėjimas.",correctLegend:"Teisinga",wrongPlaceLegend:"Ne ten",notInWordLegend:"Nėra",typeLetters:"Rašykite raides klaviatūra",pressEnter:"Spauskite <strong>Enter</strong>, kad pateiktumėte spėjimą",pressBackspace:"Spauskite <strong>Backspace</strong>, kad ištrintumėte raidę",gameNotFound:"Žaidimas nerastas. Nustatykite <code>game-id</code> atributą."},wordsearch:{loading:"Kraunamas galvosūkis…",wordsToFind:"Raskite žodžius",found:"rasta",congratulations:"Puiku!",foundAllWords:"Radote visus {0} žodžius!",playAgain:"Žaisti iš naujo",older:"Ankstesnis",newer:"Naujausias"}}},Ar=bl("lt"),$n=ys(Ar,e=>{const t=br[e]||br.lt;return function(i){const l=i.split(".");let r=t;for(const s of l)r=r?.[s];return typeof r=="string"?r:i}}),Tc={compact:{"--text-sm":"0.8125rem","--text-base":"0.9375rem","--text-lg":"1.0625rem","--text-xl":"1.25rem"},default:{"--text-sm":"0.875rem","--text-base":"1rem","--text-lg":"1.125rem","--text-xl":"1.375rem"},relaxed:{"--text-sm":"0.9375rem","--text-base":"1.0625rem","--text-lg":"1.1875rem","--text-xl":"1.5rem"}},Ec={compact:{"--space-1":"0.125rem","--space-2":"0.25rem","--space-3":"0.5rem","--space-4":"0.75rem","--space-6":"1rem"},cozy:{"--space-1":"0.25rem","--space-2":"0.5rem","--space-3":"0.75rem","--space-4":"1rem","--space-6":"1.5rem"},comfortable:{"--space-1":"0.375rem","--space-2":"0.75rem","--space-3":"1rem","--space-4":"1.5rem","--space-6":"2rem"}},Kc={primary:["--primary","--accent"],"primary-hover":["--primary-hover","--accent-hover"],"primary-light":["--primary-light","--accent-light"],"primary-foreground":["--primary-foreground"],surface:["--surface","--bg-primary"],"surface-elevated":["--surface-elevated","--bg-secondary"],"surface-muted":["--surface-muted"],text:["--text","--text-primary"],"text-muted":["--text-muted","--text-secondary"],border:["--border","--border-color"],correct:["--correct"],"correct-light":["--correct-light"],present:["--present"],absent:["--absent"],selection:["--selection","--cell-selected","--cell-selected-bg"],"selection-ring":["--selection-ring","--cell-selected-ring"],highlight:["--highlight","--cell-highlighted","--cell-related"],"cell-bg":["--cell-bg"],"cell-blocked":["--cell-blocked"],"grid-border":["--grid-border"],"main-word-marker":["--main-word-marker"],"sidebar-active":["--sidebar-active"],"sidebar-active-bg":["--sidebar-active-bg"]};function hr(e,t){if(!t||!e)return;const n=t.tokens||{};for(const[c,a]of Object.entries(Kc)){const o=n[c];if(o)for(const g of a)e.style.setProperty(g,o)}const i=t.typography||{};i.fontSans&&(e.style.setProperty("--font-sans",i.fontSans),pr(i.fontSans)),i.fontSerif&&(e.style.setProperty("--font-serif",i.fontSerif),pr(i.fontSerif));const l=Tc[i.scale];if(l)for(const[c,a]of Object.entries(l))e.style.setProperty(c,a);const r=t.spacing;r&&typeof r.radius=="number"&&(e.style.setProperty("--radius-sm",`${r.radius*.5}px`),e.style.setProperty("--radius-md",`${r.radius}px`),e.style.setProperty("--radius-lg",`${r.radius*1.5}px`),e.style.setProperty("--radius-xl",`${r.radius*2}px`));const s=r&&Ec[r.density];if(s)for(const[c,a]of Object.entries(s))e.style.setProperty(c,a);if(t.orgId&&e.setAttribute("data-org-id",t.orgId),t.customCssGames){let c=e.querySelector("style[data-branding-custom-css]");c||(c=document.createElement("style"),c.setAttribute("data-branding-custom-css",""),e.insertBefore(c,e.firstChild)),c.textContent=t.customCssGames}}const vr=new Set;function pr(e){const t=e.split(",")[0].trim().replace(/["']/g,"");if(["serif","sans-serif","monospace","cursive","system-ui","-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Arial","Helvetica"].includes(t)||vr.has(t))return;vr.add(t);const i=document.createElement("link");i.rel="stylesheet",i.href=`https://fonts.googleapis.com/css2?family=${encodeURIComponent(t)}:wght@300;400;500;600;700&display=swap`,document.head.appendChild(i)}xt[te]="src/lib/crossword/CelebrationOverlay.svelte";var Uc=qe(Qe('<div class="share-overlay svelte-14o0mzm" role="presentation"><div class="share-modal svelte-14o0mzm" role="dialog" aria-label="Share result"><button class="modal-close svelte-14o0mzm">✕</button> <h3 class="modal-title svelte-14o0mzm"> </h3> <p class="modal-subtitle svelte-14o0mzm"> </p> <div class="url-row svelte-14o0mzm"><input class="share-url-input svelte-14o0mzm" type="text" readonly=""/> <button class="copy-btn svelte-14o0mzm"><!></button></div></div></div>'),xt[te],[[89,2,[[90,4,[[96,6],[97,6],[98,6],[101,6,[[102,8],[109,8]]]]]]]]),$c=qe(Qe('<div class="celebration svelte-14o0mzm"><div class="celebration-header svelte-14o0mzm"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256" class="check-icon svelte-14o0mzm"><path d="M170.83,101.17a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z" class="svelte-14o0mzm"></path></svg> <h2 class="svelte-14o0mzm"> </h2></div> <p class="svelte-14o0mzm"> </p> <div class="celebration-actions svelte-14o0mzm"><div class="time-badge svelte-14o0mzm"><span class="time-label svelte-14o0mzm"> </span> <span class="time-value svelte-14o0mzm"> </span></div> <button class="share-btn svelte-14o0mzm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="svelte-14o0mzm"><path d="M237.66,117.66l-80,80A8,8,0,0,1,144,192V152.23c-57.1,3.24-96.25,40.27-107.24,52h0a12,12,0,0,1-20.68-9.58c3.71-32.26,21.38-63.29,49.76-87.37,23.57-20,52.22-32.69,78.16-34.91V32a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,237.66,117.66Z" class="svelte-14o0mzm"></path></svg> </button></div></div> <!>',1),xt[te],[[48,0,[[49,2,[[50,4,[[57,7]]],[61,4]]],[64,2],[66,2,[[67,4,[[68,6],[69,6]]],[72,4,[[73,6,[[79,9]]]]]]]]]]);const Pc={hash:"svelte-14o0mzm",code:`
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

/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2VsZWJyYXRpb25PdmVybGF5LnN2ZWx0ZSIsInNvdXJjZXMiOlsiQ2VsZWJyYXRpb25PdmVybGF5LnN2ZWx0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8c2NyaXB0PlxuICBpbXBvcnQgeyB0IH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NoYXJlZC9nYW1lLWxpYi9pMThuL2luZGV4LmpzXCI7XG4gIGltcG9ydCB7IGNyZWF0ZUV2ZW50RGlzcGF0Y2hlciB9IGZyb20gXCJzdmVsdGVcIjtcblxuICBleHBvcnQgbGV0IGVsYXBzZWRUaW1lID0gMDtcbiAgZXhwb3J0IGxldCBzaGFyZVVybCA9IFwiXCI7XG4gIGV4cG9ydCBsZXQgdGl0bGVUZXh0ID0gXCJcIjtcbiAgZXhwb3J0IGxldCBtZXNzYWdlVGV4dCA9IFwiXCI7XG5cbiAgY29uc3QgZGlzcGF0Y2ggPSBjcmVhdGVFdmVudERpc3BhdGNoZXIoKTtcblxuICBsZXQgc2hvd01vZGFsID0gZmFsc2U7XG4gIGxldCBjb3BpZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBmb3JtYXRUaW1lKHNlY29uZHMpIHtcbiAgICBjb25zdCBtID0gU3RyaW5nKE1hdGguZmxvb3Ioc2Vjb25kcyAvIDYwKSkucGFkU3RhcnQoMiwgXCIwXCIpO1xuICAgIGNvbnN0IHMgPSBTdHJpbmcoc2Vjb25kcyAlIDYwKS5wYWRTdGFydCgyLCBcIjBcIik7XG4gICAgcmV0dXJuIGAke219OiR7c31gO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlU2hhcmUoKSB7XG4gICAgZGlzcGF0Y2goXCJzaGFyZVwiKTtcbiAgICBzaG93TW9kYWwgPSB0cnVlO1xuICAgIGNvcGllZCA9IGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gY29weVVybCgpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQoc2hhcmVVcmwpO1xuICAgICAgY29waWVkID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb3BpZWQgPSBmYWxzZTtcbiAgICAgIH0sIDIwMDApO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRmFsbGJhY2s6IHNlbGVjdCB0aGUgaW5wdXQgdGV4dFxuICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoYXJlLXVybC1pbnB1dFwiKTtcbiAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICBpbnB1dC5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xuICAgIHNob3dNb2RhbCA9IGZhbHNlO1xuICB9XG48L3NjcmlwdD5cblxuPGRpdiBjbGFzcz1cImNlbGVicmF0aW9uXCI+XG4gIDxkaXYgY2xhc3M9XCJjZWxlYnJhdGlvbi1oZWFkZXJcIj5cbiAgICA8c3ZnXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgIHdpZHRoPVwiMzJcIlxuICAgICAgaGVpZ2h0PVwiMzJcIlxuICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDI1NiAyNTZcIlxuICAgICAgY2xhc3M9XCJjaGVjay1pY29uXCJcbiAgICAgID48cGF0aFxuICAgICAgICBkPVwiTTE3MC44MywxMDEuMTdhNCw0LDAsMCwxLDAsNS42NmwtNTYsNTZhNCw0LDAsMCwxLTUuNjYsMGwtMjQtMjRhNCw0LDAsMCwxLDUuNjYtNS42NkwxMTIsMTU0LjM0bDUzLjE3LTUzLjE3QTQsNCwwLDAsMSwxNzAuODMsMTAxLjE3Wk0yMjgsMTI4QTEwMCwxMDAsMCwxLDEsMTI4LDI4LDEwMC4xMSwxMDAuMTEsMCwwLDEsMjI4LDEyOFptLTgsMGE5Miw5MiwwLDEsMC05Miw5MkE5Mi4xLDkyLjEsMCwwLDAsMjIwLDEyOFpcIlxuICAgICAgPjwvcGF0aD48L3N2Z1xuICAgID5cbiAgICA8aDI+e3RpdGxlVGV4dCB8fCAkdChcImNyb3Nzd29yZC5jb25ncmF0dWxhdGlvbnNcIil9PC9oMj5cbiAgPC9kaXY+XG5cbiAgPHA+e21lc3NhZ2VUZXh0IHx8ICR0KFwiY3Jvc3N3b3JkLnNvbHZlZE1lc3NhZ2VcIil9PC9wPlxuXG4gIDxkaXYgY2xhc3M9XCJjZWxlYnJhdGlvbi1hY3Rpb25zXCI+XG4gICAgPGRpdiBjbGFzcz1cInRpbWUtYmFkZ2VcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidGltZS1sYWJlbFwiPnskdChcImNyb3Nzd29yZC55b3VyVGltZVwiKX08L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInRpbWUtdmFsdWVcIj57Zm9ybWF0VGltZShlbGFwc2VkVGltZSl9PC9zcGFuPlxuICAgIDwvZGl2PlxuXG4gICAgPGJ1dHRvbiBjbGFzcz1cInNoYXJlLWJ0blwiIG9uOmNsaWNrPXtoYW5kbGVTaGFyZX0+XG4gICAgICA8c3ZnXG4gICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgdmlld0JveD1cIjAgMCAyNTYgMjU2XCJcbiAgICAgICAgPjxwYXRoXG4gICAgICAgICAgZD1cIk0yMzcuNjYsMTE3LjY2bC04MCw4MEE4LDgsMCwwLDEsMTQ0LDE5MlYxNTIuMjNjLTU3LjEsMy4yNC05Ni4yNSw0MC4yNy0xMDcuMjQsNTJoMGExMiwxMiwwLDAsMS0yMC42OC05LjU4YzMuNzEtMzIuMjYsMjEuMzgtNjMuMjksNDkuNzYtODcuMzcsMjMuNTctMjAsNTIuMjItMzIuNjksNzguMTYtMzQuOTFWMzJhOCw4LDAsMCwxLDEzLjY2LTUuNjZsODAsODBBOCw4LDAsMCwxLDIzNy42NiwxMTcuNjZaXCJcbiAgICAgICAgPjwvcGF0aD48L3N2Z1xuICAgICAgPlxuICAgICAgeyR0KFwiY3Jvc3N3b3JkLnNoYXJlXCIpfVxuICAgIDwvYnV0dG9uPlxuICA8L2Rpdj5cbjwvZGl2PlxuXG57I2lmIHNob3dNb2RhbH1cbiAgPGRpdiBjbGFzcz1cInNoYXJlLW92ZXJsYXlcIiBvbjpjbGljaz17Y2xvc2VNb2RhbH0gcm9sZT1cInByZXNlbnRhdGlvblwiPlxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwic2hhcmUtbW9kYWxcIlxuICAgICAgb246Y2xpY2t8c3RvcFByb3BhZ2F0aW9uXG4gICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgIGFyaWEtbGFiZWw9XCJTaGFyZSByZXN1bHRcIlxuICAgID5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJtb2RhbC1jbG9zZVwiIG9uOmNsaWNrPXtjbG9zZU1vZGFsfT7inJU8L2J1dHRvbj5cbiAgICAgIDxoMyBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+eyR0KFwiY3Jvc3N3b3JkLnNoYXJlVGl0bGVcIil9PC9oMz5cbiAgICAgIDxwIGNsYXNzPVwibW9kYWwtc3VidGl0bGVcIj5cbiAgICAgICAgeyR0KFwiY3Jvc3N3b3JkLnNoYXJlU3VidGl0bGVcIil9XG4gICAgICA8L3A+XG4gICAgICA8ZGl2IGNsYXNzPVwidXJsLXJvd1wiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzcz1cInNoYXJlLXVybC1pbnB1dFwiXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIHJlYWRvbmx5XG4gICAgICAgICAgdmFsdWU9e3NoYXJlVXJsfVxuICAgICAgICAgIG9uOmNsaWNrPXsoZSkgPT4gZS50YXJnZXQuc2VsZWN0KCl9XG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJjb3B5LWJ0blwiIG9uOmNsaWNrPXtjb3B5VXJsfT5cbiAgICAgICAgICB7I2lmIGNvcGllZH1cbiAgICAgICAgICAgIHskdChcImNyb3Nzd29yZC5jb3BpZWRcIil9XG4gICAgICAgICAgezplbHNlfVxuICAgICAgICAgICAgeyR0KFwiY3Jvc3N3b3JkLmNvcHlcIil9XG4gICAgICAgICAgey9pZn1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG57L2lmfVxuXG48c3R5bGU+XG4gIC5jZWxlYnJhdGlvbiB7XG4gICAgbWFyZ2luLXRvcDogMTZweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jb3JyZWN0LWxpZ2h0LCAjZTJmM2VhKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgcGFkZGluZzogMzJweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuICBAa2V5ZnJhbWVzIGNlbGVicmF0aW9uUG9wIHtcbiAgICAwJSB7XG4gICAgICBvcGFjaXR5OiAwO1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgpO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcbiAgICB9XG4gICAgMTAwJSB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICB9XG4gIH1cblxuICAuY2VsZWJyYXRpb24taGVhZGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG4gICAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICB9XG5cbiAgLmNoZWNrLWljb24ge1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgICBmbGV4LXNocmluazogMDtcbiAgfVxuXG4gIC5jZWxlYnJhdGlvbiBoMiB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2VyaWYpO1xuICAgIGZvbnQtc2l6ZTogMS43NXJlbTtcbiAgICBjb2xvcjogdmFyKC0tY29ycmVjdCwgIzAwN2EzYyk7XG4gICAgbWFyZ2luOiAwO1xuICB9XG5cbiAgLmNlbGVicmF0aW9uIHAge1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnkpO1xuICAgIG1hcmdpbjogMCAwIDE2cHg7XG4gIH1cblxuICAuY2VsZWJyYXRpb24tYWN0aW9ucyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxNnB4O1xuICB9XG5cbiAgLnRpbWUtYmFkZ2Uge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gIH1cblxuICAudGltZS1sYWJlbCB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGluZS1oZWlnaHQ6IDEycHg7XG4gIH1cblxuICAudGltZS12YWx1ZSB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAxNXB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGluZS1oZWlnaHQ6IDE3cHg7XG4gIH1cblxuICAuc2hhcmUtYnRuIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGdhcDogMTBweDtcbiAgICBwYWRkaW5nOiA4cHggMTJweDtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE1cyBlYXNlO1xuICB9XG5cbiAgLnNoYXJlLWJ0biBzdmcge1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5zaGFyZS1idG46aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICB9XG5cbiAgLnNoYXJlLWJ0bjpob3ZlciBzdmcge1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICB9XG5cbiAgLyogU2hhcmUgTW9kYWwgKi9cbiAgLnNoYXJlLW92ZXJsYXkge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBpbnNldDogMDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHotaW5kZXg6IDEwMDA7XG4gICAgYW5pbWF0aW9uOiBmYWRlSW4gMC4xNXMgZWFzZTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgZmFkZUluIHtcbiAgICBmcm9tIHtcbiAgICAgIG9wYWNpdHk6IDA7XG4gICAgfVxuICAgIHRvIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICB9XG5cbiAgLnNoYXJlLW1vZGFsIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1wcmltYXJ5LCAjZmZmZmZmKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgcGFkZGluZzogMjRweDtcbiAgICBtYXgtd2lkdGg6IDQ4MHB4O1xuICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAzMnB4KTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYW5pbWF0aW9uOiBzbGlkZVVwIDAuMnMgZWFzZTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc2xpZGVVcCB7XG4gICAgZnJvbSB7XG4gICAgICBvcGFjaXR5OiAwO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwcHgpO1xuICAgIH1cbiAgICB0byB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbiAgfVxuXG4gIC5tb2RhbC1jbG9zZSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMTJweDtcbiAgICByaWdodDogMTJweDtcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBmb250LXNpemU6IDE4cHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSwgIzY0NzQ4Yik7XG4gICAgcGFkZGluZzogNHB4IDhweDtcbiAgICBsaW5lLWhlaWdodDogMTtcbiAgfVxuXG4gIC5tb2RhbC1jbG9zZTpob3ZlciB7XG4gICAgY29sb3I6IHZhcigtLXRleHQtcHJpbWFyeSwgIzBmMTcyYSk7XG4gIH1cblxuICAubW9kYWwtdGl0bGUge1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNlcmlmKTtcbiAgICBmb250LXNpemU6IDEuMjVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5LCAjMGYxNzJhKTtcbiAgICBtYXJnaW46IDAgMCA0cHg7XG4gIH1cblxuICAubW9kYWwtc3VidGl0bGUge1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gICAgY29sb3I6IHZhcigtLXRleHQtc2Vjb25kYXJ5LCAjNjQ3NDhiKTtcbiAgICBtYXJnaW46IDAgMCAxNnB4O1xuICB9XG5cbiAgLnVybC1yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZ2FwOiA4cHg7XG4gIH1cblxuICAuc2hhcmUtdXJsLWlucHV0IHtcbiAgICBmbGV4OiAxO1xuICAgIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5LCAjMGYxNzJhKTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1zZWNvbmRhcnksICNmM2Y0ZjYpO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgbWluLXdpZHRoOiAwO1xuICB9XG5cbiAgLnNoYXJlLXVybC1pbnB1dDpmb2N1cyB7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5jb3B5LWJ0biB7XG4gICAgcGFkZGluZzogMTBweCAxNnB4O1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2Fucyk7XG4gICAgZm9udC1zaXplOiAwLjhyZW07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMTVzIGVhc2U7XG4gIH1cblxuICAuY29weS1idG46aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWNvcnJlY3QtaG92ZXIsICMwMDVjMmQpO1xuICB9XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJpZ25vcmVMaXN0IjpbXX0= */`};function xt(e,t){Ni(new.target),zn(t,!1,xt),cr(e,Pc);const n=()=>(ir($n,"t"),Al($n,"$t",i)),[i,l]=hl();let r=Q(t,"elapsedTime",12,0),s=Q(t,"shareUrl",12,""),c=Q(t,"titleText",12,""),a=Q(t,"messageText",12,"");const o=pc();let g=R(!1),d=R(!1);function u(J){const $=String(Math.floor(J/60)).padStart(2,"0"),Je=String(J%60).padStart(2,"0");return`${$}:${Je}`}function b(){o("share"),v(g,!0),v(d,!1)}async function f(){try{(await dn(navigator.clipboard.writeText(s())))(),v(d,!0),setTimeout(()=>{v(d,!1)},2e3)}catch{const J=document.querySelector(".share-url-input");J&&J.select()}}function h(){v(g,!1)}var C={get elapsedTime(){return r()},set elapsedTime(J){r(J),K()},get shareUrl(){return s()},set shareUrl(J){s(J),K()},get titleText(){return c()},set titleText(J){c(J),K()},get messageText(){return a()},set messageText(J){a(J),K()},..._i()};dr();var Z=$c(),y=vi(Z),x=m(y),k=H(m(x),2),D=m(k,!0);G(k),G(x);var O=H(x,2),M=m(O,!0);G(O);var He=H(O,2),T=m(He),z=m(T),pe=m(z,!0);G(z);var oe=H(z,2),E=m(oe,!0);G(oe),G(T);var Ie=H(T,2),Ge=H(m(Ie));G(Ie),G(He),G(y);var fe=H(y,2);{var yt=J=>{var $=Uc(),Je=m($),Mt=m(Je),gt=H(Mt,2),be=m(gt,!0);G(gt);var mn=H(gt,2),Zn=m(mn,!0);G(mn);var Xn=H(mn,2),wt=m(Xn);Sc(wt);var xn=H(wt,2),Pn=m(xn);{var Qn=me=>{var Le=er();Ve(Tt=>F(Le,Tt),[()=>(n(),B(()=>n()("crossword.copied")))]),Ce(me,Le)},zi=me=>{var Le=er();Ve(Tt=>F(Le,Tt),[()=>(n(),B(()=>n()("crossword.copy")))]),Ce(me,Le)};Ue(()=>hn(Pn,me=>{I(d)?me(Qn):me(zi,-1)}),"if",xt,110,10)}G(xn),G(Xn),G(Je),G($),Ve((me,Le)=>{F(be,me),F(Zn,Le),Rc(wt,s())},[()=>(n(),B(()=>n()("crossword.shareTitle"))),()=>(n(),B(()=>n()("crossword.shareSubtitle")))]),le("click",Mt,h),le("click",wt,function(Le){return Le.target.select()}),le("click",xn,f),le("click",Je,jc(function(me){Dc.call(this,t,me)})),le("click",$,h),Ce(J,$)};Ue(()=>hn(fe,J=>{I(g)&&J(yt)}),"if",xt,88,0)}Ve((J,$,Je,Mt,gt)=>{F(D,J),F(M,$),F(pe,Je),F(E,Mt),F(Ge,` ${gt??""}`)},[()=>(Lt(c()),n(),B(()=>c()||n()("crossword.congratulations"))),()=>(Lt(a()),n(),B(()=>a()||n()("crossword.solvedMessage"))),()=>(n(),B(()=>n()("crossword.yourTime"))),()=>(Lt(r()),B(()=>u(r()))),()=>(n(),B(()=>n()("crossword.share")))]),le("click",Ie,b),Ce(e,Z);var et=jn(C);return l(),et}Fi(xt,{elapsedTime:{},shareUrl:{},titleText:{},messageText:{}},[],[],{mode:"open"}),U[te]="src/lib/WordSearchGame.svelte";var Qc=qe(Qe('<div class="loading-state svelte-len5il"><div class="spinner svelte-len5il"></div> <p class="svelte-len5il"> </p></div>'),U[te],[[360,4,[[361,6],[362,6]]]]),qc=qe(Qe('<div class="error-state svelte-len5il"><p class="svelte-len5il"> </p></div>'),U[te],[[365,4,[[366,6]]]]),ea=qe(Qe('<li><span class="clue-num svelte-len5il"> </span> <span class="clue-text svelte-len5il"> </span></li>'),U[te],[[376,14,[[381,16],[384,16]]]]),ta=qe(Qe('<div role="gridcell"><span class="cell-letter svelte-len5il"> </span></div>'),U[te],[[440,18,[[449,20]]]]),na=qe(Qe('<!> <div class="restart-row svelte-len5il"><button class="restart-btn svelte-len5il" tabindex="0"><span class="material-symbols-outlined svelte-len5il" style="font-size: 16px">replay</span> </button></div>',1),U[te],[[469,10,[[470,12,[[476,14]]]]]]),ia=qe(Qe('<div class="history-nav svelte-len5il"><button class="history-btn svelte-len5il" aria-label="Older puzzle" tabindex="0"> </button> <span class="history-count svelte-len5il"> </span> <button class="history-btn svelte-len5il" aria-label="Newer puzzle" tabindex="0"> </button></div>'),U[te],[[485,10,[[486,12],[495,12],[498,12]]]]),la=qe(Qe('<div class="game-layout svelte-len5il"><div class="clues-section svelte-len5il"><div class="clue-box svelte-len5il"><h4 class="svelte-len5il"> </h4> <ul class="svelte-len5il"></ul></div></div> <div class="grid-section svelte-len5il"><div class="clue-banner svelte-len5il"><div class="clue-banner-content svelte-len5il"><span class="clue-banner-text font-serif svelte-len5il"> </span> <div class="content-meta svelte-len5il"><div class="meta-item svelte-len5il"><span class="material-symbols-outlined meta-icon svelte-len5il">timer</span> <span class="svelte-len5il"> </span></div> <div class="meta-item svelte-len5il"><span class="meta-label svelte-len5il"> </span> <span class="meta-count svelte-len5il"> </span></div></div></div></div> <div class="grid-area svelte-len5il"><div class="grid-wrapper svelte-len5il" role="grid" aria-label="Word search grid" tabindex="0"><div class="grid svelte-len5il"></div></div></div> <!> <!></div></div>'),U[te],[[369,4,[[371,6,[[372,8,[[373,10],[374,10]]]]],[392,6,[[394,8,[[395,10,[[396,12],[397,12,[[398,14,[[399,16],[402,16]]],[404,14,[[405,16],[408,16]]]]]]]]],[417,8,[[418,10,[[431,12]]]]]]]]]]),ra=qe(Qe('<div role="application" aria-label="Word Search Game"><!></div>'),U[te],[[352,0]]);const sa={hash:"svelte-len5il",code:`
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

/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29yZFNlYXJjaEdhbWUuc3ZlbHRlIiwic291cmNlcyI6WyJXb3JkU2VhcmNoR2FtZS5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPHNjcmlwdD5cbiAgaW1wb3J0IFwiLi4vYXBwLmNzc1wiXG4gIGltcG9ydCB7IG9uTW91bnQgfSBmcm9tIFwic3ZlbHRlXCJcbiAgaW1wb3J0IHsgbG9jYWxlLCB0IH0gZnJvbSBcIi4uLy4uLy4uL3NoYXJlZC9nYW1lLWxpYi9pMThuL2luZGV4LmpzXCJcbiAgaW1wb3J0IHsgYXBwbHlCcmFuZGluZ0Zyb21EYXRhIH0gZnJvbSBcIi4uLy4uLy4uL3NoYXJlZC9nYW1lLWxpYi9icmFuZGluZy5qc1wiXG4gIGltcG9ydCBDZWxlYnJhdGlvbk92ZXJsYXkgZnJvbSBcIi4vY3Jvc3N3b3JkL0NlbGVicmF0aW9uT3ZlcmxheS5zdmVsdGVcIlxuXG4gIGV4cG9ydCBsZXQgcHV6emxlSWQgPSBcIlwiXG4gIGV4cG9ydCBsZXQgdXNlcklkID0gXCJcIlxuICBleHBvcnQgbGV0IHRoZW1lID0gXCJsaWdodFwiXG4gIGV4cG9ydCBsZXQgYXBpVXJsID0gXCJcIlxuICBleHBvcnQgbGV0IHRva2VuID0gXCJcIlxuICBleHBvcnQgbGV0IGNsaWVudCA9IFwiXCJcbiAgZXhwb3J0IGxldCBsYW5nID0gXCJsdFwiXG5cbiAgJDogbG9jYWxlLnNldChsYW5nKVxuXG4gIGxldCBjb250YWluZXJFbFxuXG4gIGxldCBncmlkID0gW11cbiAgbGV0IGdyaWRTaXplID0gMFxuICBsZXQgd29yZHMgPSBbXVxuICBsZXQgdGl0bGUgPSBcIlwiXG4gIGxldCBkaWZmaWN1bHR5ID0gXCJcIlxuICBsZXQgbG9hZGluZyA9IHRydWVcbiAgbGV0IGVycm9yID0gXCJcIlxuICBsZXQgYnJhbmRpbmcgPSBudWxsXG5cbiAgLy8gR2FtZSBzdGF0ZVxuICBsZXQgZm91bmRXb3JkcyA9IG5ldyBTZXQoKVxuICBsZXQgc2VsZWN0aW5nID0gZmFsc2VcbiAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gbnVsbFxuICBsZXQgc2VsZWN0aW9uRW5kID0gbnVsbFxuICBsZXQgc2VsZWN0aW9uQ2VsbHMgPSBbXVxuICBsZXQgZm91bmRIaWdobGlnaHRzID0gW10gLy8gQXJyYXkgb2YgeyBjZWxscyB9XG4gIGxldCB0aW1lciA9IDBcbiAgbGV0IHRpbWVySW50ZXJ2YWwgPSBudWxsXG4gIGxldCBnYW1lQ29tcGxldGUgPSBmYWxzZVxuICBsZXQgc2hhcmVVcmwgPSBcIlwiXG5cbiAgLy8gTGF0ZXN0L2hpc3RvcnkgbW9kZSDigJQgc3VwcG9ydHMgYm90aCBwdXp6bGUtaWQ9XCJsYXRlc3RcIiBhbmQgZW1wdHkgcHV6emxlSWQgd2l0aCB1c2VySWRcbiAgbGV0IGxhdGVzdE1vZGUgPSBwdXp6bGVJZCA9PT0gXCJsYXRlc3RcIiB8fCAoIXB1enpsZUlkICYmICEhdXNlcklkKVxuICBsZXQgaGlzdG9yeU9mZnNldCA9IDBcbiAgbGV0IGhpc3RvcnlNZXRhID0gbnVsbCAvLyB7IGN1cnJlbnQsIHRvdGFsLCBoYXNOZXdlciwgaGFzT2xkZXIgfVxuXG4gIC8vIFRvdWNoIHN1cHBvcnRcbiAgbGV0IHRvdWNoU3RhcnRDZWxsID0gbnVsbFxuXG4gICQ6IGNlbGxTaXplID0gZ3JpZFNpemUgPD0gMTAgPyA0MCA6IGdyaWRTaXplIDw9IDE0ID8gMzQgOiAyOFxuICAkOiBmb250U2l6ZSA9IGdyaWRTaXplIDw9IDEwID8gXCIyNHB4XCIgOiBncmlkU2l6ZSA8PSAxNCA/IFwiMjBweFwiIDogXCIxNnB4XCJcbiAgJDogZ3JpZFN0eWxlID0gYC0tZ3JpZC1jb2xzOiAke2dyaWRTaXplfTsgLS1jZWxsLXNpemU6ICR7Y2VsbFNpemV9cHg7IC0tY2VsbC1mb250OiAke2ZvbnRTaXplfTtgXG4gICQ6IHRvdGFsV29yZHMgPSB3b3Jkcy5sZW5ndGhcbiAgJDogZm91bmRDb3VudCA9IGZvdW5kV29yZHMuc2l6ZVxuXG4gIC8vIFJlYWN0aXZlIGhpZ2hsaWdodCBtYXAg4oCUIHJlYnVpbGRzIHdoZW5ldmVyIGZvdW5kSGlnaGxpZ2h0cyBjaGFuZ2VzXG4gICQ6IGNlbGxIaWdobGlnaHRNYXAgPSAoKCkgPT4ge1xuICAgIGNvbnN0IG1hcCA9IHt9XG4gICAgZm9yIChjb25zdCBoaWdobGlnaHQgb2YgZm91bmRIaWdobGlnaHRzKSB7XG4gICAgICBmb3IgKGNvbnN0IGMgb2YgaGlnaGxpZ2h0LmNlbGxzKSB7XG4gICAgICAgIG1hcFtgJHtjLnJvd30sJHtjLmNvbH1gXSA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcFxuICB9KSgpXG5cbiAgLy8gUmVhY3RpdmUgc2VsZWN0aW9uIHNldCDigJQgcmVidWlsZHMgd2hlbmV2ZXIgc2VsZWN0aW9uQ2VsbHMgY2hhbmdlc1xuICAkOiBjZWxsU2VsZWN0aW9uU2V0ID0gbmV3IFNldChzZWxlY3Rpb25DZWxscy5tYXAoKGMpID0+IGAke2Mucm93fSwke2MuY29sfWApKVxuXG4gIG9uTW91bnQoKCkgPT4ge1xuICAgIC8vIExvYWQgU291cmNlIFNhbnMgUHJvIGZvciBMUlQgZGVzaWduXG4gICAgaWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWYqPVwiU291cmNlK1NhbnMrUHJvXCJdJykpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKVxuICAgICAgbGluay5yZWwgPSBcInN0eWxlc2hlZXRcIlxuICAgICAgbGluay5ocmVmID1cbiAgICAgICAgXCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVNvdXJjZStTYW5zK1Bybzp3Z2h0QDQwMDs2MDA7NzAwJmRpc3BsYXk9c3dhcFwiXG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmspXG4gICAgfVxuXG4gICAgaWYgKGxhdGVzdE1vZGUpIHtcbiAgICAgIGZldGNoTGF0ZXN0KClcbiAgICB9IGVsc2UgaWYgKHB1enpsZUlkKSB7XG4gICAgICBmZXRjaEdhbWUoKVxuICAgIH1cbiAgfSlcblxuICBhc3luYyBmdW5jdGlvbiBmZXRjaEdhbWUoKSB7XG4gICAgbG9hZGluZyA9IHRydWVcbiAgICBlcnJvciA9IFwiXCJcbiAgICB0cnkge1xuICAgICAgY29uc3QgYmFzZSA9IGFwaVVybCB8fCB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gICAgICBjb25zdCB1cmwgPSBgJHtiYXNlfS9hcGkvcHVibGljL2dhbWVzP3R5cGU9d29yZHNlYXJjaGVzJmlkPSR7cHV6emxlSWR9YFxuICAgICAgY29uc3QgaGVhZGVycyA9IHt9XG4gICAgICBpZiAodG9rZW4pIGhlYWRlcnNbXCJBdXRob3JpemF0aW9uXCJdID0gYEJlYXJlciAke3Rva2VufWBcblxuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsLCB7IGhlYWRlcnMgfSlcbiAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gbG9hZCBnYW1lXCIpXG5cbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpXG4gICAgICBjb25zdCBkYXRhID0ganNvbi5kYXRhIHx8IGpzb25cblxuICAgICAgZ3JpZCA9IGRhdGEuZ3JpZCB8fCBbXVxuICAgICAgZ3JpZFNpemUgPSBkYXRhLmdyaWRfc2l6ZSB8fCBncmlkLmxlbmd0aFxuICAgICAgdGl0bGUgPSBkYXRhLnRpdGxlIHx8IFwiXCJcbiAgICAgIGRpZmZpY3VsdHkgPSBkYXRhLmRpZmZpY3VsdHkgfHwgXCJcIlxuICAgICAgYnJhbmRpbmcgPSBkYXRhLmJyYW5kaW5nIHx8IG51bGxcblxuICAgICAgLy8gV29yZHMgY29tZSB3aXRob3V0IHBsYWNlbWVudCBwb3NpdGlvbnMgKGFudGktY2hlYXQpXG4gICAgICB3b3JkcyA9IChkYXRhLndvcmRzIHx8IFtdKS5tYXAoKHcpID0+ICh7XG4gICAgICAgIHdvcmQ6IHcud29yZD8udG9VcHBlckNhc2UoKSB8fCBcIlwiLFxuICAgICAgICBoaW50OiB3LmhpbnQgfHwgXCJcIixcbiAgICAgIH0pKVxuXG4gICAgICBhcHBseUJyYW5kaW5nRnJvbURhdGEoY29udGFpbmVyRWwsIGJyYW5kaW5nKVxuICAgICAgc3RhcnRUaW1lcigpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBlcnJvciA9IGVyci5tZXNzYWdlIHx8IFwiRmFpbGVkIHRvIGxvYWQgZ2FtZVwiXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGxvYWRpbmcgPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGZldGNoTGF0ZXN0KG9mZnNldCA9IDApIHtcbiAgICBsb2FkaW5nID0gdHJ1ZVxuICAgIGVycm9yID0gXCJcIlxuICAgIHRyeSB7XG4gICAgICBjb25zdCBiYXNlID0gYXBpVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW5cbiAgICAgIGNvbnN0IHVybCA9IGAke2Jhc2V9L2FwaS9wdWJsaWMvZ2FtZXMvbGF0ZXN0P3R5cGU9d29yZHNlYXJjaGVzJm9yZz0ke3VzZXJJZH0mb2Zmc2V0PSR7b2Zmc2V0fWBcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fVxuICAgICAgaWYgKHRva2VuKSBoZWFkZXJzW1wiQXV0aG9yaXphdGlvblwiXSA9IGBCZWFyZXIgJHt0b2tlbn1gXG5cbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHVybCwgeyBoZWFkZXJzIH0pXG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKFwiTm8gcHVibGlzaGVkIGdhbWVzIGZvdW5kXCIpXG5cbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpXG4gICAgICBjb25zdCBkYXRhID0ganNvbi5kYXRhIHx8IGpzb25cbiAgICAgIGhpc3RvcnlNZXRhID0ganNvbi5tZXRhIHx8IG51bGxcbiAgICAgIGhpc3RvcnlPZmZzZXQgPSBvZmZzZXRcblxuICAgICAgZ3JpZCA9IGRhdGEuZ3JpZCB8fCBbXVxuICAgICAgZ3JpZFNpemUgPSBkYXRhLmdyaWRfc2l6ZSB8fCBncmlkLmxlbmd0aFxuICAgICAgdGl0bGUgPSBkYXRhLnRpdGxlIHx8IFwiXCJcbiAgICAgIGRpZmZpY3VsdHkgPSBkYXRhLmRpZmZpY3VsdHkgfHwgXCJcIlxuICAgICAgYnJhbmRpbmcgPSBkYXRhLmJyYW5kaW5nIHx8IG51bGxcblxuICAgICAgd29yZHMgPSAoZGF0YS53b3JkcyB8fCBbXSkubWFwKCh3KSA9PiAoe1xuICAgICAgICB3b3JkOiB3LndvcmQ/LnRvVXBwZXJDYXNlKCkgfHwgXCJcIixcbiAgICAgICAgaGludDogdy5oaW50IHx8IFwiXCIsXG4gICAgICB9KSlcblxuICAgICAgLy8gUmVzZXQgZ2FtZSBzdGF0ZSBmb3IgbmV3IHB1enpsZVxuICAgICAgZm91bmRXb3JkcyA9IG5ldyBTZXQoKVxuICAgICAgZm91bmRIaWdobGlnaHRzID0gW11cbiAgICAgIHNlbGVjdGlvbkNlbGxzID0gW11cbiAgICAgIHNlbGVjdGlvblN0YXJ0ID0gbnVsbFxuICAgICAgc2VsZWN0aW9uRW5kID0gbnVsbFxuICAgICAgZ2FtZUNvbXBsZXRlID0gZmFsc2VcbiAgICAgIHNlbGVjdGluZyA9IGZhbHNlXG4gICAgICBzaGFyZVVybCA9IFwiXCJcblxuICAgICAgYXBwbHlCcmFuZGluZ0Zyb21EYXRhKGNvbnRhaW5lckVsLCBicmFuZGluZylcbiAgICAgIHN0YXJ0VGltZXIoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZXJyb3IgPSBlcnIubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBsb2FkIGdhbWVcIlxuICAgIH0gZmluYWxseSB7XG4gICAgICBsb2FkaW5nID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb25zdCBuYXZpZ2F0ZUhpc3RvcnkgPSAoZGlyZWN0aW9uKSA9PiB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJvbGRlclwiICYmIGhpc3RvcnlNZXRhPy5oYXNPbGRlcikge1xuICAgICAgZmV0Y2hMYXRlc3QoaGlzdG9yeU9mZnNldCArIDEpXG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwibmV3ZXJcIiAmJiBoaXN0b3J5TWV0YT8uaGFzTmV3ZXIpIHtcbiAgICAgIGZldGNoTGF0ZXN0KGhpc3RvcnlPZmZzZXQgLSAxKVxuICAgIH1cbiAgfVxuXG5cblxuICBmdW5jdGlvbiBzdGFydFRpbWVyKCkge1xuICAgIGlmICh0aW1lckludGVydmFsKSBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWwpXG4gICAgdGltZXIgPSAwXG4gICAgdGltZXJJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGlmICghZ2FtZUNvbXBsZXRlKSB0aW1lcisrXG4gICAgfSwgMTAwMClcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFRpbWUoc2Vjb25kcykge1xuICAgIGNvbnN0IG0gPSBTdHJpbmcoTWF0aC5mbG9vcihzZWNvbmRzIC8gNjApKS5wYWRTdGFydCgyLCBcIjBcIilcbiAgICBjb25zdCBzID0gU3RyaW5nKHNlY29uZHMgJSA2MCkucGFkU3RhcnQoMiwgXCIwXCIpXG4gICAgcmV0dXJuIGAke219OiR7c31gXG4gIH1cblxuICAvLyDilIDilIDilIAgU2VsZWN0aW9uIExvZ2ljIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gIGZ1bmN0aW9uIGdldENlbGxGcm9tRXZlbnQoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoXCJbZGF0YS1yb3ddW2RhdGEtY29sXVwiKVxuICAgIGlmICghdGFyZ2V0KSByZXR1cm4gbnVsbFxuICAgIHJldHVybiB7XG4gICAgICByb3c6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LnJvdyksXG4gICAgICBjb2w6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LmNvbCksXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY29tcHV0ZVNlbGVjdGlvbkNlbGxzKHN0YXJ0LCBlbmQpIHtcbiAgICBpZiAoIXN0YXJ0IHx8ICFlbmQpIHJldHVybiBbXVxuXG4gICAgY29uc3QgZHIgPSBNYXRoLnNpZ24oZW5kLnJvdyAtIHN0YXJ0LnJvdylcbiAgICBjb25zdCBkYyA9IE1hdGguc2lnbihlbmQuY29sIC0gc3RhcnQuY29sKVxuICAgIGNvbnN0IHJvd0Rpc3QgPSBNYXRoLmFicyhlbmQucm93IC0gc3RhcnQucm93KVxuICAgIGNvbnN0IGNvbERpc3QgPSBNYXRoLmFicyhlbmQuY29sIC0gc3RhcnQuY29sKVxuXG4gICAgLy8gTXVzdCBiZSBpbiBhIHN0cmFpZ2h0IGxpbmUgKGhvcml6b250YWwsIHZlcnRpY2FsLCBvciBkaWFnb25hbClcbiAgICBpZiAocm93RGlzdCAhPT0gY29sRGlzdCAmJiByb3dEaXN0ICE9PSAwICYmIGNvbERpc3QgIT09IDApIHJldHVybiBbXVxuXG4gICAgY29uc3Qgc3RlcHMgPSBNYXRoLm1heChyb3dEaXN0LCBjb2xEaXN0KVxuICAgIGNvbnN0IGNlbGxzID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgICBjZWxscy5wdXNoKHsgcm93OiBzdGFydC5yb3cgKyBkciAqIGksIGNvbDogc3RhcnQuY29sICsgZGMgKiBpIH0pXG4gICAgfVxuICAgIHJldHVybiBjZWxsc1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2VsZWN0ZWRXb3JkKGNlbGxzKSB7XG4gICAgcmV0dXJuIGNlbGxzLm1hcCgoYykgPT4gZ3JpZFtjLnJvd10/LltjLmNvbF0gfHwgXCJcIikuam9pbihcIlwiKVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlckRvd24oZSkge1xuICAgIGNvbnN0IGNlbGwgPSBnZXRDZWxsRnJvbUV2ZW50KGUpXG4gICAgaWYgKCFjZWxsIHx8IGdhbWVDb21wbGV0ZSkgcmV0dXJuXG4gICAgc2VsZWN0aW5nID0gdHJ1ZVxuICAgIHNlbGVjdGlvblN0YXJ0ID0gY2VsbFxuICAgIHNlbGVjdGlvbkVuZCA9IGNlbGxcbiAgICBzZWxlY3Rpb25DZWxscyA9IFtjZWxsXVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlck1vdmUoZSkge1xuICAgIGlmICghc2VsZWN0aW5nIHx8IGdhbWVDb21wbGV0ZSkgcmV0dXJuXG4gICAgY29uc3QgY2VsbCA9IGdldENlbGxGcm9tRXZlbnQoZSlcbiAgICBpZiAoIWNlbGwpIHJldHVyblxuICAgIHNlbGVjdGlvbkVuZCA9IGNlbGxcbiAgICBzZWxlY3Rpb25DZWxscyA9IGNvbXB1dGVTZWxlY3Rpb25DZWxscyhzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlUG9pbnRlclVwKCkge1xuICAgIGlmICghc2VsZWN0aW5nIHx8IGdhbWVDb21wbGV0ZSkgcmV0dXJuXG4gICAgc2VsZWN0aW5nID0gZmFsc2VcblxuICAgIGlmIChzZWxlY3Rpb25DZWxscy5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZFdvcmQgPSBnZXRTZWxlY3RlZFdvcmQoc2VsZWN0aW9uQ2VsbHMpXG4gICAgICBjb25zdCByZXZlcnNlZFdvcmQgPSBzZWxlY3RlZFdvcmQuc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIilcblxuICAgICAgLy8gQ2hlY2sgaWYgc2VsZWN0ZWQgd29yZCBtYXRjaGVzIGFueSB1bmZvdW5kIHdvcmRcbiAgICAgIGNvbnN0IG1hdGNoID0gd29yZHMuZmluZChcbiAgICAgICAgKHcpID0+XG4gICAgICAgICAgIWZvdW5kV29yZHMuaGFzKHcud29yZCkgJiZcbiAgICAgICAgICAody53b3JkID09PSBzZWxlY3RlZFdvcmQgfHwgdy53b3JkID09PSByZXZlcnNlZFdvcmQpLFxuICAgICAgKVxuXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgZm91bmRXb3JkcyA9IG5ldyBTZXQoWy4uLmZvdW5kV29yZHMsIG1hdGNoLndvcmRdKVxuICAgICAgICBmb3VuZEhpZ2hsaWdodHMgPSBbXG4gICAgICAgICAgLi4uZm91bmRIaWdobGlnaHRzLFxuICAgICAgICAgIHsgY2VsbHM6IFsuLi5zZWxlY3Rpb25DZWxsc10gfSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIENoZWNrIGNvbXBsZXRpb25cbiAgICAgICAgaWYgKGZvdW5kV29yZHMuc2l6ZSA9PT0gd29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgZ2FtZUNvbXBsZXRlID0gdHJ1ZVxuICAgICAgICAgIGlmICh0aW1lckludGVydmFsKSBjbGVhckludGVydmFsKHRpbWVySW50ZXJ2YWwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWxlY3Rpb25DZWxscyA9IFtdXG4gICAgc2VsZWN0aW9uU3RhcnQgPSBudWxsXG4gICAgc2VsZWN0aW9uRW5kID0gbnVsbFxuICB9XG5cbiAgLy8gVG91Y2ggZXZlbnQgaGFuZGxlcnNcbiAgZnVuY3Rpb24gaGFuZGxlVG91Y2hTdGFydChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgY29uc3QgdG91Y2ggPSBlLnRvdWNoZXNbMF1cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQodG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSlcbiAgICBpZiAoIWVsKSByZXR1cm5cbiAgICBjb25zdCB0YXJnZXQgPSBlbC5jbG9zZXN0KFwiW2RhdGEtcm93XVtkYXRhLWNvbF1cIilcbiAgICBpZiAoIXRhcmdldCB8fCBnYW1lQ29tcGxldGUpIHJldHVyblxuICAgIHNlbGVjdGluZyA9IHRydWVcbiAgICBzZWxlY3Rpb25TdGFydCA9IHtcbiAgICAgIHJvdzogcGFyc2VJbnQodGFyZ2V0LmRhdGFzZXQucm93KSxcbiAgICAgIGNvbDogcGFyc2VJbnQodGFyZ2V0LmRhdGFzZXQuY29sKSxcbiAgICB9XG4gICAgc2VsZWN0aW9uRW5kID0gc2VsZWN0aW9uU3RhcnRcbiAgICBzZWxlY3Rpb25DZWxscyA9IFtzZWxlY3Rpb25TdGFydF1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVRvdWNoTW92ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgKCFzZWxlY3RpbmcgfHwgZ2FtZUNvbXBsZXRlKSByZXR1cm5cbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXVxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKVxuICAgIGlmICghZWwpIHJldHVyblxuICAgIGNvbnN0IHRhcmdldCA9IGVsLmNsb3Nlc3QoXCJbZGF0YS1yb3ddW2RhdGEtY29sXVwiKVxuICAgIGlmICghdGFyZ2V0KSByZXR1cm5cbiAgICBzZWxlY3Rpb25FbmQgPSB7XG4gICAgICByb3c6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LnJvdyksXG4gICAgICBjb2w6IHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LmNvbCksXG4gICAgfVxuICAgIHNlbGVjdGlvbkNlbGxzID0gY29tcHV0ZVNlbGVjdGlvbkNlbGxzKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpXG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVUb3VjaEVuZChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaGFuZGxlUG9pbnRlclVwKClcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlc3RhcnQoKSB7XG4gICAgZm91bmRXb3JkcyA9IG5ldyBTZXQoKVxuICAgIGZvdW5kSGlnaGxpZ2h0cyA9IFtdXG4gICAgc2VsZWN0aW9uQ2VsbHMgPSBbXVxuICAgIHNlbGVjdGlvblN0YXJ0ID0gbnVsbFxuICAgIHNlbGVjdGlvbkVuZCA9IG51bGxcbiAgICBnYW1lQ29tcGxldGUgPSBmYWxzZVxuICAgIHNlbGVjdGluZyA9IGZhbHNlXG4gICAgc2hhcmVVcmwgPSBcIlwiXG4gICAgc3RhcnRUaW1lcigpXG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVNoYXJlVXJsKCkge1xuICAgIGNvbnN0IG1pbnMgPSBTdHJpbmcoTWF0aC5mbG9vcih0aW1lciAvIDYwKSkucGFkU3RhcnQoMiwgXCIwXCIpXG4gICAgY29uc3Qgc2VjcyA9IFN0cmluZyh0aW1lciAlIDYwKS5wYWRTdGFydCgyLCBcIjBcIilcbiAgICBjb25zdCB0aW1lU3RyID0gYCR7bWluc306JHtzZWNzfWBcblxuICAgIGNvbnN0IHJlZGlyZWN0VXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgICByZWRpcmVjdFVybC5zZWFyY2hQYXJhbXMuZGVsZXRlKFwicmVzdWx0XCIpXG5cbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgdDogdGltZXIsXG4gICAgICByOiByZWRpcmVjdFVybC50b1N0cmluZygpLFxuICAgICAgdGl0bGU6IGAke3RpdGxlfSDigJQgV29yZCBTZWFyY2hgLFxuICAgICAgZGVzYzogYFNvbHZlZCBpbiAke3RpbWVTdHJ9ISBDYW4geW91IGJlYXQgbXkgdGltZT9gLFxuICAgIH1cblxuICAgIGNvbnN0IHNoYXJlRGF0YSA9IGJ0b2EoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKSlcbiAgICBjb25zdCBiYXNlID0gYXBpVXJsIHx8IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW5cbiAgICBjb25zdCBzaGFyZVBhZ2VVcmwgPSBuZXcgVVJMKFwiL3NoYXJlXCIsIGJhc2UpXG4gICAgc2hhcmVQYWdlVXJsLnNlYXJjaFBhcmFtcy5zZXQoXCJkYXRhXCIsIHNoYXJlRGF0YSlcbiAgICBzaGFyZVVybCA9IHNoYXJlUGFnZVVybC50b1N0cmluZygpXG4gIH1cblxuPC9zY3JpcHQ+XG5cbjxkaXZcbiAgY2xhc3M9XCJ3b3JkLXNlYXJjaC1jb250YWluZXJcIlxuICBjbGFzczpkYXJrPXt0aGVtZSA9PT0gXCJkYXJrXCJ9XG4gIHJvbGU9XCJhcHBsaWNhdGlvblwiXG4gIGFyaWEtbGFiZWw9XCJXb3JkIFNlYXJjaCBHYW1lXCJcbiAgYmluZDp0aGlzPXtjb250YWluZXJFbH1cbj5cbiAgeyNpZiBsb2FkaW5nfVxuICAgIDxkaXYgY2xhc3M9XCJsb2FkaW5nLXN0YXRlXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPjwvZGl2PlxuICAgICAgPHA+eyR0KFwid29yZHNlYXJjaC5sb2FkaW5nXCIpfTwvcD5cbiAgICA8L2Rpdj5cbiAgezplbHNlIGlmIGVycm9yfVxuICAgIDxkaXYgY2xhc3M9XCJlcnJvci1zdGF0ZVwiPlxuICAgICAgPHA+4pqg77iPIHtlcnJvcn08L3A+XG4gICAgPC9kaXY+XG4gIHs6ZWxzZX1cbiAgICA8ZGl2IGNsYXNzPVwiZ2FtZS1sYXlvdXRcIj5cbiAgICAgIDwhLS0gU2lkZWJhcjogV29yZCBMaXN0IChyZXVzZXMgY3Jvc3N3b3JkIENsdWVzU2lkZWJhciBwYXR0ZXJuKSAtLT5cbiAgICAgIDxkaXYgY2xhc3M9XCJjbHVlcy1zZWN0aW9uXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHVlLWJveFwiPlxuICAgICAgICAgIDxoND57JHQoXCJ3b3Jkc2VhcmNoLndvcmRzVG9GaW5kXCIpfTwvaDQ+XG4gICAgICAgICAgPHVsPlxuICAgICAgICAgICAgeyNlYWNoIHdvcmRzIGFzIHcsIGl9XG4gICAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICAgIGNsYXNzPVwiY2x1ZS1pdGVtXCJcbiAgICAgICAgICAgICAgICBjbGFzczpzb2x2ZWQ9e2ZvdW5kV29yZHMuaGFzKHcud29yZCl9XG4gICAgICAgICAgICAgICAgdGl0bGU9e3cuaGludCB8fCBcIlwifVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHVlLW51bVwiXG4gICAgICAgICAgICAgICAgICA+e1N0cmluZyhpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfS48L3NwYW5cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHVlLXRleHRcIj57dy53b3JkfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8IS0tIE1haW4gQ29udGVudDogR3JpZCBTZWN0aW9uIChyZXVzZXMgY3Jvc3N3b3JkIGdyaWQtc2VjdGlvbiBwYXR0ZXJuKSAtLT5cbiAgICAgIDxkaXYgY2xhc3M9XCJncmlkLXNlY3Rpb25cIj5cbiAgICAgICAgPCEtLSBIZWFkZXIgYmFubmVyIChyZXVzZXMgY3Jvc3N3b3JkIENsdWVCYW5uZXIgcGF0dGVybikgLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbHVlLWJhbm5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjbHVlLWJhbm5lci1jb250ZW50XCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsdWUtYmFubmVyLXRleHQgZm9udC1zZXJpZlwiPnt0aXRsZX08L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudC1tZXRhXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXRhLWl0ZW1cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQgbWV0YS1pY29uXCJcbiAgICAgICAgICAgICAgICAgID50aW1lcjwvc3BhblxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3Bhbj57Zm9ybWF0VGltZSh0aW1lcil9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1ldGEtaXRlbVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWV0YS1sYWJlbFwiXG4gICAgICAgICAgICAgICAgICA+eyR0KFwid29yZHNlYXJjaC5mb3VuZFwiKX06PC9zcGFuXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWV0YS1jb3VudFwiXG4gICAgICAgICAgICAgICAgICA+e2ZvdW5kQ291bnR9IC8ge3RvdGFsV29yZHN9PC9zcGFuXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8IS0tIEdyaWQgYXJlYSAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImdyaWQtYXJlYVwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiZ3JpZC13cmFwcGVyXCJcbiAgICAgICAgICAgIG9uOm1vdXNlZG93bj17aGFuZGxlUG9pbnRlckRvd259XG4gICAgICAgICAgICBvbjptb3VzZW1vdmU9e2hhbmRsZVBvaW50ZXJNb3ZlfVxuICAgICAgICAgICAgb246bW91c2V1cD17aGFuZGxlUG9pbnRlclVwfVxuICAgICAgICAgICAgb246bW91c2VsZWF2ZT17aGFuZGxlUG9pbnRlclVwfVxuICAgICAgICAgICAgb246dG91Y2hzdGFydD17aGFuZGxlVG91Y2hTdGFydH1cbiAgICAgICAgICAgIG9uOnRvdWNobW92ZT17aGFuZGxlVG91Y2hNb3ZlfVxuICAgICAgICAgICAgb246dG91Y2hlbmQ9e2hhbmRsZVRvdWNoRW5kfVxuICAgICAgICAgICAgcm9sZT1cImdyaWRcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIldvcmQgc2VhcmNoIGdyaWRcIlxuICAgICAgICAgICAgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzPVwiZ3JpZFwiXG4gICAgICAgICAgICAgIHN0eWxlPXtncmlkU3R5bGV9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHsjZWFjaCBncmlkIGFzIHJvdywgcm93SWR4fVxuICAgICAgICAgICAgICAgIHsjZWFjaCByb3cgYXMgbGV0dGVyLCBjb2xJZHh9XG4gICAgICAgICAgICAgICAgICB7QGNvbnN0IGNlbGxLZXkgPSBgJHtyb3dJZHh9LCR7Y29sSWR4fWB9XG4gICAgICAgICAgICAgICAgICB7QGNvbnN0IGlzRm91bmQgPSBjZWxsSGlnaGxpZ2h0TWFwW2NlbGxLZXldIHx8IGZhbHNlfVxuICAgICAgICAgICAgICAgICAge0Bjb25zdCBpc1NlbGVjdGluZyA9IGNlbGxTZWxlY3Rpb25TZXQuaGFzKGNlbGxLZXkpfVxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImNlbGxcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzczpzZWxlY3Rpbmc9e2lzU2VsZWN0aW5nfVxuICAgICAgICAgICAgICAgICAgICBjbGFzczpmb3VuZD17aXNGb3VuZH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1yb3c9e3Jvd0lkeH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YS1jb2w9e2NvbElkeH1cbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIkxldHRlciB7bGV0dGVyfVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2VsbC1sZXR0ZXJcIj57bGV0dGVyfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIHsvZWFjaH1cbiAgICAgICAgICAgICAgey9lYWNofVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwhLS0gQ29tcGxldGlvbiBTZWN0aW9uIOKAlCBPVVRTSURFIGdyYXkgem9uZSwgYmVsb3cgZ3JpZCAtLT5cbiAgICAgICAgeyNpZiBnYW1lQ29tcGxldGV9XG4gICAgICAgICAgPENlbGVicmF0aW9uT3ZlcmxheVxuICAgICAgICAgICAgZWxhcHNlZFRpbWU9e3RpbWVyfVxuICAgICAgICAgICAge3NoYXJlVXJsfVxuICAgICAgICAgICAgdGl0bGVUZXh0PXskdChcIndvcmRzZWFyY2guY29uZ3JhdHVsYXRpb25zXCIpfVxuICAgICAgICAgICAgbWVzc2FnZVRleHQ9eyR0KFwid29yZHNlYXJjaC5mb3VuZEFsbFdvcmRzXCIpLnJlcGxhY2UoXG4gICAgICAgICAgICAgIFwiezB9XCIsXG4gICAgICAgICAgICAgIFN0cmluZyh0b3RhbFdvcmRzKSxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICBvbjpzaGFyZT17Z2VuZXJhdGVTaGFyZVVybH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZXN0YXJ0LXJvd1wiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBjbGFzcz1cInJlc3RhcnQtYnRuXCJcbiAgICAgICAgICAgICAgb246Y2xpY2s9e2hhbmRsZVJlc3RhcnR9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9eyR0KFwid29yZHNlYXJjaC5wbGF5QWdhaW5cIil9XG4gICAgICAgICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZFwiIHN0eWxlPVwiZm9udC1zaXplOiAxNnB4XCJcbiAgICAgICAgICAgICAgICA+cmVwbGF5PC9zcGFuXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgeyR0KFwid29yZHNlYXJjaC5wbGF5QWdhaW5cIil9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgey9pZn1cblxuICAgICAgICB7I2lmIGxhdGVzdE1vZGUgJiYgaGlzdG9yeU1ldGF9XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImhpc3RvcnktbmF2XCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzPVwiaGlzdG9yeS1idG5cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWhpc3RvcnlNZXRhLmhhc09sZGVyfVxuICAgICAgICAgICAgICBvbjpjbGljaz17KCkgPT4gbmF2aWdhdGVIaXN0b3J5KFwib2xkZXJcIil9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPbGRlciBwdXp6bGVcIlxuICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICDihpAgeyR0KFwid29yZHNlYXJjaC5vbGRlclwiKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJoaXN0b3J5LWNvdW50XCI+XG4gICAgICAgICAgICAgIHtoaXN0b3J5TWV0YS5jdXJyZW50ICsgMX0gLyB7aGlzdG9yeU1ldGEudG90YWx9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzPVwiaGlzdG9yeS1idG5cIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWhpc3RvcnlNZXRhLmhhc05ld2VyfVxuICAgICAgICAgICAgICBvbjpjbGljaz17KCkgPT4gbmF2aWdhdGVIaXN0b3J5KFwibmV3ZXJcIil9XG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJOZXdlciBwdXp6bGVcIlxuICAgICAgICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7JHQoXCJ3b3Jkc2VhcmNoLm5ld2VyXCIpfSDihpJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB7L2lmfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIHsvaWZ9XG48L2Rpdj5cblxuPHN0eWxlPlxuICAqIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIENvbnRhaW5lciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAgKi9cbiAgLndvcmQtc2VhcmNoLWNvbnRhaW5lciB7XG4gICAgLyogVGhlbWUgQ29sb3JzIChtYXRjaGluZyBjcm9zc3dvcmQgbGlnaHQtdGhlbWUpICovXG4gICAgLS1iZy1wcmltYXJ5OiAjZmZmZmZmO1xuICAgIC0tYmctc2Vjb25kYXJ5OiAjZjNmNGY2O1xuICAgIC0tdGV4dC1wcmltYXJ5OiAjMGYxNzJhO1xuICAgIC0tdGV4dC1zZWNvbmRhcnk6ICM2NDc0OGI7XG4gICAgLS1ib3JkZXItY29sb3I6ICNlMmU4ZjA7XG4gICAgLS1jZWxsLWJnOiAjZmZmZmZmO1xuICAgIC0tY2VsbC1ibG9ja2VkOiAjMWExYTFhO1xuICAgIC0tY2VsbC1oaWdobGlnaHRlZDogI2ZjZWNlODtcbiAgICAtLWFjY2VudDogI2MyNWU0MDtcbiAgICAtLWFjY2VudC1ob3ZlcjogI2EwNDkyZDtcbiAgICAtLWFjY2VudC1saWdodDogI2ZjZWNlODtcbiAgICAtLWNvcnJlY3Q6ICMwMDdhM2M7XG4gICAgLS1jb3JyZWN0LWxpZ2h0OiAjZTJmM2VhO1xuICAgIC0tY29ycmVjdC1ob3ZlcjogIzAwNWMyZDtcblxuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgbWF4LXdpZHRoOiAxNDQwcHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmctcHJpbWFyeSk7XG4gICAgY29sb3I6IHZhcigtLXRleHQtcHJpbWFyeSk7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuXG4gIC8qIOKUgOKUgOKUgCBMb2FkaW5nICYgRXJyb3Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovXG4gIC5sb2FkaW5nLXN0YXRlLFxuICAuZXJyb3Itc3RhdGUge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBwYWRkaW5nOiA0OHB4O1xuICB9XG5cbiAgLnNwaW5uZXIge1xuICAgIHdpZHRoOiA0MHB4O1xuICAgIGhlaWdodDogNDBweDtcbiAgICBib3JkZXI6IDRweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci10b3AtY29sb3I6ICM2NDc0OGI7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XG4gICAgbWFyZ2luOiAwIGF1dG8gMTZweDtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgc3BpbiB7XG4gICAgdG8ge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcbiAgICB9XG4gIH1cblxuICAuZXJyb3Itc3RhdGUge1xuICAgIGNvbG9yOiAjZWY0NDQ0O1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIEdhbWUgTGF5b3V0IChtYXRjaGVzIGNyb3Nzd29yZCkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovXG4gIC5nYW1lLWxheW91dCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBnYXA6IDMycHg7XG4gICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gIH1cblxuICAvKiDilIDilIDilIAgU2lkZWJhciAocmV1c2VzIGNyb3Nzd29yZCBDbHVlc1NpZGViYXIgcGF0dGVybikg4pSAICovXG4gIC5jbHVlcy1zZWN0aW9uIHtcbiAgICBmbGV4OiAwIDAgMzUlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDE2cHg7XG4gICAgbWluLXdpZHRoOiAyNjBweDtcbiAgICBtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gODBweCk7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xuICAgIHRvcDogMTZweDtcbiAgfVxuXG4gIC5jbHVlcy1zZWN0aW9uOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDZweDtcbiAgfVxuXG4gIC5jbHVlcy1zZWN0aW9uOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIH1cblxuICAuY2x1ZXMtc2VjdGlvbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJvcmRlci1jb2xvciwgI2UyZThmMCk7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICB9XG5cbiAgLmNsdWUtYm94IHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1wcmltYXJ5LCAjZmZmZmZmKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IsICNlMmU4ZjApO1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgcGFkZGluZzogOHB4O1xuICAgIGJveC1zaGFkb3c6IDAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMDQpO1xuICB9XG5cbiAgLmNsdWUtYm94IGg0IHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICBsaW5lLWhlaWdodDogMTJweDtcbiAgICBsZXR0ZXItc3BhY2luZzogMC4ycHg7XG4gICAgY29sb3I6IHZhcigtLXRleHQtc2Vjb25kYXJ5LCAjNjQ3NDhiKTtcbiAgICBtYXJnaW46IDAgMCA2cHg7XG4gICAgcGFkZGluZy1ib3R0b206IDA7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgfVxuXG4gIC5jbHVlLWJveCB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gIC5jbHVlLWl0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZ2FwOiA4cHg7XG4gICAgcGFkZGluZzogOXB4IDEwcHg7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE1cyBlYXNlO1xuICB9XG5cbiAgLmNsdWUtaXRlbTpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmctc2Vjb25kYXJ5LCAjZjNmNGY2KTtcbiAgfVxuXG4gIC8qIFNvbHZlZCA9IGdyZWVuIGhpZ2hsaWdodCArIHN0cmlrZXRocm91Z2ggKG1hdGNoZXMgY3Jvc3N3b3JkKSAqL1xuICAuY2x1ZS1pdGVtLnNvbHZlZCB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY29ycmVjdC1saWdodCwgI2UyZjNlYSk7XG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5jbHVlLWl0ZW0uc29sdmVkIC5jbHVlLXRleHQge1xuICAgIHRleHQtZGVjb3JhdGlvbjogbGluZS10aHJvdWdoO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSwgIzY0NzQ4Yik7XG4gIH1cblxuICAuY2x1ZS1pdGVtLnNvbHZlZCAuY2x1ZS1udW0ge1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC5jbHVlLW51bSB7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWZvbnQtc2VyaWYpO1xuICAgIGZvbnQtc2l6ZTogMjJweDtcbiAgICBmb250LXdlaWdodDogNDAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxNHB4O1xuICAgIGxldHRlci1zcGFjaW5nOiAwLjNweDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1zZWNvbmRhcnksICM2NDc0OGIpO1xuICAgIG1pbi13aWR0aDogMjhweDtcbiAgICBmbGV4LXNocmluazogMDtcbiAgfVxuXG4gIC5jbHVlLXRleHQge1xuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnksICMwZjE3MmEpO1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIEdyaWQgU2VjdGlvbiAobWF0Y2hlcyBjcm9zc3dvcmQpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL1xuICAuZ3JpZC1zZWN0aW9uIHtcbiAgICBmbGV4OiAxIDEgNjUlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIH1cblxuICAvKiDilIDilIDilIAgQmFubmVyIEhlYWRlciAocmV1c2VzIGNyb3Nzd29yZCBDbHVlQmFubmVyIHBhdHRlcm4pICovXG4gIC5jbHVlLWJhbm5lciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTJweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1jZWxsLWhpZ2hsaWdodGVkKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHggMTJweCAwIDA7XG4gICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgbWluLWhlaWdodDogNTJweDtcbiAgfVxuXG4gIC5jbHVlLWJhbm5lci1jb250ZW50IHtcbiAgICBmbGV4OiAxO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA0cHg7XG4gIH1cblxuICAuY2x1ZS1iYW5uZXItdGV4dCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnkpO1xuICB9XG5cbiAgLmNvbnRlbnQtbWV0YSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTZweDtcbiAgfVxuXG4gIC5tZXRhLWl0ZW0ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDRweDtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDEycHg7XG4gICAgbGluZS1oZWlnaHQ6IDEycHg7XG4gICAgY29sb3I6IHZhcigtLXRleHQtc2Vjb25kYXJ5KTtcbiAgfVxuXG4gIC5tZXRhLWljb24ge1xuICAgIGZvbnQtc2l6ZTogMTZweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgLm1ldGEtbGFiZWwge1xuICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIH1cblxuICAubWV0YS1jb3VudCB7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgfVxuXG4gIC8qIOKUgOKUgOKUgCBIaXN0b3J5IE5hdmlnYXRpb24gKGJvdHRvbSwgbWF0Y2hpbmcgY3Jvc3N3b3JkKSDilIDilIAgKi9cbiAgLmhpc3RvcnktbmF2IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZ2FwOiAxNnB4O1xuICAgIHBhZGRpbmc6IDEycHggMDtcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yKTtcbiAgICBtYXJnaW4tdG9wOiA4cHg7XG4gIH1cblxuICAuaGlzdG9yeS1idG4ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDRweDtcbiAgICBwYWRkaW5nOiA2cHggMTRweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1wcmltYXJ5KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXItY29sb3IpO1xuICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5KTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMTVzIGVhc2U7XG4gIH1cblxuICAuaGlzdG9yeS1idG46aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tYWNjZW50KTtcbiAgICBjb2xvcjogdmFyKC0tYWNjZW50KTtcbiAgfVxuXG4gIC5oaXN0b3J5LWJ0bjpkaXNhYmxlZCB7XG4gICAgb3BhY2l0eTogMC40O1xuICAgIGN1cnNvcjogZGVmYXVsdDtcbiAgfVxuXG4gIC5oaXN0b3J5LWNvdW50IHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXNpemU6IDAuOHJlbTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSk7XG4gIH1cblxuICAvKiDilIDilIDilIAgR3JpZCBBcmVhIChncmF5IHpvbmUpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgCAqL1xuICAuZ3JpZC1hcmVhIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iZy1zZWNvbmRhcnksICNmM2Y0ZjYpO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICBjdXJzb3I6IGNyb3NzaGFpcjtcbiAgICB0b3VjaC1hY3Rpb246IG5vbmU7XG4gIH1cblxuICAuZ3JpZC13cmFwcGVyIHtcbiAgICBjdXJzb3I6IGNyb3NzaGFpcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB9XG5cbiAgLmdyaWQge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQodmFyKC0tZ3JpZC1jb2xzLCAxMCksIG1pbm1heCgwLCB2YXIoLS1jZWxsLXNpemUsIDQwcHgpKSk7XG4gICAgZ2FwOiAxcHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY2VsbC1ibG9ja2VkLCAjMWExYTFhKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBwYWRkaW5nOiAxcHg7XG4gICAgd2lkdGg6IGZpdC1jb250ZW50O1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgfVxuXG4gIC5jZWxsIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tY2VsbC1iZywgI2ZmZmZmZik7XG4gICAgY3Vyc29yOiBjcm9zc2hhaXI7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjFzIGVhc2U7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGFzcGVjdC1yYXRpbzogMTtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgZm9udC1zaXplOiB2YXIoLS1jZWxsLWZvbnQsIDIwcHgpO1xuICB9XG5cbiAgLyogRml4OiBob3ZlciB1c2VzIGEgc3VidGxlIGhpZ2hsaWdodCwgbm90IGJsYWNrICovXG4gIC5jZWxsOmhvdmVyOm5vdCguZm91bmQpOm5vdCguc2VsZWN0aW5nKSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2VsbC1oaWdobGlnaHRlZCwgI2ZjZWNlOCk7XG4gIH1cblxuICAuY2VsbC5zZWxlY3Rpbmcge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlNmU4ZmY7XG4gIH1cblxuICAuY2VsbC5zZWxlY3RpbmcgLmNlbGwtbGV0dGVyIHtcbiAgICBjb2xvcjogIzJmMzU3ZDtcbiAgfVxuXG4gIC5jZWxsLmZvdW5kIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb3JyZWN0LWxpZ2h0LCAjZTJmM2VhKTtcbiAgfVxuXG4gIC5jZWxsLmZvdW5kIC5jZWxsLWxldHRlciB7XG4gICAgY29sb3I6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICB9XG5cbiAgLmNlbGwtbGV0dGVyIHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tZm9udC1zYW5zKTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuNHB4O1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnksICMwZjE3MmEpO1xuICB9XG5cbiAgLyog4pSA4pSA4pSAIFJlc3RhcnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAICovXG4gIC5yZXN0YXJ0LXJvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICB9XG5cbiAgLnJlc3RhcnQtYnRuIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMC41cmVtO1xuICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeSwgIzY0NzQ4Yik7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyLWNvbG9yLCAjZTJlOGYwKTtcbiAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRyYW5zaXRpb246IGFsbCAwLjE1cyBlYXNlO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1mb250LXNhbnMpO1xuICB9XG5cbiAgLnJlc3RhcnQtYnRuOmhvdmVyIHtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWNvcnJlY3QsICMwMDdhM2MpO1xuICAgIGNvbG9yOiB2YXIoLS1jb3JyZWN0LCAjMDA3YTNjKTtcbiAgfVxuXG4gIC8qIOKUgOKUgOKUgCBSZXNwb25zaXZlIChtYXRjaGVzIGNyb3Nzd29yZCBicmVha3BvaW50KSDilIDilIDilIDilIDilIDilIDilIAgKi9cbiAgQG1lZGlhIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICAgIC5nYW1lLWxheW91dCB7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgZ2FwOiAxNnB4O1xuICAgIH1cblxuICAgIC5ncmlkLXNlY3Rpb24ge1xuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgb3JkZXI6IC0xO1xuICAgICAgZmxleDogMTtcbiAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgIC5jbHVlcy1zZWN0aW9uIHtcbiAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICBwb3NpdGlvbjogc3RhdGljO1xuICAgICAgbWF4LWhlaWdodDogbm9uZTtcbiAgICAgIG92ZXJmbG93LXk6IHZpc2libGU7XG4gICAgICBtaW4td2lkdGg6IDA7XG4gICAgfVxuICB9XG5cbiAgLyogUGhvbmU6IGxldCB0aGUgZ3JpZCBmaWxsIGF2YWlsYWJsZSB3aWR0aCBzbyBpdCBuZXZlciBvdmVyZmxvd3MgKi9cbiAgQG1lZGlhIChtYXgtd2lkdGg6IDY0MHB4KSB7XG4gICAgLmdyaWQtYXJlYSB7XG4gICAgICBwYWRkaW5nOiA4cHg7XG4gICAgfVxuXG4gICAgLmdyaWQge1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQodmFyKC0tZ3JpZC1jb2xzLCAxMCksIG1pbm1heCgwLCAxZnIpKTtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgIC5jZWxsIHtcbiAgICAgIC8qIFNjYWxlIGZvbnQgd2l0aCBjZWxsIHdpZHRoOiB2aWV3cG9ydCBtaW51cyBncmlkLWFyZWEgcGFkZGluZywgZGl2aWRlZFxuICAgICAgICAgYnkgY29sdW1uIGNvdW50LCBzY2FsZWQgZG93biB0byBsZWF2ZSBtYXJnaW4gZm9yIGdhcHMuIENhcHBlZCBhdCB0aGVcbiAgICAgICAgIGRlc2t0b3AgZm9udC1zaXplIHNvIGl0IGRvZXNuJ3QgZ3JvdyBvbiB0YWJsZXRzLiAqL1xuICAgICAgZm9udC1zaXplOiBtaW4oXG4gICAgICAgIHZhcigtLWNlbGwtZm9udCwgMjBweCksXG4gICAgICAgIGNhbGMoKDEwMHZ3IC0gMTZweCkgLyB2YXIoLS1ncmlkLWNvbHMsIDEwKSAqIDAuNTUpXG4gICAgICApO1xuICAgIH1cbiAgfVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwiaWdub3JlTGlzdCI6W119 */`};function U(e,t){Ni(new.target),zn(t,!1,U),cr(e,sa);const n=()=>(ir($n,"t"),Al($n,"$t",i)),[i,l]=hl(),r=R(),s=R(),c=R(),a=R(),o=R(),g=R(),d=R();let u=Q(t,"puzzleId",12,""),b=Q(t,"userId",12,""),f=Q(t,"theme",12,"light"),h=Q(t,"apiUrl",12,""),C=Q(t,"token",12,""),Z=Q(t,"client",12,""),y=Q(t,"lang",12,"lt"),x=R(),k=R([]),D=R(0),O=R([]),M=R(""),He="",T=R(!0),z=R(""),pe=null,oe=R(new Set),E=!1,Ie=null,Ge=null,fe=R([]),yt=R([]),et=R(0),J=null,$=R(!1),Je=R(""),Mt=$e(u(),"latest")||!u()&&!!b(),gt=0,be=R(null);hc(()=>{if(!document.querySelector('link[href*="Source+Sans+Pro"]')){const A=document.createElement("link");A.rel="stylesheet",A.href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap",document.head.appendChild(A)}Mt?Zn():u()&&mn()});async function mn(){v(T,!0),v(z,"");try{const p=`${h()||window.location.origin}/api/public/games?type=wordsearches&id=${u()}`,Y={};C()&&(Y.Authorization=`Bearer ${C()}`);const N=(await dn(fetch(p,{headers:Y})))();if(!N.ok)throw new Error("Failed to load game");const ne=(await dn(N.json()))(),q=ne.data||ne;v(k,q.grid||[]),v(D,q.grid_size||I(k).length),v(M,q.title||""),He=q.difficulty||"",pe=q.branding||null,v(O,(q.words||[]).map(re=>({word:re.word?.toUpperCase()||"",hint:re.hint||""}))),hr(I(x),pe),wt()}catch(A){v(z,A.message||"Failed to load game")}finally{v(T,!1)}}async function Zn(A=0){v(T,!0),v(z,"");try{const Y=`${h()||window.location.origin}/api/public/games/latest?type=wordsearches&org=${b()}&offset=${A}`,N={};C()&&(N.Authorization=`Bearer ${C()}`);const ne=(await dn(fetch(Y,{headers:N})))();if(!ne.ok)throw new Error("No published games found");const q=(await dn(ne.json()))(),re=q.data||q;v(be,q.meta||null),gt=A,v(k,re.grid||[]),v(D,re.grid_size||I(k).length),v(M,re.title||""),He=re.difficulty||"",pe=re.branding||null,v(O,(re.words||[]).map(Oe=>({word:Oe.word?.toUpperCase()||"",hint:Oe.hint||""}))),v(oe,new Set),v(yt,[]),v(fe,[]),Ie=null,Ge=null,v($,!1),E=!1,v(Je,""),hr(I(x),pe),wt()}catch(p){v(z,p.message||"Failed to load game")}finally{v(T,!1)}}const Xn=A=>{$e(A,"older")&&I(be)?.hasOlder?Zn(gt+1):$e(A,"newer")&&I(be)?.hasNewer&&Zn(gt-1)};function wt(){J&&clearInterval(J),v(et,0),J=setInterval(()=>{I($)||Os(et)},1e3)}function xn(A){const p=String(Math.floor(A/60)).padStart(2,"0"),Y=String(A%60).padStart(2,"0");return`${p}:${Y}`}function Pn(A){const p=A.target.closest("[data-row][data-col]");return p?{row:parseInt(p.dataset.row),col:parseInt(p.dataset.col)}:null}function Qn(A,p){if(!A||!p)return[];const Y=Math.sign(p.row-A.row),N=Math.sign(p.col-A.col),ne=Math.abs(p.row-A.row),q=Math.abs(p.col-A.col);if($e(ne,q,!1)&&$e(ne,0,!1)&&$e(q,0,!1))return[];const re=Math.max(ne,q),Oe=[];for(let Wt=0;Wt<=re;Wt++)Oe.push({row:A.row+Y*Wt,col:A.col+N*Wt});return Oe}function zi(A){return A.map(p=>I(k)[p.row]?.[p.col]||"").join("")}function me(A){const p=Pn(A);!p||I($)||(E=!0,Ie=p,Ge=p,v(fe,[p]))}function Le(A){if(!E||I($))return;const p=Pn(A);p&&(Ge=p,v(fe,Qn(Ie,Ge)))}function Tt(){if(!(!E||I($))){if(E=!1,I(fe).length>1){const A=zi(I(fe)),p=A.split("").reverse().join(""),Y=I(O).find(N=>!I(oe).has(N.word)&&($e(N.word,A)||$e(N.word,p)));Y&&(v(oe,new Set([...I(oe),Y.word])),v(yt,[...I(yt),{cells:[...I(fe)]}]),$e(I(oe).size,I(O).length)&&(v($,!0),J&&clearInterval(J)))}v(fe,[]),Ie=null,Ge=null}}function ca(A){A.preventDefault();const p=A.touches[0],Y=document.elementFromPoint(p.clientX,p.clientY);if(!Y)return;const N=Y.closest("[data-row][data-col]");!N||I($)||(E=!0,Ie={row:parseInt(N.dataset.row),col:parseInt(N.dataset.col)},Ge=Ie,v(fe,[Ie]))}function aa(A){if(A.preventDefault(),!E||I($))return;const p=A.touches[0],Y=document.elementFromPoint(p.clientX,p.clientY);if(!Y)return;const N=Y.closest("[data-row][data-col]");N&&(Ge={row:parseInt(N.dataset.row),col:parseInt(N.dataset.col)},v(fe,Qn(Ie,Ge)))}function ga(A){A.preventDefault(),Tt()}function oa(){v(oe,new Set),v(yt,[]),v(fe,[]),Ie=null,Ge=null,v($,!1),E=!1,v(Je,""),wt()}function Ia(){const A=String(Math.floor(I(et)/60)).padStart(2,"0"),p=String(I(et)%60).padStart(2,"0"),Y=`${A}:${p}`,N=new URL(window.location.href);N.searchParams.delete("result");const ne={t:I(et),r:N.toString(),title:`${I(M)} — Word Search`,desc:`Solved in ${Y}! Can you beat my time?`},q=btoa(encodeURIComponent(JSON.stringify(ne))),re=h()||window.location.origin,Oe=new URL("/share",re);Oe.searchParams.set("data",q),v(Je,Oe.toString())}Gt(()=>Lt(y()),()=>{Ar.set(y())}),Gt(()=>I(D),()=>{v(r,I(D)<=10?40:I(D)<=14?34:28)}),Gt(()=>I(D),()=>{v(s,I(D)<=10?"24px":I(D)<=14?"20px":"16px")}),Gt(()=>(I(D),I(r),I(s)),()=>{v(c,`--grid-cols: ${I(D)}; --cell-size: ${I(r)}px; --cell-font: ${I(s)};`)}),Gt(()=>I(O),()=>{v(a,I(O).length)}),Gt(()=>I(oe),()=>{v(o,I(oe).size)}),Gt(()=>I(yt),()=>{v(g,(()=>{const A={};for(const p of I(yt))for(const Y of p.cells)A[`${Y.row},${Y.col}`]=!0;return A})())}),Gt(()=>I(fe),()=>{v(d,new Set(I(fe).map(A=>`${A.row},${A.col}`)))}),ec();var ua={get puzzleId(){return u()},set puzzleId(A){u(A),K()},get userId(){return b()},set userId(A){b(A),K()},get theme(){return f()},set theme(A){f(A),K()},get apiUrl(){return h()},set apiUrl(A){h(A),K()},get token(){return C()},set token(A){C(A),K()},get client(){return Z()},set client(A){Z(A),K()},get lang(){return y()},set lang(A){y(A),K()},..._i()};dr();var yn=ra();let Gr;var da=m(yn);{var Ca=A=>{var p=Qc(),Y=H(m(p),2),N=m(Y,!0);G(Y),G(p),Ve(ne=>F(N,ne),[()=>(n(),B(()=>n()("wordsearch.loading")))]),Ce(A,p)},fa=A=>{var p=qc(),Y=m(p),N=m(Y);G(Y),G(p),Ve(()=>F(N,`⚠️ ${I(z)??""}`)),Ce(A,p)},ba=A=>{var p=la(),Y=m(p),N=m(Y),ne=m(N),q=m(ne,!0);G(ne);var re=H(ne,2);Ue(()=>Ri(re,5,()=>I(O),ki,(Ze,se,ce)=>{var Xe=ea();let xe;var It=m(Xe),ye=m(It);G(It);var Me=H(It,2),Te=m(Me,!0);G(Me),G(Xe),Ve((cn,qn)=>{xe=Hi(Xe,1,"clue-item svelte-len5il",null,xe,cn),Ot(Xe,"title",(I(se),B(()=>I(se).hint||""))),F(ye,`${qn??""}.`),F(Te,(I(se),B(()=>I(se).word)))},[()=>({solved:I(oe).has(I(se).word)}),()=>B(()=>String(ce+1).padStart(2,"0"))]),Ce(Ze,Xe)}),"each",U,375,12),G(re),G(N),G(Y);var Oe=H(Y,2),Wt=m(Oe),mr=m(Wt),ji=m(mr),ha=m(ji,!0);G(ji);var Zr=H(ji,2),Di=m(Zr),Xr=H(m(Di),2),va=m(Xr,!0);G(Xr),G(Di);var xr=H(Di,2),Li=m(xr),pa=m(Li);G(Li);var yr=H(Li,2),Ga=m(yr);G(yr),G(xr),G(Zr),G(mr),G(Wt);var Oi=H(Wt,2),ot=m(Oi),Mi=m(ot);Ue(()=>Ri(Mi,5,()=>I(k),ki,(Ze,se,ce)=>{var Xe=uc(),xe=vi(Xe);Ue(()=>Ri(xe,1,()=>I(se),ki,(It,ye,Me)=>{const Te=he(ht(()=>`${ce},${Me}`),"cellKey");I(Te);const cn=he(ht(()=>(I(g),Lt(I(Te)),B(()=>I(g)[I(Te)]||!1))),"isFound");I(cn);const qn=he(ht(()=>(I(d),Lt(I(Te)),B(()=>I(d).has(I(Te))))),"isSelecting");I(qn);var Et=ta();let Wr;Ot(Et,"data-row",ce),Ot(Et,"data-col",Me);var Br=m(Et),xa=m(Br,!0);G(Br),G(Et),Ve(()=>{Wr=Hi(Et,1,"cell svelte-len5il",null,Wr,{selecting:I(qn),found:I(cn)}),Ot(Et,"aria-label",`Letter ${I(ye)??""}`),F(xa,I(ye))}),Ce(It,Et)}),"each",U,436,16),Ce(Ze,Xe)}),"each",U,435,14),G(Mi),G(ot),G(Oi);var wr=H(Oi,2);{var ma=Ze=>{var se=na(),ce=vi(se);{let ye=ht(()=>(n(),B(()=>n()("wordsearch.congratulations")))),Me=ht(()=>(n(),I(a),B(()=>n()("wordsearch.foundAllWords").replace("{0}",String(I(a))))));Ue(()=>xt(ce,{get elapsedTime(){return I(et)},get shareUrl(){return I(Je)},get titleText(){return I(ye)},get messageText(){return I(Me)},$$events:{share:Ia}}),"component",U,459,10,{componentTag:"CelebrationOverlay"})}var Xe=H(ce,2),xe=m(Xe),It=H(m(xe));G(xe),G(Xe),Ve((ye,Me)=>{Ot(xe,"aria-label",ye),F(It,` ${Me??""}`)},[()=>(n(),B(()=>n()("wordsearch.playAgain"))),()=>(n(),B(()=>n()("wordsearch.playAgain")))]),le("click",xe,oa),Ce(Ze,se)};Ue(()=>hn(wr,Ze=>{I($)&&Ze(ma)}),"if",U,458,8)}var Za=H(wr,2);{var Xa=Ze=>{var se=ia(),ce=m(se),Xe=m(ce);G(ce);var xe=H(ce,2),It=m(xe);G(xe);var ye=H(xe,2),Me=m(ye);G(ye),G(se),Ve((Te,cn)=>{ce.disabled=(I(be),B(()=>!I(be).hasOlder)),F(Xe,`← ${Te??""}`),F(It,`${I(be),B(()=>I(be).current+1)??""} / ${I(be),B(()=>I(be).total)??""}`),ye.disabled=(I(be),B(()=>!I(be).hasNewer)),F(Me,`${cn??""} →`)},[()=>(n(),B(()=>n()("wordsearch.older"))),()=>(n(),B(()=>n()("wordsearch.newer")))]),le("click",ce,function(){return Xn("older")}),le("click",ye,function(){return Xn("newer")}),Ce(Ze,se)};Ue(()=>hn(Za,Ze=>{Mt&&I(be)&&Ze(Xa)}),"if",U,484,8)}G(Oe),G(p),Ve((Ze,se,ce)=>{F(q,Ze),F(ha,I(M)),F(va,se),F(pa,`${ce??""}:`),F(Ga,`${I(o)??""} / ${I(a)??""}`),Vc(Mi,I(c))},[()=>(n(),B(()=>n()("wordsearch.wordsToFind"))),()=>(I(et),B(()=>xn(I(et)))),()=>(n(),B(()=>n()("wordsearch.found")))]),le("mousedown",ot,me),le("mousemove",ot,Le),le("mouseup",ot,Tt),le("mouseleave",ot,Tt),le("touchstart",ot,ca),le("touchmove",ot,aa),le("touchend",ot,ga),Ce(A,p)};Ue(()=>hn(da,A=>{I(T)?A(Ca):I(z)?A(fa,1):A(ba,-1)}),"if",U,359,2)}G(yn),zc(yn,A=>v(x,A),()=>I(x)),Ve(()=>Gr=Hi(yn,1,"word-search-container svelte-len5il",null,Gr,{dark:$e(f(),"dark")})),Ce(e,yn);var Aa=jn(ua);return l(),Aa}Fi(U,{puzzleId:{},userId:{},theme:{},apiUrl:{},token:{},client:{},lang:{}},[],[],{mode:"open"}),Gn[te]="src/lib/WordSearchGameElement.svelte";function Gn(e,t){Ni(new.target),zn(t,!1,Gn);let n=Q(t,"puzzleId",12,""),i=Q(t,"userId",12,""),l=Q(t,"theme",12,"light"),r=Q(t,"apiUrl",12,""),s=Q(t,"token",12,""),c=Q(t,"client",12,""),a=Q(t,"lang",12,"lt");var o={get puzzleId(){return n()},set puzzleId(g){n(g),K()},get userId(){return i()},set userId(g){i(g),K()},get theme(){return l()},set theme(g){l(g),K()},get apiUrl(){return r()},set apiUrl(g){r(g),K()},get token(){return s()},set token(g){s(g),K()},get client(){return c()},set client(g){c(g),K()},get lang(){return a()},set lang(g){a(g),K()},..._i()};return Ue(()=>U(e,{get puzzleId(){return n()},get userId(){return i()},get theme(){return l()},get apiUrl(){return r()},get token(){return s()},get client(){return c()},get lang(){return a()}}),"component",Gn,26,0,{componentTag:"WordSearchGame"}),jn(o)}return customElements.define("word-search-game",Fi(Gn,{puzzleId:{attribute:"puzzle-id"},userId:{attribute:"user-id"},apiUrl:{attribute:"api-url"},theme:{},token:{},client:{},lang:{}},[],[])),Gn})();
