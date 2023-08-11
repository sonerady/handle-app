import React, {FC, useState} from 'react'
import {AiOutlineEye} from 'react-icons/ai'
import styles from '../AddApp.module.scss'
import {Button, Form, Modal} from 'react-bootstrap'
import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'

interface ApproveAppProps {
  task?: any
  activeTab?: number
  approvedApps?: any
  setApprovedApps?: any
  getApprovedApps?: any
}

interface App {
  appid: string
  userName: string
  rating: number
  comment: string
  setApprovedApps?: any
  getApprovedApps?: any
}

const ApproveApp: FC<ApproveAppProps> = ({
  task,
  activeTab,
  approvedApps,
  setApprovedApps,
  getApprovedApps,
}) => {
  const [show, setShow] = useState(false)
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState('')
  const [rating, setRating] = useState(0)
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const discordUserName = localStorage.getItem('discordUserName')
  const {addReview} = useAuthService()
  const handleClose = () => {
    setShow(false)
    setComment('')
    setRating(0)
  }
  const handleShow = (app: any) => {
    setSelectedApp(app)
    setShow(true)
  }
  const handleCommentChange = (event: any) => setComment(event.target.value)
  const handleUserNameChange = (event: any) => setUserName(event.target.value)

  const handleRatingChange = (event: any) => {
    const inputRating = event.target.value
    if (inputRating > 5) {
      toast.error('Rating can not be more than 5', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    } else {
      setRating(inputRating)
    }
  }

  const handleSubmit = async () => {
    if (selectedApp) {
      const result = await addReview({
        appId: selectedApp?.appid,
        userName: discordUserName,
        rating,
        comment,
      })
      if (result.status) {
        toast.success('Comment added successfully', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        getApprovedApps().then((res: any) => {
          setApprovedApps(res)
        })
        setComment('')
        setRating(0)
        setUserName('')
      } else {
        toast.error('You have already made a comment', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        setComment('')
        setRating(0)
        setUserName('')
      }
      handleClose()
    }
  }

  function truncate(str: any, num: any) {
    if (str?.length <= num) {
      return str
    }
    return str?.slice(0, num) + '...'
  }

  return (
    <div>
      {' '}
      {task > 0 && (
        <div className={styles.tabContent}>
          <ul
            className={`${styles.header}
    ${styles.success}
      `}
          >
            <li>App Icon</li>
            <li>Name</li>
            <li className={styles.title}>Title</li>
            <li>Description</li>
            <li></li>
          </ul>
          <div>
            {approvedApps.length > 0 ? (
              approvedApps.map((app: any, index: any) => (
                <div key={index} className={`${styles.row}`}>
                  <ul>
                    <li className={styles.icons}>
                      <span className={styles.icon}>
                        <img src={app.icon} alt='' />
                      </span>
                    </li>
                    <li title={app.name}>{truncate(app.name, 20)}</li>
                    <li
                      title={app.description}
                      dangerouslySetInnerHTML={{__html: truncate(app.description, 20)}}
                    ></li>

                    <li title={app.content}>
                      <div dangerouslySetInnerHTML={{__html: truncate(app.content, 20)}} />
                    </li>
                    <li className={styles.addComment}>
                      <button onClick={() => handleShow(app)}>Add Comment</button>
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
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Additional inputs for userName and rating */}
            <Form.Group controlId='formUserName'></Form.Group>
            <Form.Group controlId='formRating'>
              <Form.Label className={styles.label}>Rating</Form.Label>
              <Form.Control type='number' value={rating} onChange={handleRatingChange} />
            </Form.Group>
            <Form.Group controlId='formComment'>
              <Form.Label className={styles.label}>Comment</Form.Label>
              <Form.Control as='textarea' rows={6} value={comment} onChange={handleCommentChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className={styles.closeButton} onClick={handleClose}>
            Close
          </Button>
          <Button className={styles.saveButton} onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ApproveApp
