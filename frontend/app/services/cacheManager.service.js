(function() {

  'use strict';

  angular.module('linagora.esn.onlyoffice')
  .factory('cacheManager', cacheManagerService);

  function cacheManagerService() {
    let cache = {};
    let service = {
      put: put,
      containsKey: containsKey,
      get: get,
      deleteFromCache: deleteFromCache,
      clear: clear
    };

    return service;


    function putInCache(key, value) {
      cache[key] = value;
    }

    function containsKey(key) {
      return typeof cache[key] != "undefined";
    }

    function get(key) {
      return cache[key];
    }

    function deleteFromCache(key) {
      delete cache[key];
    }

    function clear() {
      cache = {};
    }
  }

})();
