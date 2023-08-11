import React, {useState, useEffect, useRef} from 'react'
import {FaHistory} from 'react-icons/fa'
import styles from './History.module.scss'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useAuthService } from '../../../../app/services/authService'
import { useGlobal } from '../../../../app/context/AuthContext'
import { useLocation } from 'react-router-dom';


const History = ({setOpenHistory,setHistoryData,showModal,setShowModal}) => {
  const modalRef = useRef()
  const {getHistory}  = useAuthService()
  const {history,setHistory,accessToken,account,code,}  = useGlobal()
  const location = useLocation();


  const openModal = () => {
    setShowModal(true)
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])




  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    if (diffDays > 0) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else {
      return diffSeconds < 5 ? "just now" : `${diffSeconds} seconds ago`;
    }
  }
  
  const handleIconClick = () => {
    setShowModal(false)
  }

  const openHistoryData = (data) => {
    setHistoryData(data); 
    setOpenHistory(true);
}
  return (
    <div
    ref={modalRef}
    className={`${styles.container} ${showModal ? styles.show : ''}`}
    >
      {!showModal &&
      <div className={styles.icon} onClick={openModal}>
        <FaHistory />
      </div>
      }
      {showModal && (
        <div  className={styles.modal}>
          <div
          onClick={handleIconClick}
          className={styles.header}
          >
            <span>
          <AiOutlineCloseCircle/>
          </span>
            </div>
            <div
            className={styles.itemWrapper}
            >

            {history && [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item, index) => {
              return (
                <div
             
                onClick={() => openHistoryData(item)}
                className={styles.item}
                >
                  {item.query.includes("http") ?
                  <div
                  className={styles.imageWrapper}
                  >
                    <img
                    style={{
                      width: "50px",
                      borderRadius: "5px",
                    }}
                    src={item.query.split(',',1)}
                    alt="prompt"
                    />
                    <div
                    className={styles.textWrapper}
                    >
                    <span>
                      {item.query.split(',')[1] === "NONE    " ? "No Prompt" : item.query.split(',')[1]}
                    </span>
                  <span>{formatDate(item.createdAt)}</span>
                  </div>
                  </div>
                :<span>{item.query.replace(". outputformat:markdown","")}</span>}
                {
                  !item.query.includes("http") &&
                  <span>{formatDate(item.createdAt)}</span>

                }
                </div>
              )
            })}
            
        </div>
        </div>
      )}
    </div>
  )
}

export default History
