'use strict';


module.exports = function(dependencies, lib, router) {
  const authorizationMW = dependencies('authorizationMW');
  var fileController = require('../controllers/filesController')(dependencies, lib);
  var middleware = require('./middleware')(dependencies);


  //router.post('/convertion', controller.convertion);

  router.get('/files/:fileId', authorizationMW.requiresAPILogin, fileController.existingFile);

  router.post('/save/files/:fileId/:extFile', authorizationMW.requiresAPILogin, fileController.saveModif);

  router.post('/coauthor/files/:fileId', authorizationMW.requiresAPILogin, fileController.addCoAuthor);

  router.post('/files', authorizationMW.requiresAPILogin, fileController.newFile);

  router.get('/files', authorizationMW.requiresAPILogin, fileController.getMetaDataByUserId);

  router.delete('/files/:fileId', authorizationMW.requiresAPILogin, fileController.removeFile);

  return router;
};
