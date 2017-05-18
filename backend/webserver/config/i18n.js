'use strict';

module.exports = function(application) {
  var i18n = require('../../lib/i18n')();

  application.use(i18n.init);
};
