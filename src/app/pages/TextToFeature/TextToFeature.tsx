import {FC, useEffect, useState} from 'react'
import {useGlobal} from '../../context/AuthContext'
import Modal from 'react-bootstrap/Modal'
import RobotIcon from '../../../_metronic/assets/icons/robot.svg'

const TextToOcr: FC = () => {
  const {
    imageData,
    setLoading,
    setImageData,
    loading,
    setPromptTitle,
    imagePreview,
    localImagePreview,
    setLocalImagePreview,
    balance,
  } = useGlobal()

  useEffect(() => {
    setImageData('')
    setPromptTitle('')
    setLoading(false)
  }, [window.location])

  const ocrArray = imageData?.ocr
  const hasOCRData = Array.isArray(ocrArray) && ocrArray.length > 0
  const text = hasOCRData ? String(ocrArray[0]) : ''

  const lines = text.split('\n')

  return (
    <div className='container h-100 d-flex justify-content-center '>
      <div style={{margin: '0 8rem'}} className='row justify-content-center w-100'>
        <div className='col-md-6 w-100'>
          {balance > 0 && (
            <>
              <div className='chat-container'>
                <img
                  style={{width: '40px', marginRight: '1rem', float: 'left'}}
                  src={RobotIcon}
                  alt=''
                />
                {loading ? (
                  <div className='bot-message'>
                    <span className='loading-dots'>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </div>
                ) : (
                  <div className='bot-message'>
                    <div className='card-body'>
                      {imageData?.result ? imageData?.result?.join(', ') : 'No Data'}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextToOcr
