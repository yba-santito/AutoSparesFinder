// patch-db.js
const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'autospares.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    const sql = `
        PRAGMA foreign_keys=off;
        BEGIN TRANSACTION;

        -- ==========================================================
        -- PHASE 1: MIGRATE / UPDATE PARTLEADS TABLE
        -- ==========================================================

        -- SAFEGUARD: Ensure a baseline PartLeads table exists so the SELECT doesn't fail.
        CREATE TABLE IF NOT EXISTS PartLeads (
            lead_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            message TEXT,
            fuel_type TEXT,
            engine_capacity TEXT,
            part_type_id INTEGER,
            status TEXT DEFAULT 'unattended',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Create the new target schema for PartLeads
        CREATE TABLE IF NOT EXISTS PartLeads_new (
            lead_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            phone TEXT,
            message TEXT,
            fuel_type TEXT CHECK(fuel_type IN ('petrol', 'diesel')),
            engine_capacity TEXT,
            part_type_id INTEGER,
            part_name TEXT,
            status TEXT DEFAULT 'unattended',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Safely copy records across
        INSERT INTO PartLeads_new (lead_id, name, email, phone, message, fuel_type, engine_capacity, part_type_id, status, created_at)
        SELECT lead_id, name, email, phone, message, fuel_type, engine_capacity, part_type_id, status, created_at FROM PartLeads;

        -- Swap tables
        DROP TABLE PartLeads;
        ALTER TABLE PartLeads_new RENAME TO PartLeads;


        -- ==========================================================
        -- PHASE 2: MIGRATE / CREATE PARTS TABLE
        -- ==========================================================

        -- SAFEGUARD: Since migrate.js only creates PartLeads, a fresh DB won't have 'Parts'.
        -- We create a temporary base table here so the SELECT query below has something to read from.
        CREATE TABLE IF NOT EXISTS Parts (
            part_id INTEGER PRIMARY KEY AUTOINCREMENT,
            part_type_id INTEGER,
            price REAL,
            stock_quantity INTEGER
        );

        -- Create the new target schema for Parts containing expanded details
        CREATE TABLE IF NOT EXISTS Parts_new (
            part_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fuel_type TEXT CHECK(fuel_type IN ('petrol', 'diesel')),
            engine_capacity TEXT,
            part_type_id INTEGER,
            SKU TEXT,
            brand TEXT,
            price REAL,
            stock_quantity INTEGER
        );

        -- Copy over base attributes from the original table layout
        INSERT INTO Parts_new (part_id, part_type_id, price, stock_quantity)
        SELECT part_id, part_type_id, price, stock_quantity FROM Parts;

        -- Swap tables
        DROP TABLE Parts;
        ALTER TABLE Parts_new RENAME TO Parts;

        COMMIT;
        PRAGMA foreign_keys=on;
    `;

    db.exec(sql, (err) => {
        if (err) {
            console.error("Error migrating tables:", err.message);
        } else {
            console.log("Database patch completed successfully!");
        }
        db.close();
    });
});