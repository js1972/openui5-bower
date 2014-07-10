/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2014 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides functionality related to eventing.
sap.ui.define(['jquery.sap.global', 'jquery.sap.keycodes'],
	function(jQuery/* , jQuerySap1 */) {
	"use strict";

	jQuery.sap._touchToMouseEvent = true;

	var onTouchStart,
		onTouchMove,
		onTouchEnd,
		onTouchCancel,
		onMouseEvent,
		aMouseEvents,
		bIsSimulatingTouchToMouseEvent = false;

	if (sap.ui.Device.browser.webkit && /Mobile/.test(navigator.userAgent) && sap.ui.Device.support.touch) {

		bIsSimulatingTouchToMouseEvent = true;

		var simulateTouchToMouseEvent = (function() {
			var document = window.document,
				bHandleEvent = false,
				oTarget = null,
				bIsMoved = false,
				iStartX,
				iStartY,
				i = 0;

			aMouseEvents = ["mousedown", "mouseover", "mouseup", "mouseout", "click"];

			/**
			 * Fires a synthetic mouse event for a given type and native touch event.
			 * @param {String} sType the type of the synthetic event to fire, e.g. "mousedown"
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			var fireMouseEvent = function(sType, oEvent) {

				if (!bHandleEvent) {
					return;
				}

				// we need mapping of the different event types to get the correct target
				var oMappedEvent = oEvent.type == "touchend" ? oEvent.changedTouches[0] : oEvent.touches[0]; 

				// create the synthetic event
				var newEvent = document.createEvent('MouseEvent');  // trying to create an actual TouchEvent will create an error
				newEvent.initMouseEvent(sType, true, true, window, oEvent.detail,
						oMappedEvent.screenX, oMappedEvent.screenY, oMappedEvent.clientX, oMappedEvent.clientY,
						oEvent.ctrlKey, oEvent.shiftKey, oEvent.altKey, oEvent.metaKey,
						oEvent.button, oEvent.relatedTarget);

				newEvent.isSynthetic = true;

				// Timeout needed. Do not interrupt the native event handling.
				window.setTimeout(function() {
						oTarget.dispatchEvent(newEvent);
				}, 0);
			};

			/**
			 * Checks if the target of the event is an input field.
			 * @param {jQuery.Event} oEvent the event object
			 * @return {Boolean} whether the target of the event is an input field.
			 */
			var isInputField = function(oEvent) {
				return oEvent.target.tagName.match(/input|textarea|select/i);
			};

			/**
			 * Mouse event handler. Prevents propagation for native events. 
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onMouseEvent = function(oEvent) {
				if (!oEvent.isSynthetic && !isInputField(oEvent)) {
					oEvent.stopPropagation();
					oEvent.preventDefault();
				}
			};

			/**
			 * Touch start event handler. Called whenever a finger is added to the surface. Fires mouse start event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchStart = function(oEvent) {
				var oTouches = oEvent.touches,
					oTouch;

				bHandleEvent = (oTouches.length == 1 && !isInputField(oEvent));

				bIsMoved = false;
				if (bHandleEvent) {
					oTouch = oTouches[0];

					// As we are only interested in the first touch target, we remember it
					oTarget = oTouch.target;
					if (oTarget.nodeType === 3) {

						// no text node
						oTarget = oTarget.parentNode;
					}

					// Remember the start position of the first touch to determine if a click was performed or not.
					iStartX = oTouch.clientX;
					iStartY = oTouch.clientY;
					fireMouseEvent("mousedown", oEvent);
				}
			};

			/**
			 * Touch move event handler. Fires mouse move event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchMove = function(oEvent) {
				var oTouch;

				if (bHandleEvent) {
					oTouch = oEvent.touches[0];

					// Check if the finger is moved. When the finger was moved, no "click" event is fired.
					if (Math.abs(oTouch.clientX - iStartX) > 10 || Math.abs(oTouch.clientY - iStartY) > 10) {
						bIsMoved = true;
					}

					if (bIsMoved) {

						// Fire "mousemove" event only when the finger was moved. This is to prevent unwanted movements. 
						fireMouseEvent("mousemove", oEvent);
					}
				}
			};

			/**
			 * Touch end event handler. Fires mouse up and click event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchEnd = function(oEvent) {
				fireMouseEvent("mouseup", oEvent);
				if (!bIsMoved) {
					fireMouseEvent("click", oEvent);
				}
			};

			/**
			 * Touch cancel event handler. Fires mouse up event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchCancel = function(oEvent) {
				fireMouseEvent("mouseup", oEvent);
			};

			// Bind mouse events
			for (; i < aMouseEvents.length; i++) {

				// Add click on capturing phase to prevent propagation if necessary
				document.addEventListener(aMouseEvents[i], onMouseEvent, true);
			}

			// Bind touch events
			document.addEventListener('touchstart', onTouchStart, true);
			document.addEventListener('touchmove', onTouchMove, true);
			document.addEventListener('touchend', onTouchEnd, true);
			document.addEventListener('touchcancel', onTouchCancel, true);
		}());
	}

	/**
	 * Disable touch to mouse handling
	 *
	 * @public
	 */
	jQuery.sap.disableTouchToMouseHandling = function() {
		var i = 0;

		if (!bIsSimulatingTouchToMouseEvent) {
			return;
		}

		// unbind touch events
		document.removeEventListener('touchstart', onTouchStart, true);
		document.removeEventListener('touchmove', onTouchMove, true);
		document.removeEventListener('touchend', onTouchEnd, true);
		document.removeEventListener('touchcancel', onTouchCancel, true);

		// unbind mouse events
		for (; i < aMouseEvents.length; i++) {
			document.removeEventListener(aMouseEvents[i], onMouseEvent, true);
		}
	};

	/**
	 * List of DOM events that a UIArea automatically takes care of.
	 *
	 * A control/element doesn't have to bind listeners for these events.
	 * It instead can implement an <code>on<i>event</i>(oEvent)</code> method
	 * for any of these events that it wants to be notified about.
	 *
	 * @public
	 */
	jQuery.sap.ControlEvents = [  // IMPORTANT: update the public documentation when extending this list
		"click",
		"dblclick",
		"focusin",
		"focusout",
		"keydown",
		"keypress",
		"keyup",
		"mousedown",
		"mouseout",
		"mouseover",
		"mouseup",
		"select",
		"selectstart",
		"dragstart",
		"dragenter",
		"dragover",
		"dragleave",
		"dragend",
		"drop",
		"paste",
		"cut"
	];

	// touch events natively supported
	if (sap.ui.Device.support.touch) {

		// Define additional native events to be added to the event list.
		// TODO: maybe add "gesturestart", "gesturechange", "gestureend" later?
		jQuery.sap.ControlEvents.push("touchstart", "touchend", "touchmove", "touchcancel");
	}

	/**
	 * Enumeration of all so called "pseudo events", a useful classification
	 * of standard browser events as implied by SAP product standards.
	 *
	 * Whenever a browser event is recognized as one or more pseudo events, then this
	 * classification is attached to the original {@link jQuery.Event} object and thereby
	 * delivered to any jQuery-style listeners registered for that browser event.
	 *
	 * Pure JavaScript listeners can evaluate the classification information using
	 * the {@link jQuery.Event#isPseudoType} method.
	 *
	 * Instead of using the procedure as described above, the SAPUI5 controls and elements
	 * should simply implement an <code>on<i>pseudo-event</i>(oEvent)</code> method. It will
	 * be invoked only when that specific pseudo event has been recognized. This simplifies event
	 * dispatching even further.
	 *
	 * @namespace
	 * @public
	 */
	jQuery.sap.PseudoEvents = { // IMPORTANT: update the public documentation when extending this list

		/* Pseudo keyboard events */

		/**
		 * Pseudo event for keyboard arrow down without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdown: {sName: "sapdown", aTypes: ["keydown"], fnCheck: function (oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow down with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdownmodifiers: {sName: "sapdownmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'show' event (F4, Alt + down-Arrow)
		 * @public
		 */
		sapshow: {sName: "sapshow", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.F4 && !hasModifierKeys(oEvent)) ||
				(oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/true, /*Shift*/false));
		}},

		/**
		 * Pseudo event for keyboard arrow up without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapup: {sName: "sapup", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow up with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapupmodifiers: {sName: "sapupmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'hide' event (Alt + up-Arrow)
		 * @public
		 */
		saphide: {sName: "saphide", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/true, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard arrow left without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapleft: {sName: "sapleft", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_LEFT && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow left with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapleftmodifiers: {sName: "sapleftmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_LEFT && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow right without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapright: {sName: "sapright", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_RIGHT && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow right with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saprightmodifiers: {sName: "saprightmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_RIGHT && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard Home/Pos1 with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saphome: {sName: "saphome", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard Home/Pos1 without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saphomemodifiers: {sName: "saphomemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for  pseudo top event
		 * @public
		 */
		saptop: {sName: "saptop", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && checkModifierKeys(oEvent, /*Ctrl*/true, /*Alt*/false, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard End without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapend: {sName: "sapend", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard End with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapendmodifiers: {sName: "sapendmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo bottom event
		 * @public
		 */
		sapbottom: {sName: "sapbottom", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && checkModifierKeys(oEvent, /*Ctrl*/true, /*Alt*/false, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard page up without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappageup: {sName: "sappageup", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_UP && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page up with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappageupmodifiers: {sName: "sappageupmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_UP && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page down without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappagedown: {sName: "sappagedown", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_DOWN && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page down with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappagedownmodifiers: {sName: "sappagedownmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_DOWN && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'select' event... space, enter, ... without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapselect: {sName: "sapselect", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.ENTER || oEvent.keyCode == jQuery.sap.KeyCodes.SPACE) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'select' event... space, enter, ... with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapselectmodifiers: {sName: "sapselectmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.ENTER || oEvent.keyCode == jQuery.sap.KeyCodes.SPACE) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard space without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapspace: {sName: "sapspace", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.SPACE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard space with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapspacemodifiers: {sName: "sapspacemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.SPACE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard enter without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapenter: {sName: "sapenter", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ENTER && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard enter with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapentermodifiers: {sName: "sapentermodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ENTER && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard backspace without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapbackspace: {sName: "sapbackspace", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.BACKSPACE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard backspace with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapbackspacemodifiers: {sName: "sapbackspacemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.BACKSPACE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard delete without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdelete: {sName: "sapdelete", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.DELETE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard delete with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdeletemodifiers: {sName: "sapdeletemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.DELETE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo expand event (keyboard numpad +) without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapexpand: {sName: "sapexpand", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_PLUS && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo expand event (keyboard numpad +) with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapexpandmodifiers: {sName: "sapexpandmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_PLUS && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad -) without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapcollapse: {sName: "sapcollapse", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_MINUS && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad -) with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapcollapsemodifiers: {sName: "sapcollapsemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_MINUS && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad *)
		 * @public
		 */
		sapcollapseall: {sName: "sapcollapseall", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_ASTERISK && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard escape
		 * @public
		 */
		sapescape: {sName: "sapescape", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ESCAPE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard tab (TAB + no modifier)
		 * @public
		 */
		saptabnext: {sName: "saptabnext", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.TAB && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard tab (TAB + shift modifier)
		 * @public
		 */
		saptabprevious: {sName: "saptabprevious", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.TAB && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		}},

		/**
		 * Pseudo event for pseudo skip forward (F6 + no modifier)
		 * @public
		 */
		sapskipforward: {sName: "sapskipforward", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.F6 && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo skip back (F6 + shift modifier)
		 * @public
		 */
		sapskipback: {sName: "sapskipback", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.F6 && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		}},

		//// contextmenu Shift-F10 hack
		//{sName: "sapcontextmenu", aTypes: ["keydown"], fnCheck: function(oEvent) {
		//	return oEvent.keyCode == jQuery.sap.KeyCodes.F10 && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		//}},

		/**
		 * Pseudo event for pseudo 'decrease' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdecrease: {sName: "sapdecrease", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'decrease' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdecreasemodifiers: {sName: "sapdecreasemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'increase' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapincrease: {sName: "sapincrease", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'increase' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapincreasemodifiers: {sName: "sapincreasemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'previous' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapprevious: {sName: "sapprevious", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'previous' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappreviousmodifiers: {sName: "sappreviousmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'next' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapnext: {sName: "sapnext", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'next' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapnextmodifiers: {sName: "sapnextmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && hasModifierKeys(oEvent);
		}},

		//// pseudo hotkey event
		//{sName: "saphotkey", aTypes: ["keydown"], fnCheck: function(oEvent) {
		//  return false;
		//}},
		/* TODO: hotkeys: all other events could be hotkeys
		if(UCF_KeyboardHelper.bIsValidHotkey(iKey, bCtrl, bAlt, bShift)) {

			if (iKey == jQuery.sap.KeyCodes.F1 && bNoModifiers) {
				//special handling for FF - in IE the help is handeled by onHelp
				if (UCF_System.sDevice == "ff1") {
					this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
				}
			}
			else if (bCtrlOnly && iKey == jQuery.sap.KeyCodes.C && document.selection) {
				//handle ctrl+c centrally if text is selected to allow to copy it instead of firing the hotkey
				var oTextRange = document.selection.createRange();
				if (!oTextRange || oTextRange.text.length <= 0) {
					this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
				}
			}
			else {
				this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
			}
		}
		*/

		/*
		 * Other pseudo events
		 * @public
		 */

		/**
		 * Pseudo event indicating delayed double click (e.g. for inline edit)
		 * @public
		 */
		sapdelayeddoubleclick: {sName: "sapdelayeddoubleclick", aTypes: ["click"], fnCheck: function(oEvent) {
			var element = jQuery(oEvent.target);
			var currentTimestamp = oEvent.timeStamp;
			var data = element.data("sapdelayeddoubleclick_lastClickTimestamp");
			var lastTimestamp = data || 0;
			element.data("sapdelayeddoubleclick_lastClickTimestamp", currentTimestamp);
			var diff = currentTimestamp - lastTimestamp;
			return (diff >= 300 && diff <= 1300);
		}}
	};

	/**
	 * Ordered array of the {@link jQuery.sap.PseudoEvents}.
	 *
	 * Order is significant as some check methods rely on the fact that they are tested before other methods.
	 * The array is processed during event analysis (when classifying browser events as pseudo events).
	 * @private
	 */
	var PSEUDO_EVENTS = ["sapdown", "sapdownmodifiers", "sapshow", "sapup", "sapupmodifiers", "saphide", "sapleft", "sapleftmodifiers", "sapright", "saprightmodifiers", "saphome", "saphomemodifiers", "saptop", "sapend", "sapendmodifiers", "sapbottom", "sappageup", "sappageupmodifiers", "sappagedown", "sappagedownmodifiers", "sapselect", "sapselectmodifiers", "sapspace", "sapspacemodifiers", "sapenter", "sapentermodifiers", "sapexpand", "sapbackspace", "sapbackspacemodifiers", "sapdelete", "sapdeletemodifiers", "sapexpandmodifiers", "sapcollapse", "sapcollapsemodifiers", "sapcollapseall", "sapescape", "saptabnext", "saptabprevious", "sapskipforward", "sapskipback", "sapprevious", "sappreviousmodifiers", "sapnext", "sapnextmodifiers", "sapdecrease", "sapdecreasemodifiers", "sapincrease", "sapincreasemodifiers", "sapdelayeddoubleclick"];

	//Add mobile touch events if touch is supported
	(function initTouchEventSupport() {
		jQuery.sap.touchEventMode = "SIM";

		var aAdditionalControlEvents = [];
		var aAdditionalPseudoEvents = [];

		if (sap.ui.Device.support.touch){ // touch events natively supported
			jQuery.sap.touchEventMode = "ON";

			// ensure that "oEvent.touches", ... works (and not only "oEvent.originalEvent.touches", ...)
			jQuery.event.props.push("touches", "targetTouches", "changedTouches");
		}

		/**
		 * This function adds the simulated event prefixed with string "sap" to jQuery.sap.ControlEvents.
		 * 
		 * When UIArea binds to the simulated event with prefix, it internally binds to the original events with the given handler and 
		 * also provides the additional configuration data in the follwing format:
		 * 
		 * {
		 * 	domRef: // the dom reference of the UIArea
		 * 	eventName: // the simulated event name
		 * 	sapEventName: // the simulated event name with sap prefix
		 * 	eventHandle: // the handler that should be registered to simulated event with sap prefix
		 * }
		 * 
		 * @param {string} sSimEventName The name of the simulated event
		 * @param {array} aOrigEvents The array of original events that should be simulated from
		 * @param {function} fnHandler The function which is bound to the original events
		 * 
		 * @private
		 */
		var createSimulatedEvent = function(sSimEventName, aOrigEvents, fnHandler) {
			var sHandlerKey = "__"+sSimEventName+"Handler";
			var sSapSimEventName = "sap"+sSimEventName;
			aAdditionalControlEvents.push(sSapSimEventName);
			aAdditionalPseudoEvents.push({sName: sSimEventName, aTypes: [sSapSimEventName], fnCheck: function (oEvent) { return true; }});

			jQuery.event.special[sSapSimEventName] = {
				// When binding to the simulated event with prefix is done through jQuery, this function is called and redirect the registration
				// to the original events. Doing in this way we can simulate the event from listening to the original events.
				add: function(oHandle) {
					var that = this,
						$this = jQuery(this),
						oAdditionalConfig = {
							domRef: that,
							eventName: sSimEventName,
							sapEventName: sSapSimEventName,
							eventHandle: oHandle
						};

					var fnHandlerWrapper = function(oEvent){
						fnHandler(oEvent, oAdditionalConfig);
					};

					$this.data(sHandlerKey + oHandle.guid, fnHandlerWrapper);
					for(var i=0; i<aOrigEvents.length; i++){
						$this.on(aOrigEvents[i], fnHandlerWrapper);
					}
				},

				// When unbinding to the simulated event with prefix is done through jQuery, this function is called and redirect the deregistration
				// to the original events.
				remove: function(oHandle) {
					var $this = jQuery(this);
					var fnHandler = $this.data(sHandlerKey + oHandle.guid);
					$this.removeData(sHandlerKey + oHandle.guid);
					for(var i=0; i<aOrigEvents.length; i++){
						jQuery.event.remove(this, aOrigEvents[i], fnHandler);
					}
				}
			};
		};

		/**
		 * This function simulates the corresponding touch event by listening to mouse event.
		 * 
		 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
		 * on control's prototype.
		 * 
		 * @param {jQuery.Event} oEvent The original event object
		 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
		 * @private
		 */
		var fnMouseToTouchHandler = function(oEvent, oConfig) {
			var $DomRef = jQuery(oConfig.domRef);
			// Suppress the delayed mouse events simulated on touch enabled device
			// the mark is done within jquery-mobile-custom.js
			if(oEvent.isMarked("delayedMouseEvent")){
				return;
			}

			// Checks if the mouseout event should be handled, the mouseout of the inner dom shouldn't be handled when the mouse cursor
			// is still inside the control's root dom node
			if(!(oEvent.type != "mouseout" || (oEvent.type === "mouseout" && jQuery.sap.checkMouseEnterOrLeave(oEvent, oConfig.domRef)))){
				var bSkip = true;
				var sControlId = $DomRef.data("__touchstart_control");
				if(sControlId){
					var oCtrlDom = jQuery.sap.domById(sControlId);
					if(oCtrlDom && jQuery.sap.checkMouseEnterOrLeave(oEvent, oCtrlDom)){
						bSkip = false;
					}
				}
				if(bSkip){
					return;
				}
			}

			var oNewEvent = jQuery.event.fix(oEvent.originalEvent || oEvent);
			oNewEvent.type = oConfig.sapEventName;

			//reset the _sapui_handledByUIArea flag
			if (oNewEvent.isMarked("firstUIArea")) {
				oNewEvent.setMark("handledByUIArea", false);
			}

			var aTouches = [{
				identifier: 1,
				pageX: oNewEvent.pageX,
				pageY: oNewEvent.pageY,
				clientX: oNewEvent.clientX,
				clientY: oNewEvent.clientY,
				screenX: oNewEvent.screenX,
				screenY: oNewEvent.screenY,
				target: oNewEvent.target,
				radiusX: 1,
				radiusY: 1,
				rotationAngle: 0
			}];

			switch (oConfig.eventName) {
				case "touchstart":
				case "touchmove":
					oNewEvent.touches = oNewEvent.changedTouches = oNewEvent.targetTouches = aTouches;
					break;

				case "touchend":
					oNewEvent.changedTouches = aTouches;
					oNewEvent.touches = oNewEvent.targetTouches = [];
					break;
				// no default
			}

			if(oConfig.eventName === "touchstart" || $DomRef.data("__touch_in_progress")){
				$DomRef.data("__touch_in_progress", "X");
				var oControl = jQuery.fn.control ? jQuery(oEvent.target).control(0) : null;
				if(oControl){
					$DomRef.data("__touchstart_control", oControl.getId());
				}

				// When saptouchend event is generated from mouseout event, it has to be marked for being correctly handled inside UIArea.
				// for example, when sap.m.Image control is used inside sap.m.Button control, the following situation can happen:
				// 	1. Mousedown on image.
				// 	2. Keep mousedown and move mouse out of image.
				// 	3. ontouchend function will be called on image control and bubbled up to button control
				// 	4. However, the ontouchend function shouldn't be called on button.
				//
				// With this parameter, UIArea can check if the touchend is generated from mouseout event and check if the target is still
				// inside the current target. Executing the corresponding logic only when the target is out of the current target.
				if(oEvent.type === "mouseout"){
					oNewEvent.setMarked("fromMouseout");
				}
				oConfig.eventHandle.handler.call(oConfig.domRef, oNewEvent);
				// here the fromMouseout flag is checked, terminate the touch progress only when touchend event is not marked with fromMouseout.
				if(oConfig.eventName === "touchend" && !oNewEvent.isMarked("fromMouseout")){
					$DomRef.removeData("__touch_in_progress");
					$DomRef.removeData("__touchstart_control");
				}
			}
		};
		createSimulatedEvent("touchstart", ["mousedown"], fnMouseToTouchHandler);
		createSimulatedEvent("touchend", ["mouseup", "mouseout"], fnMouseToTouchHandler);
		createSimulatedEvent("touchmove", ["mousemove"], fnMouseToTouchHandler);

		/**
		 * This methods decides when extra events are needed. Extra events are: tap, swipe and the new touch to mouse event simulation.
		 * 
		 * The old touch to mouse simulation is done in a way that a real mouse event is fired when there's a corresponding touch event. But this will mess up
		 * the mouse to touch event simulation and is not consistent with the mouse to touch event simulation. That's why when certain condition is met, the old
		 * touch to mouse event simluation will be replaced with the new touch to mouse event simulation.
		 * 
		 * The new one can't completely replace the old one because the desktop controls which bind to events using jQuery or browser API directly have to be change.
		 * Then the new one can replace the old one completely not under certain condition anymore.
		 * 
		 * @private
		 */
		function needsExtraEventSupport(){
			var oCfgData = window["sap-ui-config"] || {},
				sLibs = oCfgData.libs || "";

			// TODO: should be replaced by some function in jQuery.sap.global (e.g. jQuery.sap.config(sKey))
			function hasConfig(sKey) {
				return document.location.search.indexOf("sap-ui-"+sKey) > -1 || // URL 
					!!oCfgData[sKey.toLowerCase()]; // currently, properties of oCfgData are converted to lower case (DOM attributes)
			}

			return sap.ui.Device.support.touch || // tap, swipe, etc. events are needed when touch is supported
				hasConfig("xx-test-mobile") || // see sap.ui.core.Configuration -> M_SETTINGS
				// also simulate touch events when sap-ui-xx-fakeOS is set (independently of the value and the current browser)
				hasConfig("xx-fakeOS") || 
				// always simulate touch events when the mobile lib is involved (FIXME: hack for Kelley, this does currently not work with dynamic library loading)
				sLibs.match(/sap.m\b/);
		}

		// If extra event support is needed, jQuery mobile event plugin is loaded to support tap, swipe and scrollstart/stop events.
		// The old touch to mouse event simulation ((see line 25 in this file)) will be deregistered and the new one will be active.
		if(needsExtraEventSupport()){
			jQuery.sap.require("sap.ui.thirdparty.jquery-mobile-custom");

			if(sap.ui.Device.support.touch){
				var bFingerIsMoved = false,
					iMoveThreshold = jQuery.vmouse.moveDistanceThreshold,
					iStartX, iStartY,
					iOffsetX, iOffsetY;

				/**
				 * This function simulates the corresponding mouse event by listening to touch event.
				 * 
				 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
				 * on control's prototype.
				 * 
				 * @param {jQuery.Event} oEvent The original event object
				 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
				 */
				var fnTouchToMouseHandler = function(oEvent, oConfig) {
					var oTouch = oEvent.originalEvent.touches[0];
					if(oEvent.type === "touchstart"){
						bFingerIsMoved = false;
						iStartX = oTouch.pageX;
						iStartY = oTouch.pageY;
						iOffsetX = Math.round(oTouch.pageX - jQuery(oEvent.target).offset().left);
						iOffsetY = Math.round(oTouch.pageY - jQuery(oEvent.target).offset().top);
					} else if (oEvent.type === "touchmove") {
						bFingerIsMoved = bFingerIsMoved ||
									(Math.abs(oTouch.pageX - iStartX) > iMoveThreshold ||
											Math.abs(oTouch.pageY - iStartY) > iMoveThreshold) ;
					}

					var oNewEvent = jQuery.event.fix(oEvent.originalEvent || oEvent);
					oNewEvent.type = oConfig.sapEventName;
					//reset the _sapui_handledByUIArea flag
					if (oNewEvent.isMarked("firstUIArea")) {
						oNewEvent.setMark("handledByUIArea", false);
					}

					delete oNewEvent.touches;
					delete oNewEvent.changedTouches;
					delete oNewEvent.targetTouches;

					var oMappedEvent = (oConfig.eventName === "mouseup" ? oEvent.changedTouches[0] : oEvent.touches[0]);

					//TODO: add other properties that should be copied to the new event
					oNewEvent.screenX = oMappedEvent.screenX;
					oNewEvent.screenY = oMappedEvent.screenY;
					oNewEvent.clientX = oMappedEvent.clientX;
					oNewEvent.clientY = oMappedEvent.clientY;
					oNewEvent.ctrlKey = oMappedEvent.ctrlKey;
					oNewEvent.altKey = oMappedEvent.altKey;
					oNewEvent.shiftKey = oMappedEvent.shiftKey;

					oConfig.eventHandle.handler.call(oConfig.domRef, oNewEvent);

					// also call the onclick event handler when touchend event is received and the movement is within threshold
					if(oEvent.type === "touchend" && !bFingerIsMoved){
						oNewEvent.type = "click";
						oNewEvent.setMark("handledByUIArea", false);
						oNewEvent.offsetX = iOffsetX; // use offset from touchstart
						oNewEvent.offsetY = iOffsetY; // use offset from touchstart
						oConfig.eventHandle.handler.call(oConfig.domRef, oNewEvent);
					}
				};

				// Deregister the previous touch to mouse event simulation (see line 25 in this file)
				jQuery.sap.disableTouchToMouseHandling();
				jQuery.sap._touchToMouseEvent = false;

				createSimulatedEvent("mousedown", ["touchstart"], fnTouchToMouseHandler);
				createSimulatedEvent("mousemove", ["touchmove"], fnTouchToMouseHandler);
				createSimulatedEvent("mouseup", ["touchend", "touchcancel"], fnTouchToMouseHandler);
			}

			// Define additional jQuery Mobile events to be added to the event list
			// TODO taphold cannot be used (does not bubble / has no target property) -> Maybe provide own solution
			// IMPORTANT: update the public documentation when extending this list
			aAdditionalControlEvents.push("swipe", "tap", "swipeleft", "swiperight", "scrollstart", "scrollstop");

			//Define additional pseudo events to be added to the event list
			aAdditionalPseudoEvents.push({sName: "swipebegin", aTypes: ["swipeleft", "swiperight"], fnCheck: function (oEvent) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				return (bRtl && oEvent.type === "swiperight") || (!bRtl && oEvent.type === "swipeleft");
			}});
			aAdditionalPseudoEvents.push({sName: "swipeend", aTypes: ["swipeleft", "swiperight"], fnCheck: function (oEvent) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				return (!bRtl && oEvent.type === "swiperight") || (bRtl && oEvent.type === "swipeleft");
			}});
		}

		// Add all defined events to the event infrastructure
		//
		// jQuery has inversed the order of event registration when multiple events are passed into jQuery.on method from version 1.9.1.
		//
		// UIArea binds to both touchstart and saptouchstart event and saptouchstart internally also binds to touchstart event. Before
		// jQuery version 1.9.1, the touchstart event handler is called before the saptouchstart event handler and our flags (e.g. _sapui_handledByUIArea)
		// still work. However since the order of event registration is inversed from jQuery version 1.9.1, the saptouchstart event hanlder is called
		// before the touchstart one, our flags don't work anymore.
		//
		// Therefore jQuery version needs to be checked in order to decide the event order in jQuery.sap.ControlEvents.
		if(jQuery.sap.Version(jQuery.fn.jquery).compareTo("1.9.1") < 0){
			jQuery.sap.ControlEvents = jQuery.sap.ControlEvents.concat(aAdditionalControlEvents);
		}else{
			jQuery.sap.ControlEvents = aAdditionalControlEvents.concat(jQuery.sap.ControlEvents);
		}

		for(var i=0; i<aAdditionalPseudoEvents.length; i++){
			jQuery.sap.PseudoEvents[aAdditionalPseudoEvents[i].sName] = aAdditionalPseudoEvents[i];
			PSEUDO_EVENTS.push(aAdditionalPseudoEvents[i].sName);
		}
	}());

	/**
	 * Function for initialization of an Array containing all basic event types of the available pseudo events.
	 * @private
	 */
	function initPseudoEventBasicTypes(){
		var mEvents = jQuery.sap.PseudoEvents,
			aResult = [];

		for (var sName in mEvents) {
			if (mEvents[sName].aTypes) {
				for (var j = 0, js = mEvents[sName].aTypes.length; j < js; j++) {
					var sType = mEvents[sName].aTypes[j];
					if (jQuery.inArray(sType, aResult) == -1) {
						aResult.push(sType);
					}
				}
			}
		}

		return aResult;
	}

	/**
	 * Array containing all basic event types of the available pseudo events.
	 * @private
	 */
	var PSEUDO_EVENTS_BASIC_TYPES = initPseudoEventBasicTypes();

	/**
	 * Convenience method to check an event for a certain combination of modifier keys
	 *
	 * @private
	 */
	function checkModifierKeys(oEvent, bCtrlKey, bAltKey, bShiftKey) {
		return oEvent.shiftKey == bShiftKey && oEvent.altKey == bAltKey && getCtrlKey(oEvent) == bCtrlKey;
	}

	/**
	 * Convenience method to check an event for any modifier key
	 *
	 * @private
	 */
	function hasModifierKeys(oEvent) {
		return oEvent.shiftKey || oEvent.altKey || getCtrlKey(oEvent);
	}

	/**
	 * Convenience method for handling of Ctrl key, meta key etc.
	 *
	 * @private
	 */
	function getCtrlKey(oEvent) {
		return !!(oEvent.metaKey || oEvent.ctrlKey); // double negation doesn't have effect on boolean but ensures null and undefined are equivalent to false.
	}

	/**
	 * Returns an array of names (as strings) identifying {@link jQuery.sap.PseudoEvents} that are fulfilled by this very Event instance.
	 *
	 * @returns {String[]} Array of names identifying {@link jQuery.sap.PseudoEvents} that are fulfilled by this very Event instance.
	 * @public
	 */
	jQuery.Event.prototype.getPseudoTypes = function() {
		var aPseudoTypes = [];

		if (jQuery.inArray(this.type, PSEUDO_EVENTS_BASIC_TYPES) != -1) {
			var aPseudoEvents = PSEUDO_EVENTS;
			var ilength = aPseudoEvents.length;
			var oPseudo = null;

			for(var i=0; i<ilength; i++){
				oPseudo = jQuery.sap.PseudoEvents[aPseudoEvents[i]];
				if(oPseudo.aTypes
						&& jQuery.inArray(this.type, oPseudo.aTypes) > -1
						&& oPseudo.fnCheck
						&& oPseudo.fnCheck(this)){
					aPseudoTypes.push(oPseudo.sName);
				}
			}
		}

		this.getPseudoTypes = function(){return aPseudoTypes.slice();};

		return aPseudoTypes.slice();
	};

	/**
	 * Checks whether this instance of {@link jQuery.Event} is of the given <code>sType</code> pseudo type.
	 *
	 * @param {string} sType The name of the pseudo type this event should be checked for.
	 * @returns {boolean} <code>true</code> if this instance of jQuery.Event is of the given sType, <code>false</code> otherwise.
	 * @public
	 */
	jQuery.Event.prototype.isPseudoType = function(sType) {
		var aPseudoTypes = this.getPseudoTypes();

		if (sType) {
			return jQuery.inArray(sType, aPseudoTypes) > -1;
		} else {
			return aPseudoTypes.length > 0;
		}
	};


	/*
	 * store reference to original preventDefault method
	 */
	var _preventDefault = jQuery.Event.prototype.preventDefault;
	/*
	 * and introduce some keyCode fixing for IE...
	 * this e.g. suppresses the address-field drop down opening in case of sapshow (i.e. F4) in ComboBoxes
	 */
	jQuery.Event.prototype.preventDefault = function() {
		_preventDefault.apply(this, arguments);

		var e = this.originalEvent;

		if ( !e ) {
			return;
		}

		if ( e.keyCode != 0 ) {
			try { // Sometimes setting keycode results in "Access Denied"
				if(!sap.ui.Device.browser.firefox) {
					e.keyCode = 0;
				}
			} catch(ex) {}
		}

	};

	/**
	 * Binds all events for listening with the given callback function.
	 *
	 * @param {function} fnCallback Callback function
	 * @public
	 */
	jQuery.sap.bindAnyEvent = function bindAnyEvent(fnCallback) {
		if (fnCallback) {
			jQuery(document).bind(jQuery.sap.ControlEvents.join(" "), fnCallback);
		}
	};

	/**
	 * Unbinds all events for listening with the given callback function.
	 *
	 * @param {function} fnCallback Callback function
	 * @public
	 */
	jQuery.sap.unbindAnyEvent = function unbindAnyEvent(fnCallback) {
		if (fnCallback) {
			jQuery(document).unbind(jQuery.sap.ControlEvents.join(" "), fnCallback);
		}
	};

	/**
	 * Checks a given mouseover or mouseout event whether it is
	 * equivalent to a mouseenter or mousleave event regarding the given DOM reference.
	 *
	 * @param {jQuery.Event} oEvent
	 * @param {element} oDomRef
	 * @public
	 */
	jQuery.sap.checkMouseEnterOrLeave = function checkMouseEnterOrLeave(oEvent, oDomRef) {
		if(oEvent.type != "mouseover" && oEvent.type != "mouseout") {
			return false;
		}

		var isMouseEnterLeave = false;
		var element = oDomRef;
		var parent = oEvent.relatedTarget;

		try {
			while ( parent && parent !== element ) {
				parent = parent.parentNode;
			}

			if ( parent !== element ) {
				isMouseEnterLeave = true;
			}
		} catch(e) { }

		return isMouseEnterLeave;
	};

	/**
	 * Constructor for a jQuery.Event object.<br/>
	 * @see "http://www.jquery.com" and "http://api.jquery.com/category/events/event-object/".
	 *
	 * @class Check the jQuery.Event class documentation available under "http://www.jquery.com"<br/>
	 * and "http://api.jquery.com/category/events/event-object/" for details.
	 *
	 * @name jQuery.Event
	 * @public
	 */

	/**
	 * Returns OffsetX of Event. In jQuery there is a bug. In IE the value is in offsetX, in FF in layerX
	 *
	 * @returns offsetX
	 * @public
	 */
	jQuery.Event.prototype.getOffsetX = function() {

		if (this.type == 'click'){
			if (this.offsetX){
				return this.offsetX;
			}
			if (this.layerX){
				return this.layerX;
			}
			if (this.originalEvent.layerX){
				return this.originalEvent.layerX;
			}
		}
		// nothing defined -> offset = 0
		return 0;
	};

	/**
	 * Returns OffsetY of Event. In jQuery there is a bug. in IE the value is in offsetY, in FF in layerY.
	 *
	 * @returns offsetY
	 * @public
	 */
	jQuery.Event.prototype.getOffsetY = function() {

		if (this.type == 'click'){
			if (this.offsetY){
				return this.offsetY;
			}
			if (this.layerY){
				return this.layerY;
			}
			if (this.originalEvent.layerY){
				return this.originalEvent.layerY;
			}
		}
		// nothing defined -> offset = 0
		return 0;
	};

	// we still call the original stopImmediatePropagation
	var fnStopImmediatePropagation = jQuery.Event.prototype.stopImmediatePropagation;
	
	/**
	 * PRIVATE EXTENSION: allows to immediately stop the propagation of events in
	 * the event handler execution - means that "before" delegates can stop the
	 * propagation of the event to other delegates or the element and so on.
	 *
	 * @see sap.ui.core.Element.prototype._callEventHandles
	 * @param {boolean} bStopDelegate
	 */
	jQuery.Event.prototype.stopImmediatePropagation = function(bStopHandlers) {

		// execute the original function
		fnStopImmediatePropagation.apply(this, arguments);

		// only set the stop handlers flag if it is wished...
		if (bStopHandlers) {
			this._bIsStopHandlers = true;
		}
	};

	/**
	 * PRIVATE EXTENSION: check if the handler propagation has been stopped.
	 *
	 * @see sap.ui.core.Element.prototype._callEventHandles
	 */
	jQuery.Event.prototype.isImmediateHandlerPropagationStopped = function() {
		return !!this._bIsStopHandlers;
	};

	/**
	 * Mark the event object for components that needs to know if the event was handled by a child component.
	 * PRIVATE EXTENSION
	 *
	 * @param {string} [sKey="handledByControl"]
	 * @param {string} [vValue=true]
	 */
	jQuery.Event.prototype.setMark = function(sKey, vValue) {
		sKey = sKey || "handledByControl";
		vValue = arguments.length < 2 ? true : vValue;
		(this.originalEvent || this)["_sapui_" + sKey] = vValue;
	};

	/**
	 * Mark the event object for components that needs to know if the event was handled by a child component.
	 * PRIVATE EXTENSION
	 *
	 * @see jQuery.Event.prototype.setMark
	 * @param {string} [sKey="handledByControl"]
	 */
	jQuery.Event.prototype.setMarked = jQuery.Event.prototype.setMark;

	/**
	 * Check whether the event object is marked by the child component or not.
	 * PRIVATE EXTENSION
	 *
	 * @param {string} [sKey="handledByControl"]
	 * @returns {boolean}
	 */
	jQuery.Event.prototype.isMarked = function(sKey) {
		sKey = sKey || "handledByControl";
		return !!(this.originalEvent || this)["_sapui_" + sKey];
	};

	return jQuery;

}, /* bExport= */ false);
