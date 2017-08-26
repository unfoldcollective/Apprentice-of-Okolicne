const wrap = require('co-express');
const webshot = require('webshot');
const jimp = require('jimp');

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
            name: 1,
            town: 1
          }
        )
        .skip(offset)
        .limit(n)
        .toArray();

      return res.send({
        error: false,
        n,
        offset: offset,
        count: yield storage.count(),
        data: data.reverse()
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
        }
      );
    })
  );
};
