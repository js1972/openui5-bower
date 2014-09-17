/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.layout.form.SimpleForm");jQuery.sap.require("sap.ui.layout.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.layout.form.SimpleForm",{metadata:{library:"sap.ui.layout",properties:{"maxContainerCols":{type:"int",group:"Appearance",defaultValue:2},"minWidth":{type:"int",group:"Appearance",defaultValue:-1},"editable":{type:"boolean",group:"Misc",defaultValue:null},"labelMinWidth":{type:"int",group:"Misc",defaultValue:192},"layout":{type:"sap.ui.layout.form.SimpleFormLayout",group:"Misc",defaultValue:sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout},"labelSpanL":{type:"int",group:"Misc",defaultValue:4},"labelSpanM":{type:"int",group:"Misc",defaultValue:2},"labelSpanS":{type:"int",group:"Misc",defaultValue:12},"emptySpanL":{type:"int",group:"Misc",defaultValue:0},"emptySpanM":{type:"int",group:"Misc",defaultValue:0},"emptySpanS":{type:"int",group:"Misc",defaultValue:0},"columnsL":{type:"int",group:"Misc",defaultValue:2},"columnsM":{type:"int",group:"Misc",defaultValue:1},"breakpointL":{type:"int",group:"Misc",defaultValue:1024},"breakpointM":{type:"int",group:"Misc",defaultValue:600}},defaultAggregation:"content",aggregations:{"content":{type:"sap.ui.core.Element",multiple:true,singularName:"content"},"form":{type:"sap.ui.layout.form.Form",multiple:false,visibility:"hidden"},"title":{type:"sap.ui.core.Title",altTypes:["string"],multiple:false}}}});jQuery.sap.require("sap.ui.layout.form.Form");jQuery.sap.require("sap.ui.layout.form.FormContainer");jQuery.sap.require("sap.ui.layout.form.FormElement");jQuery.sap.require("sap.ui.layout.form.FormLayout");jQuery.sap.require("sap.ui.layout.ResponsiveFlowLayoutData");(function(){sap.ui.layout.form.SimpleForm.prototype.init=function(){this._iMaxWeight=8;this._iLabelWeight=3;this._iCurrentWidth=0;var F=new sap.ui.layout.form.Form(this.getId()+"--Form");F.getTitle=function(){return this.getParent().getTitle()};F._origInvalidate=F.invalidate;F.invalidate=function(O){this._origInvalidate(arguments);var S=this.getParent();if(S){S._formInvalidated(O)}};this.setAggregation("form",F);this._aElements=null;this._aLayouts=[];var i=this;this._changedFormContainers=[];this._changedFormElements=[]};sap.ui.layout.form.SimpleForm.prototype.exit=function(){var F=this.getAggregation("form");F.invalidate=F._origInvalidate;if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}for(var i=0;i<this._aLayouts.length;i++){var L=sap.ui.getCore().byId(this._aLayouts[i]);if(L&&L.destroy){L.destroy()}}this._aLayouts=[];this._aElements=null;this._changedFormContainers=[];this._changedFormElements=[]};sap.ui.layout.form.SimpleForm.prototype.onBeforeRendering=function(){this._bChangedByMe=true;if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}var i=this;var F=this.getAggregation("form");if(!F.getLayout()){_(i)}a(i);this._bChangedByMe=false};sap.ui.layout.form.SimpleForm.prototype.onAfterRendering=function(){if(this.getLayout()==sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout){this._bChangedByMe=true;this.$().css("visibility","hidden");this._applyLinebreaks();this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this.getDomRef(),jQuery.proxy(this._resize,this));this._bChangedByMe=false}};sap.ui.layout.form.SimpleForm.prototype.setEditable=function(E){this._bChangedByMe=true;this.setProperty("editable",E,true);var F=this.getAggregation("form");F.setEditable(E);this._bChangedByMe=false;return this};sap.ui.layout.form.SimpleForm.prototype.indexOfContent=function(O){var C=this._aElements;if(C){for(var i=0;i<C.length;i++){if(C[i]==O){return i}}}return-1};sap.ui.layout.form.SimpleForm.prototype.addContent=function(E){this._bChangedByMe=true;E=this.validateAggregation("content",E,true);if(!this._aElements){this._aElements=[]}var L=this._aElements.length;var i;var F=this.getAggregation("form");var j;var k;var P;var v;if(E instanceof sap.ui.core.Title){j=o(this,E);F.addFormContainer(j);this._changedFormContainers.push(j)}else if(E.getMetadata().isInstanceOf("sap.ui.core.Label")){if(L>0){i=this._aElements[L-1];P=i.getParent();if(P instanceof sap.ui.layout.form.FormElement){j=P.getParent()}else if(P instanceof sap.ui.layout.form.FormContainer){j=P}}if(!j){j=o(this);F.addFormContainer(j);this._changedFormContainers.push(j)}k=l(this,j,E)}else{if(L>0){i=this._aElements[L-1];P=i.getParent();if(P instanceof sap.ui.layout.form.FormElement){j=P.getParent();k=P;v=d(this,E);if(v instanceof sap.ui.layout.ResponsiveFlowLayoutData&&!b(this,v)){if(v.getLinebreak()){k=l(this,j)}}}else if(P instanceof sap.ui.layout.form.FormContainer){j=P;k=l(this,j)}}else{j=o(this);F.addFormContainer(j);this._changedFormContainers.push(j);k=l(this,j)}e(this,E,5,false,true);k.addField(E);s(this._changedFormElements,k)}this._aElements.push(E);E.attachEvent("_change",t,this);this.invalidate();this._bChangedByMe=false;return this};sap.ui.layout.form.SimpleForm.prototype.insertContent=function(E,I){E=this.validateAggregation("content",E,true);if(!this._aElements){this._aElements=[]}var L=this._aElements.length;var N=I<0?0:(I>L?L:I);if(N!==I){jQuery.sap.log.warning("SimpleForm.insertContent: index '"+I+"' out of range [0,"+L+"], forced to "+N)}if(N==L){this.addContent(E);return this}this._bChangedByMe=true;var O=this._aElements[N];var F=this.getAggregation("form");var j;var k;var v;var w;var C;var x=0;var y;var z;var A;var B;if(E instanceof sap.ui.core.Title){if(I==0&&!(O instanceof sap.ui.core.Title)){j=O.getParent().getParent();j.setTitle(E)}else{j=o(this,E);if(O instanceof sap.ui.core.Title){v=O.getParent();C=F.indexOfFormContainer(v)}else{w=O.getParent();v=w.getParent();C=F.indexOfFormContainer(v)+1;x=v.indexOfFormElement(w);if(!O.getMetadata().isInstanceOf("sap.ui.core.Label")){y=w.indexOfField(O);if(y>0||w.getLabel()){k=l(this,j);this._changedFormElements.push(k);s(this._changedFormElements,w);z=w.getFields();for(var i=y;i<z.length;i++){var D=z[i];k.addField(D)}x++}}A=v.getFormElements();for(var i=x;i<A.length;i++){j.addFormElement(A[i])}}F.insertFormContainer(j,C)}this._changedFormContainers.push(j)}else if(E.getMetadata().isInstanceOf("sap.ui.core.Label")){if(O instanceof sap.ui.core.Title){v=O.getParent();C=F.indexOfFormContainer(v);B=F.getFormContainers();j=B[C-1];k=l(this,j,E)}else if(O.getMetadata().isInstanceOf("sap.ui.core.Label")){v=O.getParent().getParent();x=v.indexOfFormElement(O.getParent());k=m(this,v,E,x)}else{w=O.getParent();v=w.getParent();x=v.indexOfFormElement(w)+1;y=w.indexOfField(O);if(y==0&&!w.getLabel()){k=w;k.setLabel(E);e(this,E,this._iLabelWeight,false,true,this.getLabelMinWidth())}else{k=m(this,v,E,x);s(this._changedFormElements,w);z=w.getFields();for(var i=y;i<z.length;i++){var D=z[i];k.addField(D)}}}this._changedFormElements.push(k)}else{if(O instanceof sap.ui.core.Title){v=O.getParent();C=F.indexOfFormContainer(v);if(C==0){j=o(this);F.insertFormContainer(j,C);this._changedFormContainers.push(j)}else{B=F.getFormContainers();j=B[C-1]}A=j.getFormElements();if(A.length==0){k=l(this,j)}else{k=A[A.length-1]}k.addField(E)}else if(O.getMetadata().isInstanceOf("sap.ui.core.Label")){w=O.getParent();j=w.getParent();x=j.indexOfFormElement(w);if(x==0){k=m(this,j,null,0)}else{A=j.getFormElements();k=A[x-1]}k.addField(E)}else{k=O.getParent();y=k.indexOfField(O);k.insertField(E,y)}s(this._changedFormElements,k);e(this,E,5,false,true)}this._aElements.splice(N,0,E);E.attachEvent("_change",t,this);this.invalidate();this._bChangedByMe=false;return this};sap.ui.layout.form.SimpleForm.prototype.removeContent=function(E){var j=null;var I=-1;if(this._aElements){if(typeof(E)=="string"){E=sap.ui.getCore().byId(E)}if(typeof(E)=="object"){for(var i=0;i<this._aElements.length;i++){if(this._aElements[i]==E){E=i;break}}}if(typeof(E)=="number"){if(E<0||E>=this._aElements.length){jQuery.sap.log.warning("Element.removeAggregation called with invalid index: Items, "+E)}else{I=E;j=this._aElements[I]}}}if(j){this._bChangedByMe=true;var F=this.getAggregation("form");var k;var v;var w;var x;if(j instanceof sap.ui.core.Title){k=j.getParent();k.setTitle(null);if(I>0){w=k.getFormElements();var C=F.indexOfFormContainer(k);var P=F.getFormContainers()[C-1];if(w&&!w[0].getLabel()){var y=P.getFormElements();var L=y[y.length-1];x=w[0].getFields();for(var i=0;i<x.length;i++){L.addField(x[i])}s(this._changedFormElements,L);k.removeFormElement(w[0]);w[0].destroy();w.splice(0,1)}for(var i=0;i<w.length;i++){P.addFormElement(w[i])}s(this._changedFormContainers,P);F.removeFormContainer(k);k.destroy()}}else if(j.getMetadata().isInstanceOf("sap.ui.core.Label")){v=j.getParent();k=v.getParent();v.setLabel(null);var z=k.indexOfFormElement(v);if(z==0){if(!v.getFields()){k.removeFormElement(v);v.destroy()}else{s(this._changedFormElements,v)}}else{w=k.getFormElements();var A=w[z-1];x=v.getFields();for(var i=0;i<x.length;i++){A.addField(x[i])}s(this._changedFormElements,A);k.removeFormElement(v);v.destroy()}}else{v=j.getParent();v.removeField(j);if(!v.getFields()&&!v.getLabel()){k=v.getParent();k.removeFormElement(v);v.destroy()}else{s(this._changedFormElements,v)}}this._aElements.splice(I,1);j.setParent(null);j.detachEvent("_change",t,this);h(this,j);this.invalidate();this._bChangedByMe=false;return j}return null};sap.ui.layout.form.SimpleForm.prototype.removeAllContent=function(){if(this._aElements){this._bChangedByMe=true;var F=this.getAggregation("form");var k=F.getFormContainers();for(var i=0;i<k.length;i++){var v=k[i];v.setTitle(null);var w=v.getFormElements();for(var j=0;j<w.length;j++){var x=w[j];x.setLabel(null);x.removeAllFields()}v.destroyFormElements()}F.destroyFormContainers();for(var i=0;i<this._aElements.length;i++){var E=this._aElements[i];h(this,E);E.detachEvent("_change",t,this)}var y=this._aElements;this._aElements=null;this.invalidate();this._bChangedByMe=false;return y}else{return[]}};sap.ui.layout.form.SimpleForm.prototype.destroyContent=function(){var E=this.removeAllContent();if(E){this._bChangedByMe=true;for(var i=0;i<E.length;i++){E[i].destroy()}this.invalidate();this._bChangedByMe=false}return this};sap.ui.layout.form.SimpleForm.prototype.getContent=function(){if(!this._aElements){this._aElements=this.getAggregation("content",[])}return this._aElements};sap.ui.layout.form.SimpleForm.prototype.setLayout=function(L){this._bChangedByMe=true;var O=this.getLayout();this.setProperty("layout",L);if(L!=O){var v=this;_(v);var F=this.getAggregation("form");var C=F.getFormContainers();var E;var w;var x;for(var i=0;i<C.length;i++){var y=C[i];this._changedFormContainers.push(y);x=y.getLayoutData();if(x){x.destroy()}g(this,y);E=y.getFormElements();for(var j=0;j<E.length;j++){var z=E[j];s(this._changedFormElements,z);x=z.getLayoutData();if(x){x.destroy()}f(this,z);var A=z.getLabel();if(A){h(this,A);e(this,A,this._iLabelWeight,false,true,this.getLabelMinWidth())}w=z.getFields();for(var k=0;k<w.length;k++){var B=w[k];h(this,B);e(this,B,5,false,true)}}}}this._bChangedByMe=false;return this};sap.ui.layout.form.SimpleForm.prototype.clone=function(I){this._bChangedByMe=true;var C=sap.ui.core.Control.prototype.clone.apply(this,arguments);var k=this.getContent();for(var i=0;i<k.length;i++){var E=k[i];var L=E.getLayoutData();var v=E.clone(I);if(L){if(L.getMetadata().getName()=="sap.ui.core.VariantLayoutData"){var w=L.getMultipleLayoutData();for(var j=0;j<w.length;j++){if(b(this,w[j])){C._aLayouts.push(v.getLayoutData().getMultipleLayoutData()[j].getId())}}}else if(b(this,L)){C._aLayouts.push(v.getLayoutData().getId())}}C.addContent(v)}this._bChangedByMe=false;return C};var _=function(T){var F=T.getAggregation("form");var L=F.getLayout();if(L){L.destroy()}switch(T.getLayout()){case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:jQuery.sap.require("sap.ui.layout.form.ResponsiveLayout");F.setLayout(new sap.ui.layout.form.ResponsiveLayout(T.getId()+"--Layout"));break;case sap.ui.layout.form.SimpleFormLayout.GridLayout:jQuery.sap.require("sap.ui.layout.form.GridLayout");jQuery.sap.require("sap.ui.layout.form.GridContainerData");jQuery.sap.require("sap.ui.layout.form.GridElementData");F.setLayout(new sap.ui.layout.form.GridLayout(T.getId()+"--Layout"));break;case sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout:jQuery.sap.require("sap.ui.layout.form.ResponsiveGridLayout");jQuery.sap.require("sap.ui.layout.GridData");F.setLayout(new sap.ui.layout.form.ResponsiveGridLayout(T.getId()+"--Layout"));break;default:break}};var a=function(T){T._changedFormContainers=[];var L=T.getLayout();switch(L){case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:T._applyLinebreaks();break;case sap.ui.layout.form.SimpleFormLayout.GridLayout:r(T);break;case sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout:var j=T.getAggregation("form").getLayout();j.setLabelSpanL(T.getLabelSpanL());j.setLabelSpanM(T.getLabelSpanM());j.setLabelSpanS(T.getLabelSpanS());j.setEmptySpanL(T.getEmptySpanL());j.setEmptySpanM(T.getEmptySpanM());j.setEmptySpanS(T.getEmptySpanS());j.setColumnsL(T.getColumnsL());j.setColumnsM(T.getColumnsM());j.setBreakpointL(T.getBreakpointL());j.setBreakpointM(T.getBreakpointM());break;default:break}for(var i=0;i<T._changedFormElements.length;i++){var F=T._changedFormElements[i];switch(L){case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:p(T,F);break;case sap.ui.layout.form.SimpleFormLayout.GridLayout:break;default:break}q(T,F)}T._changedFormElements=[]};var b=function(T,L){var i=L.getId(),j=" "+T._aLayouts.join(" ")+" ";return j.indexOf(" "+i+" ")>-1};var c=function(T,w,L,i,M){var j=new sap.ui.layout.ResponsiveFlowLayoutData({weight:w,linebreak:L===true,linebreakable:i===true});if(M){j.setMinWidth(M)}T._aLayouts.push(j.getId());return j};var d=function(T,F){var L;switch(T.getLayout()){case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:L=sap.ui.layout.form.FormLayout.prototype.getLayoutDataForElement(F,"sap.ui.layout.ResponsiveFlowLayoutData");break;case sap.ui.layout.form.SimpleFormLayout.GridLayout:L=sap.ui.layout.form.FormLayout.prototype.getLayoutDataForElement(F,"sap.ui.layout.form.GridElementData");break;case sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout:L=sap.ui.layout.form.FormLayout.prototype.getLayoutDataForElement(F,"sap.ui.layout.GridData");break;default:break}return L};var e=function(T,F,w,L,i,M){var j;switch(T.getLayout()){case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:j=d(T,F);if(!j||!b(T,j)){j=F.getLayoutData();if(j&&j.getMetadata().getName()=="sap.ui.core.VariantLayoutData"){j.addMultipleLayoutData(c(T,w,L,i,M))}else if(!j){F.setLayoutData(c(T,w,L,i,M))}else{jQuery.sap.log.warning("ResponsiveFlowLayoutData can not be set on Field "+F.getId(),"_createFieldLayoutData","SimpleForm")}}break;case sap.ui.layout.form.SimpleFormLayout.GridLayout:break;default:break}};var f=function(T,E){switch(T.getLayout()){case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:E.setLayoutData(new sap.ui.layout.ResponsiveFlowLayoutData({linebreak:true,margin:false}));break;case sap.ui.layout.form.SimpleFormLayout.GridLayout:break;default:break}};var g=function(T,C){switch(T.getLayout()){case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:C.setLayoutData(new sap.ui.layout.ResponsiveFlowLayoutData({minWidth:280}));break;case sap.ui.layout.form.SimpleFormLayout.GridLayout:if(T.getMaxContainerCols()>1){C.setLayoutData(new sap.ui.layout.form.GridContainerData({halfGrid:true}))}else{C.setLayoutData(new sap.ui.layout.form.GridContainerData({halfGrid:false}))}break;default:break}};var h=function(T,E){var L=d(T,E);if(L){var j=L.getId();for(var i=0;i<T._aLayouts.length;i++){var I=T._aLayouts[i];if(j==I){L.destroy();T._aLayouts.splice(i,1);break}}}};var l=function(T,F,L){var E=n(T,L);F.addFormElement(E);return E};var m=function(T,F,L,i){var E=n(T,L);F.insertFormElement(E,i);return E};var n=function(T,L){var E=new sap.ui.layout.form.FormElement();f(T,E);if(L){L.addStyleClass("sapUiFormLabel-CTX");E.setLabel(L);if(!d(T,L)){e(T,L,T._iLabelWeight,false,true,T.getLabelMinWidth())}}E.setVisible(false);return E};var o=function(T,i){var C=new sap.ui.layout.form.FormContainer();g(T,C);if(i){C.setTitle(i)}return C};var p=function(T,E){var M=T._iMaxWeight;var F=E.getFields();var j;var L=F.length;var k=E.getLabel();var v;if(k&&d(T,k)){M=M-d(T,k).getWeight()}for(var i=0;i<F.length;i++){j=F[i];v=d(T,j);if(v instanceof sap.ui.layout.ResponsiveFlowLayoutData&&!b(T,v)){M=M-v.getWeight();L--}}var w=Math.floor(M/L);var R=M%L;for(var i=0;i<F.length;i++){j=F[i];v=d(T,j);var C=w;if(!v){e(T,j,C,false,i==0)}else if(b(T,v)&&v instanceof sap.ui.layout.ResponsiveFlowLayoutData){if(R>0){C++;R--}v.setWeight(C)}}};var q=function(T,E){var F=E.getFields();var L=F.length;var v=false;for(var i=0;i<F.length;i++){var j=F[i];if(!j.getVisible||j.getVisible()){v=true;break}}if(E.getVisible()!=v){E.setVisible(v)}};sap.ui.layout.form.SimpleForm.prototype._applyLinebreaks=function(){var F=this.getAggregation("form"),C=F.getFormContainers();var D=this.getDomRef();var j=this.$();for(var i=1;i<C.length;i++){var k=C[i],L=k.getLayoutData();if(!D||j.outerWidth(true)>this.getMinWidth()){if(i%this.getMaxContainerCols()==0){L.setLinebreak(true)}else{L.setLinebreak(false)}}else{L.setLinebreak(true)}}if(D&&j.css("visibility")=="hidden"){var v=this;setTimeout(function(){if(v.getDomRef()){v.$().css("visibility","inherit")}},10)}};var r=function(T){var F=T.getAggregation("form");var C=F.getFormContainers();var L=C.length;if(L%2>0){C[L-1].getLayoutData().setHalfGrid(false)}};sap.ui.layout.form.SimpleForm.prototype._resize=function(){this._bChangedByMe=true;if(this._iCurrentWidth==this.$().outerWidth())return;this._iCurrentWidth=this.$().outerWidth();this._applyLinebreaks();this._bChangedByMe=false};var s=function(F,j){var k=false;for(var i=0;i<F.length;i++){var C=F[i];if(C==j){k=true;break}}if(!k){F.push(j)}};var t=function(E){if(E.getParameter("name")=="visible"){var F=E.oSource.getParent();q(this,F)}};var u=function(F){var E=[];var v=F.getFormContainers();for(var i=0;i<v.length;i++){var w=v[i];var T=w.getTitle();if(T){E.push(T)}var x=w.getFormElements();for(var j=0;j<x.length;j++){var y=x[j];var L=y.getLabel();if(L){E.push(L)}var z=y.getFields();for(var k=0;k<z.length;k++){var A=z[k];E.push(A)}}}return E};sap.ui.layout.form.SimpleForm.prototype._formInvalidated=function(O){if(!this._bChangedByMe){var C=u(this.getAggregation("form"));var j=0;var k=false;if(C.length<this._aElements.length){k=true}else{for(var i=0;i<C.length;i++){var E=C[i];var v=this._aElements[j];if(E===v){j++}else{var w=C[i+1];if(w===v){this.insertContent(E,i);break}var w=this._aElements[j+1];if(w===E){k=true;break}break}}}if(k){this.removeAllContent();for(var i=0;i<C.length;i++){var x=C[i];this.addContent(x)}}}}}());
