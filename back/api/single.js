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
};
