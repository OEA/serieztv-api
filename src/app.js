import http from 'http';
http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world\n');
}).listen(3000);

console.log('Server running at 3000 port');
