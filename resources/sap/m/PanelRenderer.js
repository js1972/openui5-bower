/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("sap.m.PanelRenderer");sap.m.PanelRenderer={};
sap.m.PanelRenderer.render=function(r,c){if(!c.getVisible()){return}r.write("<section");r.writeControlData(c);r.addClass("sapMPanel");r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeClasses();r.writeStyles();r.write(">");var I=c.getExpandable();var h=c.getHeaderToolbar();if(I){r.write("<div");if(h){r.addClass("sapMPanelWrappingDivTb")}else{r.addClass("sapMPanelWrappingDiv")}r.writeClasses();r.write(">");var o=c._getIcon();if(c.getExpanded()){o.addStyleClass("sapMPanelExpandableIconExpanded")}else{o.removeStyleClass("sapMPanelExpandableIconExpanded")}r.renderControl(o)}var H=c.getHeaderText();if(h){h.setDesign(sap.m.ToolbarDesign.Transparent,true);if(c.getExpandable()){h.addStyleClass("sapMPanelHdrExpandable")}r.renderControl(h)}else if(H){r.write("<div");r.addClass("sapMPanelHdr");if(c.getExpandable()){r.addClass("sapMPanelHdrExpandable")}r.writeClasses();r.write(">");r.writeEscaped(H);r.write("</div>")}if(I){r.write("</div>")}var a=c.getInfoToolbar();if(a&&c.getExpandable()){a.addStyleClass("sapMPanelExpandablePart")}if(a){a.setDesign(sap.m.ToolbarDesign.Info,true);r.renderControl(a)}r.write("<div");r.addClass("sapMPanelContent");r.addClass("sapMPanelBG");if(c.getExpandable()){r.addClass("sapMPanelExpandablePart")}r.writeClasses();r.write(">");var C=c.getContent();var l=C.length;for(var i=0;i<l;i++){r.renderControl(C[i])}r.write("</div>");r.write("</section>")};
