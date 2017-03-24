(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('documentListController', documentListController);

    function documentListController($scope, _, OnlyOfficeRestangular) {

      $scope.getExtensionfromFileName = function(filename) {
        return filename.split('.').pop();
      };

      $scope.removeDocument = function(file) {
        OnlyOfficeRestangular.one('files', file._id).remove().then(function() {
          _.pull($scope.documents, file)
        });
      };

      OnlyOfficeRestangular.all('files').getList().then(function(docs) {
        $scope.documents = docs.data;
      });
    }
})();
