/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.commons.Dialog");jQuery.sap.require("sap.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.commons.Dialog",{metadata:{interfaces:["sap.ui.core.PopupInterface"],publicMethods:["open","close","isOpen","getOpenState"],library:"sap.ui.commons",properties:{"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"height":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"scrollLeft":{type:"int",group:"Behavior",defaultValue:0},"scrollTop":{type:"int",group:"Behavior",defaultValue:0},"title":{type:"string",group:"Misc",defaultValue:''},"applyContentPadding":{type:"boolean",group:"Appearance",defaultValue:true},"showCloseButton":{type:"boolean",group:"Behavior",defaultValue:true},"resizable":{type:"boolean",group:"Behavior",defaultValue:true},"minWidth":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"minHeight":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"maxWidth":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"maxHeight":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"contentBorderDesign":{type:"sap.ui.commons.enums.BorderDesign",group:"Appearance",defaultValue:sap.ui.commons.enums.BorderDesign.None},"modal":{type:"boolean",group:"Misc",defaultValue:false},"accessibleRole":{type:"sap.ui.core.AccessibleRole",group:"Accessibility",defaultValue:sap.ui.core.AccessibleRole.Dialog},"keepInWindow":{type:"boolean",group:"Behavior",defaultValue:false},"autoClose":{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"content",aggregations:{"buttons":{type:"sap.ui.core.Control",multiple:true,singularName:"button"},"content":{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},associations:{"defaultButton":{type:"sap.ui.commons.Button",multiple:false},"initialFocus":{type:"sap.ui.core.Control",multiple:false}},events:{"closed":{}}}});sap.ui.commons.Dialog.M_EVENTS={'closed':'closed'};jQuery.sap.require("sap.ui.core.Popup");
sap.ui.commons.Dialog.prototype.init=function(){this.oPopup=new sap.ui.core.Popup(this,true,true);var e=sap.ui.core.Popup.Dock;this.oPopup.setPosition(e.CenterCenter,e.CenterCenter,window);this._minWidth=64;this._minHeight=48;this.allowTextSelection(false)};
sap.ui.commons.Dialog.prototype.setInitialFocus=function(i){if(i!=null&&typeof(i)!="string"){i=i.getId()}this.oPopup.setInitialFocusId(i);this.setAssociation("initialFocus",i,true)};
sap.ui.commons.Dialog.prototype.onAfterRendering=function(){var $=this.$("cont");if(!sap.ui.commons.Dialog._isSizeSet(this.getWidth())&&!sap.ui.commons.Dialog._isSizeSet(this.getMaxWidth())){$.children().each(function(i,b){if(jQuery.trim(this.style.width)=="100%"){this.style.width="auto"}})}if(!!sap.ui.Device.browser.internet_explorer&&(sap.ui.Device.browser.version==9||sap.ui.Device.browser.version==10)&&($.length>0)){var e=$[0];if(sap.ui.getCore().getConfiguration().getRTL()&&!sap.ui.commons.Dialog._isSizeSet(this.getWidth())){if(e.ownerDocument&&e.ownerDocument.defaultView&&e.ownerDocument.defaultView.getComputedStyle){var w=e.ownerDocument.defaultView.getComputedStyle(e).getPropertyValue("width");if(w){var W=parseFloat(w,10);if(W%1==0.5){$[0].style.width=(W+0.01)+"px"}}}}}if(!sap.ui.commons.Dialog._isSizeSet(this.getHeight())&&sap.ui.commons.Dialog._isSizeSet(this.getMinHeight())){var f=this.getDomRef("footer");var a=f.offsetTop+f.offsetHeight;var d=this.getDomRef().offsetHeight;if(a<d){this.$().removeClass("sapUiDlgFlexHeight")}else{}}var _=this.getMinSize();this._minWidth=_.width;this._minHeight=_.height};
sap.ui.commons.Dialog.prototype.onclick=function(e){switch(e.target.id){case this.getId()+"-close":this.close();e.preventDefault();break};return false};
sap.ui.commons.Dialog.prototype.open=function(){if(!this.oPopup){jQuery.sap.log.fatal("This dialog instance has been destroyed already");return}if(this._bOpen){return}this._oPreviousFocus=sap.ui.core.Popup.getCurrentFocusInfo();this.oPopup.attachEvent("opened",this.handleOpened,this);this.oPopup.attachEvent("closed",this.handleClosed,this);this.oPopup.setModal(this.getModal());this.oPopup.setAutoClose(this.getAutoClose());this.oPopup.open(400);this._bOpen=true};
sap.ui.commons.Dialog.prototype._handleOpened=function(){var i=this.getInitialFocus(),f;if(i&&(f=sap.ui.getCore().getControl(i))){f.focus();this._bInitialFocusSet=true}else{i=this.getDefaultButton();if(i&&(f=sap.ui.getCore().getControl(i))&&f.getParent()===this){f.focus();this._bInitialFocusSet=true}else if(this.getButtons().length>0){this.getButtons()[0].focus();this._bInitialFocusSet=true}else if(this.getContent().length>0){this.getContent()[0].focus();this._bInitialFocusSet=true}}};
sap.ui.commons.Dialog.prototype.handleOpened=function(){this.oPopup.detachEvent("opened",this.handleOpened,this);if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version===11){jQuery.sap.clearDelayedCall(this._delayedCallId);this._delayedCallId=jQuery.sap.delayedCall(0,this,this._handleOpened)}else{this._handleOpened()}};
sap.ui.commons.Dialog.prototype.close=function(){if(!this._bOpen){return}var r=this.$().rect();this._bOpen=false;this._bInitialFocusSet=false;this.oPopup.close(400);jQuery.sap.delayedCall(400,this,"restorePreviousFocus");jQuery.each(r,function(k,v){r[k]=parseInt(v,10)});this._oRect=r};
sap.ui.commons.Dialog.prototype.handleClosed=function(){this.oPopup.detachEvent("closed",this.handleClosed,this);this.fireClosed(this._oRect);this.close()};
sap.ui.commons.Dialog.prototype.restorePreviousFocus=function(){sap.ui.core.Popup.applyFocusInfo(this._oPreviousFocus)};
sap.ui.commons.Dialog.prototype.setTitle=function(t){this.setProperty("title",t,true);this.$("lbl").text(t);return this};
sap.ui.commons.Dialog.prototype.exit=function(){var w=this.isOpen();this.close();this.oPopup.detachEvent("opened",this.handleOpened,this);this.oPopup.detachEvent("closed",this.handleClosed,this);this.oPopup.destroy();if(w){this.fireClosed(this._oRect)}this.oPopup=null};
sap.ui.commons.Dialog._isSizeSet=function(c){return(c&&!(c=="auto")&&!(c=="inherit"))};
sap.ui.commons.Dialog.prototype.onsapescape=function(e){this.close();e.preventDefault();e.stopPropagation()};
sap.ui.commons.Dialog.prototype.onsapenter=function(e){var f,i=this.getDefaultButton();if(i&&(f=sap.ui.getCore().byId(i))&&jQuery.contains(this.getDomRef(),f.getDomRef())){if(f instanceof sap.ui.commons.Button){f.onclick(e)}}e.preventDefault();e.stopPropagation()};
sap.ui.commons.Dialog.prototype.onfocusin=function(e){this.sLastRelevantNavigation=null;if(!this._bInitialFocusSet){return}var f=this.getId()+"-fhfe";var l=this.getId()+"-fhee";var s=e.target;var F=undefined;var $=jQuery(":sapFocusable",this.$("cont"));var a=jQuery(":sapFocusable",this.$("footer"));if(s.id===f){if(a.length>0){F=a[a.length-1]}else{F=$[$.length-1]}}else if(s.id===l){if($.length>0){F=$[0]}else{F=a[0]}}if(F){var d=sap.ui.Device.browser.msie&&sap.ui.Device.browser.version===9?100:0;jQuery.sap.delayedCall(d,this,function(){if(sap.ui.getCore().byId(F.id)instanceof sap.ui.core.Control){F.focus()}else{jQuery.sap.focus(F)}})}};
sap.ui.commons.Dialog.prototype.restoreFocus=function(){if(this.oRestoreFocusInfo&&this.oPopup.bOpen){var c=sap.ui.getCore().getControl(this.oRestoreFocusInfo.sFocusId);if(c){c.applyFocusInfo(this.oRestoreFocusInfo.oFocusInfo)}}};
sap.ui.commons.Dialog.prototype.onselectstart=function(e){if(!jQuery.sap.containsOrEquals(this.getDomRef("cont"),e.target)){e.preventDefault();e.stopPropagation()}};
sap.ui.commons.Dialog.prototype.getMinSize=function(){var d=jQuery.sap.domById(this.sId),t=jQuery.sap.domById(this.sId+"-hdr"),f=jQuery.sap.domById(this.sId+"-footer"),h=0,w=0,a=0;var F=jQuery(f).children("DIV").get(0);w=F.offsetWidth;var b=0;b+=jQuery(f).outerWidth(false)-jQuery(f).width();b+=jQuery(d).outerWidth(false)-jQuery(d).width();if(b<=20){b=20}w+=b;if(isNaN(w)||w<100){w=100}h=t.offsetHeight;a=f.offsetHeight;return{width:w,height:h+a+36}};
sap.ui.commons.Dialog.prototype.isOpen=function(){return this.oPopup.isOpen()};
sap.ui.commons.Dialog.prototype.getOpenState=function(){return this.oPopup.getOpenState()};
sap.ui.commons.Dialog.prototype.getEnabled=function(){var e=this.getOpenState();return e===sap.ui.core.OpenState.OPENING||e===sap.ui.core.OpenState.OPEN};
sap.ui.commons.Dialog.prototype.ondragstart=function(e){if(this.sDragMode=="resize"||this.sDragMode=="move"){e.preventDefault();e.stopPropagation()}};
sap.ui.commons.Dialog.prototype.onmousedown=function(e){var s=e.target,i=this.getId();this._bRtlMode=sap.ui.getCore().getConfiguration().getRTL();if(jQuery.sap.containsOrEquals(this.getDomRef("hdr"),s)){if(s.id!=(i+"-close")){this.sDragMode="move";this._RootWidth=this.getDomRef().offsetWidth;this._RootHeight=this.getDomRef().offsetHeight}}else if(s.id==i+"-grip"){this.sDragMode="resize";var d=this.getDomRef();var w=d.offsetWidth+"px";d.style.width=w;var h=d.offsetHeight+"px";d.style.height=h;jQuery(d).removeClass("sapUiDlgFlexHeight sapUiDlgFlexWidth");this.setProperty("width",w,true);this.setProperty("height",h,true)}if(this.sDragMode==null){return}var a=document.activeElement;if(a&&a.id){var c=jQuery.sap.byId(a.id).control(0);if(c){this.oRestoreFocusInfo={sFocusId:c.getId(),oFocusInfo:c.getFocusInfo()}}}this.startDragX=e.screenX;this.startDragY=e.screenY;this.originalRectangle=this.$().rect();jQuery(window.document).bind("selectstart",jQuery.proxy(this.ondragstart,this));jQuery(window.document).bind("mousemove",jQuery.proxy(this.handleMove,this));jQuery(window.document).bind("mouseup",jQuery.proxy(this.handleMouseUp,this));var o=sap.ui.commons.Dialog._findSameDomainParentWinDoc();if(o){jQuery(o).bind("selectstart",jQuery.proxy(this.ondragstart,this));jQuery(o).bind("mousemove",jQuery.proxy(this.handleMove,this));jQuery(o).bind("mouseup",jQuery.proxy(this.handleMouseUp,this))}};
sap.ui.commons.Dialog._findSameDomainParentWinDoc=function(){var o=null;try{var w=window;while(w.parent&&(w.parent!=w)){if(w.parent.document){o=w.parent.document;w=w.parent}}}catch(e){}return o};
sap.ui.commons.Dialog.prototype.handleMove=function(e){if(!this.sDragMode){return}e=e||window.event;if(this.sDragMode=="resize"){var d=e.screenX-this.startDragX;var a=e.screenY-this.startDragY;var w=(this._bRtlMode?this.originalRectangle.width-d:this.originalRectangle.width+d);var h=this.originalRectangle.height+a;w=Math.max(w,this._minWidth);h=Math.max(h,this._minHeight);var D=this.getDomRef();D.style.width=w+"px";D.style.height=h+"px";w=this.getDomRef().offsetWidth;h=this.getDomRef().offsetHeight;D.style.width=w+"px";D.style.height=h+"px";this.setProperty("width",w+"px",true);this.setProperty("height",h+"px",true)}else if(this.sDragMode=="move"){var l=this.originalRectangle.left+e.screenX-this.startDragX;var t=this.originalRectangle.top+e.screenY-this.startDragY;t=Math.max(t,0);if(this._bRtlMode||this._keepInWindow()){l=Math.min(l,document.documentElement.clientWidth-this._RootWidth)}if(!this._bRtlMode||this._keepInWindow()){l=Math.max(l,0)}if(this._keepInWindow()){t=Math.min(t,document.documentElement.clientHeight-this._RootHeight)}this.oPopup.setPosition(sap.ui.core.Popup.Dock.LeftTop,{left:l,top:t})}e.cancelBubble=true;return false};
sap.ui.commons.Dialog.prototype._keepInWindow=function(){return this.getKeepInWindow()||this.getModal()};
sap.ui.commons.Dialog.prototype.handleMouseUp=function(e){if(this.sDragMode==null){return}jQuery(window.document).unbind("selectstart",this.ondragstart);jQuery(window.document).unbind("mousemove",this.handleMove);jQuery(window.document).unbind("mouseup",this.handleMouseUp);var o=sap.ui.commons.Dialog._findSameDomainParentWinDoc();if(o){jQuery(o).unbind("selectstart",this.ondragstart);jQuery(o).unbind("mousemove",this.handleMove);jQuery(o).unbind("mouseup",this.handleMouseUp)}if(!!sap.ui.Device.browser.webkit){sap.ui.core.RenderManager.forceRepaint(this.getId())}this.restoreFocus();this.sDragMode=null};
sap.ui.commons.Dialog.setAutoClose=function(a){this.oPopup.setAutoClose(a)};
sap.ui.commons.Dialog.getAutoClose=function(){this.oPopup.getAutoClose()};
