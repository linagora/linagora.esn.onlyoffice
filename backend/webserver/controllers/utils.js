'use strict';

module.exports = () => {
  const _ = require('lodash');

  const destinationExtensionExport = {
    docx: 'docy',
    xlsx: 'xlsy',
    pptx: 'ppty',
    odt: 'docx',
    ods: 'xlsx',
    odp: 'pptx',
    docy: false,
    xlsy: false,
    ppty: false
  };

  const sourceWithDestination = {
    docy: ['docx', 'odt'],
    xlsy: ['xlsx', 'ods'],
    ppty: ['pptx', 'odp']
  };

  const MimeDocumentApplication = [
    'application/pdf',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  const OfficeExt = ['docx', 'xlsx', 'pptx'];

  return {
    fileIsEditorDocument,
    destinationFromSourceExt,
    sourceToDestination,
    isOfficeDocument
  };

  function sourceToDestination(destination) {
    return _.findKey(sourceWithDestination, value => value.includes(destination));
  }

  function fileIsEditorDocument(contentType) {
    return MimeDocumentApplication.includes(contentType);
  }

  function destinationFromSourceExt(extension) {
    return destinationExtensionExport[extension];
  }

  function isOfficeDocument(extension) {
    return OfficeExt.includes(extension);
  }
};
