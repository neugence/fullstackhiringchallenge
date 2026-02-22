/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var e=require("@lexical/link"),k=require("@lexical/react/LexicalComposerContext"),l=require("@lexical/react/LexicalNodeMenuPlugin"),p=require("@lexical/utils"),q=require("lexical"),y=require("react"),z=require("react/jsx-runtime");let A=q.createCommand("INSERT_EMBED_COMMAND");class B extends l.MenuOption{constructor(g,n){super(g);this.title=g;this.onSelect=n.onSelect.bind(this)}}exports.AutoEmbedOption=B;exports.INSERT_EMBED_COMMAND=A;
exports.LexicalAutoEmbedPlugin=function({embedConfigs:g,onOpenEmbedModalForConfig:n,getMenuOptions:r,menuRenderFn:C,menuCommandPriority:D=q.COMMAND_PRIORITY_LOW}){let [d]=k.useLexicalComposerContext(),[f,t]=y.useState(null),[h,u]=y.useState(null),m=y.useCallback(()=>{t(null);u(null)},[]),v=y.useCallback(async b=>{const a=d.getEditorState().read(function(){const c=q.$getNodeByKey(b);if(e.$isLinkNode(c))return c.getURL()});if(void 0!==a)for(const c of g)null!=await Promise.resolve(c.parseUrl(a))&&(u(c),
t(b))},[d,g]);y.useEffect(()=>{let b=(a,{updateTags:c,dirtyLeaves:E})=>{for(const [w,F]of a)"created"===F&&c.has("paste")&&3>=E.size?v(w):w===f&&m()};return p.mergeRegister(...[e.LinkNode,e.AutoLinkNode].map(a=>d.registerMutationListener(a,(...c)=>b(...c),{skipInitialization:!0})))},[v,d,g,f,m]);y.useEffect(()=>d.registerCommand(A,b=>{let a=g.find(({type:c})=>c===b);return a?(n(a),!0):!1},q.COMMAND_PRIORITY_EDITOR),[d,g,n]);let x=y.useCallback(async function(){if(null!=h&&null!=f){const b=d.getEditorState().read(()=>
{const a=q.$getNodeByKey(f);return e.$isLinkNode(a)?a:null});if(e.$isLinkNode(b)){const a=await Promise.resolve(h.parseUrl(b.__url));null!=a&&d.update(()=>{q.$getSelection()||b.selectEnd();h.insertNode(d,a);b.isAttached()&&b.remove()})}}},[h,d,f]),G=y.useMemo(()=>null!=h&&null!=f?r(h,x,m):[],[h,x,r,f,m]),H=y.useCallback((b,a,c)=>{d.update(()=>{b.onSelect(a);c()})},[d]);return null!=f?z.jsx(l.LexicalNodeMenuPlugin,{nodeKey:f,onClose:m,onSelectOption:H,options:G,menuRenderFn:C,commandPriority:D}):null};
exports.URL_MATCHER=/((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
