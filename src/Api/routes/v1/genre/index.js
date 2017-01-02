import GenreService from '../../../../Services/Genre';
import MovieService from '../../../../Services/Movie';
import Promise from 'bluebird';

module.exports = function (app) {
    app.get('/v1/genre/list', (req, resp) => {
        let genreList = [];
        GenreService.getList()
            .then((genres) => {
                Promise.map(genres, (genre) => {
                    return MovieService.getMovieFromGenreId([genre._id])
                        .then((movies) => {
                            const genreJson = {};
                            genreJson.genre = genre;
                            genreJson.test = "sda";
                            genreList.push(genreJson);
                        })
                }).then(() => {
                    console.log("bitis");
                    resp.json(genreList);
                })

            });
    });
};