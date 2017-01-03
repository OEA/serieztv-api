import GenreService from '../../../../Services/Genre';
import MovieService from '../../../../Services/Movie';
import SeriesService from '../../../../Services/Series';
import Promise from 'bluebird';

module.exports = function (app) {
    app.get('/v1/genre/list', (req, resp) => {
        GenreService.getList()
            .then((genres) => {
                resp.json(genres);
            });
    });

    app.get('/v1/genre/detail/:id', (req, resp) => {
        let id = req.params.id;
        let movies = [];
        let series = [];
        GenreService.getGenreFromId(id)
            .then((genre) => {
                return MovieService.getMovieFromGenreId([genre._id])
                    .then((moviesArray) => {
                        movies = moviesArray;
                        return genre;
                    });
            })
            .then((genre) => {
                return SeriesService.getSeriesFromGenreId([genre._id])
                    .then((seriesArray) => {
                        series = seriesArray;

                    })
            })
            .then(() => {
                resp.json({movies: movies, series: series});
            })
    });
};