#!/bin/bash
source ~/.bashrc
node -e "const db = require('./db-service.js'); db.loginUser('admin', 'admin123').then(console.log).catch(console.error);"
