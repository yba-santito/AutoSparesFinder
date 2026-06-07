-- Clear existing data (respecting foreign key constraints)
DELETE FROM VehiclePartFitment;
DELETE FROM Parts;
DELETE FROM PartTypes;
DELETE FROM Vehicles;
DELETE FROM Makes;

-- =============================================
-- INSERTS MAKES
-- =============================================
INSERT INTO Makes (make_name) VALUES ('Toyota');
INSERT INTO Makes (make_name) VALUES ('Honda');
INSERT INTO Makes (make_name) VALUES ('Ford');
INSERT INTO Makes (make_name) VALUES ('BMW');
INSERT INTO Makes (make_name) VALUES ('Mercedes');

-- =============================================
-- INSERTS VEHICLES (linked to Makes)
-- =============================================
-- Toyota vehicles
INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Corolla', 2020, 2024 FROM Makes WHERE make_name = 'Toyota';

INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Camry', 2019, 2024 FROM Makes WHERE make_name = 'Toyota';

INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'RAV4', 2018, 2024 FROM Makes WHERE make_name = 'Toyota';

-- Honda vehicles
INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Civic', 2019, 2024 FROM Makes WHERE make_name = 'Honda';

INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Accord', 2018, 2024 FROM Makes WHERE make_name = 'Honda';

INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'CR-V', 2017, 2024 FROM Makes WHERE make_name = 'Honda';

-- Ford vehicles
INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'Mustang', 2018, 2024 FROM Makes WHERE make_name = 'Ford';

INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'F-150', 2016, 2024 FROM Makes WHERE make_name = 'Ford';

-- BMW vehicles
INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, '3 Series', 2019, 2024 FROM Makes WHERE make_name = 'BMW';

-- Mercedes vehicles
INSERT INTO Vehicles (make_id, model_name, year_start, year_end) 
SELECT make_id, 'C-Class', 2020, 2024 FROM Makes WHERE make_name = 'Mercedes';

-- =============================================
-- INSERTS PART TYPES
-- =============================================
INSERT INTO PartTypes (type_name) VALUES ('Engine Oil');
INSERT INTO PartTypes (type_name) VALUES ('Air Filter');
INSERT INTO PartTypes (type_name) VALUES ('Brake Pad');
INSERT INTO PartTypes (type_name) VALUES ('Spark Plug');
INSERT INTO PartTypes (type_name) VALUES ('Battery');
INSERT INTO PartTypes (type_name) VALUES ('Transmission Fluid');
INSERT INTO PartTypes (type_name) VALUES ('Coolant');
INSERT INTO PartTypes (type_name) VALUES ('Windshield Wiper');
INSERT INTO PartTypes (type_name) VALUES ('Brake Fluid');
INSERT INTO PartTypes (type_name) VALUES ('Fuel Filter');

-- =============================================
-- INSERTS PARTS (linked to PartTypes)
-- =============================================
-- Engine Oils
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'ENG-OIL-001', 'Mobil', 'MOB-5W30', part_type_id, 100.00, 25 FROM PartTypes WHERE type_name = 'Engine Oil';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'ENG-OIL-002', 'Castrol', 'CAS-10W40', part_type_id, 85.00, 18 FROM PartTypes WHERE type_name = 'Engine Oil';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'ENG-OIL-003', 'Shell', 'SHELL-0W40', part_type_id, 95.00, 22 FROM PartTypes WHERE type_name = 'Engine Oil';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'ENG-OIL-004', 'Valvoline', 'VAL-5W50', part_type_id, 105.00, 15 FROM PartTypes WHERE type_name = 'Engine Oil';

-- Air Filters
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'AIR-FILT-001', 'Mann', 'MANN-C30', part_type_id, 45.00, 30 FROM PartTypes WHERE type_name = 'Air Filter';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'AIR-FILT-002', 'Bosch', 'BOSCH-AF22', part_type_id, 40.00, 35 FROM PartTypes WHERE type_name = 'Air Filter';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'AIR-FILT-003', 'Fram', 'FRAM-CA10', part_type_id, 30.00, 40 FROM PartTypes WHERE type_name = 'Air Filter';

-- Brake Pads
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'BRK-PAD-001', 'Brembo', 'BRM-PADS-F', part_type_id, 75.00, 12 FROM PartTypes WHERE type_name = 'Brake Pad';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'BRK-PAD-002', 'TRW', 'TRW-BP30', part_type_id, 60.00, 16 FROM PartTypes WHERE type_name = 'Brake Pad';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'BRK-PAD-003', 'ATE', 'ATE-BP25', part_type_id, 65.00, 14 FROM PartTypes WHERE type_name = 'Brake Pad';

-- Spark Plugs
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'SPK-PLUG-001', 'NGK', 'NGK-IFR8', part_type_id, 8.50, 100 FROM PartTypes WHERE type_name = 'Spark Plug';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'SPK-PLUG-002', 'Denso', 'DEN-K16', part_type_id, 7.50, 120 FROM PartTypes WHERE type_name = 'Spark Plug';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'SPK-PLUG-003', 'Champion', 'CHP-RN9', part_type_id, 6.00, 150 FROM PartTypes WHERE type_name = 'Spark Plug';

-- Batteries
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'BAT-001', 'Bosch', 'BOSCH-S4', part_type_id, 95.00, 8 FROM PartTypes WHERE type_name = 'Battery';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'BAT-002', 'Optima', 'OPT-YELLOW', part_type_id, 180.00, 5 FROM PartTypes WHERE type_name = 'Battery';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'BAT-003', 'Exell', 'EXELL-STD', part_type_id, 70.00, 12 FROM PartTypes WHERE type_name = 'Battery';

-- Transmission Fluid
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'TRANS-FLUID-001', 'Mobil', 'MOB-ATF', part_type_id, 45.00, 20 FROM PartTypes WHERE type_name = 'Transmission Fluid';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'TRANS-FLUID-002', 'Castrol', 'CAS-DEXIII', part_type_id, 50.00, 18 FROM PartTypes WHERE type_name = 'Transmission Fluid';

-- Coolant
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'COOL-001', 'Prestone', 'PRES-GREEN', part_type_id, 25.00, 30 FROM PartTypes WHERE type_name = 'Coolant';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'COOL-002', 'Zerex', 'ZER-OAT', part_type_id, 28.00, 25 FROM PartTypes WHERE type_name = 'Coolant';

-- Windshield Wipers
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'WIPER-001', 'Bosch', 'BOSCH-ICON', part_type_id, 35.00, 40 FROM PartTypes WHERE type_name = 'Windshield Wiper';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'WIPER-002', 'Michelin', 'MICH-BLADE', part_type_id, 30.00, 45 FROM PartTypes WHERE type_name = 'Windshield Wiper';

-- Brake Fluid
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'BRK-FLUID-001', 'Bosch', 'BOSCH-DOT4', part_type_id, 15.00, 50 FROM PartTypes WHERE type_name = 'Brake Fluid';

-- Fuel Filter
INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'FUEL-FILT-001', 'Fram', 'FRAM-FF31', part_type_id, 20.00, 35 FROM PartTypes WHERE type_name = 'Fuel Filter';

INSERT INTO Parts (sku, brand, part_number, part_type_id, price, stock_quantity)
SELECT 'FUEL-FILT-002', 'Bosch', 'BOSCH-FF', part_type_id, 22.00, 30 FROM PartTypes WHERE type_name = 'Fuel Filter';

-- =============================================
-- INSERTS VEHICLE-PART FITMENTS
-- =============================================
-- Toyota Corolla parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'ENG-OIL-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'AIR-FILT-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'BRK-PAD-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'SPK-PLUG-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'BAT-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Corolla' AND p.sku = 'WIPER-001' LIMIT 1;

-- Toyota Camry parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Camry' AND p.sku = 'ENG-OIL-002' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Camry' AND p.sku = 'AIR-FILT-002' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Camry' AND p.sku = 'BRK-PAD-002' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Camry' AND p.sku = 'BAT-002' LIMIT 1;

-- Toyota RAV4 parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'RAV4' AND p.sku = 'ENG-OIL-003' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'RAV4' AND p.sku = 'AIR-FILT-003' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'RAV4' AND p.sku = 'COOL-001' LIMIT 1;

-- Honda Civic parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Civic' AND p.sku = 'ENG-OIL-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Civic' AND p.sku = 'AIR-FILT-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Civic' AND p.sku = 'BRK-PAD-003' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Civic' AND p.sku = 'SPK-PLUG-002' LIMIT 1;

-- Honda Accord parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Accord' AND p.sku = 'ENG-OIL-002' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Accord' AND p.sku = 'AIR-FILT-002' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Accord' AND p.sku = 'TRANS-FLUID-001' LIMIT 1;

-- Honda CR-V parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'CR-V' AND p.sku = 'ENG-OIL-003' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'CR-V' AND p.sku = 'COOL-002' LIMIT 1;

-- Ford Mustang parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Mustang' AND p.sku = 'ENG-OIL-004' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Mustang' AND p.sku = 'SPK-PLUG-003' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'Mustang' AND p.sku = 'BAT-003' LIMIT 1;

-- Ford F-150 parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'F-150' AND p.sku = 'ENG-OIL-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'F-150' AND p.sku = 'AIR-FILT-001' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'F-150' AND p.sku = 'FUEL-FILT-001' LIMIT 1;

-- BMW 3 Series parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = '3 Series' AND p.sku = 'ENG-OIL-002' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = '3 Series' AND p.sku = 'AIR-FILT-002' LIMIT 1;

-- Mercedes C-Class parts
INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'C-Class' AND p.sku = 'ENG-OIL-003' LIMIT 1;

INSERT INTO VehiclePartFitment (vehicle_id, part_id)
SELECT v.vehicle_id, p.part_id FROM Vehicles v, Parts p 
WHERE v.model_name = 'C-Class' AND p.sku = 'BRK-FLUID-001' LIMIT 1;

-- =============================================
-- VERIFICATION
-- =============================================
.mode column
.headers on
SELECT COUNT(*) as total_makes FROM Makes;
SELECT COUNT(*) as total_vehicles FROM Vehicles;
SELECT COUNT(*) as total_part_types FROM PartTypes;
SELECT COUNT(*) as total_parts FROM Parts;
SELECT COUNT(*) as total_fitments FROM VehiclePartFitment;

SELECT 'All data inserted successfully!' as status;
