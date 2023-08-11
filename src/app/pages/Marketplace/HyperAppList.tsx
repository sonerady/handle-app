import React from 'react'
import Layout from './Home'
import styles from './HyperAppList.module.scss'
import {BsBoxArrowInRight} from 'react-icons/bs'

interface CollectionProps {}

const Collection: React.FC<CollectionProps> = () => {
  const apps = [
    {
      name: 'HyperChat',
      description: 'HyperChat allows users to chat using the capabilities of ChatGPT.',
      path: 'http://localhost:8080/hyperchat',
    },
    {
      name: 'HyperCode',
      description: 'With HyperCode, you can generate code using AI.',
      path: 'http://localhost:8080/hypercodes',
    },
    {
      name: 'HyperContracts',
      description: 'HyperContracts enables you to create web3 contracts using AI.',
      path: 'http://localhost:8080/hypercontracts',
    },
    {
      name: 'HyperArt',
      description: 'With HyperArt, you can generate beautiful artwork with the power of AI.',
      path: 'http://localhost:8080/hyperart',
    },
    {
      name: 'HyperPortraits',
      description: 'HyperPortraits allows users to generate portraits using AI.',
      path: 'http://localhost:8080/hyperportraits',
    },
    {
      name: 'HyperExtract',
      description: 'HyperExtract can identify and explain the elements in an image.',
      path: 'http://localhost:8080/hyperextract',
    },
    {
      name: 'HyperOcr',
      description: 'HyperOcr is capable of extracting text from images.',
      path: 'http://localhost:8080/hyperocr',
    },
  ]

  return (
    <Layout>
      <div className={styles.profileWrapper}>
        <span className={styles.gradiantText}>HYPER APPS</span>
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          {apps.map((app, index) => (
            <React.Fragment key={index}>
              <label className={styles.cardLabel} htmlFor=''>
                {app.name}
              </label>
              <a
                rel='noreferrer'
                target='_blank'
                style={{
                  textDecoration: 'none',
                }}
                href={app.path}
                className={styles.cardItem}
              >
                <p>{app.description}</p>
                <span className={styles.iconItem}>
                  <BsBoxArrowInRight />
                </span>
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Collection
