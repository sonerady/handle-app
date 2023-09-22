import React, {FC, useEffect, useState} from 'react'
import {AiOutlineEye} from 'react-icons/ai'
import styles from '../AddApp.module.scss'
import RobotIcon from '../../../../_metronic/assets/icons/robot.svg'
import Review from '../Review'
import {Button, Modal} from 'react-bootstrap'
import moment from 'moment'
import {toast} from 'react-toastify'
import Griddle, {ColumnDefinition, RowDefinition, plugins} from 'griddle-react'
interface ApproveAppProps {
  task?: any
  activeTab?: number
  waitingApps?: any
  approvedApps?: any
  setWaitingApps?: any
  setWaitingLoading?: any
  waitingLoading?: any
}

const ApproveApp: FC<ApproveAppProps> = ({
  task,
  activeTab,
  waitingApps,
  approvedApps,
  setWaitingApps,
  setWaitingLoading,
  waitingLoading,
}) => {
  const [show, setShow] = useState(false)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [appId, setAppId] = useState<any>(null)
  const handleClose = () => setShow(false)
  const handleShow = (app: any) => {
    setSelectedApp(app)
    setShow(true)
  }

  function truncate(str: any, num: any) {
    if (str?.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  const styleConfig = {
    classNames: {
      Row: 'row-class',
    },
    styles: {
      Filter: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        alignItems: 'center',
        height: '30px',
        borderRadius: '10px',
        background: '#1a1c21',
        border: '1px solid rgba(128, 128, 128, 0.179)',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#CD6094',
        width: '250px',
        marginRight: '10px',
        marginBottom: '10px',
      },
      Row: {
        height: '42px',
      },
      Cell: {
        border: '1px solid #80808024',
        width: '10%',
      },
      TableHeading: {
        backgroundColor: '#15171b',
        border: 'none',
        height: '42px',
      },
      SettingsToggle: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        alignItems: 'center',
        height: '40px',
        borderRadius: '10px',
        background: 'var(--neutral-neutral, #232325)',
        border: 'none',
        fontSize: '16px',
        lineHeight: '24px',
        color: '#CD6094',
      },
    },
  }

  useEffect(() => {
    const inputElement = document.querySelector('.griddle-filter') as HTMLInputElement

    if (inputElement) {
      inputElement.placeholder = 'Search'
    }
  })

  return (
    <div>
      {task > 0 && (
        <div className={styles.tabContent}>
          {activeTab === 0 &&
            (waitingLoading ? (
              <span
                style={{
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  fontSize: '20px',
                }}
              >
                Loading...
              </span>
            ) : waitingApps.length > 0 ? (
              <Griddle
                pageProperties={{
                  pageSize: 50,
                }}
                enableSettings={false}
                styleConfig={styleConfig}
                data={waitingApps}
                plugins={[plugins.LocalPlugin]}
              >
                <RowDefinition>
                  <ColumnDefinition
                    id='icon'
                    title='App Icon'
                    customComponent={(props: any) => {
                      return (
                        <div>
                          <img
                            style={{width: '35px', height: '35px', borderRadius: '50%'}}
                            src={props.value ?? RobotIcon}
                            alt=''
                            onError={(e: any) => {
                              e.target.onerror = null
                              e.target.src = RobotIcon
                            }}
                          />
                        </div>
                      )
                    }}
                  />

                  <ColumnDefinition
                    id='created_at'
                    title='Date'
                    customComponent={(props: any) => (
                      <span>{moment(props.value).format('DD-MM-YYYY')}</span>
                    )}
                  />
                  <ColumnDefinition
                    id='name'
                    title='App Name'
                    customComponent={(props: any) => <span>{truncate(props.value, 15)}</span>}
                  />
                  <ColumnDefinition
                    id='title'
                    title='Title'
                    customComponent={(props: any) => <span>{truncate(props.value, 15)}</span>}
                  />
                  <ColumnDefinition id='approves' title='Approves' />
                  <ColumnDefinition
                    id='appid'
                    title='View App'
                    customComponent={(props: any) => (
                      <li
                        style={{
                          listStyle: 'none',
                        }}
                        className={styles.approveAppBtn}
                      >
                        <button
                          className={styles.viewButton}
                          onClick={() => {
                            handleShow(props.value)
                            setAppId(props.value)
                          }}
                        >
                          View App
                        </button>
                      </li>
                    )}
                  />
                </RowDefinition>
              </Griddle>
            ) : (
              <span
                style={{
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  fontSize: '20px',
                }}
              >
                No Data
              </span>
            ))}
        </div>
      )}

      <Modal
        size='sm'
        style={{
          padding: '2rem',
        }}
        show={show}
        onHide={handleClose}
      >
        <Modal.Body
          style={{
            width: '650px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'scroll',
            overflowX: 'hidden',
            height: '600px',
          }}
        >
          <Review
            handleClose={handleClose}
            waitingApps={waitingApps}
            setWaitingApps={setWaitingApps}
            app={waitingApps.find((app: any) => app.appid === appId)}
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ApproveApp
