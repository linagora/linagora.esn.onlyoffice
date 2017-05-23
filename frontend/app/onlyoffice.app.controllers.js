(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('OnlyOfficeIndexController', OnlyOfficeIndexController);

    function OnlyOfficeIndexController($scope, $window) {

      function isCompatible() {
        if (/chrome/i.test($window.navigator.userAgent)) {
          return true;
        }

        return false;
      }

      $scope.isCompatible = isCompatible();
    }
})();
