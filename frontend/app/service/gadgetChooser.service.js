(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('gadgetChooserService', gadgetChooserService)

    function gadgetChooserService () {
      return {
        gadgetChooser: gadgetChooser
      };

      function gadgetChooser(fileExtension) {

        var extensionSuported = {
          text: ['docx', 'odt'],
          spreadsheet: ['xlsx', 'ods'],
          presentation: ['pptx', 'odp']
        }

        var gadgets = {
           docx: 'https://text-gadget.app.officejs.com/',
           xlsx: 'https://spreadsheet-gadget.app.officejs.com/',
           pptx: 'https://presentation-gadget.app.officejs.com/'
        }

        if (extensionSuported.text.includes(fileExtension)) {
          return gadgets.docx;
        }

        if(extensionSuported.spreadsheet.includes(fileExtension)) {
          return gadgets.xlsx;
        }

        if(extensionSuported.presentation.includes(fileExtension)) {
          return gadgets.pptx
        }
      }
    }
})();
