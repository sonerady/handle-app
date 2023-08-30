import React, {FC, useEffect, useState} from 'react'
import styles from '../AddApp.module.scss'
import {FaRegStar, FaStar} from 'react-icons/fa'
import {IoMdAddCircleOutline} from 'react-icons/io'
import {useAuthService} from '../../../services/authService'
import {toast} from 'react-toastify'
import review from '../../../../_metronic/assets/marketplace/icons/review.svg'
import {Form, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

interface ApproveCommentsProps {
  item: any
  forAdminReviews: any
  setForAdminReviews: any
  getWaitingReviewsForAdmin: any
}

const ApproveComments: React.FC<ApproveCommentsProps> = ({
  item,
  forAdminReviews,
  setForAdminReviews,
  getWaitingReviewsForAdmin,
}) => {
  const {approveReview, getForApprovalReviews, rejectReview} = useAuthService()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState([])
  const [showApproveButton, setShowApproveButton] = useState(false)
  const [show, setShow] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const handleChange = (e: any) => setInputValue(e.target.value)
  const handleClosePopup = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleApprove = (id: any) => {
    approveReview(id)
      .then((res) => {
        if (res.Status === 400) {
          toast.error(res.Description)
        } else {
          toast.success('Approved', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          getWaitingReviewsForAdmin().then((res: any) => {
            setForAdminReviews(res)
          })
        }
      })
      .catch((err) => {
        toast.error('An error occurred while approving the review.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      })
  }
  const handleSave = () => {
    if (inputValue.trim() === '') {
      toast.error('Please provide a reason for rejection.', {
        position: toast.POSITION.BOTTOM_RIGHT,
      })
    } else {
      handleReject()
    }
  }

  const handleReject = () => {
    rejectReview(item.id, inputValue)
      .then((res) => {
        if (res.Status === 400) {
          toast.error(res.Description, {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
        } else {
          toast.success('Rejected', {
            position: toast.POSITION.BOTTOM_RIGHT,
          })
          getWaitingReviewsForAdmin().then((res: any) => {
            setForAdminReviews(res)
          })
          window.location.reload()
        }
      })
      .catch((err) => {
        toast.error('An error occurred while approving the review.', {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      })
  }

  const handleClose = () => {
    setShow(false)
  }

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setShowApproveButton(true)}
      onMouseLeave={() => setShowApproveButton(false)}
    >
      {showApproveButton && (
        <div className={styles.approveButtonWrapper}>
          <button onClick={() => handleApprove(item.id)} className={styles.approveButton}>
            Approve Comments
          </button>
          <button
            onClick={() => handleShow()}
            className={`${styles.approveButton} ${styles.rejectButton}`}
          >
            Reject Comment
          </button>
        </div>
      )}

      <p className={styles.title}>User: &nbsp; {item.username}</p>

      <div className={styles.approvesWrapper}>
        <p className={styles.approves}>Approves: &nbsp; {item.approves}</p>

        <img
          className={styles.review}
          onClick={() => navigate(`/marketplace/detail/${item.name}/${item.appid}`)}
          src={review}
          alt=''
        />
      </div>
      <div className={styles.rating}>
        {Array(5)
          .fill(0)
          .map((_, i) =>
            i < item.rating ? (
              <span className={styles.activeRating}>
                <FaStar />
              </span>
            ) : (
              <FaRegStar />
            )
          )}
      </div>

      <p className={styles.comment}>{item.comment}</p>

      <p className={styles.dateAndStatus}>
        {item.status === 'waiting_for_approval' && (
          <span
            className={`${
              item.status === 'waiting_for_approval' ? styles.waiting : styles.approved
            } badge`}
          >
            {item.status === 'waiting_for_approval' ? 'Waiting' : 'Approved'}
          </span>
        )}

        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
      </p>
      <Modal size='sm' show={show} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Reason for rejection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type='text' value={inputValue} onChange={handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <div
            style={{
              cursor: 'pointer',
            }}
            className={styles.saveButton}
            onClick={handleSave}
          >
            Save
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ApproveComments
