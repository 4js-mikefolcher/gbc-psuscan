"use strict";

modulum('CustomWindowWidget', ['WindowWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * Base class for widgets.
     * @class WindowWidget
     * @memberOf classes
     * @extends classes.WidgetGroupBase
     * @publicdoc
     */
    cls.CustomWindowWidget = context.oo.Class(cls.WindowWidget, function($super) {
      return /** @lends classes.CustomWindowWidget.prototype */ {
        __name: "WindowWidget",
        _topMenuCount: 0,
        _topMenuGroup: null,

        /**
         * @param {classes.TopMenuWidget} topMenu
         * @param order
         * @param topMenuContainer
         */
        addTopMenu: function(topMenu, order, topMenuContainer) {
            $super.addTopMenu.call(this, topMenu, order, topMenuContainer);

            //Append to top menu count
            this._topMenuCount += 1;

            //Build the top menu group and add it to the topmenu widget
            let group = this.getTopMenuGroup();
            group.setParentWidget(topMenu);
            topMenu.addChildWidget(group);

        },

        getTopMenuGroup: function() {
            if (this._topMenuGroup == null) {
               //Lazy load the topmenu group
               let opts = this.getBuildParameters();
               this._topMenuGroup = cls.WidgetFactory.createWidget("TopMenuGroup", opts);
               this._topMenuGroup.setText("Actions");
            }
            return this._topMenuGroup;
        },

        addTopMenuCommand: function(buttonWidget) {
            //Use a timeout since the button widget does not always have all the properties set to start out
            this._registerTimeout(function() {
               //If the button is hidden or disabled, remove the command
               if (buttonWidget.isHidden() || !buttonWidget.isEnabled()) {
                  this.removeTopMenuCommand(buttonWidget);
                  return;
               }
               
               //Command already exists, skip it
               if (this.commandExists(buttonWidget)) return; //Command already exists

               //Build the custom top menu command
               let opts = buttonWidget.getBuildParameters();
               let topMenuCommand = cls.WidgetFactory.createWidget("CustomTopMenuCommand", opts);
               topMenuCommand.setParentWidget(this.getTopMenuGroup());
               topMenuCommand.setText(buttonWidget.getText());
               topMenuCommand.setAuiName(buttonWidget._auiName);

               //Add it to the top menu group
               this.getTopMenuGroup().addChildWidget(topMenuCommand);

            }.bind(this), 50);
        },

        commandExists: function(buttonWidget) {
            //Check to see if the command already exists in the Actions TopMenu group
            const parent = this.getTopMenuGroup();
            const children = parent.getChildren();
            if (children) {
               for (let i = children.length - 1; i > -1; i--) {
                  let currentChildren = children[i];
                  if (buttonWidget && buttonWidget.getText() === currentChildren.getText()) {    
                     //Found an action topmenu command with the same text as the button                
                     return true;
                  }
               }
            }
            //Topmenu Command does not exist
            return false;
        },

        removeTopMenuCommand: function(buttonWidget) {
            //Remove the topmenu command
            const parent = this.getTopMenuGroup();
            const children = parent.getChildren();
            if (children) {
               for (let i = children.length - 1; i > -1; i--) {
                  let currentChildren = children[i];
                  if (buttonWidget && buttonWidget.getText() !== currentChildren.getText()) {     
                     //if the button text does not match the command text, DO NOT remove               
                     continue;
                  }
                  //Follow the remove steps (very important)
                  parent.removeChildWidget(currentChildren);
                  currentChildren.destroy();
                  currentChildren = null;
               }
            }
        },
      
        /**
         *
         * @private
         * @param topMenu
         */
        removeTopMenu: function(topMenu) {
            if (this._topMenuGroup != null) {
               topMenu.removeChildWidget(this._topMenuGroup);
               this._topMenuGroup.destroy();
               this._topMenuGroup = null;
            }
            $super.removeTopMenu.call(this, topMenu);
            this._topMenuCount -= 1;

        },

        addToButtonQueue: function(widget) {
            if (this._topMenuCount > 0) this.addTopMenuCommand(widget);
        },

        removeFromButtonQueue: function(widget) {
            if (this._topMenuCount > 0) this.removeTopMenuCommand(widget);
        },

        /**
         * @inheritDoc
         */
        destroy: function() {

            //Release objects from memory
            this._topMenuGroup = null;

            //Call parent class destroy
            $super.destroy.call(this);
        }

      };
   });
   cls.WidgetFactory.registerBuilder('Window', cls.CustomWindowWidget);
 });