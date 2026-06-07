// migrate.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'autospares.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log("Building fresh database tables...");

    // 1. MAKES TABLE
    db.run(`CREATE TABLE IF NOT EXISTS Makes (
        make_id INTEGER PRIMARY KEY AUTOINCREMENT,
        make_name TEXT NOT NULL UNIQUE
    )`);

    // 2. VEHICLES TABLE
    db.run(`CREATE TABLE IF NOT EXISTS Vehicles (
        vehicle_id INTEGER PRIMARY KEY AUTOINCREMENT,
        make_id INTEGER,
        model_name TEXT NOT NULL,
        year_start INTEGER,
        year_end INTEGER,
        FOREIGN KEY (make_id) REFERENCES Makes(make_id)
    )`);

    // 3. PART TYPES TABLE
    db.run(`CREATE TABLE IF NOT EXISTS PartTypes (
        part_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
        type_name TEXT NOT NULL UNIQUE
    )`);

    // 4. PARTS TABLE (With your updated fields)
    db.run(`CREATE TABLE IF NOT EXISTS Parts (
        part_id INTEGER PRIMARY KEY AUTOINCREMENT,
        fuel_type TEXT CHECK(fuel_type IN ('petrol', 'diesel')),
        engine_capacity TEXT,
        SKU TEXT UNIQUE,
        brand TEXT,
        price REAL,
        stock_quantity INTEGER DEFAULT 0,
        part_type_id INTEGER,
        FOREIGN KEY (part_type_id) REFERENCES PartTypes(part_type_id)
    )`);

    // 5. VEHICLE PART FITMENT (Junction Table)
    db.run(`CREATE TABLE IF NOT EXISTS VehiclePartFitment (
        vehicle_id INTEGER,
        part_id INTEGER,
        PRIMARY KEY (vehicle_id, part_id),
        FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
        FOREIGN KEY (part_id) REFERENCES Parts(part_id) ON DELETE CASCADE
    )`);

    // 6. PART LEADS TABLE
    db.run(`CREATE TABLE IF NOT EXISTS PartLeads (
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (part_type_id) REFERENCES PartTypes(part_type_id)
    )`, (err) => {
        if (err) {
            console.error("Error creating tables:", err.message);
        } else {
            console.log("✓ All database tables successfully created!");
        }
    });
});

db.close();