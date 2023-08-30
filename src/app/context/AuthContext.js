// src/contexts/AuthContext.js
import {createContext, useState, useContext, useEffect} from 'react'
import Cookies from 'js-cookie'
import {useAPI} from '../api'

const AuthContext = createContext()

export const useGlobal = () => {
  return useContext(AuthContext)
}

export const TokenProvider = ({children}) => {
  const [showImportantModal, setShowImportantModal] = useState(false)
  const handleModalToggle = () => setShowImportantModal(!showImportantModal)
  const [authToken, setAuthToken] = useState(null)
  const [commentLength, setCommentLength] = useState(0)
  const [campaignsUser, setCampaignsUser] = useState([])

  const [imageData, setImageData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [promptTitle, setPromptTitle] = useState('')
  const [contractData, setContractData] = useState([])
  const [postData, setPostData] = useState('')
  const [triggerJoin, setTriggerJoin] = useState(false)
  const [code, setCode] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [showAlert, setShowAlert] = useState('')
  const [discordRole, setDiscordRole] = useState('')
  const [successTrigger, setSuccessTrigger] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(false)
  const [localImagePreview, setLocalImagePreview] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoadingBotResponse, setIsLoadingBotResponse] = useState(false)
  const [isLoginMetamask, setIsLoginMetamask] = useState(false)
  const [account, setAccount] = useState('')
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [balance, setBalance] = useState(0)
  const [hgptBalance, setHgptBalance] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [loginMetamask, setLoginMetamask] = useState(false)
  const [activeBalance, setActiveBalance] = useState(false)
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessTokenMarketplace'))
  const [userFile, setUserFile] = useState(null)
  const [showErrorImage, setShowErrorImage] = useState(false)
  const [showGlobalAlert, setShowGlobalAlert] = useState(false)
  const [allCollection, setAllCollection] = useState([])
  const [showKanban, setShowKanban] = useState(false)
  const [allApps, setAllApps] = useState([])
  const [trendingApps, setTrendingApps] = useState([])
  const [newApps, setNewApps] = useState([])
  const [userIsVerified, setUserIsVerified] = useState(false)
  const [verifiedApps, setVerifiedApps] = useState([])
  const [apps, setApps] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loadingCollection, setLoadingCollection] = useState(false)
  const [collection, setCollection] = useState({})
  const [likeCount, setLikeCount] = useState(0)
  const [visitCount, setVisitCount] = useState(0)
  const [history, setHistory] = useState([])
  const [openHistory, setOpenHistory] = useState(false)
  const [version, setVersion] = useState('v1')
  const [alertComment, setAlertComment] = useState()
  const [comments, setComments] = useState({
    next: 1,
    total_page: 1,
    total: 0,
    result: [],
  })
  const [commentsOther, setCommentsOther] = useState({
    next: 1,
    total_page: 1,
    total: 0,
    result: [],
  })
  const [isSuccess, setIsSuccess] = useState('')
  const [appSlider, setAppSlider] = useState([])
  const [imageId, setImageId] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [googleAccessToken, setGoogleAccessToken] = useState('')
  const [searchData, setSearchData] = useState([])
  const [discordAccessToken, setDiscordAccessToken] = useState('')
  const [mailAccessToken, setMailAccessToken] = useState('')
  const [password, setPassword] = useState('')
  const [metamaskAccessToken, setMetamaskAccessToken] = useState('')
  const [waitingApps, setWaitingApps] = useState([])
  const [approvedApps, setApprovedApps] = useState([])
  const [isValidate, setIsValidate] = useState(false)
  const [rejectedApps, setRejectedApps] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [showNotificationForSize, setShowNotificationForSize] = useState(false)
  const [reviewsPublished, setReviewsPublished] = useState()
  const [taskTypes, setTaskTypes] = useState([])
  const [approvalReviews, setApprovalReviews] = useState([])
  const [userWaitingApps, setUserWaitingApps] = useState([])
  const [userApprovedApps, setUserApprovedApps] = useState([])
  const [userRejectedApps, setUserRejectedApps] = useState([])
  const [daoDatas, setDaoDatas] = useState([])
  const [triggerLogin, setTriggerLogin] = useState(false)
  const [profileAccount, setProfileAccount] = useState('')
  const [userName, setUserName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [contributors, setContributors] = useState([])
  const [waitingAppsAdmin, setWaitingAppsAdmin] = useState([])
  const [discordID, setDiscordID] = useState('')
  const [userId, setUserId] = useState('')
  const [published, setPublished] = useState()
  const [appValidation, setAppValidation] = useState()
  const [reviewValidation, setReviewValidation] = useState()
  const [ranking, setRankingDatas] = useState()
  const [campaigns, setCampaigns] = useState()
  const [userInfo, setUserInfo] = useState()
  const [userRanking, setUserRanking] = useState()
  const [appInSpace, setAppInSpace] = useState()
  const [role, setRole] = useState()
  const [appsById, setAppsById] = useState()
  const [isVisited, setIsVisited] = useState(false)
  const [ratingCount, setRatingCount] = useState(0)
  const [upComingApp, setUpComingApp] = useState()
  const [raitingDatas, setRaitingDatas] = useState(0)
  const [discordUsername, setDiscordUsername] = useState('')
  const [gmailUsername, setGmailUsername] = useState('')
  const [discordEmail, setDiscordEmail] = useState('')
  const [gmailEmail, setGmailEmail] = useState('')
  const [discordIcon, setDiscordIcon] = useState('')
  const [gmailIcon, setGmailIcon] = useState('')
  const [integratedApp, setIntegratedApp] = useState([])
  const [spaceCount, setSpaceCount] = useState(0)
  const validEmail = new RegExp(
    '^(?!0x[a-fA-F0-9]{40})[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
  )

  const validUsername = new RegExp('^[A-Za-z][A-Za-z0-9_]{4,29}$')

  const [roles, setRoles] = useState([])
  useEffect(() => {})

  const setToken = (token) => {
    setAuthToken(token)
  }

  // AuthContext.js

  return (
    <AuthContext.Provider
      value={{
        promptTitle,
        setPromptTitle,
        authToken,
        setToken,
        imageData,
        setImageData,
        loading,
        setLoading,
        setContractData,
        contractData,
        setPostData,
        postData,
        code,
        setCode,
        imagePreview,
        setImagePreview,
        showAlert,
        setShowAlert,
        uploadedFile,
        setUploadedFile,
        localImagePreview,
        setLocalImagePreview,
        chatHistory,
        setChatHistory,
        messages,
        setMessages,
        isLoadingBotResponse,
        setIsLoadingBotResponse,
        account,
        setAccount,
        balance,
        setBalance,
        accessToken,
        setAccessToken,
        activeBalance,
        setActiveBalance,
        userFile,
        setUserFile,
        showErrorImage,
        setShowErrorImage,
        showGlobalAlert,
        setShowGlobalAlert,
        allCollection,
        setAllCollection,
        showKanban,
        setShowKanban,
        allApps,
        setAllApps,
        apps,
        setApps,
        collection,
        setCollection,
        setLoadingCollection,
        loadingCollection,
        likeCount,
        setLikeCount,
        visitCount,
        setVisitCount,
        history,
        setHistory,
        openHistory,
        setOpenHistory,
        version,
        setVersion,
        alertComment,
        setAlertComment,
        comments,
        setComments,
        isSuccess,
        setIsSuccess,
        appSlider,
        setAppSlider,
        imageId,
        setImageId,
        openModal,
        setOpenModal,
        googleAccessToken,
        setGoogleAccessToken,
        discordAccessToken,
        setDiscordAccessToken,
        mailAccessToken,
        setMailAccessToken,
        metamaskAccessToken,
        setMetamaskAccessToken,
        roles,
        setRoles,
        showNotification,
        setShowNotification,
        showNotificationForSize,
        setShowNotificationForSize,
        waitingApps,
        setWaitingApps,
        taskTypes,
        setTaskTypes,
        approvedApps,
        setApprovedApps,
        rejectedApps,
        setRejectedApps,
        approvalReviews,
        setApprovalReviews,
        userWaitingApps,
        setUserWaitingApps,
        userApprovedApps,
        setUserApprovedApps,
        userRejectedApps,
        setUserRejectedApps,
        daoDatas,
        setDaoDatas,
        password,
        setPassword,
        triggerLogin,
        setTriggerLogin,
        profileAccount,
        setProfileAccount,
        userName,
        setUserName,
        avatarUrl,
        setAvatarUrl,
        contributors,
        setContributors,
        waitingAppsAdmin,
        setWaitingAppsAdmin,
        discordID,
        setDiscordID,
        newApps,
        setNewApps,
        trendingApps,
        setTrendingApps,
        verifiedApps,
        setVerifiedApps,
        userId,
        setUserId,
        published,
        appValidation,
        reviewValidation,
        ranking,
        campaigns,
        setPublished,
        setReviewValidation,
        setRankingDatas,
        setAppValidation,
        setCampaigns,
        setCommentsOther,
        commentsOther,
        userInfo,
        setUserInfo,
        reviewsPublished,
        setReviewsPublished,
        userRanking,
        setUserRanking,
        appsById,
        setAppsById,
        appInSpace,
        setAppInSpace,
        setIsVisited,
        isVisited,
        ratingCount,
        setRatingCount,
        raitingDatas,
        setRaitingDatas,
        searchData,
        setSearchData,
        upComingApp,
        setUpComingApp,
        discordUsername,
        setDiscordUsername,
        gmailUsername,
        setGmailUsername,
        discordEmail,
        setDiscordEmail,
        gmailEmail,
        setGmailEmail,
        discordIcon,
        setDiscordIcon,
        gmailIcon,
        setGmailIcon,
        integratedApp,
        setIntegratedApp,
        setSpaceCount,
        spaceCount,
        setUserIsVerified,
        userIsVerified,
        setHgptBalance,
        hgptBalance,
        showPopup,
        setShowPopup,
        validEmail,
        validUsername,
        loginMetamask,
        setLoginMetamask,
        isLoginMetamask,
        setIsLoginMetamask,
        isValidate,
        setIsValidate,
        showAnnouncement,
        setShowAnnouncement,
        discordRole,
        setDiscordRole,
        showImportantModal,
        setShowImportantModal,
        handleModalToggle,
        setCommentLength,
        commentLength,
        campaignsUser,
        setCampaignsUser,
        successTrigger,
        setSuccessTrigger,
        triggerJoin,
        setTriggerJoin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
