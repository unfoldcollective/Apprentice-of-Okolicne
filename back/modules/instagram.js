const Client = require('instagram-private-api').V1;
const device = new Client.Device('someuser');
const storage = new Client.CookieFileStorage(
  __dirname + '/cookies/okolicne.json'
);

const user = process.env.INSTA_LOGIN;
const pass = process.env.INSTA_PASS;

module.exports = (image, caption) => {
  Client.Session
    .create(device, storage, user, pass)
    .then(function(session) {
      return [Client.Upload.photo(session, image), session];
    })
    .spread(function(upload, session) {
      return Client.Media.configurePhoto(
        session,
        upload.params.uploadId,
        caption
      );
    })
    .then(function(medium) {
      console.log(medium);
    });
};
