/**
 * Created by omer on 03/01/2017.
 */
import GenreService from '../../../../Services/Genre';
import MovieService from '../../../../Services/Movie';
import SeriesService from '../../../../Services/Series';
import StarService from '../../../../Services/Star';
import CharacterService from '../../../../Services/Character';


module.exports = function (app) {
    app.get('/v1/star/list', (req, resp) => {
        StarService.getList()
            .then((stars) => {
                resp.json(stars);
            });
    });

    app.get('/v1/star/detail/:id', (req, resp) => {
        let id = req.params.id;
        let movies = [];
        let series = [];

        let characterIds = [];
        CharacterService.findCharactersFromStarId(id)
            .then((characters) => {
                for (let char of characters) {
                    characterIds.push(char._id);
                }
                return MovieService.getMovieFromCharId(characterIds);
            })
            .then((moviesArray) => {
                movies = moviesArray;
                return SeriesService.getSeriesFromStarId(characterIds);
            })
            .then((seriesArray) => {
                series = seriesArray;
                resp.json({movies: movies, series: series});
            });
    });
};