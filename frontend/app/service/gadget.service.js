
(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('gadgetService', gadgetService);

    function gadgetService() {

      function installGadget(context, gadget_url) {
        return context.getElement()
         .push(function(gadget_element) {
           var element = document.createElement('div');

            context.element = gadget_element;
            element.setAttribute('style', 'display: none');
            gadget_element.appendChild(element);

            return context.declareGadget(gadget_url,
              {
                scope: 'sub_app_installer',
                element: element,
                sandbox: 'iframe'
              });
          })
          .push(function(sub_gadget) {
            return window.RSVP.all([sub_gadget.setSubInstall(), sub_gadget.waitInstall()]);
          })
          .push(function() {
            // Ugly hack, url should be provided by installer
            var element = context.element.querySelector('div.iframe');

            return context.declareGadget(gadget_url + '1.1/',
              {
                scope: 'editor',
                element: element,
                sandbox: 'iframe'
              });
          });

          /*return context.getElement().then(function (gadget_element) {
            var element = document.createElement('div');

             context.element = gadget_element;
             element.setAttribute('style', 'display: none');
             gadget_element.appendChild(element);

             return context.declareGadget(gadget_url,
               {
                 scope: 'sub_app_installer',
                 element: element,
                 sandbox: 'iframe'
               });
          }).then(function(sub_gadget) {
            console.log(sub_gadget);
          });*/
      }

      return {
        installGadget: installGadget
      };
    }
})();
