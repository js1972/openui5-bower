/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.unified.Shell");jQuery.sap.require("sap.ui.unified.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.unified.Shell",{metadata:{library:"sap.ui.unified",properties:{"icon":{type:"sap.ui.core.URI",group:"Appearance",defaultValue:null},"showPane":{type:"boolean",group:"Appearance",defaultValue:null},"showCurtain":{type:"boolean",group:"Appearance",defaultValue:null,deprecated:true},"showCurtainPane":{type:"boolean",group:"Appearance",defaultValue:null,deprecated:true},"headerHiding":{type:"boolean",group:"Appearance",defaultValue:null}},defaultAggregation:"content",aggregations:{"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"},"paneContent":{type:"sap.ui.core.Control",multiple:true,singularName:"paneContent"},"curtainContent":{type:"sap.ui.core.Control",multiple:true,singularName:"curtainContent"},"curtainPaneContent":{type:"sap.ui.core.Control",multiple:true,singularName:"curtainPaneContent"},"headItems":{type:"sap.ui.unified.ShellHeadItem",multiple:true,singularName:"headItem"},"headEndItems":{type:"sap.ui.unified.ShellHeadItem",multiple:true,singularName:"headEndItem"},"search":{type:"sap.ui.core.Control",multiple:false},"canvasSplitContainer":{type:"sap.ui.unified.SplitContainer",multiple:false,visibility:"hidden"},"curtainSplitContainer":{type:"sap.ui.unified.SplitContainer",multiple:false,visibility:"hidden"}}}});jQuery.sap.require("sap.ui.Device");jQuery.sap.require("jquery.sap.script");jQuery.sap.require("jquery.sap.dom");jQuery.sap.require("sap.ui.unified.SplitContainer");jQuery.sap.require("sap.ui.core.Popup");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.ui.unified.Shell._SIDEPANE_WIDTH_PHONE=208;sap.ui.unified.Shell._SIDEPANE_WIDTH_TABLET=208;sap.ui.unified.Shell._SIDEPANE_WIDTH_DESKTOP=240;sap.ui.unified.Shell._HEADER_ALWAYS_VISIBLE=true;sap.ui.unified.Shell._HEADER_AUTO_CLOSE=true;sap.ui.unified.Shell._HEADER_TOUCH_TRESHOLD=30;
sap.ui.unified.Shell.prototype.init=function(){var t=this;this._rtl=sap.ui.getCore().getConfiguration().getRTL();this._animation=sap.ui.getCore().getConfiguration().getAnimation();this._showHeader=true;this._iHeaderHidingDelay=3000;this._cont=new sap.ui.unified.SplitContainer(this.getId()+"-container");this._cont._bRootContent=true;this.setAggregation("canvasSplitContainer",this._cont,true);this._curtCont=new sap.ui.unified.SplitContainer(this.getId()+"-curt-container");this._curtCont._bRootContent=true;this.setAggregation("curtainSplitContainer",this._curtCont,true);function _(r){if(!r){r=sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD).name}var w=sap.ui.unified.Shell["_SIDEPANE_WIDTH_"+r.toUpperCase()]+"px";t._cont.setSecondaryContentWidth(w);t._curtCont.setSecondaryContentWidth(w)};_();this._handleMediaChange=function(p){if(!t.getDomRef()){return}_(p.name);t._refreshHeader()};sap.ui.Device.media.attachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);function a(){t._refreshHeader()};this._headCenterRenderer=new sap.ui.unified._ContentRenderer(this,this.getId()+"-hdr-center",function(r){sap.ui.unified.ShellRenderer.renderSearch(r,t)},a);this._headBeginRenderer=new sap.ui.unified._ContentRenderer(this,this.getId()+"-hdr-begin",function(r){sap.ui.unified.ShellRenderer.renderHeaderItems(r,t,true)},a);this._headEndRenderer=new sap.ui.unified._ContentRenderer(this,this.getId()+"-hdr-end",function(r){sap.ui.unified.ShellRenderer.renderHeaderItems(r,t,false)},a)};
sap.ui.unified.Shell.prototype.exit=function(){sap.ui.Device.media.detachHandler(this._handleMediaChange,this,sap.ui.Device.media.RANGESETS.SAP_STANDARD);delete this._handleMediaChange;this._headCenterRenderer.destroy();delete this._headCenterRenderer;this._headBeginRenderer.destroy();delete this._headBeginRenderer;this._headEndRenderer.destroy();delete this._headEndRenderer;delete this._cont;delete this._curtCont};
sap.ui.unified.Shell.prototype.onAfterRendering=function(){var t=this;jQuery.sap.byId(this.getId()+"-icon").bind("load",function(){t._refreshHeader()});if(window.addEventListener&&!sap.ui.unified.Shell._HEADER_ALWAYS_VISIBLE){function h(b){var e=jQuery.event.fix(b);if(jQuery.sap.containsOrEquals(jQuery.sap.domById(t.getId()+"-hdr"),e.target)){t._timedHideHeader(e.type==="focus")}};var H=jQuery.sap.domById(this.getId()+"-hdr");H.addEventListener("focus",h,true);H.addEventListener("blur",h,true)}this.onThemeChanged();jQuery.sap.byId(this.getId()+"-hdr-center").toggleClass("sapUiUfdShellAnim",!this._noHeadCenterAnim)};
sap.ui.unified.Shell.prototype.onThemeChanged=function(){var d=this.getDomRef();if(!d){return}this._repaint(d);this._refreshHeader();this._timedHideHeader()};
sap.ui.unified.Shell.prototype.onfocusin=function(e){var i=this.getId();if(e.target.id===i+"-curt-focusDummyOut"){jQuery.sap.focus(jQuery.sap.byId(i+"-hdrcntnt").firstFocusableDomRef())}else if(e.target.id===i+"-main-focusDummyOut"){jQuery.sap.focus(jQuery.sap.byId(i+"-curtcntnt").firstFocusableDomRef())}};
(function(){if(sap.ui.Device.support.touch){sap.ui.unified.Shell._HEADER_ALWAYS_VISIBLE=false;function _(s){if(s._startY===undefined||s._currY===undefined){return}var y=s._currY-s._startY;if(Math.abs(y)>sap.ui.unified.Shell._HEADER_TOUCH_TRESHOLD){s._doShowHeader(y>0);s._startY=s._currY}};sap.ui.unified.Shell.prototype.ontouchstart=function(e){this._startY=e.touches[0].pageY;if(this._startY>2*48){this._startY=undefined}this._currY=this._startY};sap.ui.unified.Shell.prototype.ontouchend=function(e){_(this);this._startY=undefined;this._currY=undefined};sap.ui.unified.Shell.prototype.ontouchmove=function(e){this._currY=e.touches[0].pageY;_(this)}}})();
sap.ui.unified.Shell.prototype.setHeaderHiding=function(e){e=!!e;return this._mod(function(r){return this.setProperty("headerHiding",e,r)},function(){this._doShowHeader(!e?true:this._showHeader)})};
sap.ui.unified.Shell.prototype.setHeaderHidingDelay=function(d){this._iHeaderHidingDelay=d;return this};
sap.ui.unified.Shell.prototype.getHeaderHidingDelay=function(){return this._iHeaderHidingDelay};
sap.ui.unified.Shell.prototype.getShowPane=function(){return this._cont.getShowSecondaryContent()};
sap.ui.unified.Shell.prototype.setShowPane=function(s){this._cont.setShowSecondaryContent(s);this.setProperty("showPane",!!s,true);return this};
sap.ui.unified.Shell.prototype.getShowPane=function(){return this._cont.getShowSecondaryContent()};
sap.ui.unified.Shell.prototype.setShowCurtainPane=function(s){this._curtCont.setShowSecondaryContent(s);this.setProperty("showCurtainPane",!!s,true);return this};
sap.ui.unified.Shell.prototype.getShowCurtainPane=function(){return this._curtCont.getShowSecondaryContent()};
sap.ui.unified.Shell.prototype.setShowCurtain=function(s){s=!!s;return this._mod(function(r){return this.setProperty("showCurtain",s,r)},function(){var i=this.getId();jQuery.sap.byId(i+"-main-focusDummyOut").attr("tabindex",s?0:-1);this.$().toggleClass("sapUiUfdShellCurtainHidden",!s).toggleClass("sapUiUfdShellCurtainVisible",s);if(s){var z=sap.ui.core.Popup.getNextZIndex();jQuery.sap.byId(i+"-curt").css("z-index",z+1);jQuery.sap.byId(i+"-hdr").css("z-index",z+3);jQuery.sap.byId(i+"-brand").css("z-index",z+7);this.$().toggleClass("sapUiUfdShellCurtainClosed",false)}this._timedCurtainClosed(s);this._doShowHeader(true)})};
sap.ui.unified.Shell.prototype.setIcon=function(i){return this._mod(function(r){return this.setProperty("icon",i,r)},this._headEndRenderer)};
sap.ui.unified.Shell.prototype.setSearch=function(s){return this._mod(function(r){return this.setAggregation("search",s,r)},this._headCenterRenderer)};
sap.ui.unified.Shell.prototype.getContent=function(){return this._cont.getContent()};
sap.ui.unified.Shell.prototype.insertContent=function(c,i){this._cont.insertContent(c,i);return this};
sap.ui.unified.Shell.prototype.addContent=function(c){this._cont.addContent(c);return this};
sap.ui.unified.Shell.prototype.removeContent=function(i){return this._cont.removeContent(i)};
sap.ui.unified.Shell.prototype.removeAllContent=function(){return this._cont.removeAllContent()};
sap.ui.unified.Shell.prototype.destroyContent=function(){this._cont.destroyContent();return this};
sap.ui.unified.Shell.prototype.getPaneContent=function(){return this._cont.getSecondaryContent()};
sap.ui.unified.Shell.prototype.insertPaneContent=function(c,i){this._cont.insertSecondaryContent(c,i);return this};
sap.ui.unified.Shell.prototype.addPaneContent=function(c){this._cont.addSecondaryContent(c);return this};
sap.ui.unified.Shell.prototype.removePaneContent=function(i){return this._cont.removeSecondaryContent(i)};
sap.ui.unified.Shell.prototype.removeAllPaneContent=function(){return this._cont.removeAllSecondaryContent()};
sap.ui.unified.Shell.prototype.destroyPaneContent=function(){this._cont.destroySecondaryContent();return this};
sap.ui.unified.Shell.prototype.getCurtainContent=function(){return this._curtCont.getContent()};
sap.ui.unified.Shell.prototype.insertCurtainContent=function(c,i){this._curtCont.insertContent(c,i);return this};
sap.ui.unified.Shell.prototype.addCurtainContent=function(c){this._curtCont.addContent(c);return this};
sap.ui.unified.Shell.prototype.removeCurtainContent=function(i){return this._curtCont.removeContent(i)};
sap.ui.unified.Shell.prototype.removeAllCurtainContent=function(){return this._curtCont.removeAllContent()};
sap.ui.unified.Shell.prototype.destroyCurtainContent=function(){this._curtCont.destroyContent();return this};
sap.ui.unified.Shell.prototype.getCurtainPaneContent=function(){return this._curtCont.getSecondaryContent()};
sap.ui.unified.Shell.prototype.insertCurtainPaneContent=function(c,i){this._curtCont.insertSecondaryContent(c,i);return this};
sap.ui.unified.Shell.prototype.addCurtainPaneContent=function(c){this._curtCont.addSecondaryContent(c);return this};
sap.ui.unified.Shell.prototype.removeCurtainPaneContent=function(i){return this._curtCont.removeSecondaryContent(i)};
sap.ui.unified.Shell.prototype.removeAllCurtainPaneContent=function(){return this._curtCont.removeAllSecondaryContent()};
sap.ui.unified.Shell.prototype.destroyCurtainPaneContent=function(){this._curtCont.destroySecondaryContent();return this};
sap.ui.unified.Shell.prototype.insertHeadItem=function(h,i){return this._mod(function(r){return this.insertAggregation("headItems",h,i,r)},this._headBeginRenderer)};
sap.ui.unified.Shell.prototype.addHeadItem=function(h){return this._mod(function(r){return this.addAggregation("headItems",h,r)},this._headBeginRenderer)};
sap.ui.unified.Shell.prototype.removeHeadItem=function(i){return this._mod(function(r){return this.removeAggregation("headItems",i,r)},this._headBeginRenderer)};
sap.ui.unified.Shell.prototype.removeAllHeadItems=function(){return this._mod(function(r){return this.removeAllAggregation("headItems",r)},this._headBeginRenderer)};
sap.ui.unified.Shell.prototype.destroyHeadItems=function(){return this._mod(function(r){return this.destroyAggregation("headItems",r)},this._headBeginRenderer)};
sap.ui.unified.Shell.prototype.insertHeadEndItem=function(h,i){return this._mod(function(r){return this.insertAggregation("headEndItems",h,i,r)},this._headEndRenderer)};
sap.ui.unified.Shell.prototype.addHeadEndItem=function(h){return this._mod(function(r){return this.addAggregation("headEndItems",h,r)},this._headEndRenderer)};
sap.ui.unified.Shell.prototype.removeHeadEndItem=function(i){return this._mod(function(r){return this.removeAggregation("headEndItems",i,r)},this._headEndRenderer)};
sap.ui.unified.Shell.prototype.removeAllHeadEndItems=function(){return this._mod(function(r){return this.removeAllAggregation("headEndItems",r)},this._headEndRenderer)};
sap.ui.unified.Shell.prototype.destroyHeadEndItems=function(){return this._mod(function(r){return this.destroyAggregation("headEndItems",r)},this._headEndRenderer)};
sap.ui.unified.Shell.prototype._doShowHeader=function(s){this._showHeader=this._isHeaderHidingActive()?!!s:true;this.$().toggleClass("sapUiUfdShellHeadHidden",!this._showHeader).toggleClass("sapUiUfdShellHeadVisible",this._showHeader);if(this._showHeader){this._timedHideHeader()}};
sap.ui.unified.Shell.prototype._timedHideHeader=function(c){if(this._headerHidingTimer){jQuery.sap.clearDelayedCall(this._headerHidingTimer);this._headerHidingTimer=null}if(c||!sap.ui.unified.Shell._HEADER_AUTO_CLOSE||!this._isHeaderHidingActive()||this._iHeaderHidingDelay<=0){return}this._headerHidingTimer=jQuery.sap.delayedCall(this._iHeaderHidingDelay,this,function(){if(this._isHeaderHidingActive()&&this._iHeaderHidingDelay>0&&!jQuery.sap.containsOrEquals(jQuery.sap.domById(this.getId()+"-hdr"),document.activeElement)){this._doShowHeader(false)}})};
sap.ui.unified.Shell.prototype._timedCurtainClosed=function(c){if(this._curtainClosedTimer){jQuery.sap.clearDelayedCall(this._curtainClosedTimer);this._curtainClosedTimer=null}if(c){return}var d=parseInt(sap.ui.core.theming.Parameters.get("sapUiUfdShellAnimDuration"),10);if(!this._animation||(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version<10)){d=0}this._curtainClosedTimer=jQuery.sap.delayedCall(d,this,function(){this._curtainClosedTimer=null;jQuery.sap.byId(this.getId()+"-curt").css("z-index","");jQuery.sap.byId(this.getId()+"-hdr").css("z-index","");jQuery.sap.byId(this.getId()+"-brand").css("z-index","");this.$().toggleClass("sapUiUfdShellCurtainClosed",true)})};
sap.ui.unified.Shell.prototype._mod=function(m,d){var r=!!this.getDomRef();var a=m.apply(this,[r]);if(r&&d){if(d instanceof sap.ui.unified._ContentRenderer){d.render()}else{d.apply(this)}}return a};
sap.ui.unified.Shell.prototype._refreshHeader=function(){function u(I){for(var i=0;i<I.length;i++){I[i]._refreshIcon()}}u(this.getHeadItems());u(this.getHeadEndItems());var a=this.getId(),b=jQuery("html").hasClass("sapUiMedia-Std-Phone"),w=jQuery.sap.byId(this.getId()+"-hdr-end").outerWidth(),c=jQuery.sap.byId(a+"-hdr-begin").outerWidth(),d=Math.max(w,c),e=(b?c:d)+"px",f=(b?w:d)+"px";jQuery.sap.byId(a+"-hdr-center").css({"left":this._rtl?f:e,"right":this._rtl?e:f})};
sap.ui.unified.Shell.prototype._getIcon=function(){var i=this.getIcon();if(!i){jQuery.sap.require("sap.ui.core.theming.Parameters");i=sap.ui.core.theming.Parameters.get("sapUiGlobalLogo");if(i){var m=/url[\s]*\('?"?([^\'")]*)'?"?\)/.exec(i);if(m){i=m[1]}else if(i==="''"){i=null}}}return i||sap.ui.resource('sap.ui.core','themes/base/img/1x1.gif')};
sap.ui.unified.Shell.prototype._repaint=function(d){if(sap.ui.Device.browser.webkit){var a=d.style.display;d.style.display="none";d.offsetHeight;d.style.display=a}};
sap.ui.unified.Shell.prototype._isHeaderHidingActive=function(){if(sap.ui.unified.Shell._HEADER_ALWAYS_VISIBLE||this.getShowCurtain()||!this.getHeaderHiding()||sap.ui.unified._iNumberOfOpenedShellOverlays>0){return false}return true};
sap.ui.unified.Shell.prototype.invalidate=function(o){if(o instanceof sap.ui.unified.ShellHeadItem&&this._headBeginRenderer&&this._headEndRenderer){this._headBeginRenderer.render();this._headEndRenderer.render()}else{sap.ui.core.Control.prototype.invalidate.apply(this,arguments)}};
