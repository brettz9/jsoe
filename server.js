import http from 'http';
import statik from '@brettz9/node-static';

const port = process.argv[2];

const instrumented = process.argv[3];

const fileServer = new statik.Server();

http.createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response, function (e, res) {
      if (e && (e.status === 404)) { // If the file wasn't found
        fileServer.serveFile(
          instrumented === 'instrumented'
            ? '/instrumented/index.html'
            : '/index.html',
          200, {}, request, response
        );
      }
    });
  }).resume();
}).listen(port);

console.log(`Listening on port ${port}`);
