import http from 'http';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import { Path } from '../utils/path';
import { link } from '../utils/printstyle';

import { readFile } from '../file';

const constPort = 4242; // Your desired port
const targetDir = '/your/target/directory'; // Replace with your target directory
const localhostUrl = `http://localhost`;
const sourceDir = '/home/jake/site';

// format url
const formatUrl = ({ url, port }) => `${url}${port ? ':' + port : ''}/`;

// Start a server at the provided URL and port.
// Handle requests with the provided callback.
const createServer = ({ url, port, onRequest }) => {
  const fullUrl = formatUrl({ url, port });
  const linkText = link(fullUrl);

  console.log(`Starting server at ${linkText}`);

  const server = http.createServer(onRequest);

  server.listen(constPort, () => {
    const linkText = link();
    console.log(`Server is running at ${linkText}`);
  });
}

const fileServer = () => {
  const onRequest = (request, response) => {
    const path = Path.fromUrl(url, localhostUrl, sourceDir);
    const file = readFile(request.url);
    serveFile(response, file);
  };

  createServer({
    url: localhostUrl,
    port: constPort,
    onRequest
  })
}


// function getFilePath(uri) {
//   let filePath = path.join(targetDir, uri);
//   if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
//     filePath = path.join(filePath, 'index.html');
//   }
//   return filePath;
// }

function serveFile(response, file) {
  file.onRequest((err, data) => {
    if (err) {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Not Found');
    } else {
      const contentType = file.type;
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(data);
    }
  });
}

export {

}
