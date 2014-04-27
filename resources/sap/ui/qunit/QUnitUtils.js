/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define('sap/ui/qunit/QUnitUtils',['jquery.sap.global'],function(q){"use strict";q.sap.getObject("sap.ui.test.qunit",0);(function(){if(typeof QUnit!=="undefined"){var p=q.sap.getUriParameters();QUnit.equals=QUnit.assert.equal;window.equals=QUnit.assert.equal;var t=p.get("sap-ui-qunittimeout");if(!t||isNaN(t)){t="30000"}QUnit.config.testTimeout=parseInt(t,10);QUnit.config.reorder=false}}());window.qutils=sap.ui.test.qunit;sap.ui.test.qunit.delayTestStart=function(d){QUnit.config.autostart=false;if(d){window.setTimeout(function(){QUnit.start()},d)}else{q(function(){QUnit.start()})}};sap.ui.test.qunit.triggerEvent=function(e,t,p){var a=q.Event(e);if(p){for(var x in p){a[x]=p[x]}}if(typeof(t)=="string"){t=q.sap.domById(t)}q(t).trigger(a)};sap.ui.test.qunit.triggerTouchEvent=function(e,t,p){if(typeof(t)=="string"){t=q.sap.domById(t)}var T=q(t);var E=q.Event(e);E.originalEvent={};E.target=t;if(p){for(var x in p){E[x]=p[x];E.originalEvent[x]=p[x]}}var o=T.control(0);if(o&&o["on"+e]){o["on"+e].apply(o,[E])}};sap.ui.test.qunit.triggerKeyEvent=function(e,t,k,s,a,c){var p={};p.keyCode=isNaN(k)?q.sap.KeyCodes[k]:k;p.which=p.keyCode;p.shiftKey=s;p.altKey=a;p.metaKey=c;p.ctrlKey=c;sap.ui.test.qunit.triggerEvent(e,t,p)};sap.ui.test.qunit.triggerKeydown=function(t,k,s,a,c){sap.ui.test.qunit.triggerKeyEvent("keydown",t,k,s,a,c)};sap.ui.test.qunit.triggerKeyup=function(t,k,s,a,c){sap.ui.test.qunit.triggerKeyEvent("keyup",t,k,s,a,c)};sap.ui.test.qunit.triggerKeyboardEvent=function(t,k,s,a,c){sap.ui.test.qunit.triggerKeydown(t,k,s,a,c)};sap.ui.test.qunit.triggerKeypress=function(t,c,s,a,C){var _=c&&c.toUpperCase();if(q.sap.KeyCodes[_]===null){ok(false,"Invalid character for triggerKeypress: '"+c+"'")}var b=c.charCodeAt(0);var p={};p.charCode=b;p.which=b;p.shiftKey=!!s;p.altKey=!!a;p.metaKey=!!C;p.ctrlKey=!!C;sap.ui.test.qunit.triggerEvent("keypress",t,p)};sap.ui.test.qunit.triggerCharacterInput=function(i,c){sap.ui.test.qunit.triggerKeypress(i,c);if(typeof(i)=="string"){i=q.sap.domById(i)}var I=q(i);I.val(I.val()+c)};sap.ui.test.qunit.triggerMouseEvent=function(t,e,o,O,p,P,b){var a={};a.offsetX=o;a.offsetY=O;a.pageX=p;a.pageY=P;if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<=8){switch(b){case 0:a.button=1;break;case 1:a.button=0;break;default:a.button=b}}else{a.button=b}sap.ui.test.qunit.triggerEvent(e,t,a)};(function(){var F={'normal':400,'bold':700};q.fn.extend({_sapTest_dataEvents:function(){var e=this[0];return e?q._data(e,"events"):null},_sapTest_cssFontWeight:function(){var v=this.css("font-weight");return v?F[v]||v:v}})}());(function(){function d(m){if(window.console){console.info(m)}}var M={"boolean":[false,true],"int":[0,1,5,10,100],"float":[NaN,0.0,0.01,3.14,97.7],"string":["","some","very long otherwise not normal and so on whatever","<"+"script>alert('XSS attack!');</"+"script>"]};var D=q.sap.newObject(M);function f(o){return o&&!(o instanceof Array)?[o]:o}sap.ui.test.qunit.resetDefaultTestValues=function(t){if(typeof t==="string"){delete D[t]}else{D=q.sap.newObject(M)}};sap.ui.test.qunit.setDefaultTestValues=function(t,v){if(typeof t==="string"){D[t]=f(v)}else if(typeof t==="object"){q.extend(D,t)}};sap.ui.test.qunit.createSettingsDomain=function(c,p){function a(t){if(D[t]){return D[t]}try{q.sap.require(t)}catch(e){}var T=q.sap.getObject(t);if(T instanceof sap.ui.base.DataType){}else{var r=[];for(var n in T){r.push(T[n])}D[t]=r;return r}return[]}var c=new c().getMetadata().getClass();var p=p||{};var b={};var P=c.getMetadata().getAllProperties();for(var h in P){b[h]=f(p[h])||a(P[h].type)}return b};sap.ui.test.qunit.genericTest=function(c,u,t){if(t&&t.skip===true){return}var c=new c().getMetadata().getClass();var t=t||{};var T=t.testCount||100;var o=sap.ui.test.qunit.createSettingsDomain(c,t.allPairTestValues||{});d("domain");for(var n in o){var l=o[n].length;var s=[];s.push("  ",n,":","[");for(var i=0;i<l;i++){s.push(o[n][i],",")}s.push("]");d(s.join(""))}function m(p,N){return p+N.substring(0,1).toUpperCase()+N.substring(1)}function a(C,S){var A={};for(var n in S){if(C[m("get",n)]){A[n]=C[m("get",n)]()}}return A}var C;var S;var b=new sap.ui.test.qunit.AllPairsGenerator(o);var e=[];while(b.hasNext()){e.push(b.next())}var h=0;function j(){d("testNextCombination("+h+")");if(h>=e.length){d("last combination -> done");start();return}var S=e[h];C=new c(S);var A=a(C,S);deepEqual(A,S,"settings");C.placeAt(u);d("before explicit rerender");C.getUIArea().rerender();d("after explicit rerender");d("info");setTimeout(k,0)}stop(15000);j();function k(){d("continueAfterRendering("+h+")");var S=e[e.length-h-1];for(var n in S){var r=C[m("set",n)](S[n]);equal(C[m("get",n)](),S[n],"setter for property '"+n+"'");ok(r==C,"setter for property '"+n+"' supports chaining (after rendering)")}h=h+1;setTimeout(j,0)}};var g=undefined;sap.ui.test.qunit.suppressErrors=function(s){if(s!==false){d("suppress global errors");g=window.onerror}else{d("reenable global errors");g=undefined}};sap.ui.test.qunit.RandomPairsGenerator=function(o){var C=0;for(var n in o){if(o[n]&&!(o[n]instanceof Array)){o[n]=[o[n]]}if(o[n]&&o[n].length>0){if(C==0){C=o[n].length}else{C=C*o[n].length}}}function a(i){var s={};for(var n in o){var l=o[n]&&o[n].length;if(l==1){s[n]=o[n][0]}else if(l>1){var c=i%l;s[n]=o[n][c];i=(i-c)/l}}return s}this.hasNext=function(){return true};this.next=function(){return a(Math.floor(100*C*Math.random()))}};sap.ui.test.qunit.AllPairsGenerator=function(o){var p=[];for(var n in o){p.push({name:n,n:o[n].length,values:o[n]})}var N=p.length;var c=[];var e=[];var h=0;for(var a=0;a<N-1;a++){var j=p[a];for(var b=a+1;b<N;b++){var k=p[b];e[a*N+b]=h;for(var i=j.n*k.n;i>0;i--){c[h++]=0}}}function l(a,b,v,t){return e[a*N+b]+v*p[b].n+t}function m(){var v=[];function t(a,w){var y={va:w,pairs:0,redundant:0};for(var b=0;b<N;b++){var z;if(b<a){z=c[l(b,a,v[b],w)]}else if(b>a){var i=l(a,b,w,0),A=i+p[b].n;for(z=c[i];z>0&&i<A;i++){if(c[i]<z){z=c[i]}}}y.redundant=y.redundant+z;if(z==0){y.pairs++}}return y}for(var a=0;a<N;a++){var j=p[a];var u=t(a,0);for(var w=1;w<j.n;w++){var x=t(a,w);if(x.pairs>u.pairs||(x.pairs==u.pairs&&x.redundant<u.redundant)){u=x}}v[a]=u.va}return v}this.hasNext=function(){return h>0};var r=undefined;var s=-1;this.next=function(){r=m();s=0;var t={};for(var a=0;a<N;a++){for(var b=a+1;b<N;b++){var i=l(a,b,r[a],r[b]);if(c[i]==0){h--;s++}c[i]++}t[p[a].name]=p[a].values[r[a]]}return t};this.lastPairs=function(){return s}}}());return sap.ui.test.qunit},true);
