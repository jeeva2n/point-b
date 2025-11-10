import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    switch (button) {
      case "Home":
        navigate("/home");
        break;
      case "Broom & Brush":
        navigate("/broom-brush");
        break;
      case "HealthCare":
        navigate("/healthcare");
        break;
      default:
        navigate("/");
    }
  };

  const cards = [
    {
      id: 1,
      title: "We",
      subtitle: "simplify",
      subtitle2: "production",
      color: "#8FFF00",
      image: "/images/machinery1.jpg",
      description:
        "From proven hand operated machines to complete automation lines, ZAHORANSKY is the right choice",
      buttons: ["Home", "Broom & Brush", "HealthCare"],
    },
    {
      id: 2,
      title: "We",
      subtitle: "deliver",
      subtitle2: "solutions",
      color: "#FF0066",
      image: "/images/machinery2.jpg",
    },
    {
      id: 3,
      title: "We",
      subtitle: "automate",
      subtitle2: "molds",
      color: "#FF00FF",
      image: "/images/machinery3.jpg",
    },
    {
      id: 4,
      title: "We",
      subtitle: "are",
      subtitle2: "ZAHO",
      color: "#00FFFF",
      image: "/images/team.jpg",
    },
  ];

  return (
    <div className="home-container">
      <div className="home-wrapper">
        <div className="cards-wrapper">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`card ${hoveredIndex === index ? 'expanded' : ''} ${
                hoveredIndex !== null && hoveredIndex !== index ? 'collapsed' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="card-image-wrapper">
                <img src={card.image} alt={card.title} className="card-image" />
                <div className="card-overlay"></div>
              </div>

              <div className="card-content">
                <h1 className="card-title" style={{ color: card.color }}>
                  {card.title}
                </h1>
                <h2 className="card-subtitle" style={{ color: card.color }}>
                  {card.subtitle}
                </h2>
                <h2 className="card-subtitle2" style={{ color: card.color }}>
                  {card.subtitle2}
                </h2>

                {card.description && hoveredIndex === index && (
                  <div className="card-details">
                    <p className="card-description">{card.description}</p>
                    {card.buttons && (
                      <div className="card-buttons">
                        {card.buttons.map((button, btnIndex) => (
                          <button
                            key={btnIndex}
                            className="card-button"
                            onClick={() => handleButtonClick(button)}
                          >
                            {button}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
