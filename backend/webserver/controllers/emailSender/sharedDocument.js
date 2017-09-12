'use strict';

module.exports = dependencies => {
  const email = dependencies('email');

  return {
    sendEmail
  };

  function sendEmail(sharedDocument) {
    if (!sharedDocument) {
      return Promise.reject(new Error('Document can not be null'));
    }

    if (!sharedDocument.data) {
      return Promise.reject(new Error('Document data can not be null'));
    }

    const message = {
      to: sharedDocument.data.email,
      subject: `A document has been shared by ${sharedDocument.data.userSender.lastname} ${sharedDocument.data.userSender.firstname}`
    };

    return email.getMailer().sendHTML(message, 'document.shared', sharedDocument, err => (err ? Promise.reject(err) : Promise.resolve()));
  }
};
