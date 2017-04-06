(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('EditorController', EditorController);

    function EditorController($stateParams, $scope) {
      $scope.isload = false;
      $scope.fileExtension = $stateParams.fileExt;
    }
})();
