/**
 * Created by omer on 18/12/2016.
 */

import config from './config.json';
import request from 'request';
import Promise from 'bluebird';
import fileStream from 'fs';
import Movie from '../../Models/Movie';
import Genre from '../../Models/Genre';
import Character from '../../Models/Character';
import Episode from '../../Models/Episode';
import Season from '../../Models/Season';
import Star from '../../Models/Star';
import Series from '../../Models/Series';
import SeriesService from '../../Services/Series';
import MovieService from '../../Services/Movie';
import OMDBCrawler from '../OMDB';

class TMDBCrawler {
    constructor() {
        this.apiKey = config.apiKey;
        this.baseUrl = config.url.baseUrl;
        this.seriesUrl = this.baseUrl + "tv/";
        this.movieUrl = this.baseUrl + "movie/";
        this.personUrl = this.baseUrl + "person/";
        this.imageUrl = config.image.baseUrl;
        this.backDropSizes = config.image.backdropSizes;
        this.posterSizes = config.image.posterSizes;
        this.movie = new Movie({});
        this.series = new Series({});
    }

    getFilmName(id,imdbScore,imdbRating, success, fail) {
        request
            .get({url: this.movieUrl + id, form: {api_key: this.apiKey}}, (error, response, body) => {
                let bodyJson = JSON.parse(body);
                this.movie.set('name', bodyJson.original_title);
                this.movie.set('overview', bodyJson.overview);
                this.movie.set('runtime', bodyJson.runtime);
                this.movie.set('status', bodyJson.status);
                this.movie.set('airDate', bodyJson.release_date);
                this.movie.set('poster', bodyJson.poster_path);
                this.movie.set('image', bodyJson.backdrop_path);
                this.movie.set('apiID', bodyJson.id);
                this.movie.set('imdbID', bodyJson.imdb_id);
                this.movie.set('imdbRating', Number.parseFloat(imdbRating));
                this.movie.set('imdbScore', Number.parseFloat(imdbScore.replace(/,/g , "")));
                const genres = this.getGenresFromMovieBody(body);
                Promise.all(genres)
                    .then((genres) => {
                        const genreIds = [];
                        for (let genre of genres) {
                            genreIds.push(genre._id);
                        }
                        this.movie.set('genres', genreIds);
                        return this.getCreditsFromMovieId(id);
                    })
                    .then((credits) => {
                        let creditsObject = this.getCastFromMovieCreditsBody(credits);
                        return Promise.all(creditsObject.stars)
                            .then((stars) => {
                                return Promise.all(creditsObject.characters);
                            });

                    })
                    .then((characters) => {
                        const characterIds = [];
                        for (let character of characters) {
                            characterIds.push(character._id);
                        }
                        this.movie.set('characters', characterIds);
                    })
                    .then(() => {
                        MovieService.create(this.movie)
                            .then((movie) => {
                                success({success: true, movie: movie});
                            })
                            .then(() => {

                                for (var i = 0; i<this.posterSizes.length; i++) {
                                    this.downloadImageOfMovie(this.imageUrl + this.posterSizes[i] + bodyJson.poster_path, 'images/poster/' + this.posterSizes[i] + '/' + this.movie._id + '.jpg');
                                }
                                for (var i = 0; i<this.backDropSizes.length; i++) {
                                    this.downloadImageOfMovie(this.imageUrl + this.backDropSizes[i] + bodyJson.backdrop_path, 'images/backdrop/' + this.backDropSizes[i] + '/' + this.movie._id + '.jpg');
                                }

                            })
                            .catch((error) => {
                                console.log(error);
                                fail(error);
                            });

                    })
                    .catch((error) => {
                        console.log(error);
                        fail(error);
                    })

            });
    }

    getSeriesName(id,imdbScore,imdbRating, success, fail) {
        request
            .get({url: this.seriesUrl + id, form: {api_key: this.apiKey}}, (error, response, body) => {


                let bodyJson = JSON.parse(body);
                this.series.set('name', bodyJson.original_name);
                this.series.set('overview', bodyJson.overview);
                this.series.set('runtime', bodyJson.episode_run_time[0]);
                this.series.set('status', bodyJson.status);
                this.series.set('firstAir', bodyJson.first_air_date);
                this.series.set('poster', bodyJson.poster_path);
                this.series.set('image', bodyJson.backdrop_path);
                this.series.set('imdbID', bodyJson.imdb_id);
                this.series.set('apiID', bodyJson.id);
                this.series.set('active', true);
                const genres = this.getGenresFromMovieBody(body);
                Promise.all(genres)
                    .then((genres) => {
                        const genreIds = [];
                        for (let genre of genres) {
                            genreIds.push(genre._id);
                        }
                        this.series.set('genres', genreIds);
                        return this.getCreditsFromTVId(id);
                    })
                    .then((credits) => {
                        let creditsObject = this.getCastFromMovieCreditsBody(credits);
                        return Promise.all(creditsObject.stars)
                            .then((stars) => {
                                return Promise.all(creditsObject.characters);
                            });

                    })
                    .then((characters) => {
                        const characterIds = [];
                        for (let character of characters) {
                            characterIds.push(character._id);
                        }
                        this.series.set('characters', characterIds);
                    })
                    .then(() => {
                        let seasonPromises = [];
                        for (let season of bodyJson.seasons) {
                            let seasonPromise = this.getSeasonBodyOfSeries(bodyJson.id, season.season_number);
                            seasonPromises.push(seasonPromise);
                        }
                        return Promise.map(seasonPromises, (seasonJson) => {
                            let seasonJSON = JSON.parse(seasonJson);
                            let season = new Season({});
                            season.set('name', seasonJSON.name);
                            season.set('episodes', this.getEpisodesFromSeasonBody(seasonJSON.episodes));
                            if (seasonJSON.overview) {
                                season.set('overview', seasonJSON.overview);
                            } else {
                                season.set('overview', "Untitled");
                            }

                            season.set('number', seasonJSON.season_number);
                            season.set('poster', seasonJSON.poster_path);
                            season.set('airDate', seasonJSON.air_date);
                            season.set('apiID', seasonJSON.id);
                            season.save();
                            return season._id;
                        })
                    })
                    .then((seasons) => {
                        this.series.set('seasons', seasons);
                    })
                    .then(() => {

                        this.series.set('imdbRating', Number.parseFloat(imdbRating));
                        this.series.set('imdbScore', Number.parseFloat(imdbScore.replace(/,/g , "")));

                        SeriesService.create(this.series)
                            .then((series) => {
                                success(series);
                            });
                    })
                    .then(() => {
                        for (var i = 0; i<this.posterSizes.length; i++) {
                            this.downloadImageOfMovie(this.imageUrl + this.posterSizes[i] + bodyJson.poster_path, 'images/poster/' + this.posterSizes[i] + '/' + this.series._id + '.jpg');
                        }
                        for (var i = 0; i<this.backDropSizes.length; i++) {
                            this.downloadImageOfMovie(this.imageUrl + this.backDropSizes[i] + bodyJson.backdrop_path, 'images/backdrop/' + this.backDropSizes[i] + '/' + this.series._id + '.jpg');
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        fail(error);
                    })

            });
    }

    //returns promise
    getCreditsFromTVId(seriesId) {
        return new Promise((resolve, reject) => {
            request.get({url: this.seriesUrl + seriesId + "/credits", form: {api_key: this.apiKey}}, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }
    //returns promise
    getCreditsFromMovieId(movieId) {
        return new Promise((resolve, reject) => {
            request.get({url: this.movieUrl + movieId + "/credits", form: {api_key: this.apiKey}}, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }

    getGenresFromMovieBody(movieBody) {
        let bodyJson = JSON.parse(movieBody);
        const genreArray = [];
        for (let genreValue of bodyJson.genres) {
            const genre = new Genre({
                name: genreValue.name,
                apiID: genreValue.id
            });
            genreArray.push(this.findGenreOrCreate(genre));
        }
        return genreArray;
    }

    findGenreOrCreate(genre) {
        return new Promise((resolve, reject) => {
            Genre.findOne({name: genre.name}, (err, doc) => {
                if (doc == null) {
                    resolve(genre.save());
                } else {
                    resolve(doc);
                }
            });
        });
    }

    getCastFromMovieCreditsBody(creditsBody) {
        let bodyJson = JSON.parse(creditsBody);
        const starArray = [];
        const characterArray = [];
        for (let castValue of bodyJson.cast) {
            const star = new Star({
                name: castValue.name,
                image: castValue.profile_path,
                active: true,
                apiID: castValue.id
            });
            const character = new Character({
                characterName: (castValue.character) ? castValue.character : "Untitled",
                characterImage: castValue.profile_path,
                apiID: castValue.credit_id
            });
            starArray.push(this.findStarOrCreate(star, character));
            characterArray.push(this.findStarAndSaveCharacter(star, character));
        }
        return {stars: starArray, characters: characterArray};
    }

    getSeasonBodyOfSeries(seriesId, season) {
        return new Promise((resolve, reject) => {
            request.get({url: this.seriesUrl + seriesId + "/season/" + season, form: {api_key: this.apiKey}}, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }

    getEpisodesFromSeasonBody(seasonBody) {

        let episodeArray = [];
        for (let episodeBody of seasonBody) {
            let episode = new Episode({});
            episode.set('name', episodeBody.name);
            episode.set('overview', episodeBody.overview);
            episode.set('number', episodeBody.episode_number);
            episode.set('apiID', episodeBody.id);
            episode.save();
            episodeArray.push(episode._id);
        }
        return episodeArray;

    }

    findStarOrCreate(star) {
        return new Promise((resolve, reject) => {
            Star.findOne({name: star.name}, (err, doc) => {
                if (doc == null) {
                    if (star.image) {
                        for (var i = 0; i<this.backDropSizes.length; i++) {
                            this.downloadImageOfMovie(this.imageUrl + this.backDropSizes[i] + star.image, 'images/backdrop/' + this.backDropSizes[i] + '/' + star._id + '.jpg');
                        }
                    }

                    /*return Promise.map(stars, (star) => {

                     setTimeout(() => {
                     return request.get({url: this.personUrl + star.apiID, qs: {api_key: this.apiKey}}, (error, response, body) => {
                     const bodyJson = JSON.parse(body);
                     console.log(body)
                     //star.set('biography', bodyJson.biography);
                     //star.set('birthday', bodyJson.birthday);

                     });

                     }, 1000);
                     })

                    return new Promise((resolveInside, rejectInside) => {
                        return request.get({url: this.personUrl + star.apiID, qs: {api_key: this.apiKey}}, (error, response, body) => {
                            const bodyJson = JSON.parse(body);
                            console.log(body)
                            star.set('biography', bodyJson.biography);
                            star.set('birthday', bodyJson.birthday);

                        });
                    })*/

                    resolve(star.save());

                } else {
                    resolve(doc);
                }
            });
        });
    }

    findStarAndSaveCharacter(star, character) {
        return new Promise((resolve, reject) => {
            Star.findOne({name: star.name, apiID: star.apiID}, (err, doc) => {
                if (doc == null) {
                    character.set('star', star._id);
                    resolve(character.save());
                } else {
                    character.set('star', doc._id);
                    resolve(character.save());
                }
            });
        });
    }

    downloadImageOfMovie(url, filename) {
        request(url, {encoding: 'binary'}, function(error, response, body) {
            fileStream.writeFile(filename, body, 'binary', function (err) {});
        });
    }

}

export default TMDBCrawler;