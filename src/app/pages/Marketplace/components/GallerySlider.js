import React, {useState} from 'react'

const Slider = ({sliderWidth = 400, sliderHeight = 250}) => {
  const slider = ['first', 'second', 'third', 'fourth', 'fifth']
  const [activeIndex, setActiveIndex] = useState(1)
  const [left, setLeft] = useState(0)

  const prevSlide = () => {
    setActiveIndex(activeIndex - 1)
    setLeft(left + 400)
    if (activeIndex === 1) {
      setActiveIndex(activeIndex + slider.length - 1)
      setLeft(left - sliderWidth * (slider.length - 1))
    }
  }

  const nextSlide = () => {
    setActiveIndex(activeIndex + 1)
    setLeft(left - sliderWidth)
    if (activeIndex === slider.length) {
      setActiveIndex(activeIndex - slider.length + 1)
      setLeft(0)
    }
  }

  const clickIndicator = (e) => {
    setActiveIndex(parseInt(e.target.textContent))
    setLeft(sliderWidth - parseInt(e.target.textContent) * sliderWidth)
  }

  const style = {
    left: left,
    width: sliderWidth,
    height: sliderHeight,
  }

  return (
    <div>
      <div className='slider-wrapper'>
        <ul className='slider'>
          {slider.map((item, index) => (
            <li
              key={index}
              style={style}
              className={index + 1 === activeIndex ? 'slider-item' : 'hide'}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className='buttons-wrapper'>
        <button className='prev-button' onClick={prevSlide}></button>
        <button className='next-button' onClick={nextSlide}></button>
      </div>
      <div className='indicators-wrapper'>
        <ul className='indicators'>
          {slider.map((item, index) => (
            <li
              key={index}
              className={index + 1 === activeIndex ? 'active-indicator' : ''}
              onClick={clickIndicator}
            >
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Slider
