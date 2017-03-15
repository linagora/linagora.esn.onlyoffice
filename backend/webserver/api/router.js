'use strict';


module.exports = function(dependencies, lib, router) {

  var controller = require('./controller')(dependencies);
  var middleware = require('./middleware')(dependencies);


  router.get('/pad', controller.callbackUrl);
  router.post('/pad', controller.callbackUrl);

  return router;
};
