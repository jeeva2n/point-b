import './PageStyles.css';

function Company() {
  return (
    <div className="company-page">
      <div className="company-header">
        <div className="overlay">
          <h1>About ZAHORANSKY</h1>
          <p>A tradition of excellence since 1902</p>
        </div>
      </div>
      
      <div className="company-content">
        <div className="company-section">
          <h2>Our History</h2>
          <div className="section-content">
            <div className="text-column">
              <p>ZAHORANSKY has been a leader in manufacturing technology for over a century. Founded in 1902, our company has evolved from a small workshop to a global enterprise with production facilities across three continents.</p>
              <p>Our commitment to innovation and quality has remained unwavering throughout our journey, allowing us to consistently deliver cutting-edge solutions to our global customer base.</p>
            </div>
            <div className="image-column"></div>
          </div>
        </div>
        
        <div className="company-section alt">
          <h2>Global Presence</h2>
          <div className="section-content">
            <div className="image-column"></div>
            <div className="text-column">
              <p>Today, ZAHORANSKY operates production facilities and sales offices in Germany, Spain, India, China, Japan, Brazil, and the United States, serving customers in over 70 countries worldwide.</p>
              <p>Our global footprint allows us to provide localized service while maintaining the consistent quality standards that have defined our brand for generations.</p>
            </div>
          </div>
        </div>
        
        <div className="company-section">
          <h2>Innovation & Sustainability</h2>
          <div className="section-content">
            <div className="text-column">
              <p>At ZAHORANSKY, we're committed to sustainable manufacturing practices and continuous innovation. Our R&D team works tirelessly to develop solutions that reduce environmental impact while improving production efficiency.</p>
              <p>From energy-efficient machines to waste-reducing processes, sustainability is integrated into every aspect of our business operations and product development.</p>
            </div>
            <div className="image-column"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Company;
