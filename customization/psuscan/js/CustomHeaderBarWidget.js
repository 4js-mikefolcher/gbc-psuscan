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

modulum('CustomHeaderBarWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class CustomHeaderBarWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.CustomHeaderBarWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.CustomHeaderBarWidget.prototype */ {
        __name: "CustomHeaderBarWidget",
        /** @type {classes.ModelHelper} */
        _model: null,
        _sessionHandler: null,
        _logoutElement: null,
        _titleElement: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._model = new cls.ModelHelper(this);
          this._sessionHandler = context.SessionService.onSessionAdded(this.sessionAdded.bind(this));
          this._model.addCloseApplicationListener(this.onCloseApplication.bind(this));
          this._model.addCurrentWindowChangeListener(this.onCurrentWindowChanged.bind(this));
        },

        _initElement: function() {
            $super._initElement.call(this);
            this._logoutElement = this.getElement().querySelector(".CustomHeaderLogout");
            this._titleElement = this.getElement().querySelector(".CustomHeaderMiddle");
        },

        sessionAdded: function(event, sender, session) {
          this._logoutElement.on("click.CustomHeaderBarWidget", this.onLogout.bind(this));
        },

        onCloseApplication: function(application) {
          if (application.getSession().getApplications().length == 0) {
            this._logoutElement.classList.add("hidden");
            this._titleElement.textContent = "";
          }
        },

        onCurrentWindowChanged: function(windowNode) {
          if (windowNode && windowNode.isModal()) return; //Don't change the header title if it's a modal window
          if (windowNode) {
            this._titleElement.textContent = windowNode.attribute('text') || windowNode.getApplication().getTitle();
          } else {
            this._titleElement.textContent = "";
          }
        },

        onLogout: function() {
          const sess = this._model.getCurrentApplication().getSession();

          //Need to ensure the fglrun processes end properly
          while (sess._applications.length) {
              sess._applications[0].close();
              sess._applications[0].stop();
          }

        },

        destroy: function() { 

            //Cleanup class variables / handlers
            this._logoutElement.off("click.CustomHeaderBarWidget");
            this._sessionHandler = null;
            this._model = null;
            this._logoutElement = null;
            this._titleElement = null;
 
            // Call the super destroy at the end to cleanup properly
            $super.destroy.call(this);
         }

      };
    });
    cls.WidgetFactory.registerBuilder('HeaderBar', cls.CustomHeaderBarWidget);
    //cls.WidgetFactory.registerBuilder('CustomHeaderBarWidget', cls.CustomHeaderBarWidget);
  }
);
