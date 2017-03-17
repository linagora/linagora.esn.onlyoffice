(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('OnlyOfficeEditorController', OnlyOfficeEditorController);

    function OnlyOfficeEditorController($stateParams, $scope, $element, gadgetChooserService, jioService) {
      $scope.source_format = $stateParams.fileExt;
      $scope.destination_format = $stateParams.fileExt.replace(/x$/, 'y');
      $scope.gadget = gadgetChooserService.gadgetChooser($stateParams.fileExt);

      var file = '';

      window.rJS(window)
        .allowPublicAcquisition('setFillStyle', function () {
          return {
            height: '100%',
            width: '100%'
          };
        })
        .declareJob('upload', function (evt) {
          return jioService.upload(this, evt);
        })
        .declareJob('download', function (evt) {
          return jioService.download(this, evt);
        })
        .ready(function() {
          //TODO watch if a file is send and if no file create a empty document
          this.upload();
        })
        .onEvent('submit', function (evt) {
          console.log(evt);
          if (evt.target.name === 'upload') {
            return this.upload(evt);
          } else if (evt.target.name === 'download') {
            return this.download(evt);
          } else {
            throw new Error('Unknown form');
          }
        });

        window.rJS.manualBootstrap();

    }
})();
