'use strict';


module.exports = function(dependencies, lib, router) {

  var controller = require('./controller')(dependencies, lib);
  var middleware = require('./middleware')(dependencies);


  router.post('/convertion', controller.convertion)

  return router;
};
