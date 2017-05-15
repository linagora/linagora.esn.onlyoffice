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

  var sourceWithDestination = {
    docy: ['docx', 'odt'],
    xlsy: ['xlsx', 'ods'],
    ppty: ['pptx', 'odp'],
  }

  var MimeDocumentApplication = [
    'application/pdf',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];


  function sourceToDestination(destination) {
    if (sourceWithDestination.docy.includes(destination)) {
      return 'docy';
    }
    if (sourceWithDestination.xlsy.includes(destination)) {
      return 'xlsy';
    }
    if (sourceWithDestination.ppty.includes(destination)) {
      return 'ppty';
    }
  }

  function opentDocumentToOffice(ext) {
    if (ext === 'odt' ) {
      return 'docx';
    }
    if (ext === 'ods') {
      return 'xlsx';
    }
    if (ext === 'odp') {
      return 'pptx';
    }
  }

  function officeToOpenDocument(ext) {
    if (ext === 'docx' ) {
      return 'odt';
    }
    if (ext === 'xlsx') {
      return 'ods';
    }
    if (ext === 'pptx') {
      return 'odp';
    }
  }

  function fileIsEditorDocument(contentType) {
    return MimeDocumentApplication.includes(contentType);
  }

  function destinationFromSourceExt(extension) {
    return destinationExtensionExport[extension];
  }

  return {
    fileIsEditorDocument: fileIsEditorDocument,
    destinationFromSourceExt: destinationFromSourceExt,
    sourceToDestination: sourceToDestination,
    opentDocumentToOffice: opentDocumentToOffice,
    officeToOpenDocument: officeToOpenDocument
  };
}
