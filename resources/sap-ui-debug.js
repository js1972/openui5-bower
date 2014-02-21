jQuery.sap.declare('sap-ui-debug');if(!jQuery.sap.isDeclared('sap.ui.debug.DebugEnv')){
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.debug.DebugEnv");if(!jQuery.sap.isDeclared('sap.ui.debug.ControlTree')){jQuery.sap.declare("sap.ui.debug.ControlTree");jQuery.sap.require('sap.ui.base.EventProvider');sap.ui.base.EventProvider.extend("sap.ui.debug.ControlTree",{constructor:function(c,w,p,r){sap.ui.base.EventProvider.apply(this,arguments);this.oWindow=w;this.oDocument=w.document;this.oCore=c;this.oSelectedNode=null;this.oParentDomRef=p;this.oSelectionHighlighter=new sap.ui.debug.Highlighter("sap-ui-testsuite-SelectionHighlighter");this.oHoverHighlighter=new sap.ui.debug.Highlighter("sap-ui-testsuite-HoverHighlighter",true,'#c8f',1);var t=this;jQuery(p).bind("click",function(e){t.onclick(e)}).bind("mouseover",function(e){t.onmouseover(e)}).bind("mouseout",function(e){t.onmouseout(e)});this.enableInplaceControlSelection();this.oCore.attachUIUpdated(this.renderDelayed,this);this.sSelectedNodeId="";this.sResourcePath=r?jQuery.sap.getModulePath("","/"):(window.top.testfwk.sResourceRoot||"../");this.sTestResourcePath=this.sResourcePath+"../test-resources/";this.sSpaceUrl=this.sResourcePath+"sap/ui/debug/images/space.gif";this.sMinusUrl=this.sResourcePath+"sap/ui/debug/images/minus.gif";this.sPlusUrl=this.sResourcePath+"sap/ui/debug/images/plus.gif";this.sLinkUrl=this.sResourcePath+"sap/ui/debug/images/link.gif"}});sap.ui.debug.ControlTree.M_EVENTS={SELECT:"SELECT"};sap.ui.debug.ControlTree.prototype.exit=function(){jQuery(document).unbind();jQuery(this.oParentDomRef).unbind()};sap.ui.debug.ControlTree.prototype.renderDelayed=function(){if(this.oTimer){this.oWindow.jQuery.sap.clearDelayedCall(this.oTimer)}this.oTimer=this.oWindow.jQuery.sap.delayedCall(0,this,"render")};sap.ui.debug.ControlTree.prototype.render=function(){var d=this.oParentDomRef;var u=null,U=this.oCore.mUIAreas;d.innerHTML="";for(var i in U){var u=U[i],D=this.createTreeNodeDomRef(u.getId(),0,"UIArea",this.sTestResourcePath+"sap/ui/core/images/controls/sap.ui.core.UIArea.gif");d.appendChild(D);var r=u.getContent();for(var i=0,l=r.length;i<l;i++){this.renderNode(d,r[i],1)}}};sap.ui.debug.ControlTree.prototype.createTreeNodeDomRef=function(i,l,t,I){var d=this.oParentDomRef.ownerDocument.createElement("DIV");d.setAttribute("id","sap-debug-controltree-"+i);var s=t.substring(t.lastIndexOf(".")>-1?t.lastIndexOf(".")+1:0);d.innerHTML="<img style='height:12px;width:12px;display:none' src='"+this.sSpaceUrl+"' align='absmiddle'/><img style='height:16px;width:16px' src='"+I+"' align='absmiddle'/>&nbsp;<span>"+s+" - "+i+"</span>";d.style.overflow="hidden";d.style.whiteSpace="nowrap";d.style.textOverflow="ellipsis";d.style.paddingLeft=(l*16)+"px";d.style.height="20px";d.style.cursor="default";d.setAttribute("sap-type",t);d.setAttribute("sap-id",i);d.setAttribute("sap-expanded","true");d.setAttribute("sap-level",""+l);d.title=t+" - "+i;return d};sap.ui.debug.ControlTree.prototype.createLinkNode=function(p,i,l,t){var d=this.oParentDomRef.ownerDocument.createElement("DIV");d.setAttribute("id","sap-debug-controltreelink-"+i);var s=t?t.substring(t.lastIndexOf(".")>-1?t.lastIndexOf(".")+1:0):"";d.innerHTML="<img style='height:12px;width:12px;display:none' src='"+this.sSpaceUrl+"' align='absmiddle'/><img style='height:12px;width:12px' src='"+this.sLinkUrl+"' align='absmiddle'/>&nbsp;<span style='color:#888;border-bottom:1px dotted #888;'>"+(s?s+" - ":"")+i+"</span>";d.style.overflow="hidden";d.style.whiteSpace="nowrap";d.style.textOverflow="ellipsis";d.style.paddingLeft=(l*16)+"px";d.style.height="20px";d.style.cursor="default";d.setAttribute("sap-type","Link");d.setAttribute("sap-id",i);d.setAttribute("sap-expanded","true");d.setAttribute("sap-level",""+l);d.title="Association to '"+i+"'";p.appendChild(d);return d};sap.ui.debug.ControlTree.prototype.renderNode=function(d,c,l){if(!c){return}var m=c.getMetadata();var I=this.sTestResourcePath+m.getLibraryName().replace(/\./g,"/")+"/images/controls/"+m.getName()+".gif";var D=this.createTreeNodeDomRef(c.getId(),l,m.getName(),I);d.appendChild(D);var r=false;if(c.mAggregations){for(var n in c.mAggregations){r=true;var a=c.mAggregations[n];if(a&&a.length){for(var i=0;i<a.length;i++){var o=a[i];if(o instanceof sap.ui.core.Element){this.renderNode(d,a[i],l+1)}}}else if(a instanceof sap.ui.core.Element){this.renderNode(d,a,l+1)}}}if(c.mAssociations){for(var n in c.mAssociations){r=true;var A=c.mAssociations[n];if(jQuery.isArray(A)){for(var i=0;i<A.length;i++){var o=A[i];if(typeof o==="string"){this.createLinkNode(d,o,l+1)}}}else if(typeof A==="string"){this.createLinkNode(d,A,l+1)}}}if(r){var e=D.getElementsByTagName("IMG")[0];e.src=this.sMinusUrl;e.style.display=""}};sap.ui.debug.ControlTree.prototype.onclick=function(e){var s=e.target;if(s.tagName=="IMG"){var p=s.parentNode,l=parseInt(p.getAttribute("sap-level"),10),n=p.nextSibling,E=p.getAttribute("sap-expanded")=="true";s=p.firstChild;if(n){var N=parseInt(n.getAttribute("sap-level"),10);while(n&&N>l){var o=n.getElementsByTagName("IMG")[0];if(E){n.style.display="none";n.setAttribute("sap-expanded","false");if(o&&o.src!==this.sSpaceUrl){o.src=this.sPlusUrl}}else{n.style.display="block";n.setAttribute("sap-expanded","true");if(o&&o.src!==this.sSpaceUrl){o.src=this.sMinusUrl}}n=n.nextSibling;if(n){N=parseInt(n.getAttribute("sap-level"),10)}}}if(E){s.src=this.sPlusUrl;p.setAttribute("sap-expanded","false")}else{s.src=this.sMinusUrl;p.setAttribute("sap-expanded","true")}}else if(s.getAttribute("sap-type")=="UIArea"){}else{if(s.tagName!="SPAN"){s=s.getElementsByTagName("SPAN")[0]}var p=s.parentNode,i=p.getAttribute("sap-id"),a=this.oCore.getElementById(i),b=p.getAttribute("sap-type")==="Link"?"sap-debug-controltree-"+i:p.id;this.oSelectionHighlighter.hide();if(a&&a instanceof sap.ui.core.Element){this.oSelectionHighlighter.highlight(a.getDomRef());this.oHoverHighlighter.hide()}this.deselectNode(this.sSelectedNodeId);this.selectNode(b)}};sap.ui.debug.ControlTree.prototype.onmouseover=function(e){var s=e.target;if(s.tagName=="SPAN"){this.oHoverHighlighter.highlight(this.getTargetDomRef(s.parentNode))}};sap.ui.debug.ControlTree.prototype.onmouseout=function(e){var s=e.target;if(s.tagName=="SPAN"){if(this.getTargetDomRef(s.parentNode)){this.oHoverHighlighter.hide()}}};sap.ui.debug.ControlTree.prototype.selectNode=function(i){if(!i){return}var d=jQuery.sap.domById(i,jQuery.sap.ownerWindow(this.oParentDomRef));if(!d){jQuery.sap.log.warning("Control with Id '"+i.substring(22)+"' not found in tree");return}var c=d.getAttribute("sap-id");var s=d.getElementsByTagName("SPAN")[0];s.style.backgroundColor="#000066";s.style.color="#FFFFFF";this.sSelectedNodeId=i;this.fireEvent(sap.ui.debug.ControlTree.M_EVENTS.SELECT,{id:i,controlId:c})};sap.ui.debug.ControlTree.prototype.deselectNode=function(i){if(!i){return}var d=jQuery.sap.domById(i,jQuery.sap.ownerWindow(this.oParentDomRef));var s=d.getElementsByTagName("SPAN")[0];s.style.backgroundColor="transparent";s.style.color="#000000";this.sSelectedNodeId=i};sap.ui.debug.ControlTree.prototype.getTargetDomRef=function(t){var T=t.getAttribute("sap-type"),i=t.getAttribute("sap-id"),s=T==="UIArea"?this.oCore.getUIArea(i):this.oCore.getElementById(i);while(s&&s instanceof sap.ui.core.Element){var d=s.getDomRef();if(d){return d}s=s.getParent()}if(s instanceof sap.ui.core.UIArea){return s.getRootNode()}};sap.ui.debug.ControlTree.prototype.enableInplaceControlSelection=function(){var t=this;jQuery(document).bind("mouseover",function(e){t.selectControlInTree(e)})};sap.ui.debug.ControlTree.prototype.selectControlInTree=function(e){if(e){if(e.ctrlKey&&e.shiftKey&&!e.altKey){var c=e.srcElement||e.target;while(c&&(!c.id||!this.oCore.getControl(c.id))){c=c.parentNode}if(c&&c.id&&this.oCore.getControl(c.id)){this.oHoverHighlighter.highlight(c)}else{this.oHoverHighlighter.hide()}}else{this.oHoverHighlighter.hide()}}}};if(!jQuery.sap.isDeclared('sap.ui.debug.Highlighter')){jQuery.sap.declare("sap.ui.debug.Highlighter");jQuery.sap.require('jquery.sap.dom');jQuery.sap.require('jquery.sap.script');sap.ui.debug.Highlighter=function(i,f,c,b){this.sId=i||jQuery.sap.uid();this.bFilled=(f==true);this.sColor=c||'blue';if(isNaN(b)){this.iBorderWidth=2}else if(b<=0){this.iBorderWidth=0}else{this.iBorderWidth=b}};sap.ui.debug.Highlighter.prototype.highlight=function(d){if(!d||!d.parentNode){return}var h=jQuery.sap.domById(this.sId);if(!h){h=d.ownerDocument.createElement("DIV");h.setAttribute("id",this.sId);h.style.position="absolute";h.style.border=this.iBorderWidth+"px solid "+this.sColor;h.style.display="none";h.style.margin="0px";h.style.padding="0px";if(this.bFilled){h.innerHTML="<div style='background-color:"+this.sColor+";opacity:0.2;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=20);height:100%;width:100%'>&nbsp;</div>"}d.ownerDocument.body.appendChild(h)}var r=jQuery(d).rect();h.style.top=(r.top-this.iBorderWidth)+"px";h.style.left=(r.left-this.iBorderWidth)+"px";h.style.width=(r.width)+"px";h.style.height=(r.height)+"px";h.style.display="block"};sap.ui.debug.Highlighter.prototype.hide=function(){var h=jQuery.sap.domById(this.sId);if(!h){return}h.style.display="none"}};if(!jQuery.sap.isDeclared('sap.ui.debug.LogViewer')){jQuery.sap.declare("sap.ui.debug.LogViewer");sap.ui.debug.LogViewer=function(w,r){this.oWindow=w;this.oDomNode=w.document.getElementById(r);if(!this.oDomNode){var d=this.oWindow.document.createElement("DIV");d.setAttribute("id",r);d.style.overflow="auto";d.style.tabIndex="-1";d.style.position="absolute";d.style.bottom="0px";d.style.left="0px";d.style.right="202px";d.style.height="200px";d.style.border="1px solid gray";d.style.fontFamily="Arial monospaced for SAP,monospace";d.style.fontSize="11px";d.style.zIndex="999999";this.oWindow.document.body.appendChild(d);this.oDomNode=d}this.iLogLevel=3;this.sLogEntryClassPrefix=undefined;this.clear();this.setFilter(sap.ui.debug.LogViewer.NO_FILTER)};sap.ui.debug.LogViewer.NO_FILTER=function(l){return true};sap.ui.debug.LogViewer.prototype.clear=function(){this.oDomNode.innerHTML=""};sap.ui.debug.LogViewer.xmlEscape=function(t){t=t.replace(/\&/g,"&amp;");t=t.replace(/\</g,"&lt;");t=t.replace(/\"/g,"&quot;");return t};sap.ui.debug.LogViewer.prototype.addEntry=function(l){var d=this.oWindow.document.createElement("div");if(this.sLogEntryClassPrefix){d.className=this.sLogEntryClassPrefix+l.level}else{d.style.overflow="hidden";d.style.textOverflow="ellipsis";d.style.height="1.3em";d.style.width="100%";d.style.whiteSpace="noWrap"}var t=sap.ui.debug.LogViewer.xmlEscape(l.time+"  "+l.message),T=this.oWindow.document.createTextNode(t);d.appendChild(T);d.title=l.message;d.style.display=this.oFilter(t)?"":"none";this.oDomNode.appendChild(d);return d};sap.ui.debug.LogViewer.prototype.fillFromLogger=function(f){this.clear();this.iFirstEntry=f;if(!this.oLogger){return}var L=this.oLogger.getLog();for(var i=this.iFirstEntry,l=L.length;i<l;i++){if(L[i].level<=this.iLogLevel){this.addEntry(L[i])}}this.scrollToBottom()};sap.ui.debug.LogViewer.prototype.scrollToBottom=function(){this.oDomNode.scrollTop=this.oDomNode.scrollHeight};sap.ui.debug.LogViewer.prototype.truncate=function(){this.clear();this.fillFromLogger(this.oLogger.getLog().length)};sap.ui.debug.LogViewer.prototype.setFilter=function(f){this.oFilter=f=f||sap.ui.debug.LogViewer.NO_FILTER;var c=this.oDomNode.childNodes;for(var i=0,l=c.length;i<l;i++){var t=c[i].innerText;if(!t){t=c[i].innerHTML}c[i].style.display=f(t)?"":"none"}this.scrollToBottom()};sap.ui.debug.LogViewer.prototype.setLogLevel=function(l){this.iLogLevel=l;if(this.oLogger){this.oLogger.setLevel(l)}this.fillFromLogger(this.iFirstEntry)};sap.ui.debug.LogViewer.prototype.lock=function(){this.bLocked=true};sap.ui.debug.LogViewer.prototype.unlock=function(){this.bLocked=false;this.fillFromLogger(0)};sap.ui.debug.LogViewer.prototype.onAttachToLog=function(l){this.oLogger=l;this.oLogger.setLevel(this.iLogLevel);if(!this.bLocked){this.fillFromLogger(0)}};sap.ui.debug.LogViewer.prototype.onDetachFromLog=function(l){this.oLogger=undefined;this.fillFromLogger(0)};sap.ui.debug.LogViewer.prototype.onLogEntry=function(l){if(!this.bLocked){var d=this.addEntry(l);if(d&&d.style.display!=='none'){this.scrollToBottom()}}}};if(!jQuery.sap.isDeclared('sap.ui.debug.PropertyList')){jQuery.sap.declare("sap.ui.debug.PropertyList");jQuery.sap.require('jquery.sap.strings');jQuery.sap.require('sap.ui.base.EventProvider');jQuery.sap.require('sap.ui.base.DataType');jQuery.sap.require('sap.ui.core.Element');jQuery.sap.require('sap.ui.core.Core');sap.ui.base.EventProvider.extend("sap.ui.debug.PropertyList",{constructor:function(c,w,p){sap.ui.base.EventProvider.apply(this,arguments);this.oWindow=w;this.oParentDomRef=p;this.oCore=c;this.bEmbedded=top.window==w;this.mProperties={};var t=this;jQuery(p).bind("click",function(e){t.onclick(e)}).bind("focusin",function(e){t.onfocus(e)}).bind("keydown",function(e){t.onkeydown(e)});if(!this.bEmbedded){jQuery(p).bind("mouseover",function(e){t.onmouseover(e)}).bind("mouseout",function(e){t.onmouseout(e)})}this.oParentDomRef.style.border="solid 1px gray";this.oParentDomRef.style.padding="2px"}});sap.ui.debug.PropertyList.prototype.exit=function(){jQuery(this.oParentDomRef).unbind()};sap.ui.debug.PropertyList.prototype.update=function(p){var c=p.getParameter("controlId");this.oParentDomRef.innerHTML="";var C=this.oCore.getElementById(c);if(!C){this.oParentDomRef.innerHTML="Please select a valid control";return}if(!C.getMetadata||!C.getMetadata()){this.oParentDomRef.innerHTML="Control does not provide Metadata.";return}this.mProperties={};var m=C.getMetadata(),h=[];h.push("<span data-sap-ui-quickhelp='"+this._calcHelpId(m)+"'>Type : "+m.getName()+"</span><br >");h.push("Id : "+C.getId()+"<br >");h.push("<button id='sap-debug-propertylist-apply' sap-id='"+c+"' style='border:solid 1px gray;background-color:#d0d0d0;font-size:8pt;'>Apply Changes</button>");if(!this.bEmbedded){h.push("<div id='sap-ui-quickhelp' style='position:fixed;display:none;padding:5px;background-color:rgb(200,220,231);border:1px solid gray;overflow:hidden'>Help</div>")}h.push("<div style='border-bottom:1px solid gray'>&nbsp;</div><table cellspacing='1' style='font-size:8pt;width:100%;table-layout:fixed'>");while(m instanceof sap.ui.core.ElementMetadata){var P=m.getProperties();var H=false;if(!jQuery.isEmptyObject(P)){if(!H&&m!==C.getMetadata()){h.push("<tr><td colspan=\"2\">BaseType: ");h.push(m.getName());h.push("</td></tr>");H=true}m.getJSONKeys();this.printProperties(h,C,P)}var P=this.getAggregationsAsProperties(m);if(!jQuery.isEmptyObject(P)){if(!H&&m!==C.getMetadata()){h.push("<tr><td colspan=\"2\">BaseType: ");h.push(m.getName());h.push("</td></tr>");H=true}m.getJSONKeys();this.printProperties(h,C,P)}m=m.getParent()}h.push("</table>");this.oParentDomRef.innerHTML=h.join("");this.mHelpDocs={}};sap.ui.debug.PropertyList.prototype.getAggregationsAsProperties=function(m){function i(t){if(!t){return false}if(t.indexOf("[]")>0){t=t.substring(t.indexOf("[]"))}if(t==="boolean"||t==="string"||t==="int"||t==="float"){return true}if(t==="void"){return false}return false}var r={};for(var a in m.getAggregations()){var A=m.getAggregations()[a];if(A.altTypes&&A.altTypes[0]&&i(A.altTypes[0])){r[a]={name:a,type:A.altTypes[0],_oParent:A._oParent}}}return r};sap.ui.debug.PropertyList.prototype.printProperties=function(h,c,p,a){for(var i in p){var N=i,t=p[i].type,m=c["get"+N];if(!m){N=jQuery.sap.charToUpperCase(N,0)}var v=c["get"+N]();h.push("<tr><td>");this.mProperties[N]=t;h.push("<span data-sap-ui-quickhelp='",this._calcHelpId(p[i]._oParent,i),"' >",N,'</span>');h.push("</td><td>");if(t=="string"||t=="int"||t=="float"||jQuery.sap.endsWith(t,"[]")){var C='',T='';if(v===null){C='color:#a5a5a5;';v='(null)'}else if(v instanceof sap.ui.core.Element){C='color:#a5a5a5;';if(jQuery.isArray(v)){v=v.join(", ")}else{v=v.toString()}T=' title="This aggregation currently references an Element. You can set a '+t+' value instead"'}h.push("<input type='text' style='width:100%;font-size:8pt;background-color:#f5f5f5;"+C+"' value='"+jQuery.sap.escapeHTML(""+v)+"'"+T+" sap-name='"+N+"'/>")}else if(t=="boolean"){h.push("<input type='checkbox' sap-name='"+N+"' ");if(v==true){h.push("checked='checked'")}h.push("/>")}else if(t!="void"){var e=jQuery.sap.getObject(t);if(!e||e instanceof sap.ui.base.DataType){h.push("<input type='text' style='width:100%;font-size:8pt;background-color:#f5f5f5;' value='"+jQuery.sap.escapeHTML(""+v)+"'"+T+" sap-name='"+N+"'/>")}else{h.push("<select style='width:100%;font-size:8pt;background-color:#f5f5f5;' sap-name='"+N+"'>");t=t.replace("/",".");for(var n in e){h.push("<option ");if(n==v){h.push(" selected ")}h.push("value='"+t+"."+n+"'>");h.push(n);h.push("</option>")}h.push("</select>")}}else{h.push("&nbsp;")}h.push("</td></tr>")}};sap.ui.debug.PropertyList.prototype.onkeydown=function(e){if(e.keyCode==13){this.applyChanges("sap-debug-propertylist-apply")}};sap.ui.debug.PropertyList.prototype.onclick=function(e){var s=e.target;if(s.id=="sap-debug-propertylist-apply"){this.applyChanges("sap-debug-propertylist-apply")}};sap.ui.debug.PropertyList.prototype.onfocus=function(e){var s=e.target;if(s.tagName==="INPUT"&&s.getAttribute("sap-name")){if(s.style.color==='#a5a5a5'){s.style.color='';s.value=''}}};sap.ui.debug.PropertyList.prototype.applyChanges=function(sId){var oSource=this.oParentDomRef.ownerDocument.getElementById(sId),sControlId=oSource.getAttribute("sap-id"),oControl=this.oCore.getElementById(sControlId),aInput=oSource.parentNode.getElementsByTagName("INPUT"),aSelect=oSource.parentNode.getElementsByTagName("SELECT");for(var i=0;i<aInput.length;i++){var oInput=aInput[i],sName=oInput.getAttribute("sap-name");oMethod=oControl["set"+sName];if(!oMethod){sName=jQuery.sap.charToUpperCase(sName,0)}if(oControl["set"+sName]){var oType=sap.ui.base.DataType.getType(this.mProperties[sName]);var vValue=this.mProperties[sName]==="boolean"?oInput.checked:oType.parseValue(oInput.value);if(oType.isValid(vValue)&&vValue!=="(null)"){oControl["set"+sName](vValue)}}}for(var i=0;i<aSelect.length;i++){var oSelect=aSelect[i],sName=oSelect.getAttribute("sap-name"),oMethod=oControl["set"+sName];if(!oMethod){sName=jQuery.sap.charToUpperCase(sName,0)}var oValue=null;if(oSelect.value){eval("oValue = "+oSelect.value);oControl["set"+sName](oValue)}}this.oCore.applyChanges()};sap.ui.debug.PropertyList.prototype.showQuickHelp=function(s){if(this.oQuickHelpTimer){clearTimeout(this.oQuickHelpTimer);this.oQuickHelpTimer=undefined}var t=this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");if(t){this.sCurrentHelpId=s.getAttribute("data-sap-ui-quickhelp");var r=jQuery(s).rect();t.style.left=(r.left+40+10)+"px";t.style.top=(r.top-40)+"px";t.style.display='block';t.style.opacity='0.2';t.style.filter='progid:DXImageTransform.Microsoft.Alpha(opacity=20)';if(this.mHelpDocs[this.sCurrentHelpId]){this.updateQuickHelp(this.mHelpDocs[this.sCurrentHelpId],2000)}else{t.innerHTML="<b>Quickhelp</b> for "+this.sCurrentHelpId+" is being retrieved...";this.sCurrentHelpDoc=this.sCurrentHelpId;this.sCurrentHelpDocPart=undefined;if(this.sCurrentHelpId.indexOf('#')>=0){this.sCurrentHelpDoc=this.sCurrentHelpId.substring(0,this.sCurrentHelpId.indexOf('#'));this.sCurrentHelpDocPart=this.sCurrentHelpId.substring(this.sCurrentHelpId.indexOf('#')+1)}var u=this.oWindow.jQuery.sap.getModulePath(this.sCurrentHelpDoc,".control");var a=this;jQuery.ajax({async:true,url:u,dataType:'xml',error:function(x,b){a.receiveQuickHelp(undefined)},success:function(d){a.receiveQuickHelp(d)}});this.oQuickHelpTimer=setTimeout(function(){a.hideQuickHelp()},2000)}}};sap.ui.debug.PropertyList.prototype.receiveQuickHelp=function(d){if(d){var c=d.getElementsByTagName("control")[0];if(c){var g=function(x,N){var r=[];var C=x.firstChild;while(C){if(N===C.nodeName){r.push(C)}C=C.nextSibling};return r};var n=g(c,"name");var N='';if(n[0]){N=n[0].text||n[0].textContent}var D=g(c,"documentation");if(D[0]){if(N&&D[0]){var a=[];a.push("<div style='font-size:10pt;font-weight:bold;padding:5px 0px;margin-bottom:5px;border-bottom:1px solid gray'>",N.replace('/','.'),"</div>");a.push("<div style='padding:2px 0px;'>",D[0].text||D[0].textContent,"</div>");this.mHelpDocs[this.sCurrentHelpDoc]=a.join("")}}var p=g(c,"properties");if(p[0]){p=g(p[0],"property")}for(var i=0,l=p.length;i<l;i++){var P=p[i];var N=P.getAttribute("name");var t=P.getAttribute("type")||"string";var s=P.getAttribute("defaultValue")||"empty/undefined";var D=g(P,"documentation");if(N&&D[0]){var a=[];a.push("<div style='font-size:10pt;font-weight:bold;padding:3px 0px;margin-bottom:3px;border-bottom:1px solid gray'>",N,"</div>");a.push("<div style='padding:2px 0px;'><i><strong>Type</strong></i>: ",t,"</div>");a.push("<div style='padding:2px 0px;'>",D[0].text||D[0].textContent,"</div>");a.push("<div style='padding:2px 0px;'><i><strong>Default Value</strong></i>: ",s,"</div>");this.mHelpDocs[this.sCurrentHelpDoc+"#"+N]=a.join("")}};var p=g(c,"aggregations");if(p[0]){p=g(p[0],"aggregation")}for(var i=0,l=p.length;i<l;i++){var P=p[i];var N=P.getAttribute("name");var t=P.getAttribute("type")||"sap.ui.core/Control";var s=P.getAttribute("defaultValue")||"empty/undefined";var D=g(P,"documentation");if(N&&D[0]&&!this.mHelpDocs[this.sCurrentHelpDoc+"#"+N]){var a=[];a.push("<div style='font-size:10pt;font-weight:bold;padding:3px 0px;margin-bottom:3px;border-bottom:1px solid gray'>",N,"</div>");a.push("<div style='padding:2px 0px;'><i><strong>Type</strong></i>: ",t,"</div>");a.push("<div style='padding:2px 0px;'>",D[0].text||D[0].textContent,"</div>");a.push("<div style='padding:2px 0px;'><i><strong>Default Value</strong></i>: ",s,"</div>");this.mHelpDocs[this.sCurrentHelpDoc+"#"+N]=a.join("")}}}if(this.mHelpDocs[this.sCurrentHelpId]){this.updateQuickHelp(this.mHelpDocs[this.sCurrentHelpId],2000)}else{this.updateQuickHelp(undefined,0)}}else{this.updateQuickHelp(undefined,0)}};sap.ui.debug.PropertyList.prototype.updateQuickHelp=function(n,t){if(this.oQuickHelpTimer){clearTimeout(this.oQuickHelpTimer);this.oQuickHelpTimer=undefined}var T=this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");if(T){if(!n){T.innerHTML="<i>No quick help...</i>";;T.style.display='none'}else{T.innerHTML=n;var a=this;this.oQuickHelpTimer=setTimeout(function(){a.hideQuickHelp()},t)}}};sap.ui.debug.PropertyList.prototype.hideQuickHelp=function(){var t=this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");if(t){t.style.display='none'}this.bMovedOverTooltip=false};sap.ui.debug.PropertyList.prototype._calcHelpId=function(m,n){var h=m.getName();if(n){h=h+"#"+n}return h};sap.ui.debug.PropertyList.prototype._isChildOfQuickHelp=function(d){while(d){if(d.id==="sap-ui-quickhelp"){return true}d=d.parentNode};return false};sap.ui.debug.PropertyList.prototype.onmouseover=function(e){var s=e.target;if(this._isChildOfQuickHelp(s)){if(this.oQuickHelpTimer){clearTimeout(this.oQuickHelpTimer);this.oQuickHelpTimer=undefined}this.bMovedOverTooltip=true;var t=this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");if(t){t.style.opacity='';t.style.filter=''}}else if(s.getAttribute("data-sap-ui-quickhelp")){this.showQuickHelp(s)}};sap.ui.debug.PropertyList.prototype.onmouseout=function(e){var s=e.target;if(this._isChildOfQuickHelp(s)){if(this.oQuickHelpTimer){clearTimeout(this.oQuickHelpTimer);this.oQuickHelpTimer=undefined}this.bMovedOverTooltip=false;var t=this;this.oQuickHelpTimer=setTimeout(function(){t.hideQuickHelp()},50)}else if(s.getAttribute("data-sap-ui-quickhelp")){if(this.oQuickHelpTimer){clearTimeout(this.oQuickHelpTimer);this.oQuickHelpTimer=undefined}if(!this.bMovedOverTooltip){var t=this;this.oQuickHelpTimer=setTimeout(function(){t.hideQuickHelp()},800)}}}};sap.ui.debug.DebugEnv=function(){};sap.ui.debug.DebugEnv.prototype.startPlugin=function(c,o){this.oCore=c;this.oWindow=window;this.bRunsEmbedded=typeof window.top.testfwk=="undefined";jQuery.sap.log.info("Starting DebugEnv plugin ("+(this.bRunsEmbedded?"embedded":"testsuite")+")");if(!this.bRunsEmbedded||c.getConfiguration().getInspect()){this.init(o)}if(!this.bRunsEmbedded||c.getConfiguration().getTrace()){this.initLogger(jQuery.sap.log,o)}};sap.ui.debug.DebugEnv.prototype.stopPlugin=function(){jQuery.sap.log.info("Stopping DebugEnv plugin.");this.oCore=null};sap.ui.debug.DebugEnv.prototype.init=function(o){this.oControlTreeWindow=this.bRunsEmbedded?this.oWindow:(top.frames["sap-ui-ControlTreeWindow"]||top);this.oPropertyListWindow=this.bRunsEmbedded?this.oWindow:(top.frames["sap-ui-PropertyListWindow"]||top);var r=sap.ui.getCore().getConfiguration().getRTL();var c=this.oControlTreeWindow.document.getElementById("sap-ui-ControlTreeRoot"),p=this.oPropertyListWindow.document.getElementById("sap-ui-PropertyWindowRoot");if(!c){c=this.oControlTreeWindow.document.createElement("DIV");c.setAttribute("id","sap-ui-ControlTreeRoot");c.setAttribute("tabindex",-1);c.style.position="absolute";c.style.fontFamily="Arial";c.style.fontSize="8pt";c.style.backgroundColor="white";c.style.color="black";c.style.border="1px solid gray";c.style.overflow="auto";c.style.zIndex="999999";c.style.top="1px";if(r){c.style.left="1px"}else{c.style.right="1px"}c.style.height="49%";c.style.width="200px";this.oControlTreeWindow.document.body.appendChild(c)}else{c.innerHTML=""}this.oControlTreeRoot=c;if(!p){p=this.oPropertyListWindow.document.createElement("DIV");p.setAttribute("id","sap-ui-PropertyWindowRoot");p.setAttribute("tabindex",-1);p.style.position="absolute";p.style.fontFamily="Arial";p.style.fontSize="8pt";p.style.backgroundColor="white";p.style.color="black";p.style.border="1px solid gray";p.style.overflow="auto";p.style.zIndex="99999";p.style.width="196px";p.style.height="49%";if(r){p.style.left="1px"}else{p.style.right="1px"}p.style.bottom="1px";this.oPropertyListWindow.document.body.appendChild(p)}else{p.innerHTML=""}this.oPropertyWindowRoot=p;this.oControlTree=new sap.ui.debug.ControlTree(this.oCore,this.oWindow,c,this.bRunsEmbedded);this.oPropertyList=new sap.ui.debug.PropertyList(this.oCore,this.oWindow,p);this.oControlTree.attachEvent(sap.ui.debug.ControlTree.M_EVENTS.SELECT,this.oPropertyList.update,this.oPropertyList);if(!o){this.oControlTree.renderDelayed()}jQuery(window).unload(jQuery.proxy(function(e){this.oControlTree.exit();this.oPropertyList.exit()},this))};sap.ui.debug.DebugEnv.prototype.initLogger=function(l,o){this.oLogger=l;if(!this.bRunsEmbedded){this.oTraceWindow=top.frames["sap-ui-TraceWindow"];this.oTraceViewer=this.oTraceWindow.oLogViewer=new sap.ui.debug.LogViewer(this.oTraceWindow,'sap-ui-TraceWindowRoot');this.oTraceViewer.sLogEntryClassPrefix="lvl";this.oTraceViewer.lock()}else{this.oTraceWindow=this.oWindow;this.oTraceViewer=new sap.ui.debug.LogViewer(this.oTraceWindow,'sap-ui-TraceWindowRoot')}this.oLogger.addLogListener(this.oTraceViewer);this.oCore.attachUIUpdated(this.enableLogViewer,this);if(!o){var t=this;this.oTimer=setTimeout(function(){t.enableLogViewer()},0)}};sap.ui.debug.DebugEnv.prototype.enableLogViewer=function(){if(this.oTimer){clearTimeout(this.oTimer);this.oTimer=undefined}this.oCore.detachUIUpdated(this.enableLogViewer,this);if(this.oTraceViewer){this.oTraceViewer.unlock()}};sap.ui.debug.DebugEnv.prototype.isRunningEmbedded=function(){return this.bRunsEmbedded};sap.ui.debug.DebugEnv.prototype.isControlTreeShown=function(){return jQuery(this.oControlTreeRoot).css("visibility")==="visible"||jQuery(this.oControlTreeRoot).css("visibility")==="inherit"};sap.ui.debug.DebugEnv.prototype.showControlTree=function(){if(!this.oControlTreeRoot){this.init(false)}jQuery(this.oControlTreeRoot).css("visibility","visible")};sap.ui.debug.DebugEnv.prototype.hideControlTree=function(){jQuery(this.oControlTreeRoot).css("visibility","hidden")};sap.ui.debug.DebugEnv.prototype.isTraceWindowShown=function(){var l=this.oTraceWindow&&this.oTraceWindow.document.getElementById('sap-ui-TraceWindowRoot');return l&&(jQuery(l).css("visibility")==="visible"||jQuery(l).css("visibility")==="inherit")};sap.ui.debug.DebugEnv.prototype.showTraceWindow=function(){if(!this.oTraceWindow&&jQuery&&jQuery.sap&&jQuery.sap.log){this.initLogger(jQuery.sap.log,false)}var l=this.oTraceWindow&&this.oTraceWindow.document.getElementById('sap-ui-TraceWindowRoot');if(l){jQuery(l).css("visibility","visible")}};sap.ui.debug.DebugEnv.prototype.hideTraceWindow=function(){var l=this.oTraceWindow&&this.oTraceWindow.document.getElementById('sap-ui-TraceWindowRoot');if(l){jQuery(l).css("visibility","hidden")}};sap.ui.debug.DebugEnv.prototype.isPropertyListShown=function(){return jQuery(this.oPropertyWindowRoot).css("visibility")==="visible"||jQuery(this.oPropertyWindowRoot).css("visibility")==="inherit"};sap.ui.debug.DebugEnv.prototype.showPropertyList=function(){if(!this.oPropertyWindowRoot){this.init(false)}jQuery(this.oPropertyWindowRoot).css("visibility","visible")};sap.ui.debug.DebugEnv.prototype.hidePropertyList=function(){jQuery(this.oPropertyWindowRoot).css("visibility","hidden")};(function(){var t=new sap.ui.debug.DebugEnv();sap.ui.getCore().registerPlugin(t);sap.ui.debug.DebugEnv.getInstance=jQuery.sap.getter(new sap.ui.base.Interface(t,["isRunningEmbedded","isControlTreeShown","showControlTree","hideControlTree","isTraceWindowShown","showTraceWindow","hideTraceWindow","isPropertyListShown","showPropertyList","hidePropertyList"]))}())};
