/**
 * Created by omer on 06/12/2016.
 */

import express from 'express';
import json from 'express-json';
import responseTime from 'response-time';
import bodyParser from 'body-parser';

let app = express();
app.set('view engine', 'html');
app.set('views', __dirname + '/api/views');

app.enable('trust proxy');
app.disable('x-powered-by');
app.use(responseTime());
app.use(json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

require('../Api/routes')(app);

app.listen(3000);
/*
app.locals({
    config: config,
    package: JSON.parse(require('fs').readFileSync(__dirname + '/../../package.json', { encoding: 'utf8' })),
    moment: moment,
    env: config.get('NODE_ENV'),
    siteConfig: {
        name: config.get('sitename'),
        version: config.get('version'),
        paths: config.get('paths')
    }
});

app.db.on('error', function (err) {
    if (require('cluster').isMaster) {
        app.logger.error('#app #db', app.logger.parseError(err));
        process.exit(1);
    } else
        process.send({ status: 'fatal', error: err.message });
});


if (app.get('env') == 'localhost') {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
} else if (app.get('env') == 'stage') {
    //app.use(middlewares.errorHandler());
} else if (app.get('env') == 'production') {
    app.enable('view cache');
    //app.use(middlewares.errorHandler());
}
*/
exports.app = app;