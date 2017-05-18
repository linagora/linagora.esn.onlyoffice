(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('importModalController', importModalController);

    function importModalController($mdDialog, $scope, $http) {
      var importPossible = {
        docx: ['docx', 'odt', 'pdf'],
        xlsx: ['xlsx', 'ods', 'csv'],
        pptx: ['pptx', 'pdf'],
        odt: ['odt', 'docx', 'pdf'],
        ods: ['ods', 'xlsx', 'csv']
      };

      function importChooser(type) {
        switch (type) {
          case 'docx':
            return importPossible.docx;
          case 'xlsx':
            return importPossible.xlsx;
          case 'pptx':
            return importPossible.pptx;
          case 'odt':
            return importPossible.odt;
          case 'ods':
            return importPossible.ods;
        }
      }

      $scope.importType = importChooser($scope.type);

      $scope.import = function(sourceExt, destExt) {
        var url;
        var data = {};
        var filename = $scope.doc.filename.split('.')[0];

        if (sourceExt === destExt) {
          url = '/api/files/' + $scope.doc._id;
        } else {
          url = '/onlyoffice/api/files/' + $scope.doc._id;
          data.destination = destExt;
          filename = filename + '.' + destExt;
        }
        $http({
           url: url,
           method: 'GET',
           responseType: 'blob',
           params: data
        }).then(function(response) {
          var fileUrl = URL.createObjectURL(response.data);
          var link = document.createElement('a');

          link.href = fileUrl;
          link.download = filename;
          link.click();
        });
      };
    }
})();
