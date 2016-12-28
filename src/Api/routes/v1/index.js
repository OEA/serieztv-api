/**
 * Created by omer on 06/12/2016.
 */
import request from 'request';
import TMDB from '../../../Crawlers/TMDB';

module.exports = function (app) {
    app.get('/v1/hello-world', (req, res) => {

    });

    app.get('/v1/test', (req, res) => {
        let tmdb = new TMDB();
        tmdb.getFilmName(req.query.tmdbID, (movie) => {
            res.json(movie);
        }, (error) => {
            res.json(error);
        });

    });

};