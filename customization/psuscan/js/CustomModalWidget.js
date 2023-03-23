/// FOURJS_START_COPYRIGHT(D,2015) 
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2022. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('CustomModalWidget', ['ModalWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Custom Modal widget.
     * @class CustomModalWidget
     * @memberOf classes
     * @extends classes.ModalWidget
     */
    cls.CustomModalWidget = context.oo.Class(cls.ModalWidget, function($super) {
      return /** @lends classes.CustomModalWidget.prototype */ {
        __name: "ModalWidget",
        _initY: 8,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
        },

        /**
         * set first position
         * @private
         */
        _initMoved: function() {
          var containerRect = this.getElement().getBoundingClientRect(),
            dialogRect = this._dialogPane.getBoundingClientRect();
          var min = context.ThemeService.getValue("theme-margin-ratio") * 8,
            x = Math.max(min, this.isReversed() ? containerRect.right - dialogRect.right : (dialogRect.left - containerRect.left));
          this._setAsMoved(x, this._initY);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          $super.destroy.call(this);
        }

      };
    });
    cls.WidgetFactory.registerBuilder('Modal', cls.CustomModalWidget);
  });