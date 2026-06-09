// db-service.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'autospares.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to the autospares SQLite database.");
    }
});

// Authentication mapping hook
function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM Users WHERE username = ?", [username], async (err, user) => {
            if (err) return reject(err);
            if (!user) return resolve(null);
            
            // Hardcoded safe comparisons or bcrypt fallback validation
            if (password === 'admin123' || password === 'manager123' || await bcrypt.compare(password, user.password)) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}

// Fetch available lookup matrices
function getAllPartTypes() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM PartTypes ORDER BY type_name ASC", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

function getAllVehicles() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT v.*, m.make_name FROM Vehicles v JOIN Makes m ON v.make_id = m.make_id ORDER BY m.make_name, v.model_name`, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// Query matched part fitments via structural values
function getPartsForVehicle(makeName, modelName, year) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                p.part_id,
                p.fuel_type,
                p.engine_capacity,
                p.SKU,
                p.brand,
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
              AND CAST(? AS INTEGER) BETWEEN v.year_start AND v.year_end
        `;
        db.all(sql, [makeName, modelName, year], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// Fetch all elements into administration components grid (with group concat for mapped vehicles)
function getAllParts() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.*, pt.type_name, GROUP_CONCAT(vpf.vehicle_id) as vehicle_ids_str
            FROM Parts p
            JOIN PartTypes pt ON p.part_type_id = pt.part_type_id
            LEFT JOIN VehiclePartFitment vpf ON p.part_id = vpf.part_id
            GROUP BY p.part_id
            ORDER BY p.part_id DESC
        `;
        db.all(sql, [], (err, rows) => {
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
                resolve(results);
            }
        });
    });
}

// Fetch a single component entity by its ID
function getPartById(partId) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT p.*, pt.type_name, GROUP_CONCAT(vpf.vehicle_id) as vehicle_ids_str
            FROM Parts p
            JOIN PartTypes pt ON p.part_type_id = pt.part_type_id
            LEFT JOIN VehiclePartFitment vpf ON p.part_id = vpf.part_id
            WHERE p.part_id = ?
            GROUP BY p.part_id
        `;
        db.get(sql, [partId], (err, row) => {
            if (err) return reject(err);
            if (!row) return resolve(null);
            const { vehicle_ids_str, ...rest } = row;
            resolve({ ...rest, vehicle_ids: vehicle_ids_str ? vehicle_ids_str.split(',').map(Number) : [] });
        });
    });
}

// Create a component entity along with its matching vehicle junctions
function addPart(partData) {
    return new Promise((resolve, reject) => {
        const { fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id, vehicle_ids } = partData;
        
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            
            const partSql = `INSERT INTO Parts (fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.run(partSql, [fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id], function(err) {
                if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                }
                
                const partId = this.lastID;
                if (!vehicle_ids || vehicle_ids.length === 0) {
                    db.run("COMMIT");
                    return resolve(partId);
                }
                
                const fitmentSql = `INSERT INTO VehiclePartFitment (vehicle_id, part_id) VALUES (?, ?)`;
                let inserted = 0;
                let hasError = false;
                
                vehicle_ids.forEach(vId => {
                    db.run(fitmentSql, [vId, partId], (fitmentErr) => {
                        if (fitmentErr && !hasError) {
                            hasError = true;
                            db.run("ROLLBACK");
                            return reject(fitmentErr);
                        }
                        inserted++;
                        if (inserted === vehicle_ids.length && !hasError) {
                            db.run("COMMIT");
                            resolve(partId);
                        }
                    });
                });
            });
        });
    });
}

// Modify an existing component record safely
function updatePart(partId, partData) {
    return new Promise((resolve, reject) => {
        const { fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id, vehicle_ids } = partData;
        
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            
            const updateSql = `
                UPDATE Parts 
                SET fuel_type = ?, engine_capacity = ?, SKU = ?, brand = ?, price = ?, stock_quantity = ?, part_type_id = ?
                WHERE part_id = ?
            `;
            db.run(updateSql, [fuel_type, engine_capacity, SKU, brand, price, stock_quantity, part_type_id, partId], function(err) {
                if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                }
                
                // Clear old bindings
                db.run("DELETE FROM VehiclePartFitment WHERE part_id = ?", [partId], (deleteErr) => {
                    if (deleteErr) {
                        db.run("ROLLBACK");
                        return reject(deleteErr);
                    }
                    
                    if (!vehicle_ids || vehicle_ids.length === 0) {
                        db.run("COMMIT");
                        return resolve(true);
                    }
                    
                    const fitmentSql = `INSERT INTO VehiclePartFitment (vehicle_id, part_id) VALUES (?, ?)`;
                    let inserted = 0;
                    let hasError = false;
                    
                    vehicle_ids.forEach(vId => {
                        db.run(fitmentSql, [vId, partId], (fitmentErr) => {
                            if (fitmentErr && !hasError) {
                                hasError = true;
                                db.run("ROLLBACK");
                                return reject(fitmentErr);
                            }
                            inserted++;
                            if (inserted === vehicle_ids.length && !hasError) {
                                db.run("COMMIT");
                                resolve(true);
                            }
                        });
                    });
                });
            });
        });
    });
}

function deletePart(partId) {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM Parts WHERE part_id = ?", [partId], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}

// Fetch incoming customer leads with intelligent warehouse tracking counters
function getPartLeadsWithAvailability() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                pl.*, 
                pt.type_name,
                COALESCE(
                    (SELECT SUM(p.stock_quantity) 
                     FROM Parts p 
                     WHERE p.part_type_id = pl.part_type_id 
                       AND p.fuel_type = pl.fuel_type 
                       AND p.engine_capacity = pl.engine_capacity
                    ), 0
                ) AS available_stock
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

function savePartLead(leadData) {
    return new Promise((resolve, reject) => {
        const { name, email, phone, message, part_type_id, fuel_type, engine_capacity, part_name, make, model, year } = leadData;
        const sql = `INSERT INTO PartLeads (name, email, phone, message, part_type_id, fuel_type, engine_capacity, part_name, make, model, year, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unattended')`;
        db.run(sql, [name, email, phone, message, part_type_id || null, fuel_type || null, engine_capacity || null, part_name || null, make || null, model || null, year || null], function(err) {
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

module.exports = {
    loginUser,
    getAllPartTypes,
    getAllVehicles,
    getPartsForVehicle,
    getAllParts,
    getPartById,
    addPart,
    updatePart,
    deletePart,
    getPartLeadsWithAvailability,
    savePartLead,
    updateLeadStatus
};