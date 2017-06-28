(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('onlyOfficeApplicationMenu', onlyOfficeApplicationMenu);

  function onlyOfficeApplicationMenu(applicationMenuTemplateBuilder) {
    var directive = {
      retrict: 'E',
      replace: true,
      template: applicationMenuTemplateBuilder('office.index', { url: '/onlyoffice/images/onlyoffice-icon.svg' }, 'Office')
    };

    return directive;
  }
})();
