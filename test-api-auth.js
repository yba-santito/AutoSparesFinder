require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';
const token = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/part-types',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => { console.log('STATUS:', res.statusCode); console.log('BODY:', data.substring(0, 100)); });
});

req.on('error', error => { console.error(error); });
req.end();
