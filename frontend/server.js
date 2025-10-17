import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, parse } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = path.join(dirname, 'src');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function isRequestUrlDirectory(url) {
  try {
    const stats = fs.statSync(path.join(PUBLIC_DIR, url));
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

const server = http.createServer((req, res) => {
  let requestUrl = req.url;

  if (requestUrl.endsWith('/') && isRequestUrlDirectory(requestUrl)) {
    const parsedUrl = parse(requestUrl);
    const pathname = parsedUrl.pathname;
    let dirName = path.basename(pathname);
    console.log({ requestUrl, parsedUrl, pathname, dirName })
    if (dirName === '') {
      dirName = 'index';
    }
    console.log(requestUrl.slice(0, -1))
    requestUrl = path.join(requestUrl, `${dirName}.html`);
  }
  console.log(req.url, requestUrl)
  let filePath = path.join(PUBLIC_DIR, requestUrl);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        // Server error
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
