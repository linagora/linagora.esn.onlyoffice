'use strict';

module.exports = (dependencies, lib, router) => {
  const authorizationMW = dependencies('authorizationMW');
  const fileController = require('../controllers/file')(dependencies, lib);

  //router.post('/convertion', controller.convertion);

  router.get('/files/:fileId', authorizationMW.requiresAPILogin, fileController.existingFile);

  router.post('/save/files/:fileId/:extFile', authorizationMW.requiresAPILogin, fileController.saveModif);

  router.post('/import/file/:filename/:mimetype', authorizationMW.requiresAPILogin, fileController.importFile);

  router.post('/coauthor/files/:fileId', authorizationMW.requiresAPILogin, fileController.addCoAuthor);

  router.post('/files', authorizationMW.requiresAPILogin, fileController.newFile);

  router.get('/files', authorizationMW.requiresAPILogin, fileController.getMetaDataByUserId);

  router.delete('/files/:fileId', authorizationMW.requiresAPILogin, fileController.removeFile);

  return router;
};
