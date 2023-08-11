import React, {FC, useEffect, useState} from 'react'
import {useAuthService} from '../../services/authService'
import {useGlobal} from '../../context/AuthContext'
import RobotIcon from '../../../_metronic/assets/icons/robot.svg'
import UserIcon from '../../../_metronic/assets/icons/user.svg'
import Logo from '../../../_metronic/assets/Logo.svg'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'

const TextToCode: FC = () => {
  const {createCodeChat, createCodeChatGoogle} = useAuthService()
  const {
    setLoading,
    setCode,
    code,
    setActiveBalance,
    balance,
    setShowGlobalAlert,
    version,
    setVersion,
  } = useGlobal()
  const [data, setData] = useState<any>({prompt: ''})
  const [messages, setMessages] = useState<any[]>([])
  const [isLoadingBotResponse, setIsLoadingBotResponse] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)

  const handleCreateCode = async (data: any): Promise<{content: string}> => {
    if (data) {
      try {
        const datas =
          version === 'v2' ? await createCodeChatGoogle(data) : await createCodeChat(data)

        setCode(datas)
        setLoading(false)
        if (datas) {
          setActiveBalance(true)
        }

        return datas
      } catch (error) {
        console.error('Error creating post:', error)
        return {content: ''}
      }
    } else {
      return {content: ''}
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoadingBotResponse) {
      e.preventDefault() // Formun varsayılan davranışını engelle
      exampleUsage()
    }
  }

  const exampleUsage = async () => {
    if (!data.prompt.trim()) {
      setShowAlert(true)
      return
    } else {
      setShowAlert(false)
    }

    if (balance <= 0) {
      setShowGlobalAlert(true)
      setTimeout(() => {
        setShowGlobalAlert(false)
      }, 300000) // 3 saniye sonra hata resmini gizle
    }
    setLoading(true)
    setIsButtonDisabled(true)
    setIsLoadingBotResponse(true)
    setData({prompt: ''})

    const lastMessage = messages[messages.length - 1]

    const postData =
      version === 'v1'
        ? {
            user: 'assistant',
            previousMessage: lastMessage,
            Prompt: `${data.prompt}. outputformat:markdown`,
          }
        : {
            previousMessage: lastMessage,
            Prompt: `${data.prompt}. outputformat:markdown`,
          }

    setMessages((prevMessages) => [...prevMessages, {isUser: true, text: data.prompt}])

    try {
      const response = await handleCreateCode(postData)
      setIsLoadingBotResponse(false)

      setMessages((prevMessages) => [...prevMessages, {isUser: false, text: response?.content}])
    } catch (error) {
      console.error('Error fetching response:', error)
    } finally {
      setLoading(false)
      setIsButtonDisabled(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setData((prevState: any) => ({...prevState, [name]: value}))
  }

  const handleNewChat = () => {
    setMessages([]) // Mesajları temizle
    setData({prompt: ''}) // Giriş alanını temizle
    setIsLoadingBotResponse(false) // İşlem devam ediyorsa, yükleniyor durumunu temizle
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages]) // `messages` arrayinin her değiştiğinde bu effecti çalıştır

  return (
    <div
      ref={messagesEndRef}
      style={{maxHeight: '600px', overflow: 'scroll', marginTop: '5rem', overflowX: 'hidden'}}
      className='container d-flex flex-column h-100 bg-red '
    >
      {showAlert && (
        <div
          className='alert alert-warning alert-dismissible fade show position-absolute top-0 w-50 mt-4 start-50 translate-middle-x'
          role='alert'
          style={{zIndex: 1030}}
        >
          Please fill the prompt
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}
      {!messages.length && (
        <div className='row d-flex justify-content-center align-items-center h-100'>
          <img style={{opacity: '0.1', width: '400px'}} src={Logo} alt='Hyper Logo' />
        </div>
      )}
      {balance > 0 && (
        <div className='row mb-8 flex-grow-1 d-flex justify-content-center align-items-center '>
          <div className='col-lg-10'>
            {messages.map((message, index) => (
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
                {message.isUser ? (
                  <div className='user-message'>
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  <div
                    key={index}
                    className='bot-message'
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
                )}
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
      )}

      <div
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100%',
        }}
        className='row mb-8 flex-grow-1 d-flex justify-content-center align-items-end position-sticky fixed-bottom z-index-2 mb-6 d-flex  flex-lg-grow-1'
      >
        <div className='row mb-3 flex-grow-1 d-flex justify-content-center align-items-start position-sticky fixed-top z-index-2 mb-3 d-flex'>
          <div className='col-lg-10 d-flex justify-content-center gap-2'>
            <button
              style={{
                border: '1px1px solid #8080804d',
                borderRadius: '2rem',
                background: '#3e3e44',
                color: 'white',
              }}
              className='btn btn-light btn-sm mt-3'
              type='button'
              onClick={handleNewChat}
            >
              New Chat
            </button>
            {/* <button
              style={{
                border: version === 'v2' ? '2px solid #776DE1' : '1px solid rgb(255 122 4)',
                borderRadius: '2rem',
                color: version === 'v2' ? '#776DE1' : 'rgb(255 122 4)',
                fontWeight: version === 'v2' ? 'bold' : '',
              }}
              className='btn btn-light btn-sm mt-3'
              type='button'
              onClick={() => setVersion('v2')}
            >
              Hyper V2
            </button> */}
            {/* <button
              style={{
                border: version === 'v1' ? '2px solid #776DE1' : '1px solid #8080804d',
                borderRadius: '2rem',
                color: version === 'v1' ? '#776DE1' : '',
                fontWeight: version === 'v1' ? 'bold' : '',
              }}
              className='btn btn-light btn-sm mt-3'
              type='button'
              onClick={() => setVersion('v1')}
            >
              Hyper V1
            </button> */}
          </div>
        </div>
        <div className='col-lg-10'>
          <div
            style={{
              borderRadius: '1rem',
              border: '3px solid rgb(251 114 183 / 31%)',
              padding: '0.5rem',
            }}
            className='input-group relative chat-input-bar m-auto  '
          >
            <input
              onKeyDown={handleKeyDown}
              className='form-control border-0 bg-transparent form-control-lg  border border-primary-light-dark-to'
              type='text'
              placeholder='Please enter prompt'
              name='prompt'
              style={{
                fontSize: '12px',
                boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              }}
              onChange={handleChange}
              value={data.prompt}
            />
            <div className='input-group-append absolute display-flex'>
              <button
                style={{
                  borderRadius: '1rem',
                  color: 'white',
                  background: 'linear-gradient(270deg, #ff9085 0%, #fb6fbb 100%',
                }}
                onClick={exampleUsage}
                className='btn btn-light btn-sm h-42'
                type='button'
                disabled={isButtonDisabled || isLoadingBotResponse}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextToCode
