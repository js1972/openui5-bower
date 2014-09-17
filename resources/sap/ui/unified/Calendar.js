/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.unified.Calendar");jQuery.sap.require("sap.ui.unified.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.unified.Calendar",{metadata:{publicMethods:["focusDate"],library:"sap.ui.unified",properties:{"intervalSelection":{type:"boolean",group:"Misc",defaultValue:false},"singleSelection":{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{"selectedDates":{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"}},events:{"select":{},"cancel":{}}}});sap.ui.unified.Calendar.M_EVENTS={'select':'select','cancel':'cancel'};jQuery.sap.require("sap.ui.core.LocaleData");jQuery.sap.require("sap.ui.core.delegate.ItemNavigation");jQuery.sap.require("sap.ui.model.type.Date");(function(){sap.ui.unified.Calendar.prototype.init=function(){this._mouseMoveProxy=jQuery.proxy(this._handleMouseMove,this);this._iMode=0;this._oFormatYyyymmdd=sap.ui.core.format.DateFormat.getInstance({pattern:"yyyyMMdd"})};sap.ui.unified.Calendar.prototype.exit=function(){if(this._sRenderMonth){jQuery.sap.clearDelayedCall(this._sRenderMonth)}};sap.ui.unified.Calendar.prototype.onAfterRendering=function(){var t=this;d(t);r(t)};sap.ui.unified.Calendar.prototype.invalidate=function(O){if(!O||!(O instanceof sap.ui.unified.DateRange)){sap.ui.core.Control.prototype.invalidate.apply(this,arguments)}else{if(this.getDomRef()&&this._iMode==0&&!this._sRenderMonth){var t=this;this._sRenderMonth=jQuery.sap.delayedCall(0,this,e,[t])}}};sap.ui.unified.Calendar.prototype.setLocale=function(L){if(this._sLocale!=L){this._sLocale=L;this._oLocaleData=undefined;this.invalidate()}return this};sap.ui.unified.Calendar.prototype.getLocale=function(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString()}return this._sLocale};sap.ui.unified.Calendar.prototype._getFocusedDate=function(){if(!this._oFocusedDate){var t=this;j(t)}return this._oFocusedDate};sap.ui.unified.Calendar.prototype._setFocusedDate=function(D){this._oFocusedDate=new Date(D)};sap.ui.unified.Calendar.prototype.focusDate=function(D){if(D&&!this._oFocusedDate||this._oFocusedDate.getTime()!=D.getTime()){this._setFocusedDate(g(D));if(this.getDomRef()&&this._iMode==0){var t=this;e(t)}}};sap.ui.unified.Calendar.prototype.setPopupMode=function(P){this._bPoupupMode=P};sap.ui.unified.Calendar.prototype._getLocaleData=function(){if(!this._oLocaleData){var L=this.getLocale();var i=new sap.ui.core.Locale(L);this._oLocaleData=sap.ui.core.LocaleData.getInstance(i)}return this._oLocaleData};sap.ui.unified.Calendar.prototype.onclick=function(E){if(E.isMarked("delayedMouseEvent")){return}var t=this;var F=this._getFocusedDate();if(jQuery.sap.containsOrEquals(this.getDomRef("next"),E.target)){switch(this._iMode){case 0:F.setUTCMonth(F.getUTCMonth()+1,1);e(t);break;case 1:F.setUTCFullYear(F.getUTCFullYear()+1);this.$("year").text(F.getUTCFullYear());break;case 2:q(t,true,this._oItemNavigation.getFocusedIndex());break}}else if(jQuery.sap.containsOrEquals(this.getDomRef("prev"),E.target)){switch(this._iMode){case 0:F.setUTCDate(1);F.setUTCDate(F.getUTCDate()-1);e(t);break;case 1:F.setUTCFullYear(F.getUTCFullYear()-1);this.$("year").text(F.getUTCFullYear());break;case 2:q(t,false,this._oItemNavigation.getFocusedIndex());break}}else if(E.target.id==this.getId()+"-month"){if(this._iMode!=1){k(t)}else{l(t)}this.addDelegate(this._oItemNavigation)}else if(E.target.id==this.getId()+"-year"){if(this._iMode!=2){n(t)}else{o(t)}this.addDelegate(this._oItemNavigation)}else if(E.target.id==this.getId()+"-cancel"){this.onsapescape(E)}};sap.ui.unified.Calendar.prototype._handleMouseMove=function(E){if(!this.$().is(":visible")){jQuery(window.document).unbind('mousemove',this._mouseMoveProxy);this._bMouseMove=undefined}var t=jQuery(E.target);if(t.hasClass("sapUiCalDayNum")){t=t.parent()}if(t.hasClass("sapUiCalDay")){var F=this._getFocusedDate();var O=F;F=this._oFormatYyyymmdd.parse(t.attr("data-sap-day"),true);this._setFocusedDate(F);if(F.getTime()!=O.getTime()){var i=this;if(t.hasClass("sapUiCalDayOtherMonth")){e(i)}else{h(i,F,false,true);this._bMoveChange=true}}}};sap.ui.unified.Calendar.prototype.onmouseup=function(E){if(this._bMouseMove){jQuery(window.document).unbind('mousemove',this._mouseMoveProxy);this._bMouseMove=undefined;var F=this._getFocusedDate();var D=this.$("days").children(".sapUiCalDay");for(var i=0;i<D.length;i++){var $=jQuery(D[i]);if(!$.hasClass("sapUiCalDayOtherMonth")){if($.attr("data-sap-day")==this._oFormatYyyymmdd.format(F,true)){$.focus();break}}}if(this._bMoveChange){var t=this;h(t,F);this._bMoveChange=false;s(t)}}};sap.ui.unified.Calendar.prototype.onsapselect=function(E){var t=this;var i=0;switch(this._iMode){case 0:if(jQuery.sap.containsOrEquals(this.getDomRef("days"),E.target)){h(t,t._getFocusedDate());s(t);E.stopPropagation();E.preventDefault()}break;case 1:if(jQuery.sap.containsOrEquals(this.getDomRef("months"),E.target)){i=this._oItemNavigation.getFocusedIndex();m(t,i)}break;case 2:if(jQuery.sap.containsOrEquals(this.getDomRef("years"),E.target)){i=this._oItemNavigation.getFocusedIndex();p(t,i)}break}};sap.ui.unified.Calendar.prototype.onsapselectmodifiers=function(E){this.onsapselect(E)};sap.ui.unified.Calendar.prototype.onsapescape=function(E){var t=this;switch(this._iMode){case 0:this.fireCancel();break;case 1:l(t);break;case 2:o(t);break}};sap.ui.unified.Calendar.prototype.onsapshow=function(E){if(this._bPoupupMode){var t=this;switch(this._iMode){case 1:l(t);break;case 2:o(t);break}this.fireCancel()}};sap.ui.unified.Calendar.prototype.onsaphide=sap.ui.unified.Calendar.prototype.onsapshow;sap.ui.unified.Calendar.prototype.onsappageupmodifiers=function(E){if(jQuery.sap.containsOrEquals(this.getDomRef("days"),E.target)){var F=this._getFocusedDate();var t=this;var y=F.getUTCFullYear();if(!!(E.metaKey||E.ctrlKey)){F.setUTCFullYear(y-10)}else{F.setUTCFullYear(y-1)}e(t)}E.preventDefault()};sap.ui.unified.Calendar.prototype.onsappagedownmodifiers=function(E){if(jQuery.sap.containsOrEquals(this.getDomRef("days"),E.target)){var F=this._getFocusedDate();var t=this;var y=F.getUTCFullYear();if(!!(E.metaKey||E.ctrlKey)){F.setUTCFullYear(y+10)}else{F.setUTCFullYear(y+1)}e(t)}E.preventDefault()};sap.ui.unified.Calendar.prototype.onsappageup=function(E){if(E.target.id==this.getId()+"-month"||E.target.id==this.getId()+"-year"){E.preventDefault()}};sap.ui.unified.Calendar.prototype.onsappagedown=sap.ui.unified.Calendar.prototype.onsappageup;sap.ui.unified.Calendar.prototype.onsaptabnext=function(E){if(jQuery.sap.containsOrEquals(this.getDomRef("days"),E.target)||jQuery.sap.containsOrEquals(this.getDomRef("months"),E.target)||jQuery.sap.containsOrEquals(this.getDomRef("years"),E.target)){jQuery.sap.focus(this.getDomRef("month"));if(!this._bPoupupMode){jQuery(this._oItemNavigation.getItemDomRefs()[this._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1")}this.removeDelegate(this._oItemNavigation);E.preventDefault()}else if(E.target.id==this.getId()+"-month"){jQuery.sap.focus(this.getDomRef("year"));this.removeDelegate(this._oItemNavigation);E.preventDefault()}else if(E.target.id==this.getId()+"-year"){this.addDelegate(this._oItemNavigation)}};sap.ui.unified.Calendar.prototype.onsaptabprevious=function(E){if(jQuery.sap.containsOrEquals(this.getDomRef("days"),E.target)||jQuery.sap.containsOrEquals(this.getDomRef("months"),E.target)||jQuery.sap.containsOrEquals(this.getDomRef("years"),E.target)){if(this._bPoupupMode){jQuery.sap.focus(this.getDomRef("year"));this.removeDelegate(this._oItemNavigation);E.preventDefault()}}else if(E.target.id==this.getId()+"-month"){this.addDelegate(this._oItemNavigation);this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());E.preventDefault()}else if(E.target.id==this.getId()+"-year"){jQuery.sap.focus(this.getDomRef("month"));E.preventDefault()}};sap.ui.unified.Calendar.prototype.onsapnext=function(E){if(E.target.id==this.getId()+"-month"||E.target.id==this.getId()+"-year"){E.preventDefault()}};sap.ui.unified.Calendar.prototype.onsapprevious=sap.ui.unified.Calendar.prototype.onsapnext;sap.ui.unified.Calendar.prototype.onfocusin=function(E){if(E.target.id==this.getId()+"-end"){jQuery.sap.focus(this.getDomRef("year"));jQuery(this._oItemNavigation.getItemDomRefs()[this._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");this.removeDelegate(this._oItemNavigation)}jQuery.sap.byId(this.getId()+"-end").attr("tabindex","-1")};sap.ui.unified.Calendar.prototype.onsapfocusleave=function(E){if(!E.relatedControlId||!jQuery.sap.containsOrEquals(this.getDomRef(),sap.ui.getCore().byId(E.relatedControlId).getFocusDomRef())){jQuery.sap.byId(this.getId()+"-end").attr("tabindex","0");this.addDelegate(this._oItemNavigation)}};sap.ui.unified.Calendar.prototype._checkDateSelected=function(D){var S=0;var t=this.getSelectedDates();var T=D.getTime();for(var i=0;i<t.length;i++){var R=t[i];var u=g(R.getStartDate());var v=undefined;var w=0;if(u){v=u;w=v.getTime()}var E=undefined;var x=0;if(this.getIntervalSelection()){u=g(R.getEndDate());if(u){E=u;x=E.getTime()}}if(T==w&&!E){S=1;break}else if(T==w&&E){S=2;if(E&&T==x){S=5}break}else if(E&&T==x){S=3;break}else if(E&&T>w&&T<x){S=4;break}if(this.getSingleSelection()){break}}return S};function _(C){var I=C.getParameter("index");var E=C.getParameter("event");if(!E){return}var t=this;if(this._iMode==0){var D=this.$("days").children(".sapUiCalDay");var F=this._getFocusedDate();var $=jQuery(D[I]);if($.hasClass("sapUiCalDayOtherMonth")){if(E.type=="saphomemodifiers"&&(E.metaKey||E.ctrlKey)){F.setUTCDate(1);for(var i=0;i<D.length;i++){var u=jQuery(D[i]);if(this._oFormatYyyymmdd.parse(u.attr("data-sap-day"),true).getUTCDate()==1){this._oItemNavigation.focusItem(i);break}}}else if(E.type=="sapendmodifiers"&&(E.metaKey||E.ctrlKey)){for(var i=D.length-1;i>0;i--){var u=jQuery(D[i]);if(!u.hasClass("sapUiCalDayOtherMonth")){F=this._oFormatYyyymmdd.parse(u.attr("data-sap-day"),true);this._setFocusedDate(F);this._oItemNavigation.focusItem(i);break}}}else{F=this._oFormatYyyymmdd.parse($.attr("data-sap-day"),true);this._setFocusedDate(F);e(t)}}else{if(!jQuery(E.target).hasClass("sapUiCalWeekNum")){F=this._oFormatYyyymmdd.parse($.attr("data-sap-day"),true);this._setFocusedDate(F)}}}if(E.type=="mousedown"){b(t,E,F,I)}};function a(C){var i=C.getParameter("index");var E=C.getParameter("event");if(!E){return}if(E.type=="mousedown"){var t=this;var F=this._getFocusedDate();b(t,E,F,i)}};function b(t,E,F,i){switch(t._iMode){case 0:h(t,F,E.shiftKey);s(t);if(t.getIntervalSelection()&&t.$().is(":visible")){jQuery(window.document).bind('mousemove',t._mouseMoveProxy);t._bMouseMove=true}break;case 1:m(t,i);break;case 2:p(t,i);break}E.preventDefault();E.setMark("cancelAutoClose")};function c(C){var i=C.getParameter("index");var E=C.getParameter("event");var M=0;var F=this._getFocusedDate();if(E.type){var t=this;switch(this._iMode){case 0:switch(E.type){case"sapnext":case"sapnextmodifiers":if(E.keyCode==jQuery.sap.KeyCodes.ARROW_DOWN){F.setUTCDate(F.getUTCDate()+7)}else{F.setUTCDate(F.getUTCDate()+1)}break;case"sapprevious":case"sappreviousmodifiers":if(E.keyCode==jQuery.sap.KeyCodes.ARROW_UP){F.setUTCDate(F.getUTCDate()-7)}else{F.setUTCDate(F.getUTCDate()-1)}break;case"sappagedown":M=F.getUTCMonth()+1;F.setUTCMonth(M);if(M%12!=F.getUTCMonth()){while(M!=F.getUTCMonth()){F.setUTCDate(F.getUTCDate()-1)}}break;case"sappageup":M=F.getUTCMonth()-1;F.setUTCMonth(M);if(M<0){M=11}if(M!=F.getUTCMonth()){while(M!=F.getUTCMonth()){F.setUTCDate(F.getUTCDate()-1)}}break;default:break}e(t);break;case 1:break;case 2:switch(E.type){case"sapnext":case"sapnextmodifiers":if(E.keyCode==jQuery.sap.KeyCodes.ARROW_DOWN){q(t,true,this._oItemNavigation.getFocusedIndex()-16)}else{q(t,true,0)}break;case"sapprevious":case"sappreviousmodifiers":if(E.keyCode==jQuery.sap.KeyCodes.ARROW_UP){q(t,false,16+this._oItemNavigation.getFocusedIndex())}else{q(t,false,19)}break;case"sappagedown":q(t,true,this._oItemNavigation.getFocusedIndex());break;case"sappageup":q(t,false,this._oItemNavigation.getFocusedIndex());break;default:break}break}}};function d(t){var D=t._getFocusedDate();var y=t._oFormatYyyymmdd.format(D,true);var u=[];var R;var I=0;var C=0;var N=false;var v=true;switch(t._iMode){case 0:R=t.$("days").get(0);u=t.$("days").children(".sapUiCalDay");for(var i=0;i<u.length;i++){var $=jQuery(u[i]);if($.attr("data-sap-day")===y){I=i}}C=7;N=true;v=false;break;case 1:R=t.$("months").get(0);u=t.$("months").children(".sapUiCalMonth");I=D.getUTCMonth();C=3;break;case 2:R=t.$("years").get(0);u=t.$("years").children(".sapUiCalYear");I=10;C=4;N=true;v=false;break}if(!t._oItemNavigation){t._oItemNavigation=new sap.ui.core.delegate.ItemNavigation();t._oItemNavigation.attachEvent(sap.ui.core.delegate.ItemNavigation.Events.AfterFocus,_,t);t._oItemNavigation.attachEvent(sap.ui.core.delegate.ItemNavigation.Events.FocusAgain,a,t);t._oItemNavigation.attachEvent(sap.ui.core.delegate.ItemNavigation.Events.BorderReached,c,t);t.addDelegate(t._oItemNavigation);t._oItemNavigation.setHomeEndColumnMode(true,true);t._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]})}t._oItemNavigation.setRootDomRef(R);t._oItemNavigation.setItemDomRefs(u);t._oItemNavigation.setCycling(v);t._oItemNavigation.setColumns(C,N);t._oItemNavigation.setFocusedIndex(I);t._oItemNavigation.setPageSize(u.length)};function e(t){this._sRenderMonth=undefined;var D=t._getFocusedDate();var C=t.$("days");if(C.length>0){var R=sap.ui.getCore().createRenderManager();t.getRenderer().renderDays(R,t,D);R.flush(C[0]);R.destroy()}t.fireEvent("_renderMonth",{days:C.children(".sapUiCalDay").length});var M=[];if(t._bLongMonth||!t._bNamesLengthChecked){M=t._getLocaleData().getMonthsStandAlone("wide")}else{M=t._getLocaleData().getMonthsStandAlone("abbreviated")}t.$("month").text(M[D.getUTCMonth()]);t.$("year").text(D.getUTCFullYear());d(t);t._oItemNavigation.focusItem(t._oItemNavigation.getFocusedIndex())};function f(D){if(D){return new Date(D.getTime()+D.getTimezoneOffset()*60000)}}function g(D){if(D){return new Date(Date.UTC(D.getFullYear(),D.getMonth(),D.getDate()))}}function h(t,D,I,M){var S=t.getSelectedDates();var u;var F=t._getFocusedDate();var v=t.$("days").children(".sapUiCalDay");if(t.getSingleSelection()){var w=undefined;if(S.length>0){u=S[0];w=g(u.getStartDate())}else{u=new sap.ui.unified.DateRange();t.addAggregation("selectedDates",u,true)}if(t.getIntervalSelection()&&(!u.getEndDate()||M)&&w){var E=undefined;if(D.getTime()<w.getTime()){E=w;w=D;if(!M){u.setProperty("startDate",f(w),true);u.setProperty("endDate",f(E),true)}}else if(D.getTime()>=w.getTime()){E=D;if(!M){u.setProperty("endDate",f(E),true)}}var x;var y=0;for(var i=0;i<v.length;i++){var $=jQuery(v[i]);x=t._oFormatYyyymmdd.parse($.attr("data-sap-day"),true);if(x.getTime()==w.getTime()){$.addClass("sapUiCalDaySelStart");$.addClass("sapUiCalDaySel");if(E&&x.getTime()==E.getTime()){$.addClass("sapUiCalDaySelEnd")}}else if(E&&x.getTime()>w.getTime()&&x.getTime()<E.getTime()){$.addClass("sapUiCalDaySel");$.addClass("sapUiCalDaySelBetween")}else if(E&&x.getTime()==E.getTime()){$.addClass("sapUiCalDaySelEnd");$.addClass("sapUiCalDaySel")}else{if($.hasClass("sapUiCalDaySel")){$.removeClass("sapUiCalDaySel")}if($.hasClass("sapUiCalDaySelStart")){$.removeClass("sapUiCalDaySelStart")}else if($.hasClass("sapUiCalDaySelBetween")){$.removeClass("sapUiCalDaySelBetween")}else if($.hasClass("sapUiCalDaySelEnd")){$.removeClass("sapUiCalDaySelEnd")}}}}else{var Y=t._oFormatYyyymmdd.format(D,true);for(var i=0;i<v.length;i++){var $=jQuery(v[i]);if(!$.hasClass("sapUiCalDayOtherMonth")&&$.attr("data-sap-day")==Y){$.addClass("sapUiCalDaySel")}else if($.hasClass("sapUiCalDaySel")){$.removeClass("sapUiCalDaySel")}if($.hasClass("sapUiCalDaySelStart")){$.removeClass("sapUiCalDaySelStart")}else if($.hasClass("sapUiCalDaySelBetween")){$.removeClass("sapUiCalDaySelBetween")}else if($.hasClass("sapUiCalDaySelEnd")){$.removeClass("sapUiCalDaySelEnd")}}u.setProperty("startDate",f(D),true);u.setProperty("endDate",undefined,true)}}else{if(t.getIntervalSelection()){throw new Error("Calender don't support multiple interval selection")}else{var z=t._checkDateSelected(D);if(z>0){for(var i=0;i<S.length;i++){if(S[i].getStartDate()&&D.getTime()==g(S[i].getStartDate()).getTime()){t.removeAggregation("selectedDates",i,true);break}}}else{u=new sap.ui.unified.DateRange({startDate:f(D)});t.addAggregation("selectedDates",u,true)}var Y=t._oFormatYyyymmdd.format(D,true);for(var i=0;i<v.length;i++){var $=jQuery(v[i]);if(!$.hasClass("sapUiCalDayOtherMonth")&&$.attr("data-sap-day")==Y){if(z>0){$.removeClass("sapUiCalDaySel")}else{$.addClass("sapUiCalDaySel")}}}}}};function j(t){var S=t.getSelectedDates();if(S&&S[0]&&S[0].getStartDate()){t._oFocusedDate=g(S[0].getStartDate())}else{var i=new Date();t._oFocusedDate=g(i)}};function k(t){if(t._iMode==2){o(t)}var D=t._getFocusedDate();var R=sap.ui.getCore().createRenderManager();var C=t.$();t.getRenderer().renderMonthPicker(R,t,D);R.flush(C[0],false,true);R.destroy();t._iMode=1;jQuery(t._oItemNavigation.getItemDomRefs()[t._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");d(t);jQuery.sap.focus(t._oItemNavigation.getItemDomRefs()[t._oItemNavigation.getFocusedIndex()])};function l(t){t.$("months").remove();t._iMode=0;d(t);jQuery.sap.focus(t._oItemNavigation.getItemDomRefs()[t._oItemNavigation.getFocusedIndex()])};function m(t,M){var F=t._getFocusedDate();F.setUTCMonth(M);if(M!=F.getUTCMonth()){var D=F.getUTCDate();F.setUTCDate(0)}e(t);l(t)};function n(t){if(t._iMode==1){l(t)}var D=t._getFocusedDate();var R=sap.ui.getCore().createRenderManager();var C=t.$();t.getRenderer().renderYearPicker(R,t,D);R.flush(C[0],false,true);R.destroy();var i=t.$("days").children(".sapUiCalDay");if(i.length==28){t.$("years").addClass("sapUiCalYearNoTop")}t._iMode=2;jQuery(t._oItemNavigation.getItemDomRefs()[t._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");d(t);jQuery.sap.focus(t._oItemNavigation.getItemDomRefs()[t._oItemNavigation.getFocusedIndex()])};function o(t){t.$("years").remove();t._iMode=0;d(t);jQuery.sap.focus(t._oItemNavigation.getItemDomRefs()[t._oItemNavigation.getFocusedIndex()])};function p(t,i){var F=t._getFocusedDate();var D=t.$("years").children(".sapUiCalYear");var y=jQuery(D[i]).text();F.setUTCFullYear(y);e(t);o(t)};function q(t,F,S){var D=t.$("years").children(".sapUiCalYear");var u=parseInt(jQuery(D[0]).text());var v=t._getFocusedDate();var C=v.getUTCFullYear().toString();if(F){u=u+20}else{u=u-20}var y=u;for(var i=0;i<D.length;i++){var $=jQuery(D[i]);$.attr("id",t.getId()+"-y"+y);$.text(y);if($.hasClass("sapUiCalYearSel")&&$.text()!=C){$.removeClass("sapUiCalYearSel")}else if(!$.hasClass("sapUiCalYearSel")&&$.text()==C){$.addClass("sapUiCalYearSel")}y++}t._oItemNavigation.focusItem(S)};function r(t){if(!t._bNamesLengthChecked){var w=t.$().children(".sapUiCalWH");var T=false;for(var i=0;i<w.length;i++){var W=w[i];if(W.clientWidth<W.scrollWidth){T=true;break}}if(T){t._bLongWeekDays=false;var L=t._getLocaleData();var F=L.getFirstDayOfWeek();var D=L.getDaysStandAlone("narrow");for(i=0;i<D.length;i++){var W=w[i];jQuery(W).text(D[(i+F)%7])}}else{t._bLongWeekDays=true}k(t);var M=t.$("months").children();T=false;for(i=0;i<M.length;i++){var u=M[i];if(u.clientWidth<u.scrollWidth){T=true;break}}if(T){t._bLongMonth=false;if(!L){L=t._getLocaleData()}var v=L.getMonthsStandAlone("abbreviated");var x=t._getFocusedDate();t.$("month").text(v[x.getUTCMonth()])}else{t._bLongMonth=true}l(t);t._bNamesLengthChecked=true}};function s(t){if(t._bMouseMove){jQuery(window.document).unbind('mousemove',t._mouseMoveProxy);t._bMouseMove=undefined}t.fireSelect()}}());
