(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .factory('gadgetChooserService', gadgetChooserService)

    function gadgetChooserService () {
      return {
        gadgetChooser: gadgetChooser
      };

      function gadgetChooser (fileExt) {
        var gadgets = {
           docx: 'text-gadget',
           xlsx: 'spreadsheet-gadget',
           pptx: 'presentation-gadget'
        }

        switch (fileExt) {
          case 'docx':
            return gadgets.docx
            break;
          case 'xlsx':
            return gadgets.xlsx
            break;
          case 'pptx':
            return gadgets.pptx
            break;
          default:
            return false;
        }
      }
    }
})();
