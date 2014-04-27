/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/ChangeReason','sap/ui/model/ClientListBinding'],function(q,C,a){"use strict";var J=a.extend("sap.ui.model.json.JSONListBinding");J.prototype.getContexts=function(s,l){this.iLastStartIndex=s;this.iLastLength=l;if(!s){s=0}if(!l){l=Math.min(this.iLength,this.oModel.iSizeLimit)}var c=this._getContexts(s,l),o={};if(this.bUseExtendedChangeDetection){for(var i=0;i<c.length;i++){o[c[i].getPath()]=c[i].getObject()}if(this.aLastContexts&&s<this.iLastEndIndex){var t=this;var d=q.sap.arrayDiff(this.aLastContexts,c,function(O,n){return q.sap.equal(O&&t.oLastContextData&&t.oLastContextData[O.getPath()],n&&o&&o[n.getPath()])});c.diff=d}this.iLastEndIndex=s+l;this.aLastContexts=c.slice(0);this.oLastContextData=q.extend(true,{},o)}return c};J.prototype.update=function(){var l=this.oModel._getObject(this.sPath,this.oContext);if(l&&q.isArray(l)){if(this.bUseExtendedChangeDetection){this.oList=q.extend(true,[],l)}else{this.oList=l.slice(0)}this.updateIndices();this.applyFilter();this.applySort();this.iLength=this._getLength()}else{this.oList=[];this.aIndices=[];this.iLength=0}};J.prototype.checkUpdate=function(f){if(!this.bUseExtendedChangeDetection){var l=this.oModel._getObject(this.sPath,this.oContext);if(!q.sap.equal(this.oList,l)||f){this.update();this._fireChange({reason:C.Change})}}else{var c=false;var t=this;var l=this.oModel._getObject(this.sPath,this.oContext);if(!q.sap.equal(this.oList,l)){this.update()}var b=this._getContexts(this.iLastStartIndex,this.iLastLength);if(this.aLastContexts){if(this.aLastContexts.length!=b.length){c=true}else{q.each(this.aLastContexts,function(i,o){if(!q.sap.equal(b[i].getObject(),t.oLastContextData[o.getPath()])){c=true;return false}})}}else{c=true}if(c||f){this._fireChange({reason:C.Change})}}};return J},true);
