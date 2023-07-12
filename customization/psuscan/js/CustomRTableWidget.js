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
        _operationHandler: null,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);

          //Add table operations event handler
          const session = context.SessionService.getCurrent();
          if (session) this._operationHandler = session.when(context.constants.customTableOperations.EventName, this._onTableOperation.bind(this));

        },
 
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

        _onTableOperation: function(event, session, tableOp) {
          //Frontcall Table Operation Handler
          if (tableOp.tableName && this._auiName && tableOp.tableName === this._auiName) {
              if (tableOp.operationName) {

                if (tableOp.operationName === context.constants.customTableOperations.ResetSort) {
                  //Trigger reset sort event
                  this.emit(context.constants.widgetEvents.tableHeaderSort, -1);

                } else if (tableOp.operationName === context.constants.customTableOperations.ResetSettings) {
                  //Trigger the reset default settings event
                  this.emit(context.constants.widgetEvents.tableResetToDefault);

                } else if (tableOp.operationName === context.constants.customTableOperations.AutoFitColumns) {
                  //Call autoFitAllColumns() method
                  this.autoFitAllColumns();

                } else if (tableOp.operationName === context.constants.customTableOperations.FitToViewColumns) {
                  //Call fitToViewAllColumns() method
                  this.fitToViewAllColumns();
                }

              }

          }
        },

        destroy: function() {
          //release reference to the table operation event handler
          this._operationHandler = null;
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.registerBuilder("RTable", cls.CustomRTableWidget);
    cls.WidgetFactory.registerBuilder("Table[tableType=responsive]", cls.CustomRTableWidget);
});