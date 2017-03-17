(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
  .config(function($stateProvider, routeResolver) {
    $stateProvider
      .state('onlyoffice', {
        url: '/onlyoffice/index',
        templateUrl: '/onlyoffice/app/index.html',
        controller: 'OnlyOfficeIndexController'
      })
  });
})();