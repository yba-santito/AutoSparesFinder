const db = require('./db-service.js');
db.getAllPartTypes().then(console.log).catch(console.error);
