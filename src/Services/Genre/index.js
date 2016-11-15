/**
 * Created by gbu on 14/11/2016.
 */

import mongoose from 'mongoose';
import Genre from '../../Models/Genre';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

class GenreService {


    static createGenre(Genre genre) {

    }



}

export default GenreService;