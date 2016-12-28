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
import Star from '../../Models/Star';
import StarService from '../../Services/Star';
import MovieService from '../../Services/Movie';
import OMDBCrawler from '../OMDB';

class TMDBCrawler {
    constructor() {
        this.apiKey = config.apiKey;
        this.baseUrl = config.url.baseUrl;
        this.movieUrl = this.baseUrl + "movie/";
        this.imageUrl = config.image.baseUrl;
        this.backDropSizes = config.image.backdropSizes;
        this.posterSizes = config.image.posterSizes;
        this.movie = new Movie({});
    }

    getFilmName(id, success, fail) {
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

                        const omdbCrawler = new OMDBCrawler();
                        omdbCrawler.searchById(this.movie.imdbID)
                            .then((json) => {
                                const jsonBody = JSON.parse(json);
                                this.movie.set('imdbRating', Number.parseFloat(jsonBody.imdbRating));
                                this.movie.set('imdbScore', Number.parseFloat(jsonBody.imdbVotes.replace(/,/g , "")));
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
                            });


                    })
                    .catch((error) => {
                        console.log(error);
                        fail(error);
                    })

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

    findStarOrCreate(star) {
        return new Promise((resolve, reject) => {
            Star.findOne({name: star.name}, (err, doc) => {
                if (doc == null) {
                    for (var i = 0; i<this.backDropSizes.length; i++) {
                        this.downloadImageOfMovie(this.imageUrl + this.backDropSizes[i] + star.image, 'images/backdrop/' + this.backDropSizes[i] + '/' + star._id + '.jpg');
                    }
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
        request.head(url, (err, res, body) => {

            if (fileStream.existsSync(filename)) {
                // Do something
                fileStream.unlink(filename);

                request(url).pipe(fileStream.createWriteStream(filename)).on('close');
            } else {

                request.get(url).pipe(fileStream.createWriteStream(filename));
                //request(url)
            }
        });
    }


}

export default TMDBCrawler;