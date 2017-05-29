/**
 * Created by omer on 06/12/2016.
 */
import TMDB from '../../../Crawlers/TMDB';
import MovieService from '../../../Services/Movie';
import SeriesService from '../../../Services/Series';
import GenreService from '../../../Services/Genre';
import StarService from '../../../Services/Star';
module.exports = function (app) {
    app.get('/v1/hello-world', (req, res) => {

    });

    app.get('/v1/test', (req, res) => {
        let tmdb = new TMDB();
        const imdbScore = req.query.imdbScore;
        const imdbRating = req.query.imdbRating;
        tmdb.getFilmName(req.query.tmdbID,imdbScore,imdbRating, (movie) => {
            res.json(movie);
        }, (error) => {
            res.json(error);
        });

    });
    app.get('/v1/test2', (req, res) => {
        let tmdb = new TMDB();
        const imdbScore = req.query.imdbScore;
        const imdbRating = req.query.imdbRating;
        tmdb.getSeriesName(req.query.tmdbID,imdbScore,imdbRating, (movie) => {
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
                let genreIds = [];
                for (let genre of genres) {
                    genreIds.push(genre._id);
                }
                return MovieService.getMovieNameAndGenreIds(query, genreIds);
            })
            .then((movies) => {

                results.movies = movies;
                let genreIds = [];
                for (let genre of results.genres) {
                    genreIds.push(genre._id);
                }
                return SeriesService.getSeriesNameAndGenreIds(query, genreIds);
            })
            .then((series) => {
                results.series = series;
                return StarService.queryStar(query);
            })
            .then((stars) => {
                results.stars = stars;
                res.json(results);
            });

    });

};