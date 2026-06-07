import React from 'react';
import './Pages.css';

const Services = () => {
  const servicesList = [
    { id: 1, title: 'Towing Services', img: '/assets/towing-icon.png' },
    { id: 2, title: 'Spray-painting', img: '/assets/spray-icon.png' },
    { id: 3, title: 'Bodywork Services', img: '/assets/bodywork-icon.png' },
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">Our Services</h1>
      <p className="page-subtitle">Professional automotive care when you need it most.</p>

      <div className="grid-container">
        {servicesList.map((service) => (
          <article className="card" key={service.id}>
            <img src={service.img} alt={service.title} className="card-icon" />
            <h2 className="card-title">{service.title}</h2>
            <div className="card-actions">
              <button className="btn-action">Quick View</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Services;