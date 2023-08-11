import React, {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Layout from '../Home'
import styles from '../Collection.module.scss'
import Tags from './Tags'
import addCollectionImage from '../../../../_metronic/assets/marketplace/icons/addCollection.svg'
import Title from './Title'
import {useGlobal} from '../../../context/AuthContext'
import {useAuthService} from '../../../services/authService'
import {BiLinkExternal} from 'react-icons/bi'
import {BiAddToQueue} from 'react-icons/bi'

interface CollectionProps {
  setCollectionName?: any
}

const Collection: React.FC<CollectionProps> = ({setCollectionName}) => {
  const location = useLocation()
  const [openInput, setOpenInput] = useState(false)
  const navigate = useNavigate()

  const handleTab = (path: any) => {
    const url = window.location.origin + path
    window.open(url, '_blank')
  }

  const {
    allCollection,
    setAllCollection,
    loadingCollection,
    accessToken,
    collection,
    showKanban,
    setShowKanban,
    imageData,
  } = useGlobal()
  const {addCollection, getAllCollection, getCollection} = useAuthService()
  const [params, setParams] = useState<{
    name?: string
    content?: string
    description?: string
    badge?: string
    icon?: string
    rate?: string
  }>({})

  const [inputValue, setInputValue] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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
    try {
      await addCollection(inputValue)
      setInputValue('')
      const newCollection = await getAllCollection(accessToken) // all collections from API
      if (!newCollection) {
        throw new Error('New collection is not received')
      }
      setAllCollection(newCollection) // update the state with the new collection
    } catch (error: string | any) {
      console.error(error)
    }
  }

  const fetchCollection = (accessToken: string, itemId: number, collectionName: any) => {
    setCollectionName && setCollectionName(itemId)
  }

  const openInNewTab = (path: any) => {
    const url = window.location.origin + path
    window.open(url, '_blank')
  }
  useEffect(() => {
    getAllCollection(accessToken)
  }, [])
  return (
    <>
      <div className={styles.tagsWrapper}>
        {allCollection?.length > 0 && loadingCollection
          ? allCollection?.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <Tags
                    onClick={() => fetchCollection(accessToken, item.id, item.collectionname)}
                    item={item}
                  />
                </div>
              )
            })
          : 'Add Collection:'}

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
          <img onClick={() => setOpenInput(!openInput)} src={addCollectionImage} alt='' />
        )}
        {window.location.pathname !== '/collection' && (
          <div onClick={() => handleTab('/collection')} className={styles.showAllCollection}>
            <span>Show All Collection</span>
            <span>
              <BiLinkExternal />
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default Collection
