'use strict';

module.exports = dependencies => {

  const document = require('./document')(dependencies);

  return {
    document
  };
};
