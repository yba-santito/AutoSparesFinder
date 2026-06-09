import React, { useState, useEffect, useMemo } from 'react';
import './Pages.css';

const Products = () => {
  const [vehicles, setVehicles] = useState([]);
  const [spares, setSpares] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all vehicles once on mount - derive makes, models, years from them
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const data = await response.json();
        setVehicles(data);
        setIsLoadingVehicles(false);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setVehicles([]);
        setIsLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  // Derive unique makes, models, years from the vehicles array
  const uniqueMakes = useMemo(() => {
    const seen = new Set();
    return vehicles
      .map(v => ({ make_id: v.make_id, make_name: v.make_name }))
      .filter(m => {
        if (seen.has(m.make_name)) return false;
        seen.add(m.make_name);
        return true;
      })
      .sort((a, b) => a.make_name.localeCompare(b.make_name));
  }, [vehicles]);

  const modelsForMake = useMemo(() => {
    if (!selectedMake) return [];
    const seen = new Set();
    return vehicles
      .filter(v => v.make_name === selectedMake)
      .map(v => v.model_name)
      .filter(m => {
        if (seen.has(m)) return false;
        seen.add(m);
        return true;
      })
      .sort();
  }, [vehicles, selectedMake]);

  const yearsForModel = useMemo(() => {
    if (!selectedMake || !selectedModel) return [];
    const years = new Set();
    vehicles
      .filter(v => v.make_name === selectedMake && v.model_name === selectedModel)
      .forEach(v => {
        const start = parseInt(v.year_start, 10);
        const end = parseInt(v.year_end, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let y = start; y <= end; y++) years.add(y);
        }
      });
    return Array.from(years).sort((a, b) => a - b);
  }, [vehicles, selectedMake, selectedModel]);

  // Reset downstream selections when make/model changes
  useEffect(() => {
    setSelectedModel('');
    setSelectedYear('');
  }, [selectedMake]);

  useEffect(() => {
    setSelectedYear('');
  }, [selectedModel]);

  // Fetch parts when all three filters are selected
  useEffect(() => {
    if (!selectedMake || !selectedModel || !selectedYear) {
      setSpares([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const url = `/api/search-parts?make=${encodeURIComponent(selectedMake)}&model=${encodeURIComponent(selectedModel)}&year=${selectedYear}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch parts`);
        return response.json();
      })
      .then((data) => {
        setSpares(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
        setIsLoading(false);
        setSpares([]);
      });
  }, [selectedMake, selectedModel, selectedYear]);

  if (error) return (
    <div className="page-container" style={{ color: 'red', marginTop: '40px' }}>
      <h2>Error Loading Parts</h2>
      <p><strong>{error}</strong></p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Check the browser console (F12) for more details.
      </p>
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Auto Spares</h1>
      <p className="page-subtitle">Find high-quality replacement parts for your vehicle.</p>

      {/* Filter Section */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ marginTop: 0, color: '#333' }}>Filter by Vehicle</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>

          {/* Make Dropdown */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Vehicle Make
            </label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Select Make --</option>
              {isLoadingVehicles ? (
                <option disabled>Loading makes...</option>
              ) : (
                uniqueMakes.map((make) => (
                  <option key={make.make_id} value={make.make_name}>{make.make_name}</option>
                ))
              )}
            </select>
          </div>

          {/* Model Dropdown */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Vehicle Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                cursor: selectedMake ? 'pointer' : 'not-allowed',
                opacity: selectedMake ? 1 : 0.6
              }}
            >
              <option value="">-- Select Model --</option>
              {modelsForMake.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Vehicle Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedModel}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                cursor: selectedModel ? 'pointer' : 'not-allowed',
                opacity: selectedModel ? 1 : 0.6
              }}
            >
              <option value="">-- Select Year --</option>
              {yearsForModel.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedMake && selectedModel && selectedYear && (
          <p style={{ marginTop: '15px', color: '#E35205', fontWeight: 'bold' }}>
            Showing parts for {selectedYear} {selectedMake} {selectedModel}
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Loading spares...</h2>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid-container">
          {!selectedMake || !selectedModel || !selectedYear ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              <h2>Select a vehicle to see available parts</h2>
              <p>Choose make, model, and year from the filters above.</p>
            </div>
          ) : spares.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              <h2>No spare parts available</h2>
              <p>No parts found for {selectedYear} {selectedMake} {selectedModel}.</p>
            </div>
          ) : (
            spares.map((item, index) => (
              <article className="card" key={index}>
                <div className="card-icon" style={{ marginBottom: '1rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4', color: '#444' }}>
                  {item.type_name || item.part_type_name || 'Part'}
                </div>
                <h2 className="card-title">
                  {item.engine_capacity ? `${item.engine_capacity} ` : ''}
                  <span style={{ textTransform: 'capitalize' }}>{item.fuel_type}</span>
                </h2>
                <p>{item.type_name || item.part_type_name}</p>
                <p style={{ color: 'var(--action-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  ${item.price?.toFixed?.(2) ?? item.price}
                </p>
                <p>{item.stock_quantity > 0 ? `In stock: ${item.stock_quantity}` : 'Out of stock'}</p>
                <div className="card-actions">
                  <button
                    className="btn-action"
                    disabled={item.stock_quantity <= 0}
                    style={{ opacity: item.stock_quantity > 0 ? 1 : 0.5 }}
                  >
                    {item.stock_quantity > 0 ? 'Quick View' : 'Out of Stock'}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
