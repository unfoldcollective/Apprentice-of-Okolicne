const wrap = require('co-express');
const { ObjectID } = require('mongodb');

module.exports = (app, db) => {
  const storage = db.collection('storage');

  app.get(
    '/api/id/:id',
    wrap(function*(req, res, next) {
      const id = req.params.id;

      const data = yield storage.findOne({ _id: new ObjectID(id) });

      if (!data) {
        const err = new Error('Element not found in the database');
        err.status = 404;
        return next(err);
      }

      return res.send({
        error: false,
        data
      });
    })
  );

  app.get('/api/id/:id/nuke', (req, res, next) => {
    const form =
      '<form method="POST"><input type="text" name="magic" placeholder="Magic word" /><button type="submit">Delete</button></form>';
    return res.send(form);
  });

  app.post(
    '/api/id/:id/nuke',
    wrap(function*(req, res, next) {
      const id = req.params.id;
      const magic = req.body.magic;

      if (magic !== process.env.MAGIC) {
        return next(new Error('Incorrect magic word'));
      }

      const data = yield storage.remove({ _id: new ObjectID(id) });

      if (!data) {
        const err = new Error('Element not found in the database');
        err.status = 404;
        return next(err);
      }

      return res.send({
        error: false,
        data
      });
    })
  );
};
