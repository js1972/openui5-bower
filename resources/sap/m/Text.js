/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.Text");jQuery.sap.require("sap.m.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.m.Text",{metadata:{library:"sap.m",properties:{"text":{type:"string",group:"",defaultValue:'',bindable:"bindable"},"textDirection":{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"wrapping":{type:"boolean",group:"Appearance",defaultValue:true},"textAlign":{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin},"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"maxLines":{type:"int",group:"Appearance",defaultValue:null}}}});sap.m.Text.prototype.normalLineHeight=1.2;sap.m.Text.prototype.cacheLineHeight=true;
sap.m.Text.prototype.getText=function(n){var t=this.getProperty("text");if(n){return t.replace(/\r\n/g,"\n")}return t};
sap.m.Text.prototype.onAfterRendering=function(){if(this.getVisible()&&this.getWrapping()&&this.getMaxLines()>1&&!this.canUseNativeLineClamp()){var d=this.getDomRef("inner");var m=this._getClampHeight(d);d.style.maxHeight=m+"px"}};
sap.m.Text.hasNativeLineClamp=(function(){return(typeof document.documentElement.style.webkitLineClamp!="undefined")})();sap.m.Text.prototype.ellipsis='…';
sap.m.Text.prototype.canUseNativeLineClamp=function(){if(!sap.m.Text.hasNativeLineClamp){return false}if(this.getTextDirection()==sap.ui.core.TextDirection.RTL){return false}if(this.getTextDirection()==sap.ui.core.TextDirection.Inherit&&sap.ui.getCore().getConfiguration().getRTL()){return false}return true};
sap.m.Text.prototype.clampText=function(d,s,e){d=d||this.getDomRef("inner");if(!d){return}var E;var t=this.getText(true);var m=this._getClampHeight(d);s=s||0;e=e||t.length;d.textContent=t.slice(0,e);if(d.scrollHeight>m){var S=d.style,h=S.height,a=this.ellipsis,i=a.length;S.height=m+"px";while((e-s)>i){E=(s+e)>>1;d.textContent=t.slice(0,E-i)+a;if(d.scrollHeight>m){e=E}else{s=E}}if(d.scrollHeight>m&&s>0){E=s;d.textContent=t.slice(0,E-i)+a}S.height=h}return E};
sap.m.Text.prototype._getLineHeight=function(d){if(this.cacheLineHeight&&this._iLineHeight){return this._iLineHeight}d=d||this.getDomRef("inner");var s=window.getComputedStyle(d);var l=parseFloat(s.lineHeight);if(!l){l=parseFloat(s.fontSize)*this.normalLineHeight}return(this._iLineHeight=Math.floor(l))};
sap.m.Text.prototype._getClampHeight=function(d){return this.getMaxLines()*this._getLineHeight(d)};
