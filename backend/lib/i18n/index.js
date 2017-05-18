'use strict';

var i18n = require('i18n');

i18n.configure(
  {
    defaultLocale: 'en',
    locales: ['en'],
    directory: __dirname + '/locales',
    updateFiles: false,
    indent: '  ',
    extension: '.json',
    cookie: 'locale'
  }
);

module.exports = function() {
  return i18n;
};
