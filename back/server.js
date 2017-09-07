const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const co = require('co');

const PORT = process.env.PORT || 3000;
const app = express();

//  Server config
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

//  TODO: use an api key or jwt better than this check
app.use((req, res, next) => {
    if (req.headers.host !== 'back:3001') {
        const err = new Error('Request not valid');
        return next(err);
    }

    return next();
});

app.use('/captures', express.static(path.join(__dirname, 'captures')));

co(function*() {
    const db = yield MongoClient.connect('mongodb://db:27017/okolicne');

    //List & new
    require('./api/list')(app, db);

    //Single & delete
    require('./api/single')(app, db);

    //Generic error
    app.get('*', (req, res, next) => {
        const err = new Error('API endpoint not found, check your request');
        err.status = 404;
        next(err);
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        res.json({
            error: {
                status: err.status,
                message: err.message
            }
        });
    });

    app.listen(PORT, () => console.warn('API Server started on port', PORT));
}).catch(error => console.error(error));
