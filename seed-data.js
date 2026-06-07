const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'autospares.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    } else {
        console.log("Connected to the autospares SQLite database.");
    }
});

// Get schema and table structures
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
        console.error("Schema query failed:", err);
        process.exit(1);
    }
    
    console.log("\n=== DATABASE TABLES ===");
    console.log(JSON.stringify(tables, null, 2));
    
    // Get column info for each table
    if (tables && tables.length > 0) {
        tables.forEach(table => {
            db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
                if (!err) {
                    console.log(`\n--- ${table.name} columns ---`);
                    console.log(JSON.stringify(columns, null, 2));
                }
            });
        });
    }
    
    // Wait a bit then insert dummy data
    setTimeout(() => {
        insertDummyData();
    }, 1000);
});

function insertDummyData() {
    console.log("\n=== INSERTING DUMMY DATA ===");
    
    // 1. Insert Makes
    db.run("INSERT INTO Makes (make_name) VALUES (?)", ['Toyota'], (err) => {
        if (err) console.log("Make insert error (may already exist):", err.message);
        else console.log("✓ Make inserted: Toyota");
    });
    
    db.run("INSERT INTO Makes (make_name) VALUES (?)", ['Honda'], (err) => {
        if (err) console.log("Make insert error (may already exist):", err.message);
        else console.log("✓ Make inserted: Honda");
    });
    
    // 2. Wait then insert Vehicles
    setTimeout(() => {
        db.run("INSERT INTO Vehicles (make_id, model_name, year_start, year_end) SELECT make_id, ?, ?, ? FROM Makes WHERE make_name = ?", 
            ['Corolla', 2020, 2024, 'Toyota'], (err) => {
                if (err) console.log("Vehicle insert error:", err.message);
                else console.log("✓ Vehicle inserted: Toyota Corolla 2020-2024");
            });
        
        db.run("INSERT INTO Vehicles (make_id, model_name, year_start, year_end) SELECT make_id, ?, ?, ? FROM Makes WHERE make_name = ?",
            ['Civic', 2019, 2023, 'Honda'], (err) => {
                if (err) console.log("Vehicle insert error:", err.message);
                else console.log("✓ Vehicle inserted: Honda Civic 2019-2023");
            });
    }, 500);
    
    // 3. Wait then insert PartTypes
    setTimeout(() => {
        db.run("INSERT INTO PartTypes (type_name) VALUES (?)", ['Engine Oil'], (err) => {
            if (err) console.log("PartType insert error:", err.message);
            else console.log("✓ PartType inserted: Engine Oil");
        });
        
        db.run("INSERT INTO PartTypes (type_name) VALUES (?)", ['Air Filter'], (err) => {
            if (err) console.log("PartType insert error:", err.message);
            else console.log("✓ PartType inserted: Air Filter");
        });
        
        db.run("INSERT INTO PartTypes (type_name) VALUES (?)", ['Brake Pad'], (err) => {
            if (err) console.log("PartType insert error:", err.message);
            else console.log("✓ PartType inserted: Brake Pad");
        });
    }, 1000);
    
    // 4. Wait then insert Parts (Aligned to fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id)
    setTimeout(() => {
        db.run(
            `INSERT INTO Parts (fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id) 
             SELECT ?, ?, ?, ?, ?, ?, part_type_id FROM PartTypes WHERE type_name = ?`,
            ['petrol', '1.8L', 'OIL-001', 'Mobil', 100.00, 15, 'Engine Oil'],
            (err) => {
                if (err) console.log("Part insert error:", err.message);
                else console.log("✓ Part inserted: Mobil 1.8L Petrol Oil");
            }
        );
        
        db.run(
            `INSERT INTO Parts (fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id) 
             SELECT ?, ?, ?, ?, ?, ?, part_type_id FROM PartTypes WHERE type_name = ?`,
            ['petrol', '1.8L', 'AIR-002', 'Mann', 45.00, 20, 'Air Filter'],
            (err) => {
                if (err) console.log("Part insert error:", err.message);
                else console.log("✓ Part inserted: Mann 1.8L Petrol Air Filter");
            }
        );
        
        db.run(
            `INSERT INTO Parts (fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id) 
             SELECT ?, ?, ?, ?, ?, ?, part_type_id FROM PartTypes WHERE type_name = ?`,
            ['diesel', '2.0L', 'BRK-003', 'Brembo', 75.00, 8, 'Brake Pad'],
            (err) => {
                if (err) console.log("Part insert error:", err.message);
                else console.log("✓ Part inserted: Brembo 2.0L Diesel Brake Pads");
            }
        );
    }, 1500);
    
    // 5. Wait then insert Fitments (Uses case-sensitive p.SKU column lookup)
    setTimeout(() => {
        db.run(
            `INSERT INTO VehiclePartFitment (vehicle_id, part_id) 
             SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
             WHERE v.model_name = ? AND p.SKU = ? LIMIT 1`,
            ['Corolla', 'OIL-001'],
            (err) => {
                if (err) console.log("Fitment insert error:", err.message);
                else console.log("✓ Fitment inserted: Corolla + Mobil Oil");
            }
        );
        
        db.run(
            `INSERT INTO VehiclePartFitment (vehicle_id, part_id) 
             SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
             WHERE v.model_name = ? AND p.SKU = ? LIMIT 1`,
            ['Corolla', 'AIR-002'],
            (err) => {
                if (err) console.log("Fitment insert error:", err.message);
                else console.log("✓ Fitment inserted: Corolla + Mann Air Filter");
            }
        );
        
        db.run(
            `INSERT INTO VehiclePartFitment (vehicle_id, part_id) 
             SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
             WHERE v.model_name = ? AND p.SKU = ? LIMIT 1`,
            ['Civic', 'BRK-003'],
            (err) => {
                if (err) console.log("Fitment insert error:", err.message);
                else console.log("✓ Fitment inserted: Civic + Brembo Pads");
            }
        );
    }, 2000);
    
    // 6. Verify data structures and print records matching the exact schema configuration
    setTimeout(() => {
        console.log("\n=== VERIFICATION ===");
        db.all("SELECT COUNT(*) as count FROM Parts", [], (err, result) => {
            if (!err) console.log(`Total parts in DB: ${result[0].count}`);
        });
        
        db.all("SELECT COUNT(*) as count FROM Makes", [], (err, result) => {
            if (!err) console.log(`Total makes in DB: ${result[0].count}`);
        });
        
        db.all("SELECT COUNT(*) as count FROM Vehicles", [], (err, result) => {
            if (!err) console.log(`Total vehicles in DB: ${result[0].count}`);
        });
        
        db.all(`
            SELECT p.SKU, p.brand, p.fuel_type, p.engine_capacity, pt.type_name, p.price, p.stock_quantity
            FROM Parts p
            JOIN PartTypes pt ON p.part_type_id = pt.part_type_id
        `, [], (err, result) => {
            if (!err) {
                console.log("\n=== ALL PARTS IN FRESH DATABASE ===");
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.error("Verification output error:", err.message);
            }
            db.close();
            console.log("\n✓ Done!");
        });
    }, 2500);
}