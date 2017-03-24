(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('OnlyOfficeIndexController', OnlyOfficeIndexController);

    function OnlyOfficeIndexController($scope, $state, $modal, fileUploadService, backgroundProcessorService, OnlyOfficeRestangular) {

      //var myModal = $modal({scope: $scope, template: '/onlyoffice/app/modal/nameModal.html', show: false});
      /*OnlyOfficeRestangular.all('files').getList().then(function(docs) {
        console.log(docs);
      })

      $scope.showModal = function() {
        myModal.$promise.then(myModal.show);
      }*/

      $scope.onFileSelect = function(file) {
        // Get the uploaderService
        var uploadService = fileUploadService.get();

        // Add the file in the Queue and start the upload
        var taskOpenFile = uploadService.addFile(file[0], true);

        if (uploadService.isComplete()) {
          goEditor(taskOpenFile);
        } else {
          backgroundProcessorService.add(uploadService.await(goEditor));
        }
      };

      function goEditor(task) {
        var extension = task[0].file.name.split(".").pop();
        var fileid = task[0].response.data._id;
        $state.go('editor', {'fileExt': extension, 'fileId': fileid});
      }
    }
})();
