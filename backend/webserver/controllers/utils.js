'use strict';

module.exports = function(dependencies, lib) {
  const logger = dependencies('logger');
  const filestore = dependencies('filestore');

  var destinationExtensionExport = {
    'docx': 'docy',
    'xlsx': 'xlsy',
    'pptx': 'ppty',
    'odt': 'docx',
    'ods': 'xlsx',
    'odp': 'pptx',
    'docy': false,
    'xlsy': false,
    'ppty': false
  };

  var MimeDocumentApplication = [
    'application/pdf',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  return {
    fileIsEditorDocument: fileIsEditorDocument,
    destinationFromSourceExt: destinationFromSourceExt
  };

  function fileIsEditorDocument(contentType) {
    return MimeDocumentApplication.includes(contentType);
  }

  function destinationFromSourceExt(extension) {
    return destinationExtensionExport[extension];
  }

}
