const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/part-types',
  method: 'GET',
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => { console.log('STATUS:', res.statusCode); console.log('BODY:', data); });
});

req.on('error', error => { console.error(error); });
req.end();
