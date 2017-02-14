/**
 * Created by omer on 06/12/2016.
 */
module.exports = (app) => {
    app.get('/', (req, res) => {
        res.json({
            hello: 'world'
        });
    });

    app.get('/status', (req, res) => {
        res.send('OK');
    });
    require('./v1')(app);
    require('./v1/auth')(app);
    require('./v1/genre')(app);
    require('./v1/movie')(app);
    require('./v1/series')(app);
    require('./v1/star')(app);
    require('./v1/list')(app);
};