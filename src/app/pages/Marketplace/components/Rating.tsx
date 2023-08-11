import React from 'react'
import {FaStar, FaRegStar, FaStarHalfAlt} from 'react-icons/fa'
import styles from '../Home.module.scss'

interface RatingProps {
  rate?: any
  style?: React.CSSProperties
}

const Rating: React.FC<RatingProps> = ({rate, style}) => {
  const fullStars = Math.floor(rate)
  const halfStar = rate % 1 > 0 ? 1 : 0
  const emptyStars = 5 - fullStars - halfStar

  return (
    <div style={style} className={styles.rating}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} color='#FD7DA4' />
      ))}
      {halfStar ? <FaStarHalfAlt color='#FD7DA4' /> : null}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={i} color='#FD7DA4' />
      ))}
    </div>
  )
}

export default Rating
