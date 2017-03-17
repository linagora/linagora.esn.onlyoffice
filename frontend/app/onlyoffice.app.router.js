(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
  .config(function($stateProvider, routeResolver) {
    $stateProvider
      .state('index', {
        url: '/onlyoffice/index',
        templateUrl: '/onlyoffice/app/index.html'
      })
      .state('editor', {
        url: '/onlyoffice/editor/:fileExt',
        templateUrl: '/onlyoffice/app/editor.html',
        controller: 'OnlyOfficeEditorController'
      })
  });
})();
