/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @namespace
 * @name sap.ui.core.delegate
 * @public
 */

// Provides class sap.ui.core.delegate.ScrollEnablement
jQuery.sap.declare("sap.ui.core.delegate.ScrollEnablement");

jQuery.sap.require("sap.ui.base.Object");

(function($) {

	sap.ui.base.Object.extend("sap.ui.core.delegate.ScrollEnablement", /* @lends sap.ui.core.delegate.ScrollEnablement */ {

		/**
		 * Creates a ScrollEnablement delegate that can be attached to Controls requiring
		 * capabilities for scrolling of a certain part of their DOM on mobile devices.
		 *
		 * @class Delegate for touch scrolling on mobile devices
		 *
		 * @author SAP AG
		 *
		 * This delegate uses CSS (-webkit-overflow-scrolling) only if supported. Otherwise the desired
		 * scrolling library is used. Please also consider the documentation
		 * of the library for a proper usage.
		 *
		 * Controls that implement ScrollEnablement should additionally provide the getScrollDelegate method that returns
		 * the current instance of this delegate object
		 *
		 * @extends sap.ui.base.Object
		 * @name sap.ui.core.delegate.ScrollEnablement
		 * @experimental Since 1.5.2. This class is experimental and provides only limited functionality. Also the API might be changed in future.
		 *
		 * @param {sap.ui.core.Control} oControl the Control of which this Scroller is the delegate
		 * @param {string} sScrollContentDom the Id of the element within the DOM of the Control which should be scrollable
		 * @param {object} oConfig the configuration of the scroll delegate
		 * @param {boolean} [oConfig.horizontal=false] Whether the element should be scrollable horizontally
		 * @param {boolean} [oConfig.vertical=false] Whether the element should be scrollable vertically
		 * @param {boolean} [oConfig.zynga=false] If set, then the Zynga scroller (http://zynga.github.com/scroller/) is used otherwise iScroll (http://cubiq.org/iscroll-4) is used.
		 * @param {boolean} [oConfig.preventDefault=false] If set, the default of touchmove is prevented
		 * @param {boolean} [oConfig.nonTouchScrolling=false] If true, the delegate will also be active to allow touch like scrolling with the mouse on non-touch platforms; if set to "scrollbar", there will be normal scrolling with scrollbars and no touch-like scrolling where the content is dragged
		 *
		 * @version 1.18.8
		 * @constructor
		 * @protected
		 */
		constructor : function(oControl, sScrollContentDom, oConfig) {

			sap.ui.base.Object.apply(this);

			this._oControl = oControl;
			this._oControl.addDelegate(this);
			this._sContentId = sScrollContentDom;
			this._bHorizontal = !!oConfig.horizontal;
			this._bVertical = !!oConfig.vertical;
			this._scrollX = 0;
			this._scrollY = 0;
			this._scroller = null;
			this._scrollbarClass = oConfig.scrollbarClass || false;
			this._bounce = oConfig.bounce;

			initDelegateMembers(this, oConfig);

			if(this._init){
				this._init.apply(this, arguments);
			}
		},

		/**
		 * Enable or disable horizontal scrolling.
		 *
		 * @param {boolean} bHorizontal set true to enable horizontal scrolling, false - to disable
		 * @protected
		 */
		setHorizontal : function(bHorizontal) {
			this._bHorizontal = !!bHorizontal;

			if (this._scroller) {
				if (this._zynga) {

					// Zynga keeps scrolling options internally
					this._scroller.options.scrollingX = this._bHorizontal;
				} else {
					// iScroll
					this._scroller.hScroll = this._scroller.hScrollbar = this._bHorizontal;
					this._scroller._scrollbar('h');
				}
			} else if(this._setOverflow) { // native scrolling
				this._setOverflow();
			}
		},

		/**
		 * Enable or disable vertical scrolling.
		 *
		 * @param {boolean} bVertical set true to enable vertical scrolling, false - to disable
		 * @protected
		 */
		setVertical : function(bVertical) {
			this._bVertical = !!bVertical;

			if (this._scroller) {
				if (this._zynga) {

					// Zynga options
					this._scroller.options.scrollingY = this._bVertical;
				} else {

					// iScroll
					this._scroller.vScroll = this._scroller.vScrollbar = this._bVertical;
					this._scroller._scrollbar('v');
				}
			} else if(this._setOverflow) { //native scrolling
				this._setOverflow();
			}
		},

		/**
		 * Get current setting for horizontal scrolling.
		 *
		 * @return {boolean} true if horizontal scrolling is enabled
		 * @protected
		 * @since 1.9.1
		 */
		getHorizontal : function() {
			return this._bHorizontal;
		},

		/**
		 * Get current setting for vertical scrolling.
		 *
		 * @return {boolean} true if vertical scrolling is enabled
		 * @protected
		 * @since 1.9.1
		 */
		getVertical : function() {
			return this._bVertical;
		},

		/**
		 * Setter for property <code>bounce</code>.
		 *
		 * @param {boolean} bBounce new value for property <code>bounce</code>.
		 * @protected
		 * @since 1.17
		 */
		setBounce: function(bBounce) {
			this._bounce = !!bBounce;
		},

		/**
		 * Set overflow control on top of scroll container.
		 *
		 * @param {sap.ui.core.Control} top control that should be normally hidden over
		 * the top border of the scroll container (pull-down content).
		 * This function is supported in iScroll delegates only. In MouseScroll delegates the element is not hidden and should have an appropriate rendering for being always displayed and should have an alternative way for triggering (e.g. a Button).
		 * @protected
		 * @since 1.9.2
		 */
		setPullDown : function(oControl) {
			this._oPullDown = oControl;
			return this;
		},

		/**
		 * Sets GrowingList control to scroll container
		 *
		 * @param {sap.m.GrowingList} GrowingList instance
		 * This function is supported in iScroll and mouse delegates only.
		 * @protected
		 * @since 1.11.0
		 */
		setGrowingList : function(oGrowingList, fnScrollLoadCallback) {
			this._oGrowingList = oGrowingList;
			this._fnScrollLoadCallback = jQuery.proxy(fnScrollLoadCallback, oGrowingList);
			return this;
		},

		/**
		 * Sets IconTabBar control to scroll container
		 *
		 * @param {sap.m.IconTabBar} IconTabBar instance
		 * This function is supported in iScroll only.
		 * @protected
		 * @since 1.16.1
		 */
		setIconTabBar : function(oIconTabBar, fnScrollEndCallback, fnScrollStartCallback) {
			this._oIconTabBar = oIconTabBar;
			this._fnScrollEndCallback = jQuery.proxy(fnScrollEndCallback, oIconTabBar);
			this._fnScrollStartCallback = jQuery.proxy(fnScrollStartCallback, oIconTabBar);
			return this;
		},

		scrollTo : function(x, y, time) {
			this._scrollX = x; // remember for later rendering
			this._scrollY = y;
			this._scrollTo(x, y, time);
			return this;
		},

		/**
		 * Destroys this Scrolling delegate.
		 *
		 * This function must be called by the control which uses this delegate in the <code>exit</code> function.
		 * @protected
		 */
		destroy : function() {
			if(this._exit){
				this._exit();
			}

			if(this._oControl){
				this._oControl.removeDelegate(this);
				this._oControl = undefined;
			}
		},

		/**
		 * Refreshes this Scrolling delegate.
		 *
		 * @protected
		 */
		refresh : function() {
			if(this._refresh){
				this._refresh();
			}
		}

	});


	/* =========================================================== */
	/* Delegate members for usage of iScroll library               */
	/* =========================================================== */


	var oIScrollDelegate = {

		getScrollTop : function() {
			return this._scrollY;
		},

		getScrollLeft : function() {
			return this._scrollX;
		},

		getMaxScrollTop : function() {
			return -this._scroller.maxScrollY;
		},

		_scrollTo : function(x, y, time) {
			this._scroller.scrollTo(-x, -y, time, false);
		},

		_refresh : function() {
			if (this._scroller && this._sScrollerId) {
				var oScroller = $.sap.domById(this._sScrollerId);

				if (oScroller && (oScroller.offsetHeight > 0)) { // only refresh if rendered and not collapsed to zero height (e.g. display: none)

					this._bIgnoreScrollEnd = true; // this refresh may introduce wrong position 0 after invisible rerendering
					this._scroller.refresh();
					this._bIgnoreScrollEnd = false;

					// and if scroller is not yet at the correct position (e.g. due to rerendering) move it there
					if (-this._scrollX != this._scroller.x || -this._scrollY != this._scroller.y) {
						this._scroller.scrollTo(-this._scrollX, -this._scrollY, 0);
					}

					// reset scrollTop of the section after webkit soft keyboard is closed
					if(this._scroller.wrapper && this._scroller.wrapper.scrollTop){
						this._scroller.wrapper.scrollTop = 0;
					}
				}
			}
		},

		_cleanup : function() {
			this._toggleResizeListeners(false);

			if (this._scroller) {
				this._scroller.stop();
				this._scrollX = -this._scroller.x; // remember position for after rendering
				var oScroller = $.sap.domById(this._sScrollerId);

				if (oScroller && (oScroller.offsetHeight > 0)) {
					this._scrollY = -this._scroller.y;
				}

				this._scroller.destroy();
				this._scroller = null;
			}
		},

		_toggleResizeListeners : function(bToggle){

			if(this._sScrollerResizeListenerId){
				sap.ui.core.ResizeHandler.deregister(this._sScrollerResizeListenerId);
				this._sScrollerResizeListenerId = null;
			}

			if(this._sContentResizeListenerId){
				sap.ui.core.ResizeHandler.deregister(this._sContentResizeListenerId);
				this._sContentResizeListenerId = null;
			}

			if(bToggle && this._sContentId && $.sap.domById(this._sContentId)){

				//TODO Prevent a double refresh
				var $fRefresh = $.proxy(this._refresh, this);
				this._sScrollerResizeListenerId = sap.ui.core.ResizeHandler.register( $.sap.domById(this._sScrollerId), $fRefresh );
				this._sContentResizeListenerId = sap.ui.core.ResizeHandler.register( $.sap.domById(this._sContentId), $fRefresh );
			}

		},

		onBeforeRendering : function() {
			this._cleanup();
		},

		onfocusin: function(evt) {
			// on Android Inputs need to be scrolled into view
			if (sap.ui.core.delegate.ScrollEnablement._bScrollToInput && sap.ui.Device.os.android) {
				var element = evt.srcElement;
				this._sTimerId && jQuery.sap.clearDelayedCall(this._sTimerId);
				if (element && element.nodeName &&
						(element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA")) {
					this._sTimerId = jQuery.sap.delayedCall(400, this, function() {
						var offset = this._scroller._offset(element);
						offset.top += 48;
						this._scroller.scrollTo(offset.left, offset.top);
					});
				}
			}
		},

		onAfterRendering : function() {
			var that = this,
				bBounce = (this._bounce !== undefined) ? this._bounce : sap.ui.Device.os.ios;

			var $Content = $.sap.byId(this._sContentId);

			this._sScrollerId = $Content.parent().attr("id");

			// Fix for displaced edit box overlay on scrolled pages in Android 4.x and 2.3.4 browsers:
			var bDontUseTransform = (
					!!sap.ui.Device.os.android &&
					!sap.ui.Device.browser.chrome &&
					(sap.ui.Device.os.version == 4 || !sap.ui.Device.os.versionStr.indexOf("2.3.4")) &&
					$Content.find("input,textarea").length
				);

			this._iTopOffset = this._oPullDown && this._oPullDown.getDomRef && this._oPullDown.getDomRef().offsetHeight || 0;

			var x = this._scrollX || 0,
				y = this._scrollY || 0;
			
			// RTL adaptations
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				// iScroll does not support RTL, so in RTL mode we need some tweaks (see https://github.com/cubiq/iscroll/issues/247)
				$Content.attr("dir", "rtl");
				var $Parent = $Content.parent();
				$Parent.attr("dir", "ltr");
				
				if (!this._bScrollPosInitialized) {
					x = this._scrollX = $Content.width() - $Parent.width(); // initial scroll position: scrolled to the right edge in RTL
					this._bScrollPosInitialized = true;
				}
			}

			this._scroller = new window.iScroll(this._sScrollerId, {
				useTransition: true,
				useTransform: !bDontUseTransform,
				hideScrollbar: true,
				fadeScrollbar: true,
				bounce: !!bBounce,
				momentum: true,
				handleClick: false,	/* implicitly set to false otherwise we have double click event */
				hScroll: this._bHorizontal,
				vScroll: this._bVertical,
				x: -x,
				y: -y,
				topOffset: this._iTopOffset,
				scrollbarClass: this._scrollbarClass,
				onBeforeScrollStart: function(oEvent) {

					// A touch on a scrolling list means "stop scrolling" and not a tap.
					if (that._isScrolling) {

						// Do not allow core to convert touchstart+touchend into a tap event during scrolling:
						oEvent.stopPropagation();

						// Disable native HTML behavior on <a> elements:
						oEvent.preventDefault();
					}
				},

				onScrollEnd: function() {
					if (!that._bIgnoreScrollEnd && that._scroller) { // that.scroller can be undefined when scrolled into the empty place
						that._scrollX = -that._scroller.x;
						that._scrollY = -that._scroller.y;
					}

					if (that._oPullDown) {
						that._oPullDown.doScrollEnd();
					}

					if (that._oGrowingList && that._fnScrollLoadCallback) {

						// start loading if 75% of the scroll container is scrolled
						var scrollThreshold = Math.floor(this.wrapperH / 4);
						var bInLoadingLimit = -this.maxScrollY + this.y < scrollThreshold;

						// user needs to scroll bottom and must be in loading range
						if (this.dirY > 0 && bInLoadingLimit) {
							that._fnScrollLoadCallback();
						}

					}

					if (that._oIconTabBar && that._fnScrollEndCallback) {
						that._fnScrollEndCallback();
					}

					that._isScrolling = false;
				},

				onRefresh: function(){
					if (that._oPullDown) {
						that._oPullDown.doRefresh();
					}

					// Reset resize listeners after each refresh to avoid concurrent errors like in
					// the following case:
					// 1. List height: 2000px. Resize handler remembers it
					// 2. PullToRefresh calls refresh, list is empty, height: 800px, iScroll remembers it
					// 3. List is filled again, no change, list height is 2000px.
					// 4. Resize handler checks after 200ms and finds no changes: iScroll has wrong size and
					//    must be refreshed.
					// Due to this, refresh and resize handler registration should be done synchronously
					that._toggleResizeListeners(true);
				},

				onScrollMove: function(oEvent) {
					if (!that._isScrolling) {

						// Workaround for problems with active input and textarea: close keyboard on scroll start
						var rIsTextField = /(INPUT|TEXTAREA)/i,
							oActiveEl = document.activeElement;

						if (rIsTextField.test(oActiveEl.tagName) && oEvent.target !== oActiveEl ) {
							oActiveEl.blur();
						}
					}

					that._isScrolling = true;

					if (that._oPullDown) {
						that._oPullDown.doScrollMove();
					}

					if (that._oIconTabBar && that._fnScrollStartCallback) {
						that._fnScrollStartCallback();
					}
				}
			});

			// Traverse the parents and check if any has a ScrollDelegate with the same vertical or horizontal scroll.
			// Controls that implement ScrollEnablement should provide the getScrollDelegate method.
			for (var oParent = this._oControl; oParent = oParent.oParent;) {
				var oSD = oParent.getScrollDelegate ? oParent.getScrollDelegate() : null;
				if(oSD && (oSD.getVertical() && this.getVertical() || oSD.getHorizontal() && this.getHorizontal())){
					this._scroller._sapui_isNested = true;
					break;
				}
			}

			// SAP modification: disable nested scrolling.
			this._scroller._move = function(oEvent){

				if(oEvent._sapui_handledByControl && !oEvent._sapui_scroll){ return; }

				// Enable scrolling of outer container when the inner container is scrolled to the end
				// so that a user can "pull out" contents that have been accidentally moved outside of
				// the scrolling container by momentum scrolling.
				if(this._sapui_isNested){
					oEvent._sapui_handledByControl =
						!(this.dirY < 0 && this.y >= 0) &&
						!(this.dirY > 0 && this.y <= this.maxScrollY) &&
						!(this.dirX < 0 && this.x >= 0) &&
						!(this.dirX > 0 && this.x <= this.maxScrollX);
				}

				window.iScroll.prototype._move.call(this,oEvent);
			};

			// re-apply scrolling position after rendering - but only if changed and the height is > 0
			var oScroller = $Content.parent()[0];

			if (oScroller && (oScroller.offsetHeight > 0)) {
				if (this._scrollX != -this._scroller.x || this._scrollY != -this._scroller.y){
					this._scroller.scrollTo(-this._scrollX, -this._scrollY, 0);
				}
			}

			// listen to size changes
			this._toggleResizeListeners(true);

		},

		ontouchmove : function(oEvent) {

			if (this._preventTouchMoveDefault) {

				//Prevent the default touch action e.g. scrolling the whole page
				oEvent.preventDefault();
			}
		}
	};

	/* =========================================================== */
	/* Delegate members for usage of Zynga library                 */
	/* =========================================================== */

	var oZyngaDelegate = {

		_refresh : function() {
			if (this._scroller && this._sContentId && $.sap.domById(this._sContentId)) {
				var $Content = $.sap.byId(this._sContentId);
				var $Container = $Content.parent();
				this._scroller.setDimensions($Container.width(), $Container.height(), $Content.width(), $Content.height());
			}
		},

		_cleanup : function() {
			if(this._sScrollerResizeListenerId){
				sap.ui.core.ResizeHandler.deregister(this._sScrollerResizeListenerId);
				this._sScrollerResizeListenerId = null;
			}

			if(this._sContentResizeListenerId){
				sap.ui.core.ResizeHandler.deregister(this._sContentResizeListenerId);
				this._sContentResizeListenerId = null;
			}

			if (this._scroller) {
				var oVals = this._scroller.getValues();
				this._scrollX = oVals.left; // remember position for after rendering
				this._scrollY = oVals.top;
			}
		},

		_scrollTo : function(x, y, time){
			if(this._scroller){
				if (!isNaN(time)){
					this._scroller.options.animationDuration = time;
				}
				this._scroller.scrollTo(x, y, !!time);
			}
		},

		onBeforeRendering : function() {
			this._cleanup();
		},

		onAfterRendering : function() {
			this._refresh();

			this._scroller.scrollTo(this._scrollX, this._scrollY, false);

			this._sContentResizeListenerId = sap.ui.core.ResizeHandler.register(
				$.sap.domById(this._sContentId),
				$.proxy(function(){
					if((!this._sContentId || !$.sap.domById(this._sContentId)) && this._sContentResizeListenerId){
						sap.ui.core.ResizeHandler.deregister(this._sContentResizeListenerId);
						this._sContentResizeListenerId = null;
					}else{
						this._refresh();
					}
				}, this)
			);
		},

		ontouchstart : function(oEvent) {

			// Don't react if initial down happens on a form element
			if (oEvent.target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			this._scroller.doTouchStart(oEvent.touches, oEvent.timeStamp);
		},

		ontouchend : function(oEvent) {
			this._scroller.doTouchEnd(oEvent.timeStamp);
		},

		ontouchmove : function(oEvent) {
			this._scroller.doTouchMove(oEvent.touches, oEvent.timeStamp);
			if(this._preventTouchMoveDefault) {
				//Prevent the default touch action e.g. scrolling the whole page
				oEvent.preventDefault();
			} else {
				// Zynga relies on default browser behavior and
				// the app.control prevents default at window level in initMobile
				oEvent.stopPropagation();
			}
		}
	};

	/* =========================================================== */
	/* Native scroll delegate                                      */
	/* =========================================================== */

	var oNativeScrollDelegate = {

		getScrollTop : function() {
			return this._scrollY || 0;
		},

		getScrollLeft : function() {
			return this._scrollX || 0;
		},

		getMaxScrollTop : function() {
			return (this._$Container && this._$Container.length) ? this._$Container[0].scrollHeight - this._$Container.height() : -1;
		},

		_setOverflow : function(){
			var $Container = this._$Container;
			if(!$Container || !$Container[0]) return;

			// Let container scroll into the configured directions
			$Container.css("z-index", "0"); // performance hack for webkit
			if(sap.ui.Device.os.ios){
				$Container
					.css("overflow-x", this._bHorizontal ? "scroll" : "hidden")
					.css("overflow-y", this._bVertical ? "scroll" : "hidden")
					.css("-webkit-overflow-scrolling", "touch");
			} else { //other browsers do not support -webkit-overflow-scrolling
				$Container
					.css("overflow-x", this._bHorizontal ? "auto" : "hidden")
					.css("overflow-y", this._bVertical ? "auto" : "hidden");
			}

			// Make sure that contents fits between headers and footers in case of absolute
			// positioned content section (Page: absolute, Dialog: relative):
			if(window.getComputedStyle($Container[0]).position == "absolute"){
				var header = $Container.prev()[0];
				if(header){
					var top = header.offsetHeight + header.offsetTop;
					if($Container[0].offsetTop != top){
						$Container.css("top", top + "px");
					}
				}
				var footer = $Container.next()[0];
				if(footer){
					var bottom = footer.parentElement.clientHeight - footer.offsetTop;
					if($Container[0].offsetTop + $Container[0].clientHeight != bottom){
						$Container.css("bottom", bottom + "px");
					}
				}
				// Remove iScroll border hack.
				$Container.children(".sapMPageScroll").css("border", "none");
			}
		},

		_refresh : function(){
			var $Container = this._$Container;
			if(!$Container || !$Container.height()) return;

			var $Content = $.sap.byId(this._sContentId);

			var top = 0; // additional space for P2R || growing
			if(this._oPullDown && this._oPullDown._bTouchMode){
				// hide pull to refresh (except for state 2 - loading)
				var domRef = this._oPullDown.getDomRef();
				if(domRef){
					top = domRef.offsetHeight + domRef.offsetTop;
					if(this._oPullDown._iState != 2 && this._scrollY < top){
						this._scrollY = top;
					}
				}
			} else if(this._fnScrollLoadCallback){ // make growing list always scrollable
				top = 5;
			} else if(this._bHorizontal && sap.ui.Device.os.ios){ // allow horizontal scrolling on IOS
				top = 2;
			}
			if(top){
				// make sure it always scrolls with the growing list and pull to refresh
				$Content.css("min-height", $Container[0].clientHeight + top + "px");
			}

			if($Container.scrollTop() != this._scrollY){
				$Container.scrollTop(this._scrollY);
			}

			if (!(this._oPullDown && this._oPullDown._bTouchMode)
				&& !this._fnScrollLoadCallback
				&& !!!sap.ui.Device.browser.internet_explorer) {
				// for IE the resize listener must remain in place for the case when navigating away and coming back.
				// For the other browsers it seems to work fine without.
				sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
				this._sResizeListenerId = null;
			}
		},

		_onScroll: function(oEvent) {
			var $Container = this._$Container;

			this._scrollX = $Container.scrollLeft(); // remember position
			this._scrollY = $Container.scrollTop();

			// Growing List/Table
			if (this._fnScrollLoadCallback && $Container[0].scrollHeight - $Container.scrollTop() - $Container.height() < 100 ) {
				this._fnScrollLoadCallback(); // close to the bottom
			}

			// PullToRefresh in pull/touch mode
			if(this._oPullDown){
				this._oPullDown.doScrollMove(this._scrollY, this._bScrolling, true);
			}

			// IconTabBar.
			// TODO: allow native scrolling in IconTabBar
			if(!this._bScrolling && this._fnScrollEndCallback){
				this._fnScrollEndCallback();
			}
		},

		_onStart : function(oEvent){
			var container = this._$Container[0];
			if(!container) return;

			// vertically scrollable, for rubber page prevention
			this._bScrollable = this._bVertical && (container.scrollHeight > container.clientHeight + 1);
			// enable horizontal scrolling on ios
			this._bScrollable = this._bScrollable || this._bHorizontal && sap.ui.Device.os.ios;

			if(this._bScrollable){
				if(sap.ui.Device.os.ios){
					if(container.scrollTop == 0){
						container.scrollTop = 1;
					}
		
					var delta = container.scrollHeight - container.clientHeight;
					if(container.scrollTop === delta){
						container.scrollTop = delta-1;
					}
				}
				this._bScrolling = true;
			}

			// IconTabBar
			if (this._fnScrollStartCallback) {
				this._bScrolling = true;
				this._fnScrollStartCallback();
			}

		},

		_onTouchMove : function(oEvent){
			// Prevent rubber scroll of the whole application window in IOS.
			// see jQuery.sap.mobile.js
			if(this._bScrollable){
				oEvent.setMarked();
				if(window.iScroll){ // if both iScroll and native scrolling are used (IconTabBar)
					oEvent.setMarked("scroll");
				}
			}
		},

		_onEnd : function(){
			if(!this._bScrolling) return;
			// Attention: there still may be momentum scrolling  with two more scroll events thereafter,
			// but PullDown fires the refresh event based on the current scroll state
			this._bScrolling = false;
			if (this._oPullDown && this._oPullDown._bTouchMode) { this._oPullDown.doScrollEnd(); }
			this._refresh();

			// IconTabBar.
			if (this._fnScrollEndCallback) { this._fnScrollEndCallback(); }
		},

		// Mouse drag scrolling, optional.
		// Set options.nonTouchScrolling = true to enable
		_onMouseDown : function(oEvent){
			var container = this._$Container[0];
			if(!container) return;

			if(oEvent.button) return; // react on the left button only

			// Store initial coordinates for mouse drag
			this._iX = container.scrollLeft + oEvent.pageX;
			this._iY = container.scrollTop + oEvent.pageY;

			// initialize scrolling
			this._onStart(oEvent);
		},

		_onMouseMove : function(oEvent){
			if(this._bScrolling){
				this._$Container[0].scrollLeft = this._iX - oEvent.pageX;
				this._$Container[0].scrollTop = this._iY - oEvent.pageY;
			}
		},

		onBeforeRendering: function() {
			if (this._sResizeListenerId) {
				sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
				this._sResizeListenerId = null;
			}

			var $Container = this._$Container;
			if ($Container) {
				if ($Container.height() > 0) {
					this._scrollX = $Container.scrollLeft(); // remember position
					this._scrollY = $Container.scrollTop();
				}
				$Container.off(); // delete all event handlers
			}
		},

		onAfterRendering: function() {

			var $Container = this._$Container = $.sap.byId(this._sContentId).parent();
			var _fnRefresh = jQuery.proxy(this._refresh, this);

			this._setOverflow();

			// apply the previous scroll state
			this._scrollTo(this._scrollX, this._scrollY);

			this._refresh();

			if (!$Container.is(":visible")
				|| !!sap.ui.Device.browser.internet_explorer
				|| this._oPullDown
				|| this._fnScrollLoadCallback) {
				// element may be hidden and have height 0
				this._sResizeListenerId = sap.ui.core.ResizeHandler.register($Container[0], _fnRefresh);
			}

			// Set event listeners
			$Container.scroll(jQuery.proxy(this._onScroll, this));
			if(sap.ui.Device.support.touch){
				$Container
					.on("touchcancel touchend", jQuery.proxy(this._onEnd, this))
					.on("touchstart", jQuery.proxy(this._onStart, this))
					.on("touchmove", jQuery.proxy(this._onTouchMove, this));
			} else if(this._bMouseDrag){
				//TODO: allow mouse dragging scroll on desktop after the text selection issue is clarified
				$Container
					.on("mouseup mouseleave", jQuery.proxy(this._onEnd, this))
					.mousedown(jQuery.proxy(this._onMouseDown, this))
					.mousemove(jQuery.proxy(this._onMouseMove, this));
			}
		},

		_readActualScrollPosition: function() {
			// if container has a size, this method reads the current scroll position and stores it as desired position
			if (this._$Container.width() > 0) {
				this._scrollX = this._$Container.scrollLeft();
			}
			if (this._$Container.height() > 0) {
				this._scrollY = this._$Container.scrollTop();
			}
		},

		_scrollTo: function(x, y, time) {
			if (this._$Container.length > 0) {
				if (time > 0) {
					this._$Container.animate({ scrollTop: y, scrollLeft: x }, time, jQuery.proxy(this._readActualScrollPosition, this));
				} else {
					this._$Container.scrollTop(y);
					this._$Container.scrollLeft(x);
					this._readActualScrollPosition(); // if container is too large no scrolling is possible
				}
			}
		}
	};

	/*
	 * Init delegator prototype according to various conditions.
	 */
	function initDelegateMembers(oScrollerInstance, oConfig) {
		var oDelegateMembers;

		if (!$.support.touch && !$.sap.simulateMobileOnDesktop && !oConfig.nonTouchScrolling) {  //TODO: Maybe find some better criteria
			// nothing to do on desktop browsers when disabled
			return;
		}

		if(sap.ui.Device.support.touch || $.sap.simulateMobileOnDesktop){
			$.sap.require("jquery.sap.mobile");
		}

		oDelegateMembers = {
			_init : function(oControl, sScrollContentDom, oConfig) {

				function createZyngaScroller(contentId, horizontal, vertical){
					var oScroller = new window.Scroller(function(left, top, zoom){
							var $Container = $.sap.byId(contentId).parent();
							$Container.scrollLeft(left);
							$Container.scrollTop(top);
						}, {
							scrollingX: horizontal,
							scrollingY: vertical,
							bouncing: false
					});
					return oScroller;
				}

				function isNativeTouchScrollingSupported() {
					// No touchend or touchmove in android default browser by scrolling:
					// https://code.google.com/p/android/issues/detail?id=19827
					// Android Chrome fires arbitrary touchcancel events:
					// See https://code.google.com/p/chromium/issues/detail?id=260732
					if( sap.ui.Device.os.android ||
						sap.ui.Device.os.blackberry || // TODO: native scroll on BlackBerry
						sap.ui.Device.os.ios && sap.ui.Device.os.version < 6) {
						return false;
					}
					return true;
				}

				// What library to use?
				var sLib = "n";
				if(oConfig.zynga){
					sLib = "z";
				} else if(oConfig.iscroll || !isNativeTouchScrollingSupported()){
					sLib = "i"; // iScroll
				}

				// Initialization
				this._preventTouchMoveDefault = !!oConfig.preventDefault;
				this._scroller = null;
				switch (sLib) {
					case "z": // Zynga library
						$.sap.require("sap.ui.thirdparty.zyngascroll");
						$.extend(this, oZyngaDelegate);
						this._zynga = true;
						this._scroller = createZyngaScroller(this._sContentId, this._bHorizontal, this._bVertical);
						break;
					case "i": // iScroll library
						$.sap.require("sap.ui.thirdparty.iscroll");
						$.extend(this, oIScrollDelegate);
						this._bIScroll = true;
						break;
					default: // native scrolling;
						$.extend(this, oNativeScrollDelegate);
						if(oConfig.nonTouchScrolling === true){
							this._bMouseDrag = true; // optional mouse drag scrolling
						}
						if (sap.ui.getCore().getConfiguration().getRTL()) {
							this._scrollX = 9999; // in RTL case initially scroll to the very right
						}
						break;
				}
			},
			_exit : function() {
				if(this._cleanup){ this._cleanup(); }
				this._scroller = null;
			}
		};
		// Copy over members to prototype
		$.extend(oScrollerInstance, oDelegateMembers);
	}

}(jQuery));
