(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('jioService', jioService)

    function jioService () {
      return {
        download: download,
        upload: upload
      };

      function download(context, evt) {
        return context.getDeclaredGadget('editor')
          .push(function (gadget) {
            return gadget.getContent();
          })
          .push(function (result) {
            var form_data = new FormData(evt.target);
            form_data.append("data", window.jIO.util.dataURItoBlob(result.text_content));
            return window.jIO.util.ajax({
              url: '/onlyoffice/api/convertion',
              type: 'POST',
              dataType: "blob",
              data: form_data
            });
          })
          .push(function (result) {
            var a = document.createElement("a"),
              url = window.URL.createObjectURL(result.target.response);

            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = 'couscous.docx';
            a.click();
            return new window.RSVP.Queue()
              .push(function () {
                return window.RSVP.delay(10);
              })
              .push(function () {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              });
        });
      }

      function upload(context, evt) {
        if(evt) {
          var form_data = new FormData(evt.target);
        } else {
          var form_data = new FormData();
        }
        return new window.RSVP.Queue()
          .push(function () {
            return window.RSVP.all([
              window.jIO.util.ajax({
                url: '/onlyoffice/api/convertion',
                type: 'POST',
                dataType: "blob",
                data: form_data
              }),
              context.getDeclaredGadget('editor')
            ]);
          })
          .push(function (result_list) {
            result_list.push(window.jIO.util.readBlobAsDataURL(result_list[0].target.response));
            return window.RSVP.all(result_list);
          })
          .push(function (result_list) {
            return result_list[1].render({
              jio_key: 'nut',
              value: result_list[2].target.result
            });
          });
      }
    }
})();
