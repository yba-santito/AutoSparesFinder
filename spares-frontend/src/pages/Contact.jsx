import React, { useState, useEffect } from 'react';
import './Pages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    fuel_type: '',
    engine_capacity: '',
    part_type_id: '',
    make: '',
    model: '',
    year: '',
  });
  const [partTypes, setPartTypes] = useState([]);
  const [status, setStatus] = useState('');

  // Use an empty string so requests are relative and handled by the Vite proxy
  const API_BASE_URL = '';

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/part-types`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPartTypes(data);
        } else {
          console.warn('Expected an array of part types from backend, but received:', data);
        }
      })
      .catch(err => console.error('Error fetching part types:', err));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/part-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          part_type_id: formData.part_type_id ? parseInt(formData.part_type_id) : null
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setStatus('Lead submitted successfully!');
        setFormData({
          name: '', email: '', phone: '', message: '',
          fuel_type: '', engine_capacity: '', part_type_id: '',
          make: '', model: '', year: ''
        });
      } else {
        setStatus('Failed to submit lead.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error submitting lead.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Get In Touch</h1>
      <p className="page-subtitle">We are here to help with all your automotive needs.</p>

      <div className="contact-wrapper">
        
        {/* Contact Information */}
        <div className="contact-details">
          <div className="contact-info-item">
            <strong>Contact Person</strong>
            Mr Jason Naicker
          </div>
          <div className="contact-info-item">
            <strong>Phone Number</strong>
            <a href="tel:0845288308" style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>084 528 8308</a>
          </div>
          <div className="contact-info-item">
            <strong>Email Address</strong>
            <a href="mailto:jjsautomotivesupplies@gmail.com" style={{ color: 'var(--secondary-blue)' }}>jjsautomotivesupplies@gmail.com</a>
          </div>
          <div className="contact-info-item">
            <strong>Physical Address</strong>
            103 Tramway st, Turffontein<br />
            Johannesburg South, 2140
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Contact Details</h3>
          <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="form-input" placeholder="Your Name" required />
          <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="form-input" placeholder="Your Email" required />
          <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="form-input" placeholder="Your Phone Number" />
          <textarea name="message" value={formData.message} onChange={handleFormChange} className="form-textarea" placeholder="How can we help you?" required></textarea>
          
          <h3 style={{ marginTop: '20px' }}>Part Details (Optional Lead Info)</h3>
          <input type="text" name="make" value={formData.make} onChange={handleFormChange} className="form-input" placeholder="Make (e.g., Toyota)" />
          <input type="text" name="model" value={formData.model} onChange={handleFormChange} className="form-input" placeholder="Model (e.g., Corolla)" />
          <input type="text" name="year" value={formData.year} onChange={handleFormChange} className="form-input" placeholder="Year (e.g., 2018)" />
          <select name="fuel_type" value={formData.fuel_type} onChange={handleFormChange} className="form-input">
            <option value="">-- Select Fuel Type --</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
          </select>
          <input type="text" name="engine_capacity" value={formData.engine_capacity} onChange={handleFormChange} className="form-input" placeholder="Engine Capacity (e.g., 2.0L)" />
          <select name="part_type_id" value={formData.part_type_id} onChange={handleFormChange} className="form-input">
            <option value="">-- Select Part Type --</option>
            {Array.isArray(partTypes) && partTypes.map(type => (
              <option key={type.part_type_id} value={type.part_type_id}>{type.type_name}</option>
            ))}
          </select>
          <button type="submit" className="btn-action" style={{ width: 'fit-content', marginTop: '10px' }}>Send Message</button>
          {status && <p style={{ marginTop: '10px', color: status.includes('success') ? 'green' : 'red' }}>{status}</p>}
        </form>

      </div>
    </div>
  );
};

export default Contact;