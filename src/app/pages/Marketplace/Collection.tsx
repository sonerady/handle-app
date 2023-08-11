import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import Layout from './Home'
import styles from './Collection.module.scss'
import Tags from './components/Tags'
import addCollectionImage from '../../../_metronic/assets/marketplace/icons/addCollection.svg'
import nft from '../../../_metronic/assets/marketplace/icons/nft.svg'
import Title from './components/Title'

import {FiTrash2} from 'react-icons/fi'
import {HiOutlineDownload} from 'react-icons/hi'
import {useGlobal} from '../../context/AuthContext'
import {useAuthService} from '../../services/authService'
import {Alert} from 'react-bootstrap'

interface CollectionProps {}

const Collection: React.FC<CollectionProps> = () => {
  const location = useLocation()
  const [openInput, setOpenInput] = useState(false)
  const {allCollection, setAllCollection, loadingCollection, accessToken, collection} = useGlobal()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {addCollection, getAllCollection, getCollection, removeCollectionItem} = useAuthService()
  const [params, setParams] = useState<{
    name?: string
    content?: string
    description?: string
    badge?: string
    icon?: string
    rate?: string
  }>({})
  const [selectedTag, setSelectedTag] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 2000)
      return () => clearTimeout(timer) // Cleanup function
    }
  }, [error]) // Hata durumu değiştiğinde bu Hook çalışır

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    setParams({
      name: searchParams.get('name') || undefined,
      content: searchParams.get('content') || undefined,
      description: searchParams.get('description') || undefined,
      badge: searchParams.get('badge') || undefined,
      icon: searchParams.get('icon') || undefined,
      rate: searchParams.get('rate') || undefined,
    })
  }, [location.search])

  const handleCollection = async () => {
    if (inputValue.trim() === '') {
      setError('Boş bir değer girilemez !')
      return
    }
    try {
      await addCollection(inputValue)
      setInputValue('')
      const newCollection = await getAllCollection(accessToken) // all collections from API
      setAllCollection(newCollection) // update the state with the new collection
      setError(null) // Hata mesajını temizle
    } catch (error: string | any) {
      console.error(error)
    }
  }

  const fetchCollection = (accessToken: string, itemId: number) => {
    getCollection(accessToken, itemId)
  }

  const handleRemoveCollectionItem = async (colid: any, itemId: any, resourceurl: any) => {
    try {
      await removeCollectionItem(colid, itemId, resourceurl)
      await getCollection(accessToken, colid) // all collections from API
    } catch (error: string | any) {
      console.error(error)
    }
  }
  useEffect(() => {
    getAllCollection(accessToken)
  }, [])

  return (
    <Layout>
      <div style={{border: 'none'}} className={`${styles.container} card`}>
        <Title>📌 Collections</Title>
        <div className={styles.tagsWrapper}>
          {allCollection?.length > 0 &&
            allCollection?.map((item: any, index: number) => {
              return (
                <div>
                  <Tags
                    onClick={() => {
                      setSelectedTag(item.id)
                      setSelectedId(item.id)
                      fetchCollection(accessToken, item.id)
                    }}
                    item={item}
                    key={index}
                    selected={selectedTag === item.id} // Burada eklenen `selected` prop, seçilen etiketin ID'sinin kontrolünü sağlar.
                  />
                </div>
              )
            })}
          {openInput ? (
            <div className={styles.addCollection}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <input
                  type='text'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='Collection name'
                />
                <button onClick={handleCollection}>Add</button>
                <button onClick={() => setOpenInput(!openInput)} className={styles.closeBtn}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <img
              className={styles.addCollectionImage}
              onClick={() => setOpenInput(!openInput)}
              src={addCollectionImage}
              alt=''
            />
          )}
        </div>
        {error && <Alert variant='danger'>{error}</Alert>} {/* Hata mesajını burada gösteriyoruz */}
        <div className={styles.imageWrapper}>
          {collection?.length > 0 ? (
            collection?.map((item: any, index: number) => {
              return (
                <div
                  className={styles.itemWrapper}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={styles.imageHeader}
                    style={{opacity: hoveredIndex === index ? 1 : 0}}
                  >
                    <div className={styles.left}>
                      <img className={styles.imageHover} src={nft} alt='' />
                    </div>
                    <div className={styles.right}>
                      <span
                        onClick={() =>
                          handleRemoveCollectionItem(selectedId, item.id, item.resourceurl)
                        }
                        className={styles.imageHover}
                      >
                        <FiTrash2 />
                      </span>
                      <span className={styles.imageHover}>
                        <a href={item.resourceurl} download>
                          <HiOutlineDownload />
                        </a>
                      </span>
                    </div>
                  </div>
                  <img src={item.resourceurl} alt='' />
                </div>
              )
            })
          ) : (
            <span className={styles.noItem}>No Items Available</span>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Collection
