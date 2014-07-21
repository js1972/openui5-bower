/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.ui.table.ColumnMenu");jQuery.sap.require("sap.ui.table.library");jQuery.sap.require("sap.ui.unified.Menu");sap.ui.unified.Menu.extend("sap.ui.table.ColumnMenu",{metadata:{library:"sap.ui.table"}});jQuery.sap.require("sap.ui.core.RenderManager");jQuery.sap.require("sap.ui.unified.Menu");jQuery.sap.require("sap.ui.unified.MenuItem");
sap.ui.table.ColumnMenu.prototype.init=function(){this.addStyleClass("sapUiTableColumnMenu");this.oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.table");this._bInvalidated=true;this._iPopupClosedTimeoutId=null;this._oColumn=null;this._oTable=null;this._attachPopupClosed()};
sap.ui.table.ColumnMenu.prototype.exit=function(){window.clearTimeout(this._iPopupClosedTimeoutId);this._detachEvents();this._oColumn=this._oTable=null};
sap.ui.table.ColumnMenu.prototype.onThemeChanged=function(){if(this.getDomRef()){this._invalidate()}};
sap.ui.table.ColumnMenu.prototype.setParent=function(p){this._detachEvents();this._invalidate();this._oColumn=p;if(p){this._oTable=this._oColumn.getParent();if(this._oTable){}}this._attachEvents();return sap.ui.unified.Menu.prototype.setParent.apply(this,arguments)};
sap.ui.table.ColumnMenu.prototype._attachEvents=function(){if(this._oTable){this._oTable.attachColumnVisibility(this._invalidate,this);this._oTable.attachColumnMove(this._invalidate,this)}};
sap.ui.table.ColumnMenu.prototype._detachEvents=function(){if(this._oTable){this._oTable.detachColumnVisibility(this._invalidate,this);this._oTable.detachColumnMove(this._invalidate,this)}};
sap.ui.table.ColumnMenu.prototype._invalidate=function(){this._bInvalidated=true};
sap.ui.table.ColumnMenu.prototype._attachPopupClosed=function(){var t=this;if(!sap.ui.Device.support.touch){this.getPopup().attachClosed(function(e){t._iPopupClosedTimeoutId=window.setTimeout(function(){if(t._oColumn){t._oColumn.focus()}},0)})}};
sap.ui.table.ColumnMenu.prototype.open=function(){if(this._bInvalidated){this._bInvalidated=false;this.destroyItems();this._addMenuItems()}if(this.getItems().length>0){sap.ui.unified.Menu.prototype.open.apply(this,arguments)}};
sap.ui.table.ColumnMenu.prototype._addMenuItems=function(){if(this._oColumn){this._addSortMenuItem(false);this._addSortMenuItem(true);this._addFilterMenuItem();this._addGroupMenuItem();this._addFreezeMenuItem();this._addColumnVisibilityMenuItem()}};
sap.ui.table.ColumnMenu.prototype._addSortMenuItem=function(d){var c=this._oColumn;var D=d?"desc":"asc";var i=d?"sort-descending":"sort-ascending";if(c.getSortProperty()&&c.getShowSortMenuEntry()){this.addItem(this._createMenuItem(D,"TBL_SORT_"+D.toUpperCase(),i,function(e){c.sort(d,e.getParameter("ctrlKey")===true)}))}};
sap.ui.table.ColumnMenu.prototype._addFilterMenuItem=function(){var c=this._oColumn;if(c.getFilterProperty()&&c.getShowFilterMenuEntry()){this.addItem(this._createMenuTextFieldItem("filter","TBL_FILTER","filter",c.getFilterValue(),function(e){c.filter(this.getValue())}))}};
sap.ui.table.ColumnMenu.prototype._addGroupMenuItem=function(){var c=this._oColumn;var t=this._oTable;if(t&&t.getEnableGrouping()&&c.getSortProperty()){this.addItem(this._createMenuItem("group","TBL_GROUP",null,jQuery.proxy(function(e){t.setGroupBy(c)},this)))}};
sap.ui.table.ColumnMenu.prototype._addFreezeMenuItem=function(){var c=this._oColumn;var t=this._oTable;if(t&&t.getEnableColumnFreeze()){var C=jQuery.inArray(c,t.getColumns());var i=C+1==t.getFixedColumnCount();this.addItem(this._createMenuItem("freeze",i?"TBL_UNFREEZE":"TBL_FREEZE",null,function(e){var E=t.fireColumnFreeze({column:c});if(E){if(i){t.setFixedColumnCount(0)}else{t.setFixedColumnCount(C+1)}}}))}};
sap.ui.table.ColumnMenu.prototype._addColumnVisibilityMenuItem=function(){var t=this._oTable;if(t&&t.getShowColumnVisibilityMenu()){var c=this._createMenuItem("column-visibilty","TBL_COLUMNS");this.addItem(c);var C=new sap.ui.unified.Menu(c.getId()+"-menu");C.addStyleClass("sapUiTableColumnVisibilityMenu");c.setSubmenu(C);var a=t.getColumns();if(t.getColumnVisibilityMenuSorter&&typeof t.getColumnVisibilityMenuSorter==="function"){var s=t.getColumnVisibilityMenuSorter();if(typeof s==="function"){a=a.sort(s)}}for(var i=0,l=a.length;i<l;i++){var m=this._createColumnVisibilityMenuItem(C.getId()+"-item-"+i,a[i]);C.addItem(m)}}};
sap.ui.table.ColumnMenu.prototype._createColumnVisibilityMenuItem=function(i,c){var t=c.getName()||(c.getLabel()&&c.getLabel().getText?c.getLabel().getText():null);return new sap.ui.unified.MenuItem(i,{text:t,icon:c.getVisible()?"sap-icon://accept":null,select:jQuery.proxy(function(e){var m=e.getSource();var v=!c.getVisible();if(v||this._oTable._getVisibleColumnCount()>1){var T=c.getParent();var E=true;if(T&&T instanceof sap.ui.table.Table){E=T.fireColumnVisibility({column:c,newVisible:v})}if(E){c.setVisible(v)}m.setIcon(v?"sap-icon://accept":null)}},this)})};
sap.ui.table.ColumnMenu.prototype._createMenuItem=function(i,t,I,h){return new sap.ui.unified.MenuItem(this.getId()+"-"+i,{text:this.oResBundle.getText(t),icon:I?"sap-icon://"+I:null,select:h||function(){}})};
sap.ui.table.ColumnMenu.prototype._createMenuTextFieldItem=function(i,t,I,v,h){jQuery.sap.require("sap.ui.unified.MenuTextFieldItem");h=h||function(){};return new sap.ui.unified.MenuTextFieldItem(this.getId()+"-"+i,{label:this.oResBundle.getText(t),icon:I?"sap-icon://"+I:null,value:v,select:h||function(){}})};
sap.ui.table.ColumnMenu.prototype._setFilterValue=function(v){var f=sap.ui.getCore().byId(this.getId()+"-filter");if(f){f.setValue(v)}return this};
sap.ui.table.ColumnMenu.prototype._setFilterState=function(f){var F=sap.ui.getCore().byId(this.getId()+"-filter");if(F){F.setValueState(f)}return this};
