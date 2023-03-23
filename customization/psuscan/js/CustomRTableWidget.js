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
 
modulum('CustomRTableWidget', ['RTableWidget', 'WidgetFactory'],
  function(context, cls) {
 
    /**
     * Responsive table widget.
     * @class BFSRTableWidget
     * @memberOf classes
     * @extends classes.RTableWidget
     * @publicdoc
     */
    cls.CustomRTableWidget = context.oo.Class(cls.RTableWidget, function($super) {
      return /** @lends classes.CustomRTableWidget.prototype */ {
 
        __name: "RTableWidget",
 
        fillContextMenu: function(contextMenu, opts) {
          //First, call super fillContextMenu
          $super.fillContextMenu.call(this, contextMenu, opts);
 
          let app = context.SessionService.getCurrent().getCurrentApplication();
          if (!app) return;
 
          let actionService = app.getActionApplicationService();
          if (!actionService) return;

          let actionCount = 0;
          for (const key in context.constants.tableActions) {

            const actionObj = context.constants.tableActions[key];
            if (actionObj && actionObj.actionName && actionService.hasAction(actionObj.actionName)) {

                if (actionCount === 0) {
                    //For the first action we all, first create a separator
                    contextMenu.addSeparator();
                }

                // Add action label
                let actionLabel = cls.WidgetFactory.createWidget("Label", opts);
                actionLabel.setValue(actionObj.actionText || actionObj.actionName);
                actionLabel.addClass("gbc_CustomTableAction");
                contextMenu.addChildWidget(actionLabel, {
                    clickCallback: function() {
                        //Trigger action
                        if (actionService.hasAction(actionObj.actionName)) {
                          actionService.executeByName(actionObj.actionName);
                        }
                    }.bind(this)
                });
                actionCount++;
            }

          }
 
        },
        destroy: function() {
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.registerBuilder("RTable", cls.CustomRTableWidget);
    cls.WidgetFactory.registerBuilder("Table[tableType=responsive]", cls.CustomRTableWidget);
});