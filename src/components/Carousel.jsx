import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/Components/Carousel.css';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      <div><img className='carousel-img' src="img/capBarceloneta.jpg" alt="Carrusel 1" /></div>
      <div><img className='carousel-img' src="img/capVilaOlimpica.jpg" alt="Carrusel 2" /></div>
      <div><img className='carousel-img' src="img/valldhebron.jpg" alt="Carrusel 3" /></div>
      <div><img className='carousel-img' src="img/santpau.jpg" alt="Carrusel 4" /></div>
      <div><img className='carousel-img' src="img/clinic.jpg" alt="Carrusel 5" /></div>
    </Slider>
  );
};

export default Carousel;

