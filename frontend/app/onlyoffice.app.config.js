(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .config(injectApplicationMenu)

    function injectApplicationMenu(dynamicDirectiveServiceProvider) {
      var onlyOfficeModule = new dynamicDirectiveServiceProvider.DynamicDirective(true, 'only-office-application-menu', {priority: 28});

      dynamicDirectiveServiceProvider.addInjection('esn-application-menu', onlyOfficeModule);
    }
})();
