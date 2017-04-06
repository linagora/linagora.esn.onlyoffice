(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('IndexController', OnlyOfficeIndexController);

    function OnlyOfficeIndexController($scope, $state, fileUploadService, backgroundProcessorService) {
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
