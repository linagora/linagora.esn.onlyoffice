(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('documentListController', documentListController);

    function documentListController($scope, $mdDialog, session, _, OnlyOfficeRestangular, moment, esnPaginationtionProviderBuilder) {
      var options = {
        limit: 10
      };

      $scope.userId = session.user._id;

      function list(options) {
        return OnlyOfficeRestangular.all('files').getList(options);
      }

      $scope.getExtensionfromFileName = function(filename) {
        return filename.split('.').pop();
      };

      $scope.removeDocument = function(file) {
        OnlyOfficeRestangular.one('files', file._id).remove().then(function() {
          _.pull($scope.elements, file);
        });
      };

      $scope.showImport = function(type, document) {
        var newScope = $scope.$new();

        newScope.type = type;
        newScope.doc = document;
        $mdDialog.show({
          controller: 'importModalController',
          templateUrl: '/onlyoffice/app/documentList/modal/import/import-modal.html',
          scope: newScope,
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      };

      $scope.showShare = function(fileId) {
        var newScope = $scope.$new();

        newScope.fileId = fileId;
        $mdDialog.show({
          controller: 'shareModalController',
          templateUrl: '/onlyoffice/app/documentList/modal/share/share-modal.html',
          scope: newScope,
          parent: angular.element(document.body),
          clickOutsideToClose: true
        });
      };

      esnPaginationtionProviderBuilder($scope, 'documentList', list, options);
    }
})();
