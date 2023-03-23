"use strict";

modulum('FrontCallService.modules.JSONInfo', ['FrontCallService'],
/**
** @param {gbc} context
** @param {classes} cls
**/
function(context, cls) {
   context.FrontCallService.modules.JSONInfo = {
      BDLInfo: function (frontCallName, jsonString) {

         //Validate the frontCallName Parameter
         if (frontCallName === undefined) {
            this.parametersError();
            console.log("frontcallName is null");
            return;
         }
         //Validate the jsonString Parameter
         if (jsonString === undefined) {
            this.parametersError();
            console.log("jsonString is null");
            return;
         }
         try {
            //Parse jsonString
            var obj = JSON.parse(jsonString);
            //Trigger a session event
            const session = context.SessionService.getCurrent();
            session._registerTimeout(function() {
                this.emit(frontCallName, obj);
            }.bind(session), 100);
         } catch (ex) {
            //Error parsing the jsonString
            this.runtimeError("BDLInfo parameter is not a valid JSON string");
            console.log("Exception: " + ex.toString());
            console.log("jsonString: " + jsonString);
            return;
         }
         return [''];
      }
   };
});
