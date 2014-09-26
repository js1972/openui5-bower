/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Core','sap/ui/core/Popup','jquery.sap.strings'],function(q,C,P){"use strict";var T={open:function(c){function s(o){if(o&&window.JSON){return window.JSON.stringify(o)}if(o===""){return'""'}return""+o+(o?"???":"")}function l(o,p){p=p||'';if(!p){h.push("<table border='0' cellspacing='0' cellpadding='0'>")}q.each(o,function(i,v){if(!v||typeof v==='string'||typeof v==='number'||v instanceof Date){h.push("<tr><td>",p,"<b>",q.sap.escapeHTML(s(i)),"</b></td><td>",q.sap.escapeHTML(s(v)),"</td></tr>")}else{h.push("<tr><td>",p,"<b>",q.sap.escapeHTML(s(i)),"</b></td><td></td></tr>");l(v,p+"&nbsp;&nbsp;")}});if(!p){h.push("</table>")}}var a=this._ojQSData=c()||{};var b=false,L=false,e=true;if(q.sap.getObject("sap.ui.debug.DebugEnv")){b=sap.ui.debug.DebugEnv.getInstance().isControlTreeShown();L=sap.ui.debug.DebugEnv.getInstance().isTraceWindowShown();e=sap.ui.debug.DebugEnv.getInstance().isRunningEmbedded()}var d="/sapui5-internal/download/index.jsp";var D=q.sap.syncHead(d);var O="/sapui5-sdk-dist/optimize-module-set";var f=q.sap.syncHead(O);if(!f){O="/demokit/optimize-module-set";f=q.sap.syncHead(O)}var u=q.sap.debug();var U=q.sap.statistics();var w=q.sap.uid();var W=sap.ui.getCore().getConfiguration().getWeinreServer()+"/client/#"+w;{var h=[];h.push("<div id='sap-ui-techinfo' class='sapUiTInf sapUiDlg' style='width:640px; position: relative;'>");h.push("<table border='0' cellpadding='3'>");try{var V=sap.ui.getVersionInfo();var g="<a href='"+sap.ui.resource("","sap-ui-version.json")+"' target='_blank' title='Open Version Info'>"+V.version+"</a>";h.push("<tr><td align='right' valign='top'><b>SAPUI5 Version</b></td><td>",g," (built at ",V.buildTimestamp,", last change ",V.scmRevision,")</td></tr>")}catch(j){h.push("<tr><td align='right' valign='top'><b>SAPUI5 Version</b></td><td>not available</td></tr>")}h.push("<tr><td align='right' valign='top'><b>Core Version</b></td><td>",sap.ui.version," (built at ",sap.ui.buildinfo.buildtime,", last change ",sap.ui.buildinfo.lastchange,")</td></tr>");h.push("<tr><td align='right' valign='top'><b>User Agent</b></td><td>",q.sap.escapeHTML(navigator.userAgent),(document.documentMode?", Document Mode '"+document.documentMode+"'":""),"</td></tr>");h.push("<tr><td align='right' valign='top'><b>Configuration</b></td><td class='sapUiTInfCfg'>");l(a.config);h.push("</td></tr>");h.push("<tr><td align='right' valign='top'><b>Loaded Modules</b></td><td><div id='sap-ui-techinfo-modules' class='sapUiTInfMList'>");this._renderModules(h,20);h.push("</div></td></tr>");if(D){h.push("<tr><td></td><td><a id=\"sap-ui-techinfo-customModule\" href=\""+d+"\">Create Custom Bootstrap Module</a></td></tr>")}if(f){h.push("<tr><td></td><td><a id=\"sap-ui-techinfo-optimizeModuleSet\" href=\""+O+"\">Calculate Optimized Module Set URL</a></td></tr>")}h.push("<tr><td align='right' valign='top' rowSpan='4'><b>Debug Tools</b></td>","<td><input id='sap-ui-techinfo-useDbgSources' type='checkbox'",u?" checked='checked'":"","><span ",">Use Debug Sources (reload)</span></input></td></tr>");h.push("<tr><td><input id='sap-ui-techinfo-showControls' type='checkbox'",b?" checked='checked'":"",e?"":" readonly='readonly'","><span ",e?"":" style='color:grey'",">Show UIAreas, Controls and Properties</span></input></td></tr>");h.push("<tr><td><input id='sap-ui-techinfo-showLogViewer' type='checkbox' ",L?" checked='checked'":"",e?"":" readonly='readonly' style='color:grey'","><span ",e?"":" style='color:grey'",">Show Log Viewer</span></input></td></tr>");h.push("<tr><td><input id='sap-ui-techinfo-useStatistics' type='checkbox' ",U?" checked='checked'":"","><span ",">Enable SAP-statistics for oData calls</span></input></td></tr>");h.push("<tr><td colspan='2' align='center' valign='bottom' height='40'><button id='sap-ui-techinfo-close' class='sapUiBtn sapUiBtnS sapUiBtnNorm sapUiBtnStd'>Close</button></td></tr>");h.push("</table>");if(D){h.push("<form id=\"sap-ui-techinfo-submit\" target=\"_blank\" method=\"post\" action=\""+d+"\">");h.push("<input type=\"hidden\" name=\"modules\"/>");h.push("</form>")}if(f){h.push("<form id=\"sap-ui-techinfo-optimize-submit\" target=\"_blank\" method=\"post\" action=\""+O+"\">");h.push("<input type=\"hidden\" name=\"version\"/>");h.push("<input type=\"hidden\" name=\"libs\"/>");h.push("<input type=\"hidden\" name=\"modules\"/>");h.push("</form>")}if(sap.ui.getCore().getConfiguration().getRTL()){h.push("<div style='position: absolute; bottom: 5px; left: 5px; text-align: left'>")}else{h.push("<div style='position: absolute; bottom: 5px; right: 5px; text-align: right'>")}h.push("<canvas id='sap-ui-techinfo-qrcode' width='0' height='0'></canvas>");h.push("<br><a id='sap-ui-techinfo-weinre' href=\""+W+"\" target=\"_blank\">Remote Web Inspector</a>");h.push("</div></div>");this._$Ref=q(h.join(""));this._$Ref.find('#sap-ui-techinfo-useDbgSources').click(q.proxy(this.onUseDbgSources,this));this._$Ref.find('#sap-ui-techinfo-showControls').click(q.proxy(this.onShowControls,this));this._$Ref.find('#sap-ui-techinfo-showLogViewer').click(q.proxy(this.onShowLogViewer,this));this._$Ref.find('#sap-ui-techinfo-more').click(q.proxy(this.onShowAllModules,this));this._$Ref.find('#sap-ui-techinfo-close').click(q.proxy(this.close,this));this._$Ref.find('#sap-ui-techinfo-customModule').click(q.proxy(this.onCreateCustomModule,this));this._$Ref.find('#sap-ui-techinfo-optimizeModuleSet').click(q.proxy(this.onOptimizeModuleSet,this));this._$Ref.find('#sap-ui-techinfo-weinre').click(q.proxy(this.onOpenWebInspector,this));this._$Ref.find('#sap-ui-techinfo-useStatistics').click(q.proxy(this.onUseStatistics,this))}this._oPopup=new P(this._$Ref.get(0),true,true,false);var k=!!!sap.ui.Device.browser.internet_explorer||!!sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version>8;var m=k&&q.sap.sjax({type:"HEAD",url:sap.ui.resource("sap.ui.dev","library.js")}).success;if(m){var t=this;this._oPopup.attachOpened(function(E){this._$().css("z-index","1000000");q.sap.require("sap.ui.dev.qrcode.QRCode");if(sap.ui.dev.qrcode.QRCode._renderQRCode){var A=window.location.href,i=A+(A.indexOf("?")>0?"&":"?")+"sap-ui-weinreId="+w;sap.ui.dev.qrcode.QRCode._renderQRCode(q.sap.domById("sap-ui-techinfo-qrcode"),i)}})}this._oPopup.open(400)},close:function(){this._oPopup.destroy();this._oPopup=undefined;this._$Ref.remove();this._$Ref=undefined;this._ojQSData=undefined},_renderModules:function(h,l){var c={"5":" sapUiTInfMFail"};var m=this._ojQSData.modules;var d=[];q.each(m,function(n,o){if(o.state>0){d.push(n)}});d.sort();var M=(l&&d.length>l)?d.length-l:0;if(M){d.sort(function(a,b){if(a===b){return 0}var i=m[a].url?1:0;var e=m[b].url?1:0;if(i!=e){return e-i}return a<b?-1:1});d=d.slice(0,l)}q.each(d,function(i,v){var a=m[v];h.push("<span"," title='",a.url?q.sap.escapeHTML(a.url):("embedded in "+a.parent),"'"," class='sapUiTInfM",c[a.state]||"","'>",v,",</span> ")});if(M){h.push("<span id='sap-ui-techinfo-more' title='Show all modules' class='sapUiTInfMMore'>...("+M+" more)</span>")}},onShowAllModules:function(e){var h=[];this._renderModules(h,0);this._$Ref.find("[id=sap-ui-techinfo-modules]").html(h.join(""))},onCreateCustomModule:function(e){e.preventDefault();e.stopPropagation();var m=[];q.each(this._ojQSData.modules,function(i,v){m.push(i)});m.sort();q("input[name='modules']",this._$Ref).attr("value",m.join(","));q("form",this._$Ref)[0].submit()},onOptimizeModuleSet:function(e){e.preventDefault();e.stopPropagation();var l=[];q.each(sap.ui.getCore().getLoadedLibraries(),function(i,v){l.push(i)});var m=[];q.each(this._ojQSData.modules,function(n,M){if(M.state>=0){m.push(n)}});m.sort();var f=q("#sap-ui-techinfo-optimize-submit",this._$Ref);q("input[name='version']",f).attr("value","2.0");q("input[name='libs']",f).attr("value",l.join(","));q("input[name='modules']",f).attr("value",m.join(","));f[0].submit()},ensureDebugEnv:function(s){if(!q.sap.getObject("sap.ui.debug.DebugEnv")){try{q.sap.require("sap-ui-debug");if(!s){sap.ui.debug.DebugEnv.getInstance().hideControlTree();sap.ui.debug.DebugEnv.getInstance().hidePropertyList()}}catch(e){return false}}return true},onShowControls:function(e){if(e.target.readOnly){e.preventDefault();e.stopPropagation();return}if(this.ensureDebugEnv(true)){if(e.target.checked){sap.ui.debug.DebugEnv.getInstance().showControlTree();sap.ui.debug.DebugEnv.getInstance().showPropertyList()}else{sap.ui.debug.DebugEnv.getInstance().hideControlTree();sap.ui.debug.DebugEnv.getInstance().hidePropertyList()}}},onShowLogViewer:function(e){if(e.target.readOnly){e.preventDefault();e.stopPropagation();return}if(this.ensureDebugEnv(false)){if(e.target.checked){sap.ui.debug.DebugEnv.getInstance().showTraceWindow()}else{sap.ui.debug.DebugEnv.getInstance().hideTraceWindow()}}},onUseDbgSources:function(e){var u=q.sap.debug(!!e.target.checked)},onUseStatistics:function(e){var s=q.sap.statistics(!!e.target.checked)},onOpenWebInspector:function(e){if(!sap.ui.getCore().getConfiguration().getWeinreServer()){alert("Cannot start Web Inspector - WEINRE server is not configured.");e.preventDefault()}else if(!!!sap.ui.Device.browser.webkit){alert("Cannot start Web Inspector - WEINRE only runs on WebKit, please use Chrome or Safari.");e.preventDefault()}}};return T},true);
