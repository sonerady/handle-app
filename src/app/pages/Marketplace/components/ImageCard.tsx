// Card.tsx
import React from 'react'
import styles from '../Home.module.scss'
import {useAuthService} from '../../../services/authService'

interface CardProps {
  backgroundImage: string
  title: string
  height?: '200px' | '225px'
  icon?: React.ReactNode
  button?: React.ReactNode
  color: string
  position?: string
  bgSize?: 'cover' | 'contain'
  isCenter?: boolean
  isBottom?: boolean
  link?: string
  order?: any
  linkCentered?: string
  id?: string
}

const Card: React.FC<CardProps> = ({
  backgroundImage,
  title,
  height = '225px',
  icon,
  button,
  color,
  position,
  bgSize = 'contain',
  isCenter,
  isBottom,
  link,
  order,
  linkCentered,
  id,
}) => {
  const cardStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: bgSize,
    backgroundColor: color,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: position,
    cursor: 'pointer',
    height,
  }

  const {topSliderLog, centerSliderLog} = useAuthService()
  return (
    <div
      onClick={() => {
        window.open(linkCentered ?? link, '_blank')
        // isCenter ? centerSliderLog(id) : topSliderLog(id)
      }}
      className={`${styles.imageCard} ${isCenter && styles.darkBg}`}
      style={cardStyle}
    >
      {order}
      <div
        className={`${styles.title} ${isBottom && styles.bottomImages} ${
          isCenter && styles.centerTitle
        }`}
      >
        {title}
      </div>
      {icon && button && (
        <div className={styles.iconAndButton}>
          <div className={styles.icon}>{icon}</div>
          {
            <button
              onClick={() => {
                window.open(linkCentered, '_blank')
              }}
              className={styles.button}
            >
              {button}
            </button>
          }
        </div>
      )}
    </div>
  )
}

export default Card
