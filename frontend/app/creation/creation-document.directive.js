(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('creationDocument', creationDocument);

  function creationDocument() {
    var component = {
      retrict: 'E',
      templateUrl: '/onlyoffice/app/creation/creation-document.html',
      controller: 'creationDocumentController'
    };

    return component;
  }
})();
