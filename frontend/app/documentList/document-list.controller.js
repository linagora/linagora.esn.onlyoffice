(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('documentListController', documentListController);

    function documentListController($scope, $mdDialog, session,  _, OnlyOfficeRestangular, moment, esnPaginationtionProviderBuilder) {
      $scope.userId = session.user._id;
      var options = {
        limit: 10
      };

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

      $scope.formatDate = function(date) {
        return moment(date).format('DD MMMM YYYY HH:mm');
      }

      $scope.showImport = function(type) {
        // Appending dialog to document.body to cover sidenav in docs app
        var newScope = $scope.$new();
        newScope.type = type;
        $mdDialog.show({
          controller: 'importModalController',
          templateUrl: '/onlyoffice/app/documentList/modal/import/import-modal.html',
          scope: newScope,
          parent: angular.element(document.body),
          clickOutsideToClose:true
        })
      };

      $scope.showShare = function(fileId) {
        // Appending dialog to document.body to cover sidenav in docs app
        var newScope = $scope.$new();
        newScope.fileId = fileId;
        $mdDialog.show({
          controller: 'shareModalController',
          templateUrl: '/onlyoffice/app/documentList/modal/share/share-modal.html',
          scope: newScope,
          parent: angular.element(document.body),
          clickOutsideToClose:true
        })
      };

      esnPaginationtionProviderBuilder($scope, 'documentList', list, options);
    }
})();
