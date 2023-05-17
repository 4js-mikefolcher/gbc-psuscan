"use strict";

modulum('CustomTopMenuCommandWidget', ['TopMenuCommandWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * CustomTopMenuCommand widget.
     * @class CustomTopMenuCommandWidget
     * @memberOf classes
     * @extends classes.TopMenuCommandWidget
     * @publicdoc Widgets
     */
    cls.CustomTopMenuCommandWidget = context.oo.Class(cls.TopMenuCommandWidget, function($super) {
      return /** @lends classes.TopMenuCommandWidget.prototype */ {
        __name: 'TopMenuCommandWidget',
      
        /**
         * @inheritDoc
         */
        constructor: function(opts) {
            $super.constructor.call(this, opts);
        },

         /**
         * @inheritDoc
         */
         manageMouseClick: function(domEvent) {
            //Call the parent class manageMouseClick function
            const retValue = $super.manageMouseClick.call(this, domEvent);

            //Trigger the action associated with the command (from _auiName)
            const app = context.SessionService.getCurrent().getCurrentApplication();
            const actions = app.getActionApplicationService() || null;
            const actionName = this._auiName;

            if (actions && actions.hasAction(actionName)) {
               //Make sure the action is active before triggering it
               actions.executeByName(actionName);
            }
            
            return retValue;
         },

        /**
         * @inheritDoc
         */
        destroy: function() {
            $super.destroy.call(this);
        }

      };
   });
   cls.WidgetFactory.registerBuilder('CustomTopMenuCommand', cls.CustomTopMenuCommandWidget);
 });