(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('shareModalController', shareModalController);

    function shareModalController($mdDialog, $scope, _, OnlyOfficeRestangular, notificationFactory) {
      $scope.newUsersGroups = [];

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.confirm = function() {
        $mdDialog.hide();
        OnlyOfficeRestangular.one('coauthor').one('files', $scope.fileId).customPOST($scope.newUsersGroups).then(function () {
          notificationFactory.weakSuccess('Success', 'Le document a été partagé avec Succès');
        });
      };
    }
})();
