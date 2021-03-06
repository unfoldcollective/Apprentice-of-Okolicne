const path = require('path');
const wrap = require('co-express');
const webshot = require('webshot');
const jimp = require('jimp');
const instagramUpload = require('../modules/instagram.js');

module.exports = (app, db) => {
  const storage = db.collection('storage');
  //List
  app.get(
    '/api',
    wrap(function*(req, res, next) {
      const offset = Number(req.query.offset) || 0;
      const n = Math.min(req.query.n || 20, 200);

      const data = yield storage
        .find(
          {
            objects: {
              $exists: true,
              $not: { $size: 0 }
            }
          },
          {
            name: 1
          }
        )
        .sort({ _id: -1 })
        .skip(offset)
        .limit(n)
        .toArray();

      return res.send({
        error: false,
        n,
        offset: offset,
        count: yield storage.count(),
        data
      });
    })
  );

  app.get('/api/emails', (req, res, next) => {
    const form =
      '<form method="POST"><input type="text" name="magic" placeholder="Magic word" /><button type="submit">List</button></form>';
    return res.send(form);
  });

  app.post(
    '/api/emails',
    wrap(function*(req, res, next) {
      const magic = req.body.magic;

      if (magic !== process.env.MAGIC) {
        return next(new Error('Incorrect magic word'));
      }

      const data = yield storage.find({}, { email: 1, name: 1 }).toArray();

      return res.send({
        data: data.map(d => ({
          name: d.name.join(''),
          email: d.email.join('')
        }))
      });
    })
  );

  app.post(
    '/api',
    wrap(function*(req, res, next) {
      const payload = req.body;

      //TODO: validate payload
      const r = yield storage.insertOne(payload);

      webshot(
        `http://front/gallery/${payload._id}`,
        `captures/${payload._id}.jpg`,
        {
          windowSize: {
            width: 1920,
            height: 1080
          },
          shotSize: {
            width: 'window',
            height: 'window'
          },
          shotOffset: {
            left: 0,
            right: 576,
            top: 0,
            bottom: 0
          },
          renderDelay: 2000
        },
        error => {
          if (error) return next(new Error('Screenshot failed'));

          jimp
            .read(`captures/${payload._id}.jpg`)
            .then(capture => {
              capture
                .resize(600, jimp.AUTO)
                .write(`captures/th_${payload._id}.jpg`, error => {
                  if (error) return next(error);
                  return res.send({
                    _id: payload._id,
                    error: false,
                    data: r
                  });
                });
            })
            .catch(error => next(error));

          if (process.env.INSTA_LOGIN && process.env.INSTA_PASS) {
            instagramUpload(
              path.join(__dirname, '..', `captures/${payload._id}.jpg`),
              'Freshly created at the #SNG exhibition ‘Master of Okoličné and Gothic Art of Spiš around 1500’ @sng_gallery #gothic #art #remix #composition #slovaknationalgallery'
            );
          }
        }
      );
    })
  );
};
