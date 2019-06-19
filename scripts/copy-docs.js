const fs = require('fs');
const fsPromises = fs.promises;

fsPromises.copyFile('./api-metadata/index.md', './docs/index.md')
  .then(() => console.log('Documentation index file was copied to destination'))
  .catch(() => console.log('Documentation index file could not be copied'));
