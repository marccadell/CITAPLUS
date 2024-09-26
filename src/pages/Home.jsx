import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from '../components/Carousel';
import "../styles/Pages/Home.css";

const Home = () => {
    return (
        <div className="home">
            <div className="banner">
                <div className="banner-content">
                    <h1>CitaPlus</h1>
                    <p>¡Organiza tus citas médicas fácilmente y accede a los mejores centros de salud con nosotros!</p>
                </div>
            </div>
            <div className="carousel">
                <h2>Nuestros Centros de Referencia</h2>
                <Carousel />
            </div>
            <div className="features">
                <h2>Que Ofrece CitaPlus</h2>
                <div className="grid-container">
                    <div className="grid-item">
                        <img src="img/grid1.jpg" alt="Descripción 1" />
                        <h3>Citas Específicas Según Necesidad</h3>
                    </div>
                    <div className="grid-item">
                        <img src="img/grid2.jpg" alt="Descripción 2" />
                        <h3>Médicos con Experiencia</h3>
                    </div>
                    <div className="grid-item">
                        <img src="img/grid3.jpg" alt="Descripción 3" />
                        <h3>Atención Personalizada</h3>
                    </div>
                    <div className="grid-item">
                        <img src="img/grid4.jpg" alt="Descripción 4" />
                        <h3>Tecnología de Vanguardia</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
