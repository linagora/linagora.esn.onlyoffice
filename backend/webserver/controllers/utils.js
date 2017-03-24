'use strict';

module.exports = function(dependencies, lib) {
  const logger = dependencies('logger');
  const filestore = dependencies('filestore');

  return {
    fileIsEditorDocument: fileIsEditorDocument,
    destinationFromSourceExt: destinationFromSourceExt
  };

  function fileIsEditorDocument(contentType) {
    var MimeDocumentApplication = [
      'application/pdf',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    return MimeDocumentApplication.includes(contentType);
  }

  function destinationFromSourceExt(extension) {
    var destinationExtension = {
      'docx': 'docy',
      'xlsx': 'xlsy',
      'pptx': 'ppty'
    }

    switch (extension) {
      case 'docx':
        return 'docy';
        break;
      case 'xlsx':
        return 'xlsy';
        break;
      case 'pptx':
        return 'ppty';
        break;
      default:
        return 'docy';
    }
  }

}
