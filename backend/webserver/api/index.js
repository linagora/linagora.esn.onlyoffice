'use strict';

const express = require('express');

module.exports = (dependencies, lib) => {
  const router = express.Router();

  require('./router')(dependencies, lib, router);

  return router;
};
