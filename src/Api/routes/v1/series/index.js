/**
 * Created by omer on 02/01/2017.
 */
import SeriesService from '../../../../Services/Series';

module.exports = function (app) {
    app.get('/v1/series/list', (req, resp) => {
        SeriesService.getSeries()
            .then((series) => {
                resp.json(series);
            });
    });

    //It can be limited by limit query
    app.get('/v1/series/top', (req, resp) => {
        let limit = req.query.limit;
        if (limit) {
            SeriesService.getTopImdbSeries(Number(limit))
                .then((series) => {
                    resp.json(series);
                });
        } else {
            SeriesService.getTopImdbSeries()
                .then((series) => {
                    resp.json(series);
                });
        }

    });

    //It can be limited by limit query
    app.get('/v1/series/recent', (req, resp) => {
        let limit = req.query.limit;
        if (limit) {
            SeriesService.getRecentSeries(Number(limit))
                .then((series) => {
                    resp.json(series);
                });
        } else {
            SeriesService.getRecentSeries()
                .then((series) => {
                    resp.json(series);
                });
        }

    });


    app.get('/v1/series/find/:id', (req, resp) => {
        let id = req.params.id;

        SeriesService.getSeriesFromId(id)
            .then((series) => {
                resp.json(series);
            });

    });


    app.get('/v1/series/search', (req, resp) => {
        let genre = req.query.genre;
        let name = req.query.name;
        if (genre) {
            SeriesService.getSeriesFromGenre(genre)
                .then((series) => {
                    resp.json(series);
                })
                .catch((error) => {
                    resp.json({error: error});
                })
        } else if (name) {
            SeriesService.getSeriesFromName(name)
                .then((series) => {
                    resp.json(series);
                })
                .catch((error) => {
                    resp.json({error: error});
                })
        } else {
            resp.json({error: "Specify the search."});
        }


    });
};