import React, {FC, useEffect, useState} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {useGlobal} from '../../context/AuthContext'
import {CopyToClipboard} from 'react-copy-to-clipboard'
// import Typist from 'react-typist'
import UserIcon from '../../../_metronic/assets/icons/user.svg'
import RobotIcon from '../../../_metronic/assets/icons/robot.svg'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'

const TextToContract: FC = () => {
  const {
    setLoading,
    contractData,
    loading,
    promptTitle,
    setPromptTitle,
    setContractData,
    showAlert,
    messages,
    isLoadingBotResponse,
  } = useGlobal()
  const [copy, setCopy] = useState<boolean>(false)

  useEffect(() => {
    setContractData('')
    setPromptTitle('')
    setLoading(false)
  }, [window.location])

  return (
    <div style={{position: 'relative'}}>
      {showAlert && (
        <div
          className='alert alert-warning alert-dismissible fade show position-absolute top-0  w-50 mt-4 start-50 translate-middle-x'
          role='alert'
          style={{zIndex: 1030}}
        >
          {showAlert}
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
          ></button>
        </div>
      )}

      <div className='row justify-content-center'>
        <div className='col-md-8 mx-auto'>
          {messages?.map((message: any, index: any) => (
            <p key={index} className='chat-container'>
              {message.isUser ? (
                <img
                  style={{width: '40px', marginRight: '1rem', float: 'left'}}
                  src={UserIcon}
                  alt=''
                />
              ) : (
                <img
                  style={{width: '40px', marginRight: '1rem', float: 'left'}}
                  src={RobotIcon}
                  alt=''
                />
              )}
              <div
                key={index}
                className={message.isUser ? 'user-message' : 'bot-message'}
                // avgTypingDelay={10}
                // stdTypingDelay={1}
              >
                {
                  message.text.includes('```') ? (
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
                    // <Typist avgTypingDelay={10} stdTypingDelay={1}>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  )
                  // </Typist>
                }
              </div>
            </p>
          ))}
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
    </div>
  )
}

export default TextToContract
