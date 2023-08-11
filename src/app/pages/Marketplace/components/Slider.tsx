import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './SimpleCarousel.css'
import example from '../../../../_metronic/assets/marketplace/images/example.svg'
import example2 from '../../../../_metronic/assets/marketplace/images/example2.svg'
import example3 from '../../../../_metronic/assets/marketplace/images/example3.svg'

interface SimpleCarouselProps {
  images: any[]
}

const SimpleCarousel: React.FC<SimpleCarouselProps> = ({images}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  }

  return (
    <div className='carousel-container'>
      <Slider {...settings}>
        {images.map((item: any) => (
          <div key={item.id}>
            <img
              style={{
                width: '400px',
                height: '225px',
                objectFit: 'cover',
                borderRadius: '1rem',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25',
              }}
              src={item.image}
              alt={`Görsel ${item.id}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default SimpleCarousel
