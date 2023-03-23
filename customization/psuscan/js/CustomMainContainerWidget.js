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

modulum('CustomMainContainerWidget', ['MainContainerWidget', 'WidgetFactory'],
  function(context, cls) {

    /**
     * @class CustomMainContainerWidget
     * @memberOf classes
     * @extends classes.MainContainerWidget
     */
    cls.CustomMainContainerWidget = context.oo.Class(cls.MainContainerWidget, function($super) {
      return /** @lends classes.CustomMainContainerWidget.prototype */ {
        __name: "CustomMainContainerWidget",
        _headerWidget: null,
        _footerWidget: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);

          this._headerWidget = cls.WidgetFactory.createWidget('HeaderBar', this.getBuildParameters());
          this._headerWidget.setParentWidget(this);
          this.getElement().querySelector("header").appendChild(this._headerWidget.getElement());
        

          this._footerWidget = cls.WidgetFactory.createWidget("FooterBar", this.getBuildParameters());
          this._footerWidget.setParentWidget(this);
          this.getElement().querySelector("footer").appendChild(this._footerWidget.getElement());

        },

        destroy: function() { 

            //Cleanup class variables / handlers
            this._headerWidget = null;
            this._footerWidget = null;
 
            // Call the super destroy at the end to cleanup properly
            $super.destroy.call(this);
         }
      };
    });

    /*
     *  This is a sample widget that would replace the default one in GBC
     *  To activate it, please uncomment the line below. This will override
     *  the original widget registration to this one.
     */

    cls.WidgetFactory.registerBuilder('MainContainer', cls.CustomMainContainerWidget);
  });
