/**
 * Created by omer on 19/02/2017.
 */

import elasticsearch from 'elasticsearch';

let client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

client.ping({
    requestTimeout: 30000,
}, (error) => {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});