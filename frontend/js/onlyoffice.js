/*globals window, document, RSVP, rJS, jIO, FormData,
          URI, location, XMLHttpRequest, console*/
/*jslint indent: 2, maxlen: 80*/
(function (window, document, RSVP, rJS,
           XMLHttpRequest, location, console) {
  "use strict";

  function download(context, evt) {
    return context.getDeclaredGadget('editor')
      .push(function (gadget) {
        return gadget.getContent();
      })
      .push(function (result) {
        var form_data = new FormData(evt.target);
        form_data.append("data", jIO.util.dataURItoBlob(result.text_content));
        return jIO.util.ajax({
          url: '/onlyoffice/api/convertion',
          type: 'POST',
          dataType: "blob",
          data: form_data
        });
      }, console.log)
      .push(function (result) {
        var a = document.createElement("a"),
          url = window.URL.createObjectURL(result.target.response);

        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = 'couscous.docx';
        a.click();
        return new RSVP.Queue()
          .push(function () {
            return RSVP.delay(10);
          })
          .push(function () {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          });
      });
  }

  function upload(context, evt) {
    var form_data = new FormData(evt.target);
    return new RSVP.Queue()
      .push(function () {
        return RSVP.all([
          jIO.util.ajax({
            url: '/onlyoffice/api/convertion',
            type: 'POST',
            dataType: "blob",
            data: form_data
          }),
          context.getDeclaredGadget('editor')
        ]);
      })
      .push(function (result_list) {
        result_list.push(jIO.util.readBlobAsDataURL(result_list[0].target.response));
        return RSVP.all(result_list);
      })
      .push(function (result_list) {
        return result_list[1].render({
          jio_key: 'nut',
          value: result_list[2].target.result
        });
      });
  }

  rJS(window)
    .allowPublicAcquisition('setFillStyle', function () {
      return {
        height: '100%',
        width: '100%'
      };
    })
    .declareJob('upload', function (evt) {
      return upload(this, evt);
    })
    .declareJob('download', function (evt) {
      return download(this, evt);
    })
    .onEvent('submit', function (evt) {
      if (evt.target.name === 'upload') {
        return this.upload(evt);
      } else if (evt.target.name === 'download') {
        return this.download(evt);
      } else {
        throw new Error('Unknown form');
      }
    });

    rJS.manualBootstrap();

}(window, document, RSVP, rJS,
  XMLHttpRequest, location, console));
