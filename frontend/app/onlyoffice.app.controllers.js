(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('OnlyOfficeIndexController', OnlyOfficeIndexController);

    function OnlyOfficeIndexController($scope, CONFIG) {
      $scope.preloaderUrl = CONFIG.PRELOADER_URL;
      $scope.convertExts = CONFIG.CONVERTED_DOCS.join(",");
      $scope.editedExts = CONFIG.EDITED_DOCS.join(",");
    }
})();
