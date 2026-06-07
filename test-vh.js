const db = require('./db-service.js');
db.getAllVehicles().then(console.log).catch(console.error);
