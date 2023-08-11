import React from 'react'
import all from '../../../../_metronic/assets/marketplace/icons/all.svg'
import verified from '../../../../_metronic/assets/marketplace/icons/verified.svg'
import trending from '../../../../_metronic/assets/marketplace/icons/trending.svg'
import news from '../../../../_metronic/assets/marketplace/icons/new.svg'
import upcomings from '../../../../_metronic/assets/marketplace/icons/upcomings.svg'
import styles from '../Home.module.scss'
import Input from './Input'
import {useNavigate} from 'react-router-dom'

const Filter = () => {
  const navigate = useNavigate()

  const list = [
    {
      name: 'All Apps',
      icon: all,
      value: 'all',
    },
    {
      name: 'Verified',
      icon: verified,
      value: 'verified',
    },
    {
      name: 'Trending',
      icon: trending,
      value: 'trending',
    },
    {
      name: 'New Arrivals',
      icon: news,
      value: 'new',
    },
    {
      name: 'Upcoming',
      icon: upcomings,
      value: 'upcomings',
    },
  ]

  const handleRedirect = (value: any) => {
    navigate && navigate(`/apps?filter=${value}`)
  }

  return (
    <div className={styles.filterWrapper}>
      <div className={styles.filter}>
        {list.map((item, index) => {
          return (
            <div
              className={styles.filterItem}
              key={index}
              onClick={() => handleRedirect(item.value)}
            >
              <img src={item.icon} alt={item.name} style={{height: '15px', margin: '5px'}} />

              <label
                style={
                  index === 0
                    ? {
                        marginRight: '0.4rem',
                      }
                    : {}
                }
                className={styles.name}
              >
                {item.name}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Filter
