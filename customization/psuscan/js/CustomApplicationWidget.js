/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2023. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('CustomApplicationWidget', ['ApplicationWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Main container widget for an application
     * @class CustomApplicationWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc Widgets
     */
    cls.CustomApplicationWidget = context.oo.Class(cls.ApplicationWidget, function($super) {
      return /** @lends classes.CustomApplicationWidget.prototype */ {
        __name: "CustomApplicationWidget",
        _loadingElement: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          $super.constructor.call(this, opts);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._loadingElement = null;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._loadingElement = this.getElement().querySelector(".loading-bar");
          const animation = gbc.constants.activeAnimation;
          if (this._loadingElement) {

             // Remove the default CSS Class and add current style class
             this._loadingElement.classList.remove("default");
             this._loadingElement.classList.add(animation.style);

             //Create x number of div tags based on current animation object
             for (var x = 0;x < animation.divCount; x++) {
                let div = document.createElement("div");
                this._loadingElement.appendChild(div);
             }
          }
        }

      };
    });
    cls.WidgetFactory.registerBuilder('Application', cls.CustomApplicationWidget);
  });
