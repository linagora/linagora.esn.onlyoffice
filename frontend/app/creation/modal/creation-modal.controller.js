(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('creationModalController', creationModalController);

    function creationModalController($scope, $mdDialog, OnlyOfficeRestangular) {
      $scope.filename = '';

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.confirm = function() {
        $mdDialog.hide($scope.filename);
      };
    }
})();
