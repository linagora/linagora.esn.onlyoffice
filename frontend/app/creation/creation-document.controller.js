(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('creationDocumentController', creationDocumentController);

    function creationDocumentController($scope, $state, $timeout, $mdDialog, OnlyOfficeRestangular, fileUploadService, backgroundProcessorService) {

      function mimeTypeFromExt(ext) {
        var mimeType = {
              'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            };

            switch (ext) {
              case 'docx':
                return mimeType.docx
                break;
              case 'xlsx':
                return mimeType.xlsx
                break;
              case 'pptx':
                return mimeType.pptx
                break;
              default:
                return false;
            }
      }

      $scope.isOpen = false;

      function newDocument(type, filename) {
        var typeFromExt = mimeTypeFromExt(type);

        if(!typeFromExt) {
          return false;
        }
        //TODO Go to the editor after the backend create the new file in gridfs
        OnlyOfficeRestangular.all('files').post({name: filename + '.' + type, mimetype: typeFromExt }).then(function(doc) {
          $state.go('editor', {'fileExt': type, 'fileId': doc.data._id});
        });
      }


      //Manage the fab button
      $scope.$watch('isOpen', function(isOpen) {
        if (isOpen) {
          $timeout(function() {
            $scope.tooltipVisible = self.isOpen;
          }, 600);
        } else {
          $scope.tooltipVisible = self.isOpen;
        }
      });


      $scope.showPrompt = function(ev, type) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt({
          controller: 'creationModalController',
          templateUrl: '/onlyoffice/app/creation/modal/creation-modal.html',
          targetEvent: ev,
          parent: angular.element(document.body),
          clickOutsideToClose:true
        })

        $mdDialog.show(confirm).then(function(result) {
          newDocument(type, result);
        });
      };

      $scope.$watch('file', function() {
        if($scope.file) {
          fileUpload($scope.file)
        }
      });

      function fileUpload(file) {
        var mimetype = file[0].type.split('/').pop();

        OnlyOfficeRestangular.one('import/file/' + file[0].name + '/' + mimetype)
          .withHttpConfig({transformRequest: angular.identity})
          .customPOST(file[0], '', undefined, {'Content-Type': file[0].type}).then(function (document) {
            goEditor(document.data);
          });
      };

      function goEditor(document) {
        var extension = document.filename.split(".").pop();
        var fileId = document._id;
        $state.go('editor', {'fileExt': extension, 'fileId': fileId});
      }

    }
})();
