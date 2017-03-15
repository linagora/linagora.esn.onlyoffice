(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('guidManager', guidManagerService);

    function guidManagerService() {
      let service = {
        newGuid: newGuid
      };

      return service;

      function s4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };

      function newGuid() {
          return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
      };
    }
})();
