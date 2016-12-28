/**
 * Created by omer on 06/12/2016.
 */
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.json({
            hello: 'world'
        });
    });

    app.get('/status', function (req, res) {
        res.send('OK');
    });
    require('./v1')(app);
    require('./v1/auth')(app);
};