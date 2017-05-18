(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
  .config(function($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/onlyoffice/index',
        templateUrl: '/onlyoffice/app/index.html',
        controller: 'IndexController'
      })
      .state('editor', {
        url: '/onlyoffice/editor/:fileExt/:fileId',
        templateUrl: '/onlyoffice/app/editor/editor.html',
        controller: 'EditorController'
      });
  });
})();
