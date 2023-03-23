"use strict";

modulum('CustomChromeBarWidget', ['ChromeBarWidget', 'WidgetFactory'],
  function(context, cls) {

    /*
     * @class CustomChromeBarWidget
     * @memberOf classes
     * @extends classes.ChromeBarWidget
     */
    cls.CustomChromeBarWidget = context.oo.Class(cls.ChromeBarWidget, function($super) {
      return /** @lends classes.ChromeBarWidget.prototype */ {
        __name: "CustomChromeBarWidget",
        _model: null,
        _contextMenu: null,
        _windowMenuElement: null,
        _unknownWindowName: "Screen",
        _appCount: 0,
        _appCountElement: null,
        _logoutHandler: null,

        /**
         * @inheritDoc
         */
        constructor: function(opts) {
          // Call super constructor first
          $super.constructor.call(this, opts);
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._model = new cls.ModelHelper(this);
          this._model.addCurrentWindowChangeListener(this._onCurrentWindowChanged.bind(this));

          this._windowMenuElement = this.getElement().querySelector(".CustomWindowMenu");
          this._appCountElement = this.getElement().querySelector(".CustomAppCount");

        },

        _adjustWindowMenuIcon: function() {
          if (this._windowMenuElement && this._appCountElement) {
             if (this._appCount > 1) {
               this._windowMenuElement.classList.remove("hidden");
               this._appCountElement.classList.remove("hidden");
               this._appCountElement.textContent = this._appCount;
             } else {
               this._windowMenuElement.classList.add("hidden");
               this._appCountElement.classList.add("hidden");
             }
          }
        },

        _onCurrentWindowChanged: function(windowNode) {
          this._registerTimeout(function() {
            let sess = null;
            let numOfApps = 0;
            if (this._model && this._model.getCurrentApplication()) {
              sess = this._model.getCurrentApplication().getSession();
              numOfApps = (sess) ? sess.getApplications().length : 0;
            }
            this._appCount = numOfApps;
            this._adjustWindowMenuIcon();
          }.bind(this), 50);
        },
   
        /**
         * @inheritDoc
         */
        manageMouseClick: function(domEvent) {
          const bubble = $super.manageMouseClick.call(this, domEvent);
          // Click on the burger to open left Sidebar
          if (domEvent.target.isElementOrChildOf(this._windowMenuElement)) {
            this._buildContextMenu(domEvent);
          }
          return bubble;
        },

        _fillContextMenu: function(contextMenu, opts) {
          const sess = this._model.getCurrentApplication().getSession();
          if (sess.getApplications().length > 1) {
            for (const app of sess.getApplications()) {
              let windowLabel = cls.WidgetFactory.createWidget("Label", opts);
              const node = app.getVMWindow();
              windowLabel.setValue(node.attribute("text") || app.getTitle() || this._unknownWindowName);
              windowLabel.addClass("gbc_WindowApp");
              contextMenu.addChildWidget(windowLabel, {
                clickCallback: function() {
                  //Trigger action
                  const currentApp = this._model.getCurrentApplication();
                  if (app != currentApp) {
                    const ui = app.getUI();
                    ui.syncCurrentWindow();
                  }
                }.bind(this)
              });
            }
          }
        },

        /**
         * Build context menu and show it
         */
        _buildContextMenu: function(domEvent) {

          if (this._contextMenu) {
            this._contextMenu.destroyChildren();
            this._contextMenu.destroy();
            this._contextMenu = null;
          }

          let opts = this.getBuildParameters();
          opts.inTable = false;
          opts.ignoreLayout = true;

          this._contextMenu = cls.WidgetFactory.createWidget("ContextMenu", opts);
          this._contextMenu.setParentWidget(this);
          this._contextMenu.setColor(this.getColor());
          this._contextMenu.setBackgroundColor(this.getBackgroundColor());
          this._contextMenu.onClose(function() {
            this.afterDomMutator(function() {
              if (this._contextMenu) {
                this._contextMenu.destroyChildren();
                this._contextMenu.destroy();
                this._contextMenu = null;
              }
            }.bind(this));
          }.bind(this), true);
          this._fillContextMenu(this._contextMenu, opts);

          // beware setFocus should not raise a scroll event (it will immediately close contextmenu)
          this._element.domFocus(null, this.getElement());

          this._contextMenu.parentElement = domEvent.target;
          this._contextMenu.show();

        },

        /**
         * @inheritDoc
         */
        destroy: function() { 

           //Cleanup event handler and objects
           this._appCount = 0;
           this._model = null;

           if (this._contextMenu) {
            this._contextMenu.destroyChildren();
            this._contextMenu.destroy();
            this._contextMenu = null;
           }
           this._logoutHandler = null;

           // Call the super destroy at the end to cleanup properly
           $super.destroy.call(this);
        }

      };
    });
    cls.WidgetFactory.registerBuilder('ChromeBar', cls.CustomChromeBarWidget);
  }
);

