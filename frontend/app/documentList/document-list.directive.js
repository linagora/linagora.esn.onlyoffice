(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('documentList', documentListComponent);

  function documentListComponent() {
    let component = {
      retrict: 'E',
      scope: {},
      templateUrl: '/onlyoffice/app/documentList/document-list.html',
      controller: 'documentListController'
    };

    return component;
  }
})();
