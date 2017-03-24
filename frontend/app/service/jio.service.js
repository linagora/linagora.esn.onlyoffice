
(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('jioService', jioService)

    function jioService () {
      return {
        download: download,
        upload: upload
      };

    function installGadget(context, gadget_url) {
      return context.getElement()
         .push(function(gadget_element) {
            context.element = gadget_element;
            var element = document.createElement("div");
            element.setAttribute("style", "display: none");
            gadget_element.appendChild(element);
            return context.declareGadget(gadget_url,
              {
                "scope": "sub_app_installer",
                "element": element,
                "sandbox": "iframe"
              });
          })
          .push(function (sub_gadget) {
            return RSVP.all([sub_gadget.setSubInstall(), sub_gadget.waitInstall()]);
          })
          .push(function () {
            // Ugly hack, url should be provided by installer
            var element = context.element.querySelector("div.iframe")
            return context.declareGadget(gadget_url + "1.1/",
              {
                "scope": "editor",
                "element": element,
                "sandbox": "iframe"
              });
          });
    }

      function download(context, evt, gadget_url) {
        return installGadget(context, gadget_url)
          .push(function () {
            context.getDeclaredGadget('editor')
           })
          .push(function (gadget) {
            return gadget.getContent();
          })
          .push(function (result) {
            var form_data = new FormData(evt.target || {});
            form_data.append("data", window.jIO.util.dataURItoBlob(result.text_content));
            return window.jIO.util.ajax({
              url: '/onlyoffice/api/files',
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

      function upload(context, evt, gadget_url, fileId) {
        var apiUrl = '/onlyoffice/api/files';
        if(fileId) {
          apiUrl += '/' + fileId
        }
        return new window.RSVP.Queue()
          .push(function () {
            var form_data;
            if(evt && evt.target) {
              form_data = new FormData(evt.target);
            } else {
              form_data = new FormData({})
            }
            return window.RSVP.all([
              window.jIO.util.ajax({
                url: apiUrl,
                type: 'POST',
                dataType: "blob",
                data: form_data
              }),
              installGadget(context, gadget_url)
            ]);
          })
          .push(function (result_list) {
            result_list.push(window.jIO.util.readBlobAsDataURL(result_list[0].target.response));
            result_list.push(context.getDeclaredGadget('editor'));
            return window.RSVP.all(result_list);
          })
          .push(function (result_list) {
            return result_list[3].render({
              jio_key: 'nut',
              value: result_list[2].target.result
            });
          });
      }
    }
})();
