(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('OnlyOfficeRestangular', OnlyOfficeRestangular);

    function OnlyOfficeRestangular(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('/onlyoffice/api');
        RestangularConfigurer.setFullResponse(true);
      });
    }
})();
