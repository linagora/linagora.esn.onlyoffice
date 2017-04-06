'use strict';

var email;

var properties = {
  subject: 'A document has been shared',
  template: 'document.shared'
};

function sendEmail(sharedDocument, done) {
  if (!sharedDocument) {
    return done(new Error('Document can not be null'));
  }

  if (!sharedDocument.data) {
    return done(new Error('Document data can not be null'));
  }

  var message = {
    to: sharedDocument.data.email,
    subject: properties.subject
  };

  email.getMailer().sendHTML(message, properties.template, sharedDocument.data, done);
}

module.exports = function(dependencies, lib) {
  email = dependencies('email');

  return {
    sendEmail: sendEmail
  };
};
