(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('shareModalController', shareModalController);

    function shareModalController($mdDialog, $scope, _, OnlyOfficeRestangular) {
      $scope.newUsersGroups = [];

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.confirm = function() {
        $mdDialog.hide();
        var usersId = []
        OnlyOfficeRestangular.one('coauthor').one('files', $scope.fileId).customPOST($scope.newUsersGroups);
      };
    }
})();
