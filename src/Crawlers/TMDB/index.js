/**
 * Created by omer on 18/12/2016.
 */

import config from './config.json';
import request from 'request';
import Promise from 'bluebird';
import Movie from '../../Models/Movie';
import Genre from '../../Models/Genre';
import Character from '../../Models/Character';
import Star from '../../Models/Star';
import StarService from '../../Services/Star';

class TMDBCrawler {
    constructor() {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;
        this.imageUrl = config.imageUrl;
        this.movie = new Movie({});
    }

    getFilmName(id, success, fail) {
        request
            .get({url: "https://api.themoviedb.org/3/movie/" + id, form: {api_key: this.apiKey}}, (error, response, body) => {

                /*const movie = new Movie({
                    poster: 'poster_path',
                    image: 'backdrop_path',
                    imdbScore: 1000,
                    imdbRating: 9.5,
                    apiID: '1'
                });*/
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
                        return Promise.all(creditsObject.characters)
                            .then((characters) => {
                                //console.log(characters);
                                return Promise.all(creditsObject.stars);
                            });

                    })
                    .then((stars) => {
                        const starIds = [];
                        for (let star of stars) {
                            starIds.push(star._id);
                        }
                        this.movie.set('stars', starIds);
                        console.log(this.movie);
                        success({success: true});
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
            request.get({url: "https://api.themoviedb.org/3/movie/"+movieId+"/credits", form: {api_key: this.apiKey}}, (error, response, body) => {
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
            genreArray.push(genre.save());
        }
        return genreArray;
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
            starArray.push(star.save());
            const character = new Character({
                star: star._id,
                characterName: castValue.character,
                characterImage: castValue.profile_path,
                apiID: castValue.credit_id
            });
            characterArray.push(character.save());
        }
        return {stars: starArray, characters: characterArray};
    }


}

export default TMDBCrawler;