(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('OnlyOfficeEditorController', OnlyOfficeEditorController);

    function OnlyOfficeEditorController($stateParams, $scope, $element, gadgetChooserService, gadgetService) {
      var gadget = gadgetChooserService.gadgetChooser($scope.fileExtension);

      function save(context, fileId, sourceExt) {
        return context.getDeclaredGadget('editor')
          .push(function(gadget) {
            return gadget.getContent();
          })
          .push(function(result) {
            var blobDocument = window.jIO.util.dataURItoBlob(result.text_content);

            window.jIO.util.ajax({
              url: '/onlyoffice/api/save/files/' + fileId + '/' + sourceExt,
              type: 'POST',
              dataType: 'blob',
              data: blobDocument
            });
          });
      }

      function startEditor(context, gadget_url, fileId, sourceExt) {
        var url = '/onlyoffice/api/files/' + fileId;

        window.setInterval(function() {
          save(context, fileId, sourceExt);
        }, 10000);

        return new window.RSVP.Queue()
          .push(function() {
            return window.RSVP.all([
              window.jIO.util.ajax({
                url: url,
                type: 'GET',
                dataType: 'blob'
              }),
              gadgetService.installGadget(context, gadget_url)
            ]);
          })
          .push(function(result_list) {
            result_list.push(window.jIO.util.readBlobAsDataURL(result_list[0].target.response));
            result_list.push(context.getDeclaredGadget('editor'));

            return window.RSVP.all(result_list);
          })
          .push(function(result_list) {
            return result_list[3].render({
              jio_key: 'nut',
              value: result_list[2].target.result,
              portal_type: gadgetService.getGadgetPortalTypeFromFileExtension(sourceExt)
            });
          })
          .push(function() {
            $scope.$parent.isload = true;
            $scope.$parent.$digest();
          });
      }

      window.rJS(window)
        .allowPublicAcquisition('setFillStyle', function() {
          return {
            height: '100%',
            width: '100%'
          };
        })
        .declareJob('startEditor', function(fileId, sourceExt) {
          return startEditor(this, gadget, fileId, sourceExt);
        })
        .ready(function() {
          if ($stateParams.fileId) {
            this.startEditor($stateParams.fileId, $stateParams.fileExt);
          } else {
            this.startEditor();
          }
        });

        window.rJS.manualBootstrap();

    }
})();
