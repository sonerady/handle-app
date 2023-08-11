import React, {FC, useEffect, useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {useGlobal} from '../../context/AuthContext'
// import Typist from 'react-typist'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'

import {ReactMarkdown} from 'react-markdown/lib/react-markdown'
import RobotIcon from '../../../_metronic/assets/icons/robot.svg'
import UserIcon from '../../../_metronic/assets/icons/user.svg'
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

const TextToPost: FC = () => {
  const {
    setPostData,
    setPromptTitle,
    setLoading,
    showAlert,
    setShowAlert,
    isLoadingBotResponse,
    messages,
    balance,
  } = useGlobal()
  const [copy, setCopy] = useState<boolean>(false)

  useEffect(() => {
    setPostData('')
    setPromptTitle('')
    setLoading(false)
  }, [window.location])

  return (
    <div className='position-relative'>
      {showAlert && (
        <div
          className='alert alert-warning alert-dismissible fade show position-absolute top-0 w-50 mt-4 start-50 translate-middle-x'
          role='alert'
          style={{zIndex: 1030}}
        >
          {showAlert}
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}
      {balance > 0 && (
        <div className='row mb-8 flex-grow-1 d-flex justify-content-center align-items-center '>
          <div className='col-lg-10'>
            {messages.map((message: any, index: any) => {
              if (!message.isUser) {
                // Sadece mesaj kullanıcıdan gelmiyorsa
                return (
                  <p className='chat-container'>
                    <img
                      style={{width: '40px', marginRight: '1rem', float: 'left'}}
                      src={RobotIcon}
                      alt=''
                    />
                    <div
                      key={index}
                      className={message.isUser ? 'user-message ' : 'bot-message'}
                      // avgTypingDelay={10}
                      // stdTypingDelay={1}
                    >
                      {message.text.includes('```') ? (
                        message.text.split('```').map((part: any, index: any) =>
                          index % 2 === 1 ? (
                            <SyntaxHighlighter
                              key={index}
                              language='javascript'
                              style={materialDark}
                              wrapLines={true}
                              customStyle={{
                                marginTop: '1rem',
                                padding: '1em',
                                paddingTop: '0em',
                                backgroundColor: '#1E1E1E',
                                borderRadius: '0.7rem',
                              }}
                            >
                              {part}
                            </SyntaxHighlighter>
                          ) : (
                            part
                          )
                        )
                      ) : (
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      )}
                    </div>
                  </p>
                )
              }
            })}

            {isLoadingBotResponse && (
              <p className='bot-message-other'>
                <strong>
                  <img
                    style={{width: '40px', marginRight: '1rem', float: 'left'}}
                    src={RobotIcon}
                    alt=''
                  />
                </strong>
                <span className='loading-dots'>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TextToPost
