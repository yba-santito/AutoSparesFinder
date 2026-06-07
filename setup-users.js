const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt to hash passwords

const dbPath = path.resolve(__dirname, 'autospares.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    } else {
        console.log("Connected to the autospares database.");
    }
});

// Create Users table if it doesn't exist
const createTableSQL = `
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`;

db.run(createTableSQL, async (err) => {
    if (err) {
        console.error("Error creating Users table:", err.message);
        process.exit(1);
    }
    console.log("Users table ready.");

    try {
        const saltRounds = 10;
        // Correctly generate secure hashes for the default credentials
        const adminHash = await bcrypt.hash('admin123', saltRounds);
        const managerHash = await bcrypt.hash('manager123', saltRounds);
        const staffHash = await bcrypt.hash('staff123', saltRounds);

        // Clear out the old plain text users if any exist
        db.run("DELETE FROM Users", [], (err) => {
            if (err) console.error("Error clearing old users:", err.message);
            
            const insertUserSQL = `INSERT INTO Users (username, password, role) VALUES (?, ?, ?)`;

            // Insert admin
            db.run(insertUserSQL, ['admin', adminHash, 'Administrator']);
            // Insert manager
            db.run(insertUserSQL, ['manager', managerHash, 'Manager']);
            // Insert staff
            db.run(insertUserSQL, ['staff', staffHash, 'Staff'], (err) => {
                if (err) {
                    console.error("Error inserting users:", err.message);
                    process.exit(1);
                }
                console.log("✓ Test users created successfully with secure hashes!");
                
                // Verify credentials in DB
                db.all("SELECT user_id, username, role FROM Users", (err, rows) => {
                    if (err) {
                        console.error("Error verifying users:", err.message);
                    } else {
                        console.log("\nActive Users in database:", rows);
                    }
                    db.close();
                });
            });
        });

    } catch (hashError) {
        console.error("Encryption failed:", hashError);
        process.exit(1);
    }
});