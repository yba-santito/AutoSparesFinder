const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// 1. Connect to your SQLite database file (with write access)
const dbPath = path.resolve(__dirname, 'autospares.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to the autospares SQLite database.");
    }
});

// 2. Create the function that searches for parts
function getPartsForVehicle(makeName, modelName, year) {
    return new Promise((resolve, reject) => {
        // We use '?' placeholders for security (Parameterized Queries)
        const sql = `
            SELECT 
                p.fuel_type,
                p.engine_capacity,
                pt.type_name,
                p.price,
                p.stock_quantity
            FROM Parts p
            JOIN PartTypes pt ON p.part_type_id = pt.part_type_id
            JOIN VehiclePartFitment vpf ON p.part_id = vpf.part_id
            JOIN Vehicles v ON vpf.vehicle_id = v.vehicle_id
            JOIN Makes m ON v.make_id = m.make_id
            WHERE m.make_name = ? 
              AND v.model_name = ? 
              AND CAST(? AS INTEGER) BETWEEN v.year_start AND COALESCE(v.year_end, CAST(strftime('%Y', 'now') AS INTEGER))
        `;

        // Run the query, passing the make, model, and year into the '?' placeholders
        db.all(sql, [makeName, modelName, year], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getAllParts() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                p.fuel_type,
                p.engine_capacity,
                pt.type_name,
                p.price,
                p.stock_quantity
            FROM Parts p
            JOIN PartTypes pt ON p.part_type_id = pt.part_type_id
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
function getPartLeadsWithAvailability() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                pl.*, 
                pt.type_name,
                p.part_id AS inventory_part_id,
                p.stock_quantity AS current_inventory_stock
            FROM PartLeads pl
            LEFT JOIN PartTypes pt ON pl.part_type_id = pt.part_type_id
            LEFT JOIN Parts p ON (
                 pl.fuel_type IS NOT NULL 
                 AND pl.engine_capacity IS NOT NULL 
                 AND LOWER(p.fuel_type) = LOWER(pl.fuel_type) 
                 AND LOWER(p.engine_capacity) = LOWER(pl.engine_capacity)
            )
            ORDER BY pl.created_at DESC
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}
// Business Portal Functions

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        // Query by username only, and select the password column
        const sql = `SELECT user_id, username, password, role FROM Users WHERE username = ? LIMIT 1`;
        
        db.get(sql, [username], async (err, row) => {
            if (err) {
                return reject(err);
            }
            
            // If no user is found, return null
            if (!row) {
                return resolve(null);
            }

            try {
                // Compare plain text password with the database hash
                const isMatch = await bcrypt.compare(password, row.password);
                
                if (isMatch) {
                    // Password is correct; remove hash from the object before returning
                    const { password: userPassword, ...userWithoutHash } = row;
                    resolve(userWithoutHash);
                } else {
                    // Password mismatch
                    resolve(null);
                }
            } catch (bcryptErr) {
                reject(bcryptErr);
            }
        });
    });
}

function addPart(fuel_type, engine_capacity, part_type_id, price, stock_quantity) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO Parts (fuel_type, engine_capacity, part_type_id, price, stock_quantity) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [fuel_type, engine_capacity, part_type_id, price, stock_quantity], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function updatePart(partId, fuel_type, engine_capacity, part_type_id, price, stock_quantity) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE Parts SET fuel_type = ?, engine_capacity = ?, part_type_id = ?, price = ?, stock_quantity = ? WHERE part_id = ?`;
        db.run(sql, [fuel_type, engine_capacity, part_type_id, price, stock_quantity, partId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes > 0);
            }
        });
    });
}

function searchParts(query) {
    return new Promise((resolve, reject) => {
        const searchQuery = `%${query}%`;
        const sql = `
            SELECT 
                p.part_id,
                p.fuel_type,
                p.engine_capacity,
                p.part_type_id,
                pt.type_name,
                p.price,
                p.stock_quantity,
                (SELECT GROUP_CONCAT(vehicle_id) FROM VehiclePartFitment WHERE part_id = p.part_id) as vehicle_ids_str
            FROM Parts p
            JOIN PartTypes pt ON p.part_type_id = pt.part_type_id
            WHERE p.fuel_type LIKE ? OR p.engine_capacity LIKE ?
            LIMIT 50
        `;
        db.all(sql, [searchQuery, searchQuery], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const results = rows.map(row => {
                    const { vehicle_ids_str, ...rest } = row;
                    return {
                        ...rest,
                        vehicle_ids: vehicle_ids_str ? vehicle_ids_str.split(',').map(Number) : []
                    };
                });
                resolve(results || []);
            }
        });
    });
}

function getAllPartTypes() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT part_type_id, type_name FROM PartTypes ORDER BY type_name`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

function getAllMakes() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT DISTINCT make_id, make_name FROM Makes ORDER BY make_name`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

function getModelsByMake(makeName) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT v.model_name 
            FROM Vehicles v
            JOIN Makes m ON v.make_id = m.make_id
            WHERE m.make_name = ?
            ORDER BY v.model_name
        `;
        db.all(sql, [makeName], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => row.model_name) || []);
            }
        });
    });
}

function getYearsByMakeAndModel(makeName, modelName) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT 
                CAST(v.year_start AS INTEGER) as year
            FROM Vehicles v
            JOIN Makes m ON v.make_id = m.make_id
            WHERE m.make_name = ? AND v.model_name = ?
            ORDER BY year DESC
        `;
        db.all(sql, [makeName, modelName], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => row.year) || []);
            }
        });
    });
}

function getAllVehicles() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT v.vehicle_id, m.make_name, v.model_name, v.year_start, v.year_end
            FROM Vehicles v
            JOIN Makes m ON v.make_id = m.make_id
            ORDER BY m.make_name, v.model_name
        `;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

function addPartFitment(partId, vehicleId) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO VehiclePartFitment (vehicle_id, part_id) VALUES (?, ?)`;
        db.run(sql, [vehicleId, partId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

function updatePartFitments(partId, vehicleIds) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM VehiclePartFitment WHERE part_id = ?`, [partId], function(err) {
            if (err) return reject(err);
            
            if (!vehicleIds || vehicleIds.length === 0) {
                return resolve(true);
            }

            let inserted = 0;
            let hasError = false;
            
            vehicleIds.forEach(vid => {
                db.run(`INSERT INTO VehiclePartFitment (vehicle_id, part_id) VALUES (?, ?)`, [vid, partId], function(err2) {
                    if (hasError) return;
                    if (err2) {
                        hasError = true;
                        reject(err2);
                    } else {
                        inserted++;
                        if (inserted === vehicleIds.length) {
                            resolve(true);
                        }
                    }
                });
            });
        });
    });
}
function addPartLead(name, email, phone, message, part_type_id, fuel_type, engine_capacity) {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO PartLeads (name, email, phone, message, part_type_id, fuel_type, engine_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [name, email, phone, message, part_type_id, fuel_type, engine_capacity], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
}

function updateLeadStatus(leadId, status) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE PartLeads SET status = ? WHERE lead_id = ?`;
        db.run(sql, [status, leadId], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}
function getPartLeads() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT pl.*, pt.type_name 
            FROM PartLeads pl
            LEFT JOIN PartTypes pt ON pl.part_type_id = pt.part_type_id
            ORDER BY pl.created_at DESC
        `;
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// 3. Export the functions so server.js can use them
module.exports = {
    getPartsForVehicle,
    getAllParts,
    loginUser,
    addPart,
    updatePart,
    searchParts,
    getAllPartTypes,
    getAllMakes,
    getModelsByMake,
    getPartLeadsWithAvailability,
    getYearsByMakeAndModel,
    getAllVehicles,
    addPartFitment,
    updatePartFitments,
    addPartLead,
    getPartLeads,
    updateLeadStatus,
};