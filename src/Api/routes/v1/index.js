/**
 * Created by omer on 06/12/2016.
 */
import TMDB from '../../../Crawlers/TMDB';
import MovieService from '../../../Services/Movie';
import SeriesService from '../../../Services/Series';
import GenreService from '../../../Services/Genre';
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
    app.get('/v1/test2', (req, res) => {
        let tmdb = new TMDB();
        tmdb.getSeriesName(req.query.tmdbID, (movie) => {
            res.json(movie);
        }, (error) => {
            res.json(error);
        });

    });

    app.get('/v1/search', (req, res) => {
        let query = req.query.query;
        let results = {};
        GenreService.search(query)
            .then((genres) => {
                results.genres = genres;
                return MovieService.getMovieFromName(query);
            })
            .then((movies) => {
                results.movies = movies;
                return SeriesService.getSeriesFromName(query);
            })
            .then((series) => {
                results.series = series;
                res.json(results);
            })

    });

};