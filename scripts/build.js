import path from 'node:path';
import fs from 'node:fs';
import process from 'node:process';
import ncc from '@vercel/ncc';

fs.mkdirSync('dist');

ncc(path.join(process.cwd(), 'index.js'), {
  minify: true
}).then(({ code }) => {
  const pkg = JSON.stringify({ type: 'module' }, null, 2);
  fs.writeFileSync('dist/package.json', pkg);

  // Fix issue with node: protocol imports
  code = code.replace(/"node:/g, '"');
  fs.writeFileSync('dist/index.js', code);

  console.log('Done.');
});
