import { useState } from 'react';

export default function SparesDashboard() {
    // 1. STATE: These variables hold what the user types into the screen
    const [make, setMake] = useState('Toyota');
    const [model, setModel] = useState('Corolla');
    const [year, setYear] = useState('2017');
    
    // 2. STATE: This holds the data we get back from the database
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);

    // 3. THE BRIDGE: This function walks up to your Express API and asks for data
    const fetchParts = async () => {
        setLoading(true);
        try {
            // Notice this is the exact same URL you tested in your browser earlier!
            const response = await fetch(`http://localhost:3000/api/parts?make=${make}&model=${model}&year=${year}`);
            const data = await response.json();
            
            // We save the data into our 'inventory' state variable
            setInventory(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
        setLoading(false);
    };

    // 4. THE UI: This is the HTML that React draws on the screen
    return (
        <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
            <h2>Automotive Spares Inventory</h2>

            {/* The Search Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select value={make} onChange={(e) => setMake(e.target.value)} style={inputStyle}>
                    <option value="Toyota">Toyota</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="BMW">BMW</option>
                </select>

                <input 
                    type="text" 
                    value={model} 
                    onChange={(e) => setModel(e.target.value)} 
                    style={inputStyle} 
                    placeholder="Model (e.g. Corolla)" 
                />

                <input 
                    type="number" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    style={inputStyle} 
                />

                <button onClick={fetchParts} style={buttonStyle}>
                    {loading ? 'Searching...' : 'Search Inventory'}
                </button>
            </div>

            {/* The Data Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={thStyle}>SKU</th>
                        <th style={thStyle}>Brand</th>
                        <th style={thStyle}>Part Number</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {/* We loop through the inventory array and create a table row for each part */}
                    {inventory.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>
                                No parts loaded. Click search to fetch inventory.
                            </td>
                        </tr>
                    ) : (
                        inventory.map((part) => (
                            <tr key={part.sku} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={tdStyle}><strong>{part.sku}</strong></td>
                                <td style={tdStyle}>{part.brand}</td>
                                <td style={tdStyle}>{part.part_number}</td>
                                <td style={tdStyle}>{part.type_name}</td>
                                <td style={tdStyle}>R {part.price.toFixed(2)}</td>
                                <td style={tdStyle}>{part.stock_quantity}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Simple styling to make it look clean without needing external CSS files right now
const inputStyle = { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' };
const buttonStyle = { padding: '8px 20px', backgroundColor: '#E35205', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '12px' };