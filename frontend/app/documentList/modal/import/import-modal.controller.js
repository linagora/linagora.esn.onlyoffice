(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('importModalController', importModalController);

    function importModalController($mdDialog, $scope) {
      var importPossible = {
        docx: ['docx', 'odt', 'pdf'],
        xlsx: ['xlsx', 'ods', 'csv'],
        pptx: ['pptx', 'pdf']
      };

      function importChooser(type) {
        switch (type) {
          case 'docx':
            return importPossible.docx;
            break;
          case 'xlsx':
            return importPossible.xlsx;
            break;
          case 'pptx':
            return importPossible.pptx;
            break;
        }
      }

      $scope.importType = importChooser($scope.type)

      $scope.import = function(sourceExt, destExt) {
        console.log(sourceExt, destExt);
      }
    }
})();
