// AdminPortal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const AdminPortal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const API_BASE_URL = '';

  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  }), []);

  const [parts, setParts] = useState([]);
  const [partTypes, setPartTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formMode, setFormMode] = useState('add'); 
  const [formData, setFormData] = useState({
    part_id: '',
    fuel_type: 'petrol',
    engine_capacity: '',
    SKU: '',
    brand: '',
    part_type_id: '',
    price: '',
    stock_quantity: '',
    vehicle_ids: [],
  });

  const fetchInitialData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [typesRes, vehiclesRes, leadsRes, partsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/part-types`),
        fetch(`${API_BASE_URL}/api/vehicles`),
        fetch(`${API_BASE_URL}/api/admin/part-leads`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/parts`, { headers })
      ]);

      if (typesRes.ok) setPartTypes(await typesRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (partsRes.ok) setParts(await partsRes.json());
    } catch (err) {
      console.error("Initialization breakdown:", err);
    }
  }, [API_BASE_URL, getAuthHeaders]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser || !localStorage.getItem('token')) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchInitialData();
    }
  }, [navigate, fetchInitialData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleCheckboxChange = (vehicleId) => {
    setFormData(prev => {
      const currentIds = [...prev.vehicle_ids];
      if (currentIds.includes(vehicleId)) {
        return { ...prev, vehicle_ids: currentIds.filter(id => id !== vehicleId) };
      } else {
        return { ...prev, vehicle_ids: [...currentIds, vehicleId] };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      part_id: '',
      fuel_type: 'petrol',
      engine_capacity: '',
      SKU: '',
      brand: '',
      part_type_id: '',
      price: '',
      stock_quantity: '',
      vehicle_ids: [],
    });
    setFormMode('add');
  };

  const handleEditClick = (part) => {
    setFormData({
      part_id: part.part_id,
      fuel_type: part.fuel_type || 'petrol',
      engine_capacity: part.engine_capacity || '',
      SKU: part.SKU || '',
      brand: part.brand || '',
      part_type_id: part.part_type_id || '',
      price: part.price || '',
      stock_quantity: part.stock_quantity || '',
      vehicle_ids: part.vehicle_ids || [],
    });
    setFormMode('edit');
    setActiveTab('add');
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/part-leads/${leadId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setMessage('Status updated successfully!');
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const url = formMode === 'add' 
      ? `${API_BASE_URL}/api/admin/parts` 
      : `${API_BASE_URL}/api/admin/parts/${formData.part_id}`;
      
    const method = formMode === 'add' ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(`Part successfully ${formMode === 'add' ? 'created' : 'modified'}!`);
        resetForm();
        setActiveTab('inventory');
        fetchInitialData();
      } else {
        const errData = await response.json();
        setMessage(`Error: ${errData.error || 'Operation failed'}`);
      }
    } catch (err) {
      setMessage(`Network error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePart = async (partId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/parts/${partId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        setMessage("Item purged from stock.");
        fetchInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Spares Administration Panel</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Logged in as: <strong>{user?.username}</strong> ({user?.role})</p>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding: '8px 16px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>

      {message && <div style={{ padding: '12px', backgroundColor: message.includes('Error') ? '#fde8e8' : '#e1f5fe', color: message.includes('Error') ? '#e53935' : '#0288d1', borderRadius: '4px', marginBottom: '20px', fontWeight: 'bold' }}>{message}</div>}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
        {['dashboard', 'inventory', 'add', 'leads'].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); if (tab !== 'add') resetForm(); }} style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: activeTab === tab ? 'bold' : 'normal', color: activeTab === tab ? '#E35205' : '#555', borderBottom: activeTab === tab ? '3px solid #E35205' : 'none' }}>
            {tab === 'leads' ? `Leads (${leads.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <h2>Dashboard Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #E35205', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Catalog Stock Items</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{parts.length}</p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #4CAF50', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' }}>Unattended Customer Leads</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>{leads.filter(l => l.status === 'unattended').length}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Current Inventory Parts Listing</h2>
            <input type="text" placeholder="Search by Brand or SKU..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '8px 12px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px' }}>SKU</th>
                <th style={{ padding: '12px' }}>Classification</th>
                <th style={{ padding: '12px' }}>Brand / Specs</th>
                <th style={{ padding: '12px' }}>Price</th>
                <th style={{ padding: '12px' }}>Stock Availability</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.filter(p => (p.SKU || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase())).map(part => (
                <tr key={part.part_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{part.SKU || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>{part.type_name}</td>
                  <td style={{ padding: '12px' }}>
                    <strong>{part.brand}</strong> <br />
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>{part.engine_capacity} | {part.fuel_type}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#E35205', fontWeight: 'bold' }}>${part.price?.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>{part.stock_quantity} units</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => handleEditClick(part)} style={{ padding: '4px 8px', marginRight: '5px', backgroundColor: '#0288d1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDeletePart(part.part_id)} style={{ padding: '4px 8px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'add' && (
        <div style={{ maxWidth: '600px', background: '#f9f9f9', padding: '25px', borderRadius: '8px', border: '1px solid #eee' }}>
          <h2>{formMode === 'add' ? 'Register New Inventory Component' : 'Update Component Properties'}</h2>
          <form onSubmit={handleSubmitForm} style={{ marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>SKU Reference Code *</label>
                <input type="text" name="SKU" value={formData.SKU} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="e.g., BRK-4412" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Manufacturer Brand *</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="e.g., Bosch" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fuel Variant *</label>
                <select name="fuel_type" value={formData.fuel_type} onChange={handleFormChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Engine Displacement *</label>
                <input type="text" name="engine_capacity" value={formData.engine_capacity} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="e.g., 2.0L" />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Part Classification Type *</label>
              <select name="part_type_id" value={formData.part_type_id} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="">-- Choose Category --</option>
                {partTypes.map(t => <option key={t.part_type_id} value={t.part_type_id}>{t.type_name}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price ($) *</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="0.00" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Stock Available *</label>
                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="0" />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mapped Vehicle Models Fitment</label>
              <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '4px', background: '#fff' }}>
                {vehicles.map(v => (
                  <div key={v.vehicle_id} style={{ marginBottom: '5px' }}>
                    <label style={{ fontWeight: 'normal', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.vehicle_ids.includes(v.vehicle_id)} onChange={() => handleVehicleCheckboxChange(v.vehicle_id)} style={{ marginRight: '8px' }} />
                      {v.make_name} {v.model_name} ({v.year_start}-{v.year_end})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={isLoading} style={{ flex: 1, padding: '12px', backgroundColor: '#E35205', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>
                {isLoading ? 'Processing...' : (formMode === 'add' ? 'Add Part' : 'Update Part')}
              </button>
              {formMode === 'edit' && <button type="button" onClick={() => { setActiveTab('inventory'); resetForm(); }} style={{ padding: '12px 20px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>}
            </div>
          </form>
        </div>
      )}

      {activeTab === 'leads' && (
        <div>
          <h2>Customer Inquiries & Mapped Store Stock Metrics</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <thead style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '12px' }}>Requester</th>
                <th style={{ padding: '12px' }}>Requested Specifications</th>
                <th style={{ padding: '12px' }}>Message Context</th>
                <th style={{ padding: '12px' }}>Stock Alert</th>
                <th style={{ padding: '12px' }}>Workflow Pipeline Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.lead_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <strong>{lead.name}</strong><br />
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>{lead.email} | {lead.phone}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge" style={{ backgroundColor: '#e0e0e0', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{lead.fuel_type}</span> <br />
                    <strong>{lead.engine_capacity}</strong> — {lead.type_name || lead.part_name}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#555' }}>"{lead.message}"</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: lead.available_stock > 0 ? '#4CAF50' : '#d32f2f' }}>
                      {lead.available_stock > 0 ? `✓ Match (${lead.available_stock} available)` : '✗ Out of Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <select value={lead.status} onChange={(e) => handleStatusChange(lead.lead_id, e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: lead.status === 'unattended' ? '#fff3e0' : lead.status === 'approved' ? '#e8f5e9' : '#fff' }}>
                      <option value="unattended">Unattended</option>
                      <option value="attended">Attended</option>
                      <option value="approved">Approved</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
