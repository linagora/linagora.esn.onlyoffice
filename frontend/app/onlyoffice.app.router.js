(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
  .config(function($stateProvider) {
    $stateProvider
      .state('office.index', {
        url: '/office/index',
        templateUrl: '/onlyoffice/app/index.html'
      })
      .state('editor', {
        url: '/office/editor/:fileExt/:fileId',
        templateUrl: '/onlyoffice/app/editor/editor.html',
        controller: 'EditorController'
      });
  });
})();
