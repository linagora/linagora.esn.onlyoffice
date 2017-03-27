(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('OnlyOfficeEditorController', OnlyOfficeEditorController);

    function OnlyOfficeEditorController($stateParams, $scope, $element, gadgetChooserService, jioService) {
      $scope.source_format = $stateParams.fileExt;
      $scope.destination_format = $stateParams.fileExt.replace(/x$/, 'y');
      var gadget = gadgetChooserService.gadgetChooser($stateParams.fileExt);

      var file = '';

      window.rJS(window)
        .allowPublicAcquisition('setFillStyle', function () {
          return {
            height: '100%',
            width: '100%'
          };
        })
        .declareJob('startEditor', function (evt, fileId) {
          return jioService.upload(this, evt, gadget, fileId);
        })
        .declareJob('download', function (evt, fileId) {
          return jioService.download(this, evt, gadget, fileId);
        })
        .ready(function() {
          //TODO watch if a file is send and if no file create a empty document
          if($stateParams.fileId) {
            this.startEditor(null, $stateParams.fileId);
          } else {
            this.startEditor();
          }
        });

        window.rJS.manualBootstrap()

    }
})();
