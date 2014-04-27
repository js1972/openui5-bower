/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var O=sap.ui.base.Object.extend("sap.ui.model.odata.ODataMetadata",{constructor:function(m,l){this.oModel=m;this.oMetadata=null;this._loadMetadata(l)},metadata:{publicMethods:["getServiceMetadata"]}});O.prototype._loadMetadata=function(a){var u=this.oModel._createRequestUrl("$metadata");var r=this.oModel._createRequest(u,"GET",a);var t=this;function _(m,R){t.oMetadata=m;if(!t.oModel.bUseBatch){t.oModel.bUseBatch=t._getUseBatchExtensionValue()}t.oModel._setMetadata(t);t.oModel.refresh(true)}function b(e){t.oModel.fireMetadataFailed(e);t.oModel._handleError(e)}this.oModel._request(r,_,b,OData.metadataHandler)};O.prototype.getServiceMetadata=function(){return this.oMetadata};O.prototype._getEntityTypeByPath=function(p){if(!p){return null}if(!this.oMetadata||q.isEmptyObject(this.oMetadata)){return null}var c=p.replace(/^\/|\/$/g,""),P=c.split("/"),l=P.length,a,A,o,e,E,b,r,t=this;if(P[0].indexOf("(")!=-1){P[0]=P[0].substring(0,P[0].indexOf("("))}if(l>1){o=t._getEntityTypeByPath(P[0]);for(var i=1;i<P.length;i++){if(o){if(P[i].indexOf("(")!=-1){P[i]=P[i].substring(0,P[i].indexOf("("))}if(o.navigationProperty){r=t._getEntityTypeByNavProperty(o,P[i]);if(r){o=r}}b=o}}}else{E=this._splitName(this._getEntityTypeName(P[0]));b=this._getObjectMetadata("entityType",E[0],E[1]);if(b){b.entityType=this._getEntityTypeName(P[0])}}if(!b){var f=P[P.length-1];var F=this._getFunctionImportMetadata(f,"GET");if(F&&F.entitySet){b=this._getEntityTypeByPath(F.entitySet);if(b){b.entityType=this._getEntityTypeName(F.entitySet)}}}return b};O.prototype._splitName=function(f){var p=[];if(f){var s=f.lastIndexOf(".");p[0]=f.substr(s+1);p[1]=f.substr(0,s)}return p};O.prototype._getEntityTypeName=function(c){var e;if(c){q.each(this.oMetadata.dataServices.schema,function(i,s){if(s.entityContainer){q.each(s.entityContainer,function(k,E){if(E.entitySet){q.each(E.entitySet,function(j,o){if(o.name===c){e=o.entityType;return false}})}})}})}return e};O.prototype._getObjectMetadata=function(o,s,n){var a;if(s&&n){q.each(this.oMetadata.dataServices.schema,function(i,S){if(S[o]&&S.namespace===n){q.each(S[o],function(j,c){if(c.name===s){a=c;return false}});return!a}})}return a};O.prototype._getUseBatchExtensionValue=function(){var u=false;q.each(this.oMetadata.dataServices.schema,function(i,s){if(s.entityContainer){q.each(s.entityContainer,function(k,e){if(e.extensions){q.each(e.extensions,function(l,E){if(E.name==="use-batch"&&E.namespace==="http://www.sap.com/Protocols/SAPData"){u=(typeof E.value==='string')?(E.value.toLowerCase()==='true'):!!E.value;return false}})}})}});return u};O.prototype._getFunctionImportMetadata=function(f,m){var o=null;q.each(this.oMetadata.dataServices.schema,function(i,s){if(s["entityContainer"]){q.each(s["entityContainer"],function(j,e){if(e["functionImport"]){q.each(e["functionImport"],function(k,F){if(F.name===f&&F.httpMethod===m){o=F;return false}})}return!o})}return!o});return o};O.prototype._getEntityTypeByNavProperty=function(e,n){var t=this,a,A,E,N;q.each(e.navigationProperty,function(k,o){if(o.name===n){a=t._splitName(o.relationship);A=t._getObjectMetadata("association",a[0],a[1]);if(A){var b=A.end[0];if(b.role!==o.toRole){b=A.end[1]}E=t._splitName(b.type);N=t._getObjectMetadata("entityType",E[0],E[1]);if(N){N.entityType=b.type}return false}}});return N};O.prototype._getNavigationPropertyNames=function(e){var n=[];if(e.navigationProperty){q.each(e.navigationProperty,function(k,N){n.push(N.name)})}return n};O.prototype._getPropertyMetadata=function(e,p){var P,t=this;p=p.replace(/^\/|\/$/g,"");var a=p.split("/");q.each(e.property,function(k,b){if(b.name===a[0]){P=b;return false}});if(P&&a.length>1&&!q.sap.startsWith(P.type.toLowerCase(),"edm.")){var n=this._splitName(P.type);P=this._getPropertyMetadata(this._getObjectMetadata("complexType",n[0],n[1]),a[1])}if(!P&&a.length>1){var o=this._getEntityTypeByNavProperty(e,a[0]);if(o){P=t._getPropertyMetadata(o,a[1])}}return P};O.prototype.destroy=function(){delete this.oModel;delete this.oMetadata;sap.ui.base.Object.prototype.destroy.apply(this,arguments)};return O},true);
