/**
 * Created by omer on 28/12/2016.
 */
import MovieService from '../../../../Services/Movie';

module.exports = function (app) {
    app.get('/v1/movie/list', (req, resp) => {
        MovieService.getMovies()
            .then((movies) => {
                resp.json(movies);
            });
    });



    //It can be limited by limit query
    app.get('/v1/movie/top', (req, resp) => {
        let limit = req.query.limit;
        if (limit) {
            MovieService.getTopImdbMovies(Number(limit))
                .then((movies) => {
                    resp.json(movies);
                });
        } else {
            MovieService.getTopImdbMovies()
                .then((movies) => {
                    resp.json(movies);
                });
        }

    });

    //It can be limited by limit query
    app.get('/v1/movie/recent', (req, resp) => {
        let limit = req.query.limit;
        if (limit) {
            MovieService.getRecentMovies(Number(limit))
                .then((movies) => {
                    resp.json(movies);
                });
        } else {
            MovieService.getRecentMovies()
                .then((movies) => {
                    resp.json(movies);
                });
        }

    });


    app.get('/v1/movie/find/:id', (req, resp) => {
        let id = req.params.id;

        MovieService.getMovieFromId(id)
            .then((movie) => {
                resp.json(movie);
            });

    });


    app.get('/v1/movie/search', (req, resp) => {
        let genre = req.query.genre;
        let name = req.query.name;
        if (genre) {
            MovieService.getMovieFromGenre(genre)
                .then((movies) => {
                    resp.json(movies);
                })
                .catch((error) => {
                    resp.json({error: error});
                })
        } else if (name) {

        } else {
            resp.json({error: "Specify the search."});
        }


    });

};