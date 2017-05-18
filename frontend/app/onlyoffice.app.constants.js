(function() {
  'use strict';

  angular.module('linagora.esn.onlyoffice')
    .constant('CONFIG', {
      MAX_FILE_SIZE: 5242880,
      STORAGE_HOLDER: 'app_data',
      VIEWED_DOCS: ['.ppt', '.pps', '.odp', '.pdf', '.djvu', '.fb2', '.epub', '.xps'],
      EDITED_DOCS: ['.docx', '.doc', '.odt', '.xlsx', '.xls', '.ods', '.csv', '.pptx', '.ppsx', '.rtf', '.txt', '.mht', '.html', '.htm'],
      CONVERTED_DOCS: ['.doc', '.odt', '.xls', '.ods', '.ppt', '.pps', '.odp', '.rtf', '.mht', '.html', '.htm', '.fb2', '.epub'],
      TENANT_ID: 'ContactUs',
      KEY: 'ContactUs',
      STORAGE_URL: 'https://doc.onlyoffice.com/FileUploader.ashx',
      CONVERTER_URL: 'https://doc.onlyoffice.com/ConvertService.ashx',
      TEMP_STORAGE_URL: 'https://doc.onlyoffice.com/ResourceService.ashx',
      PRELOADER_URL: 'https://doc.onlyoffice.com/OfficeWeb/apps/api/documents/cache-scripts.html?_dc=2014-12-19',
      HAVE_EXTERNAL_IP: false
    });
})();
