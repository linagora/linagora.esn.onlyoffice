'use strict';

module.exports = function(dependencies, lib) {
  const logger = dependencies('logger');

  return {
    callbackUrl: callbackUrl
  };

  function callbackUrl(req, res) {
    var updateFile = function (response, body) {
        if (body.status == 2) {
            console.log(body);
        }

        response.write("{\"error\":0}");
        response.end();
    }

    var readbody = function (request, response) {
        var content = "";
        request.on("data", function (data) {
            content += data;
        });
        request.on("end", function () {
            var body = JSON.parse(content);
            updateFile(response, body);
        });
    }

    if (req.body.hasOwnProperty("status")) {
        updateFile(res, req.body);
    } else {
        readbody(req, res)
    }

  }

};
