(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('gadgetChooserService', gadgetChooserService);

    function gadgetChooserService() {
      var extensionSuported = {
        text: ['docx', 'odt'],
        spreadsheet: ['xlsx', 'ods'],
        presentation: ['pptx', 'odp']
      };

      var gadgets = {
         docx: 'https://text.app.officejs.com/f0c3dfd6ab/ooffice_text_gadget/development/',
         xlsx: 'https://spreadsheet.app.officejs.com/7badc7e694/ooffice_spreadsheet_gadget/development/',
         pptx: 'https://presentation.app.officejs.com/e45e218460/ooffice_presentation_gadget/development/'
      };

      function gadgetChooser(fileExtension) {

        if (extensionSuported.text.includes(fileExtension)) {
          return gadgets.docx;
        }

        if (extensionSuported.spreadsheet.includes(fileExtension)) {
          return gadgets.xlsx;
        }

        if (extensionSuported.presentation.includes(fileExtension)) {
          return gadgets.pptx;
        }
      }

      return {
        gadgetChooser: gadgetChooser
      };
    }
})();
