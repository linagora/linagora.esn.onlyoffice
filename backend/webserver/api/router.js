'use strict';


module.exports = function(dependencies, lib, router) {

  var fileController = require('../controllers/filesController')(dependencies, lib);
  var middleware = require('./middleware')(dependencies);


  //router.post('/convertion', controller.convertion);

  router.post('/files/:fileId', fileController.existingFile);

  router.post('/files', fileController.newFile)

  router.get('/files', fileController.getMetaDataByUserId);

  router.delete('/files/:fileId', fileController.removeFile);

  return router;
};
