(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .directive('documentDragDrop', documentDragDrop);

  function documentDragDrop() {
    let component = {
      retrict: 'E',
      templateUrl: '/onlyoffice/app/dragndrop/dragndrop.html',
      controller: 'documentDragDropController'
    };

    return component;
  }
})();
