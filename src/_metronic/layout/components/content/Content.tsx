import {useEffect, useState} from 'react'
import {useLocation} from 'react-router'
import clsx from 'clsx'
import {useLayout} from '../../core'
import {DrawerComponent} from '../../../assets/ts/components'
import {WithChildren} from '../../../helpers'
import History from '../history/History'
import styles from './Content.module.scss'
import {useGlobal} from '../../../../app/context/AuthContext'
import {HiOutlineArrowCircleLeft} from 'react-icons/hi'
import {useNavigate} from 'react-router-dom'
import RobotIcon from '../../../../_metronic/assets/icons/robot.svg'
import UserIcon from '../../../../_metronic/assets/icons/user.svg'
import {useAuthService} from '../../../../app/services/authService'
import {ReactMarkdown} from 'react-markdown/lib/react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

const Content = ({children}: WithChildren) => {
  const {config, classes} = useLayout()
  const location = useLocation()
  const {getHistory} = useAuthService()
  const {
    openHistory,
    setOpenHistory,
    setHistory,
    accessToken,
    account,
    code,
    messages,
    imageData,
    history,
  } = useGlobal()
  const [historyData, setHistoryData] = useState<Record<string, unknown>>({})
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    DrawerComponent.hideAll()
  }, [location])

  const navigate = useNavigate()

  const handleBackButton = () => {
    setOpenHistory(false)
  }

  useEffect(() => {
    if (!accessToken) return
    getHistory(accessToken)
      .then((res) => {
        let filteredHistory
        if (location.pathname === '/hyperchat') {
          filteredHistory = res.filter((item: any) => item.types === 1)
        } else if (location.pathname === '/hypercodes') {
          filteredHistory = res.filter((item: any) => item.types === 2)
        } else if (location.pathname === '/hyperart') {
          filteredHistory = res.filter((item: any) => item.types === 6)
        } else if (location.pathname === '/hyperportraits') {
          filteredHistory = res.filter((item: any) => item.types === 3)
        } else if (location.pathname === '/hyperportraits') {
          filteredHistory = res.filter((item: any) => item.types === 4)
        } else if (location.pathname === '/hyperocr') {
          filteredHistory = res.filter((item: any) => item.types === 5)
        } else if (location.pathname === '/hyperextract') {
          filteredHistory = res.filter((item: any) => item.types === 3)
        }
        setHistory(filteredHistory)
      })
      .catch((err) => {})
  }, [accessToken, account, location, code, messages, imageData])

  const pathname = location.pathname

  return (
    <div
      id='kt_app_content'
      className={clsx(
        'app-content flex-column-fluid ',
        classes.content.join(' '),
        config?.app?.content?.class
      )}
    >
      {openHistory ? (
        <div className={`${styles.content}`}>
          <div onClick={handleBackButton} className={`${styles.closeBtn}`}>
            <HiOutlineArrowCircleLeft />
          </div>
          {pathname === '/hyperchat' ||
          pathname === '/hypercodes' ||
          pathname === 'hypercontracts' ? (
            <div className={`${styles.contentItem} col-lg-9`}>
              <div className={styles.chatHistory}>
                <div className={styles.userPrompt}>
                  <img
                    style={{width: '40px', marginRight: '1rem', float: 'left'}}
                    src={UserIcon}
                    alt=''
                  />
                  <span className={styles.userPromptSpan}>
                    {typeof historyData.query === 'string'
                      ? historyData.query.replace('outputformat:markdown', '')
                      : 'Default Value'}
                  </span>
                </div>
                <div className={styles.responsePrompt}>
                  <img
                    style={{width: '40px', marginRight: '1rem', float: 'left'}}
                    src={RobotIcon}
                    alt=''
                  />
                  <span className={styles.responsePromptSpan}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      {typeof historyData.response === 'string' &&
                      historyData.response.includes('```') ? (
                        historyData.response.split('```').map((part: any, index: any) =>
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
                        <ReactMarkdown>
                          {typeof historyData.response === 'string'
                            ? historyData.response
                            : 'Default Value'}
                        </ReactMarkdown>
                      )}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
              }}
            >
              {typeof historyData?.response === 'string' &&
                historyData?.response.match(/(http|https):\/\/[^ "']+/g)?.map((url, index) => (
                  <img
                    style={{
                      borderRadius: '1rem',
                      width: '300px',
                      objectFit: 'contain',
                    }}
                    key={index}
                    src={url}
                    alt=''
                  />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            marginTop: '5rem',
            height: ' 100%',
          }}
        >
          {children}
        </div>
      )}
      {window.location.pathname !== '/marketplace' && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 999999,
            width: showModal ? '20%' : 'fit-content',
            height: '80%',
            borderRadius: '0.5rem',
          }}
        >
          <History
            showModal={showModal}
            setShowModal={setShowModal}
            setHistoryData={setHistoryData}
            setOpenHistory={setOpenHistory}
          />
        </div>
      )}
    </div>
  )
}

export {Content}
