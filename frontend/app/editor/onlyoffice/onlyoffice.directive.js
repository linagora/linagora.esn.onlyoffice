(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('onlyofficeEditor', onlyofficeEditor);

  function onlyofficeEditor() {
    let component = {
      retrict: 'E',
      scope: {
        fileExtension: '='
      },
      templateUrl: '/onlyoffice/app/editor/onlyoffice/onlyoffice.html',
      controller: 'OnlyOfficeEditorController'
    };

    return component;
  }
})();
