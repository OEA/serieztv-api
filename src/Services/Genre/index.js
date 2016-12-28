/**
 * Created by gbu on 14/11/2016.
 */

import mongoose from 'mongoose';
import Genre from '../../Models/Genre';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

const GenreErrorMessages = {
    GENRE_ALREADY_EXISTS: "Genre already exists",
    CANNOT_CREATE_GENRE: "Could not create genre",
    GENRE_NOT_EXIST: "Genre does not exist"
};

class GenreService {

    static create(genre) {
        return new Promise((resolve, reject) => {
            Genre.find({name: genre.name}).count((error, count)=> {
                if (count > 0 || error) {
                    reject(GenreErrorMessages.GENRE_ALREADY_EXISTS);
                }
            });
            genre.save((error) => {
                if (error) {
                    reject(GenreErrorMessages.CANNOT_CREATE_GENRE);
                } else {
                    resolve(genre);
                }
            });
        });
    }

    static search(genreName) {
        return new Promise((resolve, reject) => {
            Genre.find({name:genreName}).count((error, count) => {
                if (count == 0 || error) {
                    reject(GenreErrorMessages.GENRE_NOT_EXIST);
                }
            }).then((count) => {
                Genre.find({name: genreName}, (error, genres) => {
                    if (error) {

                    } else {
                        resolve(genres[0]);
                    }
                });
            });

        });
    }

    static delete(genreName) {
        return new Promise((resolve, reject) => {
           Genre.find({name:genreName}).count((error, count) => {
               if (count == 0 || error) {
                   reject(GenreErrorMessages.GENRE_NOT_EXIST);
               }
           }).then((test) => {
               Genre.findOneAndRemove({name: genreName}, (error, genre) => {
                   if (error) {

                   } else {
                       resolve(genre);
                   }
               });
           });

        });

    }
}

export default GenreService;