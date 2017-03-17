'use strict';

module.exports = function(dependencies) {
  const convertion = require('./convertion')(dependencies);

  return {
    convertion: convertion
  }
};
