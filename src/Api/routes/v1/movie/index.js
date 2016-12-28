/**
 * Created by omer on 28/12/2016.
 */

import MovieService from '../../../../Services/Movie';

module.exports = function (app) {
    app.get('/v1/movie/list', (req, resp) => {
        MovieService.getMovies()
            .then((movies) => {
                resp.json(movies);
            })
    });
};