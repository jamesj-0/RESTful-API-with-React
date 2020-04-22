const db = require('./connection');
const path = require('path');
const fs = require('fs');

const initPath = path.join(__dirname, 'init.sql');
const initSql = fs.readFileSync(initPath, 'utf-8');

function build() {
    return db.query(initSql);
};

if (require.main === module) build();

module.exports = build;