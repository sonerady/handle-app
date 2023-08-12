import React, {FC, useState} from 'react'
import styles from '../AddApp.module.scss'
import moment from 'moment'
import {FaRegStar, FaStar} from 'react-icons/fa'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import {Form, Modal} from 'react-bootstrap'
import Review from '../Review'
import {IoMdAddCircleOutline} from 'react-icons/io'
import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'
import review from '../../../../_metronic/assets/marketplace/icons/review.svg'
import {useNavigate} from 'react-router-dom'
interface ApproveCommentsProps {
  item: any
  approvalReviews: any
  setApprovalReviews: any
}

const ApproveComments: FC<ApproveCommentsProps> = ({item, approvalReviews, setApprovalReviews}) => {
  const [show, setShow] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const {approveReview, getForApprovalReviews, rejectReview} = useAuthService()
  const [reviews, setReviews] = useState([])
  const navigate = useNavigate()
  const handleClose = () => setShow(false)
  const handleShow = (app: any) => {
    setSelectedApp(app)
    setShow(true)
  }
  const [showRejectModal, setShowRejectModal] = useState(false)

  const [reason, setReason] = useState('')
  const [inputValue, setInputValue] = useState('')

  const handleShowRejectReason = (app: any) => {
    setSelectedApp(app)
    setShow(true)
  }

  const handleCloseRejectReason = () => {
    setInputValue('')
    setShow(false)
  }

  const handleChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const handleSave = () => {
    setReason(inputValue)
    rejectReview(item.id, inputValue)
    handleCloseRejectReason()
  }

  const handleShowRejectModal = (app: any) => {
    setSelectedApp(app)
    setShowRejectModal(true)
  }

  const handleCloseRejectModal = () => {
    setInputValue('')
    setShowRejectModal(false)
  }

  const handleReject = () => {
    rejectReview(item.id, inputValue)
      .then((res) => {
        if (res.Status === 200) {
          toast.success('Successfully rejected', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          handleCloseRejectModal()
        } else {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        }
      })
      .catch((err) => {
        toast.error('An error occurred while rejecting the review.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      })
  }

  const handleApprove = (id: any) => {
    approveReview(id)
      .then((res) => {
        if (res.Status === 400) {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else {
          toast.success('Approved', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          getForApprovalReviews().then((res) => {
            setApprovalReviews(res)
          })
        }
      })
      .catch((err) => {
        toast.error('An error occurred while approving the review.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      })
  }

  return (
    <div>
      <div className={styles.tabContent}>
        <div>
          <div className={`${styles.row}`}>
            <ul>
              <li title={moment(item.created_at).format('DD.MM.YYYY')}>
                {moment(item.created_at).format('DD.MM.YYYY')}
              </li>
              <li title={item.name}>
                {!item.is_comment
                  ? Array(5)
                      .fill(0)
                      .map((_, i) =>
                        i < item.rating ? (
                          <span className={styles.activeRating}>
                            <FaStar />
                          </span>
                        ) : (
                          <FaRegStar />
                        )
                      )
                  : ''}
              </li>
              <li className={styles.approveAppBtn}>
                <OverlayTrigger
                  delay={{hide: 450, show: 300}}
                  overlay={(props) => <Tooltip {...props}>{item.comment}</Tooltip>}
                  placement='bottom'
                >
                  <div>{item.comment}</div>
                </OverlayTrigger>
              </li>
              <li>
                <span>{item.is_comment ? 'Comment' : 'Review'}</span>
              </li>
              <li title={item.content}>
                <span>{item.approves}</span>
              </li>
              <li className={styles.approveAppBtn}>
                <button
                  style={{
                    borderColor: 'red',
                    color: 'red',
                  }}
                  onClick={() => {
                    handleShowRejectModal(item)
                  }}
                >
                  Reject
                </button>
              </li>
              <li className={styles.approveAppBtn}>
                <button
                  style={{
                    borderColor: '#1aaa55',
                    color: '#1aaa55',
                  }}
                  onClick={() => {
                    handleApprove(item.id)
                  }}
                >
                  Approve
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Modal show={showRejectModal} onHide={handleCloseRejectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reason for rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type='text' value={inputValue} onChange={handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <div className={styles.saveButton} onClick={handleReject}>
            Save
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ApproveComments
