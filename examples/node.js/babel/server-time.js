import https from 'https';
import { parallelLimit } from '../../../lib/';

const sites = {
  Google: 'www.google.com',
  Bing: 'www.bing.com',
  Yahoo: 'www.yahoo.com',
  DuckDuckGo: 'www.duckduckgo.com'
};

const funcs = Object.keys(sites).map(s =>
  () => new Promise(
    (resolve, reject) => {
      const req = https.request(
        {
          hostname: sites[s],
          port: 443,
          path: '/',
          method: 'HEAD'
        },
        response => resolve({ [s]: response.headers['date'] })
      );

      req.on('error', reject);
      req.end();
    }
  )
);

parallelLimit(funcs, 2)
.then(console.log)
.catch(console.error);
