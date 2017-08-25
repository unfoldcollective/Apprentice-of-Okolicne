const wrap = require('co-express');

module.exports = (app, db) => {
    const storage = db.collection('storage');
    //List
    app.get(
        '/api',
        wrap(function*(req, res, next) {
            const offset = Number(req.query.offset) || 0;
            const n = Math.min(req.query.n || 20, 200);

            const data = yield storage
                .find({ objects: { $exists: true, $not: { $size: 0 } } })
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

    app.post(
        '/api',
        wrap(function*(req, res, next) {
            const payload = req.body;

            //TODO: validate payload
            const r = yield storage.insertOne(payload);

            return res.send({
                _id: payload._id,
                error: false,
                data: r
            });
        })
    );
};
