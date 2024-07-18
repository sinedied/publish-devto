import path from 'node:path';
import fs from 'node:fs';
import process from 'node:process';
import ncc from '@vercel/ncc';

fs.mkdirSync('dist');

ncc(path.join(process.cwd(), 'index.js'), {
  minify: true
}).then(({ code }) => {
  const package_ = JSON.stringify({ type: 'module' }, null, 2);
  fs.writeFileSync('dist/package.json', package_);

  // Fix issue with node: protocol imports
  code = code.replaceAll('"node:', '"');
  fs.writeFileSync('dist/index.js', code);

  console.log('Done.');
});
