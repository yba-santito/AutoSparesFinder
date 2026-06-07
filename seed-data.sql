-- Insert Makes
INSERT OR IGNORE INTO Makes (make_name) VALUES ('Toyota');
INSERT OR IGNORE INTO Makes (make_name) VALUES ('Honda');
INSERT OR IGNORE INTO Makes (make_name) VALUES ('Ford');

-- Insert Vehicles
INSERT OR IGNORE INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Corolla', 2020, 2024 FROM Makes WHERE make_name = 'Toyota';

INSERT OR IGNORE INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Civic', 2019, 2023 FROM Makes WHERE make_name = 'Honda';

INSERT OR IGNORE INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Mustang', 2018, 2024 FROM Makes WHERE make_name = 'Ford';

-- Insert Part Types
INSERT OR IGNORE INTO PartTypes (type_name) VALUES ('Engine Oil');
INSERT OR IGNORE INTO PartTypes (type_name) VALUES ('Air Filter');
INSERT OR IGNORE INTO PartTypes (type_name) VALUES ('Brake Pad');
INSERT OR IGNORE INTO PartTypes (type_name) VALUES ('Spark Plug');
INSERT OR IGNORE INTO PartTypes (type_name) VALUES ('Battery');

-- Insert Parts
INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'OIL-001', 'Mobil', 'MOB-5W30', part_type_id, 100.00, 15 FROM PartTypes WHERE type_name = 'Engine Oil';

INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'OIL-002', 'Castrol', 'CAS-10W40', part_type_id, 85.00, 12 FROM PartTypes WHERE type_name = 'Engine Oil';

INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'AIR-001', 'Mann', 'MANN-C30', part_type_id, 45.00, 20 FROM PartTypes WHERE type_name = 'Air Filter';

INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'AIR-002', 'Bosch', 'BOSCH-AF22', part_type_id, 40.00, 25 FROM PartTypes WHERE type_name = 'Air Filter';

INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'BRK-001', 'Brembo', 'BRM-PADS', part_type_id, 75.00, 8 FROM PartTypes WHERE type_name = 'Brake Pad';

INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'BRK-002', 'TRW', 'TRW-BP30', part_type_id, 60.00, 10 FROM PartTypes WHERE type_name = 'Brake Pad';

INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'SPK-001', 'NGK', 'NGK-IFR8', part_type_id, 8.00, 50 FROM PartTypes WHERE type_name = 'Spark Plug';

INSERT OR IGNORE INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity) 
SELECT 'BAT-001', 'Bosch', 'BOSCH-S4', part_type_id, 95.00, 6 FROM PartTypes WHERE type_name = 'Battery';

-- Insert Vehicle Part Fitments
INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'OIL-001' LIMIT 1;

INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'AIR-001' LIMIT 1;

INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'BRK-001' LIMIT 1;

INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Civic' AND p.sku = 'OIL-002' LIMIT 1;

INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Civic' AND p.sku = 'AIR-002' LIMIT 1;

INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Civic' AND p.sku = 'BRK-002' LIMIT 1;

INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Mustang' AND p.sku = 'SPK-001' LIMIT 1;

INSERT OR IGNORE INTO VehiclePartFitment (vehicle_id, part_id) 
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Mustang' AND p.sku = 'BAT-001' LIMIT 1;
