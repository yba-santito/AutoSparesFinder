import React, { useState, useEffect } from 'react';
import './Pages.css';

const Products = () => {
  // 1. Set up state to hold our database items
  const [spares, setSpares] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingMakes, setLoadingMakes] = useState(true);

  // Fetch makes on component mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch('/api/makes');
        if (!response.ok) throw new Error('Failed to fetch makes');
        const data = await response.json();
        setAvailableMakes(data);
        setLoadingMakes(false);
      } catch (err) {
        console.error('Error fetching makes:', err);
        setAvailableMakes([]);
        setLoadingMakes(false);
      }
    };
    fetchMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    if (!selectedMake) {
      setAvailableModels([]);
      setSelectedModel('');
      setSelectedYear('');
      setAvailableYears([]);
      return;
    }

    const fetchModels = async () => {
      try {
        const response = await fetch(`/api/models?make=${encodeURIComponent(selectedMake)}`);
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        setAvailableModels(data);
        setSelectedModel('');
        setSelectedYear('');
        setAvailableYears([]);
      } catch (err) {
        console.error('Error fetching models:', err);
        setAvailableModels([]);
      }
    };
    fetchModels();
  }, [selectedMake]);

  // Fetch years when model changes
  useEffect(() => {
    if (!selectedMake || !selectedModel) {
      setAvailableYears([]);
      setSelectedYear('');
      return;
    }

    const fetchYears = async () => {
      try {
        const response = await fetch(`/api/years?make=${encodeURIComponent(selectedMake)}&model=${encodeURIComponent(selectedModel)}`);
        if (!response.ok) throw new Error('Failed to fetch years');
        const data = await response.json();
        setAvailableYears(data);
        setSelectedYear('');
      } catch (err) {
        console.error('Error fetching years:', err);
        setAvailableYears([]);
      }
    };
    fetchYears();
  }, [selectedMake, selectedModel]);

  // 2. Fetch the data when filters change
  useEffect(() => {
    console.log('useEffect triggered - fetching parts');
    setIsLoading(true);
    let url = '/api/products';
    
    if (selectedMake && selectedModel && selectedYear) {
      url = `/api/parts?make=${encodeURIComponent(selectedMake)}&model=${encodeURIComponent(selectedModel)}&year=${selectedYear}`;
    }

    console.log('Fetching from:', url);

    fetch(url)
      .then((response) => {
        console.log('Response received:', response.status, response.ok);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch parts from the backend`);
        return response.json();
      })
      .then((data) => {
        console.log('Data received:', data);
        setSpares(data); // Save the database info to state
        setIsLoading(false); // Turn off the loading screen
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
        setIsLoading(false);
        setSpares([]);
      });
  }, [selectedMake, selectedModel, selectedYear]);

  // Handle make change
  const handleMakeChange = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
  };

  // Handle model change
  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
  };

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // 3. Render loading or error states if necessary
  if (error) return (
    <div className="page-container" style={{ color: 'red', marginTop: '40px' }}>
      <h2>⚠️ Error Loading Parts</h2>
      <p><strong>{error}</strong></p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Check the browser console (F12) for more details.
      </p>
    </div>
  );
  if (error) return <div className="page-container"><h2>Error: {error}</h2></div>;

  // 4. Render the page with filters and products
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
              onChange={handleMakeChange}
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
              {loadingMakes ? (
                <option disabled>Loading makes...</option>
              ) : (
                availableMakes.map((make) => (
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
              onChange={handleModelChange}
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
              {availableModels.map((model) => (
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
              onChange={handleYearChange}
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
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedMake && selectedModel && selectedYear && (
          <p style={{ marginTop: '15px', color: '#E35205', fontWeight: 'bold' }}>
            ✓ Showing parts for {selectedYear} {selectedMake} {selectedModel}
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <div className="page-container"><h2>Loading spares...</h2></div>}

      {/* Products Grid */}
      {!isLoading && (
        <div className="grid-container">
          {spares.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              <h2>No spare parts available.</h2>
              <p>{selectedMake && selectedModel && selectedYear ? `No parts found for ${selectedYear} ${selectedMake} ${selectedModel}` : 'Select a vehicle to see available parts'}</p>
            </div>
          ) : (
          spares.map((item, index) => (
            <article className="card" key={index}>
                <div className="card-icon" style={{ marginBottom: '1rem', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4', color: '#444' }}>
                  {item.type_name || 'Part'}
                </div>
              <h2 className="card-title">{item.engine_capacity ? `${item.engine_capacity} ` : ''}<span style={{textTransform: 'capitalize'}}>{item.fuel_type}</span></h2>
                <p>{item.type_name}</p>
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