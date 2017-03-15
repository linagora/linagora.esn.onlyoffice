(function() {

  'use strict';

  angular.module('linagora.esn.onlyoffice')
  .factory('fileUtility', fileUtilityService);

  function fileUtilityService(CONFIG) {
    let service = {
      getFileName: getFileName,
      getFileExtension: getFileExtension,
      getFileType: getFileType,
      getUrlParams: getUrlParams
    };
    return service;

    let documentExts = [".docx", ".doc", ".odt", ".rtf", ".txt",".html", ".htm", ".mht", ".pdf", ".djvu",".fb2", ".epub", ".xps"];
    let spreadsheetExts = [".xls", ".xlsx", ".ods", ".csv"];
    let presentationExts = [".ppt", ".pptx", ".odp"];
    let fileType = {
        text: "text",
        spreadsheet: "spreadsheet",
        presentation: "presentation"
    };

    function getFileName(url, withoutExtension) {
        if (!url) return null;

        var filename;

        if (CONFIG.STORAGE_URL && url.indexOf(CONFIG.STORAGE_URL) == 0) {
            var params = getUrlParams(url);
            filename = params == null ? null : params["filename"];
        } else {
            var parts = url.toLowerCase().split("/");
            fileName = parts.pop();
        }

        if (withoutExtension) {
            var ext = getFileExtension(fileName);
            return fileName.replace(ext, "");
        }

        return fileName;
    };

    function getFileExtension(url, withoutDot) {
        if (!url) return null;

        var fileName = getFileName(url);

        var parts = fileName.toLowerCase().split(".");

        return withoutDot ? parts.pop() : "." + parts.pop();
    };

    function getFileType(url) {
        var ext = getFileExtension(url);

        if (documentExts.indexOf(ext) != -1) return fileType.text;
        if (spreadsheetExts.indexOf(ext) != -1) return fileType.spreadsheet;
        if (presentationExts.indexOf(ext) != -1) return fileType.presentation;

        return fileType.text;
    }

    function getUrlParams(url) {
        try {
            var query = url.split("?").pop();
            var params = query.split("&");
            var map = {};
            for (var i = 0; i < params.length; i++)
            {
                var parts = param.split("=");
                map[parts[0]] = parts[1];
            }
            return map;
        }
        catch (ex)
        {
            return null;
        }
    }

  }

})();
