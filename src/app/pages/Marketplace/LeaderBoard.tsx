import Layout from './Home'
import Title from './components/Title'
import styles from './LeaderBoard.module.scss'
import React, {useEffect, useState} from 'react'
import {useGlobal} from '../../context/AuthContext'
import {useLocation, useNavigate} from 'react-router-dom'
import {useAuthService} from '../../services/authService'
import {number} from 'yup'

interface CollectionProps {}

const Collection: React.FC<CollectionProps> = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [role, setRole] = useState<any>()
  const [counter, setCounter] = useState(5)
  const isDiscordUser = localStorage.getItem('role')
  const [countdowns, setCountdowns] = useState<any>({})
  const [error, setError] = useState<string | null>(null)
  const [userCampaigns, setUserCampaigns] = useState<any[]>([])

  const {
    published,
    appValidation,
    reviewValidation,
    ranking,
    campaigns,
    reviewsPublished,
    userInfo,
    accessToken,
  } = useGlobal()
  const {getRanking, getCampigns, getUserRanking, getUserCampaignConditions} = useAuthService()

  const [params, setParams] = useState<{
    name?: string
    content?: string
    description?: string
    badge?: string
    icon?: string
    rate?: string
  }>({})

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [error])

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

  useEffect(() => {
    // getPublished()
    // getAppValidation()
    // getReviewValidation()
    getRanking()
    getCampigns()
    // getReviewsPublished()
    // getUserRanking()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      let newCountdowns: any = {}
      campaigns?.forEach((campaign: any) => {
        const timeRemaining = Date.parse(campaign.end_date) - Date.now()
        newCountdowns[campaign.id] = {
          days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
          seconds: Math.floor((timeRemaining / 1000) % 60),
        }
      })
      setCountdowns(newCountdowns)
    }, 1000)

    return () => clearInterval(interval)
  }, [campaigns])

  useEffect(() => {
    if (accessTokenMarketplace) {
      getUserCampaignConditions().then((res) => {
        if (res && Array.isArray(res)) {
          setUserCampaigns(res)
        } else {
          console.error('API did not return an array for userCampaigns')
        }
      })
    }
  }, [])

  const roles = userInfo?.data?.dao_roles
  const accessTokenMarketplace = localStorage.getItem('accessTokenMarketplace')

  useEffect(() => {
    if (!accessTokenMarketplace) {
      setTimeout(() => {
        navigate('/marketplace')
      })
    }
  }, [])

  const taskOrder = ['Add App', 'Approve App', 'Add Comment', 'Approve Comment']

  const sortedCampaigns = (userCampaigns as {task_name: string}[]).sort((a, b) => {
    const aIndex = taskOrder.indexOf(a.task_name)
    const bIndex = taskOrder.indexOf(b.task_name)
    return aIndex - bIndex
  })

  return (
    <Layout>
      <div className={styles.daoWrapper}>
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <h1>User Role</h1>
          <div className={styles.daoContent}>
            <div className={styles.daoContentTitle}>
              {roles?.map((role: any, index: number, arr: any[]) => {
                return (
                  <span key={index}>
                    {role}
                    {index !== arr.length - 1 ? ', ' : ''}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        <div style={{border: 'none'}} className={`${styles.card} card`}>
          <h1>Campaign Rewards</h1>
          <div className={styles.daoContent}>
            <div className={styles.daoContentTitle}>
              {campaigns && campaigns?.length > 0 ? (
                <div>
                  <div>
                    {parseFloat(campaigns[0].prize).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) ?? '0.00'}{' '}
                    HGPT
                  </div>
                </div>
              ) : (
                'Capmaings Loading...'
              )}
            </div>
            {/* <button className={styles.daoContentButton}>Claim Rewards</button> */}
          </div>
        </div>
      </div>
      <div
        className={` 
            ${styles.subCard}
        `}
      >
        {sortedCampaigns
          ? sortedCampaigns?.map((item: any, index: number) => {
              return (
                <div className={`${styles.card} card`} key={index}>
                  <h3>{item?.task_name}</h3>
                  <span>{item?.number}</span>
                </div>
              )
            })
          : ''}
        {/* <div className={`${styles.card} card`}>
          <h3>ADD APP</h3>
          <span>{published ? published.Result : 'Loading...'}</span>
        </div>
        <div className={`${styles.card} card`}>
          <h3>APPROVE APP</h3>
          <span>{appValidation ? appValidation.Result : 'Loading...'}</span>
        </div>
        <div className={`${styles.card} card`}>
          <h3>ADD COMMENT</h3>
          <span>{reviewsPublished ? reviewsPublished.Result : 'Loading...'}</span>
        </div>
        <div className={`${styles.card} card`}>
          <h3>APPROVE COMMENT</h3>
          <span>{reviewValidation ? reviewValidation.Result : 'Loading...'}</span>
        </div> */}
      </div>
      <div style={{border: 'none'}} className={`${styles.card} ${styles.tableCard} card`}>
        <div className={styles.topBoard}>
          <Title>LEADERBOARD</Title>
          {campaigns && campaigns?.length > 0
            ? (() => {
                const item = campaigns[0]
                const startDate = item.start_date
                  ? new Date(item.start_date).toLocaleDateString('tr-TR')
                  : 'Loading...'
                const endDate = item.end_date
                  ? new Date(item.end_date).toLocaleDateString('tr-TR')
                  : 'Loading...'
                return (
                  <div className={styles.countdown} key={item.id}>
                    <span
                      style={{
                        fontSize: '1.3rem',
                      }}
                    >
                      <strong>Starting Date: </strong>
                      {startDate}
                    </span>
                    <span className={styles.tire}>-</span>
                    <span
                      style={{
                        fontSize: '1.3rem',
                      }}
                    >
                      <strong>Ending Date: </strong> {endDate}
                    </span>
                    {/* <p className={styles.hpgt}>Worth of $HGPT Token</p> */}
                    {/* <p className={styles.countdownText}>
                      <span>
                        {countdowns[item.id]
                          ? `${countdowns[item.id].days} days, 
                         ${countdowns[item.id].hours} hours, 
                         ${countdowns[item.id].minutes} minutes, 
                         ${countdowns[item.id].seconds} seconds`
                          : 'Loading...'}
                      </span>
                    </p> */}
                  </div>
                )
              })()
            : null}
        </div>
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th className={styles.rankTitle}>Rank</th>
              <th className={styles.rankTitle}>Username</th>
              <th className={styles.rankTitle}>Role</th>
              <th className={styles.rankTitle}>Share</th>
              <th className={styles.rankTitle}>XP</th>
            </tr>
          </thead>
          <tbody>
            {ranking?.map((item: any, index: any) => (
              <tr
                key={index}
                className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
              >
                <td>#{item?.ranking}</td>
                <td>{item?.username ? item.username : item.email ?? 'No name'} </td>
                <td>
                  {item.discord_role
                    ? item.discord_role
                        .filter((role: any) => role !== 'HyperAdmin')
                        .map(
                          (role: any, index: number, arr: any[]) =>
                            role + (index !== arr.length - 1 ? ', ' : '')
                        )
                        .join('')
                    : 'No role'}
                </td>

                <td>
                  {parseFloat(item.share).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) ?? '0.00'}
                  %
                </td>
                <td>{item.total_bonus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Collection
