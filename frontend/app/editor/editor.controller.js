(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .controller('OnlyOfficeEditorController', OnlyOfficeEditorController);

    function OnlyOfficeEditorController($scope, $stateParams, $window) {
      $scope.type = $stateParams.fileExt;

      let config = {
        "document": {
            "width": "100%",
            "height": "100%",
            "fileType": "docx",
            "key": "Khirz6zTPdfd8"+ Date.now(),
            "title": "Example Document Title.docx",
            "url": "http://localhost:8080/onlyoffice/sample.docx",
            "permissions": {
                "download": true,
                "edit": true,
                "print": true,
                "review": true,
            },
        },
        "documentType": "text",
        "editorConfig": {
            "callbackUrl": "http://localhost:8080/onlyoffice/api/pad",
        },
      };

      let docEditor = new window.DocsAPI.DocEditor("iframeEditor", config);
    }
})();
