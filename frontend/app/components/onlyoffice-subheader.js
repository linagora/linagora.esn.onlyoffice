(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('onlyofficeViewSubheader', onlyofficeViewSubheader);

  function onlyofficeViewSubheader() {
    return {
      restrict: 'E',
      templateUrl: '/onlyoffice/app/components/onlyoffice-subheader.html'
    };
  }
})();
