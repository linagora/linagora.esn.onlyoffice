(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('onlyOfficeApplicationMenu', onlyOfficeApplicationMenu);

  function onlyOfficeApplicationMenu(applicationMenuTemplateBuilder) {
    var directive = {
      retrict: 'E',
      replace: true,
      template: applicationMenuTemplateBuilder('/#/onlyoffice/index', { url: '/onlyoffice/images/onlyoffice-icon.svg' }, 'OnlyOffice')
    };

    return directive;
  }
})();
