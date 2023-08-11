import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import Layout from './Home'
import styles from './Balance.module.scss'
import Tags from './components/Tags'
import defaultProfile from '../../../_metronic/assets/marketplace/icons/defaultProfile.svg'
import Title from './components/Title'
import DiscordButton from '../Marketplace/components/DiscordButton'
import GoogleButton from '../Marketplace/components/GoogleButton'
import MetamaskButton from '../Marketplace/components/MetamaskButton'
import {useGlobal} from '../../context/AuthContext'
import {useAuthService} from '../../services/authService'

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

  const transactionData = [
    {
      id: 1,
      name: 'Transaction 1',
      from: '0xab...',
      to: '0xcd...',
      value: '2 ETH',
      date: '2023-07-01',
    },
    {
      id: 2,
      name: 'Transaction 2',
      from: '0xef...',
      to: '0xgh...',
      value: '1.5 ETH',
      date: '2023-07-02',
    },
    {
      id: 3,
      name: 'Transaction 3',
      from: '0xij...',
      to: '0xkl...',
      value: '3 ETH',
      date: '2023-07-03',
    },
    // Daha fazla transaction verisi ekleyebilirsiniz
  ]

  return (
    <Layout>
      <div className={styles.balanceWrapper}>
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <Title>YOUR CREDITS</Title>
          <div className={styles.profileContent}>
            <div className={styles.profileContentItem}>100</div>
          </div>
        </div>
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <Title>NEED MORE CREDIT ?</Title>
          <div className={styles.profileContent}>
            <div className={styles.profileInfo}>
              <div className={styles.profileContentRight}>
                <div className={styles.profileContentItemInput}>
                  <span className={styles.gradiantText}>= $7,164.45</span>
                  <input placeholder='Enter Amount' />
                </div>
                <button>Buy Credits</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{border: 'none'}} className={`${styles.card} ${styles.tableCard} card`}>
        <Title>Transaction History</Title>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
              <th></th>
              <th></th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
              >
                <td>{transaction.name}</td>
                <td>{transaction.from}</td>
                <td>{transaction.to}</td>
                <td>{transaction.value}</td>
                <td></td>
                <td></td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Collection
