import {FC, useEffect, useState} from 'react'
import {useGlobal} from '../../context/AuthContext'
import Modal from 'react-bootstrap/Modal'
import RobotIcon from '../../../_metronic/assets/icons/robot.svg'
// import Typist from 'react-typist'

const TextToOcr: FC = () => {
  const {imageData, setLoading, setImageData, loading, setPromptTitle, balance} = useGlobal()

  useEffect(() => {
    setImageData('')
    setPromptTitle('')
    setLoading(false)
  }, [window.location])

  const ocrArray = imageData?.ocr
  const hasOCRData = Array.isArray(ocrArray) && ocrArray.length > 0
  const text = hasOCRData ? String(ocrArray[0]) : ''

  const lines = text.split('\n').join(', ')
  const hasNewLine = lines?.length > 1

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
                  <div
                    className='bot-message'

                    // avgTypingDelay={10} stdTypingDelay={1}
                  >
                    <div className='card-body'>{lines ? lines : 'No OCR data'}</div>
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
