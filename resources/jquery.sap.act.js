/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("jquery.sap.act",false);(function(){if(typeof window.jQuery.sap.act==="object"||typeof window.jQuery.sap.act==="function"){return}var _={},a=true,b=null,c=10000,d=!!window.addEventListener,e=[],f=[],g=null;function h(){if(b){clearTimeout(b);b=null}setTimeout(j,c)};function j(){a=false;b=null;g.observe(document.documentElement,{childList:true,attributes:true,subtree:true,characterData:true})};function k(){if(!a){a=true;l(e);g.disconnect()}h()};function l(L){if(L.length==0){return}var m=L.slice();setTimeout(function(){var I;for(var i=0,n=m.length;i<n;i++){I=m[i];I.fFunction.call(I.oListener||window)}},0)};_.attachActivate=function(F,L){e.push({oListener:L,fFunction:F})};_.detachActivate=function(F,L){for(var i=0,m=e.length;i<m;i++){if(e[i].fFunction===F&&e[i].oListener===L){e.splice(i,1);break}}};_.isActive=!d?function(){return true}:function(){return a};_.refresh=!d?function(){}:k;if(d){var E=["resize","orientationchange","mousemove","mousedown","mouseup","touchstart","touchmove","touchend","touchcancel","paste","cut","keydown","keyup","DOMMouseScroll","mousewheel"];for(var i=0;i<E.length;i++){window.addEventListener(E[i],_.refresh,true)}if(window.MutationObserver){g=new window.MutationObserver(_.refresh)}else if(window.WebKitMutationObserver){g=new window.WebKitMutationObserver(_.refresh)}else{g={observe:function(){document.documentElement.addEventListener("DOMSubtreeModified",_.refresh)},disconnect:function(){document.documentElement.removeEventListener("DOMSubtreeModified",_.refresh)}}}k()}jQuery.sap.act=_}());
