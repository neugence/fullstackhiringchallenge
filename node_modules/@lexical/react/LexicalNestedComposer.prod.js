/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var g=require("@lexical/react/LexicalCollaborationContext"),h=require("@lexical/react/LexicalComposerContext"),n=require("react"),r=require("react/jsx-runtime"),t;function v(a){let k=new URLSearchParams;k.append("code",a);for(let d=1;d<arguments.length;d++)k.append("v",arguments[d]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${k} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}
t=v&&v.__esModule&&Object.prototype.hasOwnProperty.call(v,"default")?v["default"]:v;function w(a){a=a.transform();return null!==a?new Set([a]):new Set}
exports.LexicalNestedComposer=function({initialEditor:a,children:k,initialNodes:d,initialTheme:x,skipCollabChecks:y}){let u=n.useRef(!1),p=n.useContext(h.LexicalComposerContext);null==p&&t(9);let [e,{getTheme:z}]=p,B=n.useMemo(()=>{var c=x||z()||void 0;const A=h.createLexicalComposerContext(p,c);void 0!==c&&(a._config.theme=c);a._parentEditor=e;if(d)for(var b of d){var f=c=null;"function"!==typeof b&&(f=b,b=f.replace,c=f.with,f=f.withKlass||null);const m=a._nodes.get(b.getType());a._nodes.set(b.getType(),
{exportDOM:m?m.exportDOM:void 0,klass:b,replace:c,replaceWithKlass:f,transforms:w(b)})}else{b=a._nodes=new Map(e._nodes);for(const [m,l]of b)a._nodes.set(m,{exportDOM:l.exportDOM,klass:l.klass,replace:l.replace,replaceWithKlass:l.replaceWithKlass,transforms:w(l.klass)})}a._config.namespace=e._config.namespace;a._editable=e._editable;return[a,A]},[]),{isCollabActive:C,yjsDocMap:D}=g.useCollaborationContext(),q=y||u.current||D.has(a.getKey());n.useEffect(()=>{q&&(u.current=!0)},[q]);n.useEffect(()=>
e.registerEditableListener(c=>{a.setEditable(c)}),[a,e]);return r.jsx(h.LexicalComposerContext.Provider,{value:B,children:!C||q?k:null})}
