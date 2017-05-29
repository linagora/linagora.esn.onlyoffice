(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
  .config(function($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/office/index',
        templateUrl: '/onlyoffice/app/index.html',
        controller: 'OnlyOfficeIndexController'
      })
      .state('editor', {
        url: '/office/editor/:fileExt/:fileId',
        templateUrl: '/onlyoffice/app/editor/editor.html',
        controller: 'EditorController'
      });
  });
})();
