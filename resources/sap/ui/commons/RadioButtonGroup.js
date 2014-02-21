/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.commons.RadioButtonGroup");jQuery.sap.require("sap.ui.commons.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.ui.commons.RadioButtonGroup",{metadata:{publicMethods:["getSelectedItem","setSelectedItem"],library:"sap.ui.commons",properties:{"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},"columns":{type:"int",group:"Appearance",defaultValue:1},"visible":{type:"boolean",group:"Appearance",defaultValue:true},"editable":{type:"boolean",group:"Behavior",defaultValue:true},"valueState":{type:"sap.ui.core.ValueState",group:"Data",defaultValue:sap.ui.core.ValueState.None},"selectedIndex":{type:"int",group:"Data",defaultValue:0},"enabled":{type:"boolean",group:"Behavior",defaultValue:true}},defaultAggregation:"items",aggregations:{"items":{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable"}},associations:{"ariaDescribedBy":{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},"ariaLabelledBy":{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{"select":{}}}});sap.ui.commons.RadioButtonGroup.M_EVENTS={'select':'select'};jQuery.sap.require("sap.ui.core.delegate.ItemNavigation");
sap.ui.commons.RadioButtonGroup.prototype.exit=function(){this.destroyItems();if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation}};
sap.ui.commons.RadioButtonGroup.prototype.onBeforeRendering=function(){if(this.getSelectedIndex()>this.getItems().length){jQuery.sap.log.warning("Invalid index, set to 0");this.setSelectedIndex(0)}};
sap.ui.commons.RadioButtonGroup.prototype.onAfterRendering=function(){this.initItemNavigation();for(var i=0;i<this.aRBs.length;i++){jQuery.sap.byId(this.aRBs[i].getId()).attr("aria-posinset",i+1).attr("aria-setsize",this.aRBs.length)}};
sap.ui.commons.RadioButtonGroup.prototype.initItemNavigation=function(){var d=[];this._aActiveItems=[];var a=this._aActiveItems;var e=false;for(var i=0;i<this.aRBs.length;i++){a[d.length]=i;d.push(jQuery.sap.domById(this.aRBs[i].getId()));if(!e&&this.aRBs[i].getEnabled()){e=true}}if(e){e=this.getEnabled()}if(!e){if(this.oItemNavigation){this.removeDelegate(this.oItemNavigation);this.oItemNavigation.destroy();delete this.oItemNavigation}return}if(!this.oItemNavigation){this.oItemNavigation=new sap.ui.core.delegate.ItemNavigation();this.oItemNavigation.attachEvent(sap.ui.core.delegate.ItemNavigation.Events.AfterFocus,this._handleAfterFocus,this);this.addDelegate(this.oItemNavigation)}this.oItemNavigation.setRootDomRef(this.getDomRef());this.oItemNavigation.setItemDomRefs(d);this.oItemNavigation.setCycling(true);this.oItemNavigation.setColumns(this.getColumns());this.oItemNavigation.setSelectedIndex(this.getSelectedIndex());this.oItemNavigation.setFocusedIndex(this.getSelectedIndex())};
sap.ui.commons.RadioButtonGroup.prototype.setSelectedIndex=function(s){var i=this.getSelectedIndex();if(s<0){jQuery.sap.log.warning("Invalid index, will not be changed");return this}this.setProperty("selectedIndex",s,true);if(!isNaN(i)&&this.aRBs&&this.aRBs[i]){this.aRBs[i].setSelected(false)}if(this.aRBs&&this.aRBs[s]){this.aRBs[s].setSelected(true)}if(this.oItemNavigation){this.oItemNavigation.setSelectedIndex(s);this.oItemNavigation.setFocusedIndex(s)}return this};
sap.ui.commons.RadioButtonGroup.prototype.setSelectedItem=function(s){for(var i=0;i<this.getItems().length;i++){if(s.getId()==this.getItems()[i].getId()){this.setSelectedIndex(i);break}}};
sap.ui.commons.RadioButtonGroup.prototype.getSelectedItem=function(){return this.getItems()[this.getSelectedIndex()]};
sap.ui.commons.RadioButtonGroup.prototype.addItem=function(i){this.myChange=true;this.addAggregation("items",i);this.myChange=undefined;if(this.getSelectedIndex()===undefined){this.setSelectedIndex(0)}if(!this.aRBs){this.aRBs=[]}var I=this.aRBs.length;this.aRBs[I]=this.createRadioButton(i,I);return this};
sap.ui.commons.RadioButtonGroup.prototype.insertItem=function(I,a){this.myChange=true;this.insertAggregation("items",I,a);this.myChange=undefined;if(!this.aRBs){this.aRBs=[]}var l=this.aRBs.length;if(this.getSelectedIndex()===undefined||l==0){this.setSelectedIndex(0)}else if(this.getSelectedIndex()>=a){this.setProperty("selectedIndex",this.getSelectedIndex()+1,true)}if(a>=l){this.aRBs[a]=this.createRadioButton(I,a)}else{for(var i=(l);i>a;i--){this.aRBs[i]=this.aRBs[i-1];if((i-1)==a){this.aRBs[i-1]=this.createRadioButton(I,a)}}}return this};
sap.ui.commons.RadioButtonGroup.prototype.createRadioButton=function(i,I){if(this.iIDCount==undefined){this.iIDCount=0}else{this.iIDCount++}var r=new sap.ui.commons.RadioButton(this.getId()+"-"+this.iIDCount);r.setText(i.getText());r.setTooltip(i.getTooltip());if(this.getEnabled()){r.setEnabled(i.getEnabled())}else{r.setEnabled(false)}r.setKey(i.getKey());r.setTextDirection(i.getTextDirection());r.setEditable(this.getEditable());r.setGroupName(this.getId());r.setValueState(this.getValueState());r.setParent(this);if(I==this.getSelectedIndex()){r.setSelected(true)}r.attachEvent('select',this.handleRBSelect,this);return(r)};
sap.ui.commons.RadioButtonGroup.prototype.removeItem=function(e){var i=e;if(typeof(e)=="string"){e=sap.ui.getCore().byId(e)}if(typeof(e)=="object"){i=this.indexOfItem(e)}this.myChange=true;var I=this.removeAggregation("items",i);this.myChange=undefined;if(!this.aRBs){this.aRBs=[]}if(!this.aRBs[i]){return null}this.aRBs[i].destroy();this.aRBs.splice(i,1);if(this.aRBs.length==0){this.setSelectedIndex(undefined)}else if(this.getSelectedIndex()==i){this.setSelectedIndex(0)}else{if(this.getSelectedIndex()>i){this.setProperty("selectedIndex",this.getSelectedIndex()-1,true)}}return I};
sap.ui.commons.RadioButtonGroup.prototype.removeAllItems=function(){this.myChange=true;var i=this.removeAllAggregation("items");this.myChange=undefined;this.setSelectedIndex(undefined);if(this.aRBs){while(this.aRBs.length>0){this.aRBs[0].destroy();this.aRBs.splice(0,1)};return i}else{return null}};
sap.ui.commons.RadioButtonGroup.prototype.destroyItems=function(){this.myChange=true;this.destroyAggregation("items");this.myChange=undefined;this.setSelectedIndex(undefined);if(this.aRBs){while(this.aRBs.length>0){this.aRBs[0].destroy();this.aRBs.splice(0,1)}}return this};
sap.ui.commons.RadioButtonGroup.prototype.invalidate=function(o){if(o instanceof sap.ui.core.Item&&this.aRBs&&!this.myChange){var I=this.getItems();for(var i=0;i<I.length;i++){if(I[i]==o){if(this.aRBs[i]){this.aRBs[i].setText(I[i].getText());this.aRBs[i].setTooltip(I[i].getTooltip());if(this.getEnabled()){this.aRBs[i].setEnabled(I[i].getEnabled())}else{this.aRBs[i].setEnabled(false)}this.aRBs[i].setKey(I[i].getKey());this.aRBs[i].setTextDirection(I[i].getTextDirection())}break}}if(this.getDomRef()){this.initItemNavigation()}}var p=this.getParent();if(p){p.invalidate(this)}};
sap.ui.commons.RadioButtonGroup.prototype.handleRBSelect=function(c){for(var i=0;i<this.aRBs.length;i++){if(this.aRBs[i].getId()==c.getParameter("id")){this.setSelectedIndex(i);this.oItemNavigation.setSelectedIndex(i);this.oItemNavigation.setFocusedIndex(i);this.fireSelect({selectedIndex:i});break}}};
sap.ui.commons.RadioButtonGroup.prototype.setEditable=function(e){this.setProperty("editable",e,false);if(this.aRBs){for(var i=0;i<this.aRBs.length;i++){this.aRBs[i].setEditable(e)}}};
sap.ui.commons.RadioButtonGroup.prototype.setEnabled=function(e){this.setProperty("enabled",e,false);if(this.aRBs){var I=this.getItems();for(var i=0;i<this.aRBs.length;i++){if(e){this.aRBs[i].setEnabled(I[i].getEnabled())}else{this.aRBs[i].setEnabled(e)}}}};
sap.ui.commons.RadioButtonGroup.prototype.setValueState=function(v){this.setProperty("valueState",v,false);if(this.aRBs){for(var i=0;i<this.aRBs.length;i++){this.aRBs[i].setValueState(v)}}};
sap.ui.commons.RadioButtonGroup.prototype._handleAfterFocus=function(c){var i=c.getParameter("index");var e=c.getParameter("event");if(i!=this.getSelectedIndex()&&!(e.ctrlKey||e.metaKey)&&this.aRBs[i].getEditable()&&this.aRBs[i].getEnabled()){this.setSelectedIndex(i);this.oItemNavigation.setSelectedIndex(i);this.fireSelect({selectedIndex:i})}};
