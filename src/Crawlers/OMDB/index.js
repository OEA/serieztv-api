/**
 * Created by omer on 28/12/2016.
 */
import config from './config.json';
import request from 'request';
import Promise from 'bluebird';

class OMDBCrawler {
    constructor() {
        this.baseUrl = config.url.baseUrl;
    }

    //Return promise
    searchById(imdbId) {
        return new Promise((resolve, reject) => {
            //i => imdbId
            //plot => full | short
            //r => json | xml
            request.get({url: this.baseUrl , qs: {i: imdbId, plot: "full", r: "json"}}, (error, response, body) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    }

}

export default OMDBCrawler;