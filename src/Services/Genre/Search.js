/**
 * Created by gbu on 15/11/2016.
 */

import mongoose from 'mongoose';
import Genre from '../../Models/Genre';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);