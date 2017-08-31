const Client = require('instagram-private-api').V1;
const device = new Client.Device('someuser');
const storage = new Client.CookieFileStorage(
  __dirname + '/cookies/okolicne.json'
);

module.exports = (image, caption) => {
  Client.Session
    .create(device, storage, 'oko6399', 'Trunu39s')
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
