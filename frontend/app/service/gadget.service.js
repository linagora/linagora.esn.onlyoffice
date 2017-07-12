
(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('gadgetService', gadgetService);

    function gadgetService() {

      function installGadget(context, gadget_url) {
        return context.getElement()
          .push(function() {
            // Ugly hack, url should be provided by installer
            var element = context.element.querySelector('div.iframe');

            return context.declareGadget(gadget_url,
              {
                scope: 'editor',
                element: element,
                sandbox: 'iframe'
              });
          });
      }

      return {
        installGadget: installGadget
      };
    }
})();
