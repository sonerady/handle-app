import React from 'react'
import styles from './TelegramBot.module.scss'
import {Link} from 'react-router-dom'

const TelegramBot = () => {
  // const handleAppClick = (url) => {
  //   window.location.href = url + '?hyperart?utm_source=hypergpt&platform=telegram'
  // }

  const apps = [
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/sukvbcqfnpvopvzn',
      name: 'AI Powered ChatBot',
      subTitle: 'Chat with GPT-3',
      url: '/hyperchat',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/bcrpgtsrwkhqcwej',
      name: 'HyperPosts',
      subTitle: 'Engage with Ease!',
      url: '/hyperposts',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/eulotsllbbpatzrd',
      name: 'HyperContract',
      subTitle: 'Smart Contracts Made Easy',
      url: '/hypercontracts',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/tmpdwhngyzyvmhal',
      name: 'HyperCodes',
      subTitle: 'AI-Powered Code Genie',
      url: '/hypercodes',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/aulfpvkxxayltsgz',
      name: 'HyperArt',
      subTitle: 'Enhancing with Machine Learning!',
      url: '/hyperart',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/jaaeelttpfjrneax',
      name: 'HyperPortrait',
      subTitle: 'AI-Powered Portraits!',
      url: '/hyperportraits',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/jaaeelttpfjrneax',
      name: 'HyperOcr',
      subTitle: 'AI-Powered Precision and Versatility!',
      url: '/hyperocr',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/srehvatidisonfaa',
      name: 'HyperExtract',
      subTitle: 'Extract Data from Documents',
      url: '/hyperextract',
    },
    {
      emoji: 'https://deviumstore.blob.core.windows.net/iamge/jaaeelttpfjrneax',
      name: 'HyperImage',
      subTitle: 'Generate Images',
      url: '/hyperimages',
    },
  ]

  return (
    <div className={styles.appsContainer}>
      {apps.map((app, index) => (
        <Link
          to={app.url + `?utm_source=${app.name}&platform=telegram`}
          key={index}
          className={styles.appCard}
          // onClick={() => handleAppClick(app.url)}
        >
          <div className={styles.emoji}>
            <img className={styles.emojiImg} src={app.emoji} alt='' />
          </div>
          <div className={styles.appName}>{app.name}</div>
          <div className={styles.appSubTitle}>{app.subTitle}</div>
        </Link>
      ))}
    </div>
  )
}

export default TelegramBot
