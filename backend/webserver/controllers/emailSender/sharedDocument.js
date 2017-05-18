'use strict';

var email;

function sendEmail(sharedDocument, done) {
  if (!sharedDocument) {
    return done(new Error('Document can not be null'));
  }

  if (!sharedDocument.data) {
    return done(new Error('Document data can not be null'));
  }

  var properties = {
    subject: 'A document has been shared by ' + sharedDocument.data.userSender.lastname + ' ' + sharedDocument.data.userSender.firstname,
    template: 'document.shared'
  };

  var message = {
    to: sharedDocument.data.email,
    subject: properties.subject
  };

  email.getMailer().sendHTML(message, properties.template, sharedDocument, done);
}

module.exports = function(dependencies) {
  email = dependencies('email');

  return {
    sendEmail: sendEmail
  };
};
