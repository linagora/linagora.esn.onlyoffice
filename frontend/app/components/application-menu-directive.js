(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('onlyOfficeApplicationMenu', onlyOfficeApplicationMenu);

  function onlyOfficeApplicationMenu(applicationMenuTemplateBuilder) {
    let directive = {
      retrict: 'E',
      replace: true,
      template: applicationMenuTemplateBuilder('/#/onlyoffice/index', 'mdi-file-document', 'OnlyOffice')
    };

    return directive;
  }
})();
