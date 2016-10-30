import http from 'http';
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world\n');
}).listen(3000);


mongoose.connect('mongodb://localhost:27017/seriez', (err, db) => {
    if (err) {
        console.log("Couldn't connect to the databese");
    } else {
        console.log("Connected to the database");

    }
});

console.log('Server running at 3000 port');
