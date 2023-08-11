import React, {FC, useState} from 'react'
import {AiOutlineEye} from 'react-icons/ai'
import styles from '../AddApp.module.scss'
import RobotIcon from '../../../../_metronic/assets/icons/robot.svg'
import Review from '../Review'
import {Button, Modal} from 'react-bootstrap'
import {toast} from 'react-toastify'
import moment from 'moment'
interface ApproveAppProps {
  task?: any
  activeTab?: number
  waitingApps?: any
  approvedApps?: any
  setWaitingApps?: any
  getWaitingForAdmin?: any
  setWaitingAppsAdmin?: any
}

const ApproveApp: FC<ApproveAppProps> = ({
  task,
  activeTab,
  waitingApps,
  approvedApps,
  setWaitingApps,
  getWaitingForAdmin,
  setWaitingAppsAdmin,
}) => {
  const [show, setShow] = useState(false)
  const [selectedApp, setSelectedApp] = useState<any>(null)

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

  return (
    <div>
      {' '}
      {task > 0 && (
        <div className={styles.tabContent}>
          <div>
            {waitingApps?.length > 0 ? (
              waitingApps.map((app: any, index: any) => (
                <div key={index} className={`${styles.row}`}>
                  <ul>
                    <li className={styles.icons}>
                      <span className={styles.icon}>
                        <img src={app.icon ? app.icon : RobotIcon} alt='' />
                      </span>
                    </li>
                    <li title={moment(app.created_at).format('DD.MM.YYYY')}>
                      {moment(app.created_at).format('DD.MM.YYYY')}
                    </li>
                    <li title={app.name}>{truncate(app.name, 20)}</li>
                    <li title={app.title}>
                      <div dangerouslySetInnerHTML={{__html: truncate(app.title, 20)}} />
                    </li>
                    <li title={app.content}>
                      <span>{app.approves}</span>
                    </li>
                    <li className={styles.approveAppBtn}>
                      <button onClick={() => handleShow(app)}>View App</button>
                    </li>
                  </ul>
                </div>
              ))
            ) : (
              <div className={styles.noData}>No Data</div>
            )}
          </div>
        </div>
      )}
      <Modal
        style={{
          padding: '2rem',
        }}
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Review App{' '}
            <span
              style={{
                cursor: 'pointer',
                color: '#6c757d',
              }}
              onClick={() => {
                navigator?.clipboard?.writeText(selectedApp?.appid)
                toast.success('App ID copied to clipboard', {
                  position: toast.POSITION.BOTTOM_RIGHT,
                })
              }}
            >
              ({selectedApp?.appid})
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Review
            getWaitingForAdmin={getWaitingForAdmin}
            setWaitingAppsAdmin={setWaitingAppsAdmin}
            handleClose={handleClose}
            waitingApps={waitingApps}
            setWaitingApps={setWaitingApps}
            app={selectedApp}
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ApproveApp
