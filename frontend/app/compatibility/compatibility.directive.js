(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('onlyofficeCompatibility', onlyOfficeCompatibility);

  function onlyOfficeCompatibility() {
    var component = {
      retrict: 'E',
      templateUrl: '/onlyoffice/app/compatibility/compatibility.html'
    };

    return component;
  }
})();
