"use strict";

modulum('CustomButtonWidget', ['ButtonWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Button widget.
     * @class CustomButtonWidget
     * @memberOf classes
     * @extends classes.TextWidgetBase
     * @publicdoc Widgets
     */
    cls.CustomButtonWidget = context.oo.Class(cls.ButtonWidget, function($super) {
      return /** @lends classes.CustomButtonWidget.prototype */ {
        __name: "ButtonWidget",

        /**
         * @inheritDoc
         */
        _initElement: function() {
            $super._initElement.call(this);
        },

        /**
         * Defines if the widget should be hidden or not
         * @param {boolean} hidden true if the widget is hidden, false otherwise
         * @publicdoc
         */
        setHidden: function(hidden) {
            $super.setHidden.call(this, hidden);
            if (!hidden) {
               this.addToButtonQueue();
            }
        },

        /**
         * Defines the enabled status of the widget
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         * @publicdoc
         */
        setEnabled: function(enabled) {
            $super.setEnabled.call(this, enabled);
            if (!this.isHidden()) {
               this.addToButtonQueue();
            }
        },

        addToButtonQueue: function(stateType, stateValue) {
            if (this._windowWidget && this._windowWidget instanceof cls.CustomWindowWidget) {
               this._windowWidget.addToButtonQueue(this);
            }
        },  

        /**
         * @inheritDoc
         */
        destroy: function() {
            if (this._windowWidget && this._windowWidget instanceof cls.CustomWindowWidget) {
               this._windowWidget.removeFromButtonQueue(this);
            }
            $super.destroy.call(this);
        }

      };
   });
   cls.WidgetFactory.registerBuilder('Action', cls.CustomButtonWidget);
   cls.WidgetFactory.registerBuilder('MenuAction', cls.CustomButtonWidget);
 });