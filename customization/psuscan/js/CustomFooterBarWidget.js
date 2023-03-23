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

modulum('CustomFooterBarWidget', ['WidgetBase', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class CustomFooterBarWidget
     * @memberOf classes
     * @extends classes.WidgetBase
     */
    cls.CustomFooterBarWidget = context.oo.Class(cls.WidgetBase, function($super) {
      return /** @lends classes.CustomFooterBarWidget.prototype */ {
        __name: "CustomFooterBarWidget",
        _sessionHandler: null,
        _bdlHandler: null,
        _bdlElement: null,
        _osElement: null,
        _userElement: null,
        _gbcElement: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._sessionHandler = context.SessionService.onSessionAdded(this.sessionAdded.bind(this));
        },

        _initElement: function() {
            $super._initElement.call(this);
            this._bdlElement = this.getElement().querySelector(".CustomFooterBDL");
            this._osElement = this.getElement().querySelector(".CustomFooterOS");
            this._userElement = this.getElement().querySelector(".CustomFooterUser");
            this._gbcElement = this.getElement().querySelector(".CustomFooterGBC");
        },

        sessionAdded: function(event, sender, session) {
          this._bldHandler = session.when(context.constants.customEventNames.BDLContext,
            function(event, session, obj) {
              if (obj.generoVersion && this._bdlElement) {
                this._bdlElement.textContent = "BDL Version: " + obj.generoVersion;
              }
              if (obj.osBuild && this._osElement) {
                this._osElement.textContent = "BDL OS: " + obj.osBuild;
              }
              if (obj.username && this._userElement) {
                this._userElement.textContent = "Username: " + obj.username;
              }
              if (this._gbcElement) {
                this._gbcElement.textContent = "GBC Version: " + context.version;
              }
              
            }.bind(this)
          );
        },



        destroy: function() { 

            //Cleanup class variables / handlers
            this._sessionHandler = null;
            this._bdlHandler = null;
            this._bdlElement = null;
            this._osElement = null;
            this._gbcElement = null;
            this._userElement = null;
 
            // Call the super destroy at the end to cleanup properly
            $super.destroy.call(this);
         }

      };
    });
    cls.WidgetFactory.registerBuilder('FooterBar', cls.CustomFooterBarWidget);
    //cls.WidgetFactory.registerBuilder('CustomFooterBarWidget', cls.CustomFooterBarWidget);
  }
);
