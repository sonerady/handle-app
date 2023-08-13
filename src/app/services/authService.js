import {useEffect} from 'react'
import {useAPI} from '../api'
import {useGlobal} from '../context/AuthContext'
import Cookies from 'js-cookie'

export const useAuthService = () => {
  const api = useAPI()
  const {
    accessToken,
    setBalance,
    balance,
    account,
    setShowErrorImage,
    setApps,
    setAllApps,
    setIsOpen,
    setAllCollection,
    setLoading,
    setCollection,
    setLikeCount,
    likeCount,
    setVisitCount,
    version,
    alertComment,
    setAlertComment,
    setComments,
    setIsSuccess,
    setAppSlider,
    imageId,
    setImageId,
    setRoles,
    setVerifiedApp,
    newApps,
    setNewApps,
    trendingApps,
    setTrendingApps,
    verifiedApps,
    setVerifiedApps,
    setPublished,
    setReviewValidation,
    setRankingDatas,
    setAppValidation,
    setCampaigns,
    setCommentsOther,
    setUserInfo,
    setReviewsPublished,
    userRanking,
    setUserRanking,
    setAppsById,
    ratingCount,
    setRatingCount,
    setIsVisited,
    setRaitingDatas,
    searchData,
    setSearchData,
    upComingApp,
    setUpComingApp,
    discordEmail,
    integratedApp,
    setIntegratedApp,
    spaceCount,
    setSpaceCount,
    setHgptToken,
    setHgptBalance,
    setCommentLength,
    campaignsUser,
    setCampaignsUser,
  } = useGlobal()

  const checkBalance = () => {
    if (balance <= 0) {
      // setShowErrorImage(true);
      throw new Error('You do not have sufficient balance, please try again in 24 hours.')
    }
  }

  // DAO PAGE

  const getPublished = async () => {
    try {
      const response = await api.get(`/app/getApplicationPublished?&token=${accessToken}`)
      return setPublished(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  const getRating = async (id) => {
    try {
      const response = await api.get(`/app/app_ratings?&appid=${id}`)
      return setRaitingDatas(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getSliderTop = async () => {
    try {
      const response = await api.get(`/user/slidertop`)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  const getAppValidation = async () => {
    try {
      const response = await api.get(`/app/getApplicationValidation?&token=${accessToken}`)
      return setAppValidation(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const search = async (key, page) => {
    try {
      const response = await api.get(`/apps/search?&key=${key}&page=${page}`)
      setSearchData(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getReviewValidation = async () => {
    try {
      const response = await api.get(`/app/getReviewValidation?&token=${accessToken}`)
      return setReviewValidation(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getReviewsPublished = async () => {
    try {
      const response = await api.get(`/app/getReviewsPublished?&token=${accessToken}`)
      return setReviewsPublished(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getRanking = async () => {
    try {
      const response = await api.get(`/user/getCampaignRankings?&token=${accessToken}`)
      return setRankingDatas(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getSpaceCount = async (appid) => {
    try {
      const response = await api.get(`/app/spaceAdded?app_id=${appid}`)

      setSpaceCount(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getUserRanking = async () => {
    try {
      const response = await api.get(`/user/getUserRanking?token=${accessToken}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setUserRanking(response.data)
      return response.data
    } catch (error) {}
  }

  const getCampigns = async () => {
    try {
      const response = await api.get(`/campaign/getCampaigns`)
      return setCampaigns(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getAllCollection = async (accesTokenOther) => {
    try {
      const response = await api.get(`/collection/getCollection_all?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accesTokenOther}`,
          'Content-Type': 'application/json',
        },
      })
      setAllCollection(response.data)
      return response.data
    } catch (error) {}
  }

  const getTokenBalance = async () => {
    try {
      const response = await api.get(`/metamask/get_balance?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setHgptBalance(response.data)
      return response.data
    } catch (error) {}
  }

  const getRole = async (accessTokenOther) => {
    if (!accessTokenOther) {
      return
    }
    try {
      const response = await api.get(`/User/discord_role?token=${accessTokenOther}`, {
        headers: {
          Authorization: `Bearer ${accessTokenOther}`,
          'Content-Type': 'application/json',
        },
      })
      setRoles(response.data)
      localStorage.setItem('role', response.data.sonuc.role)
      // setLoading(true)
      return response.data
    } catch (error) {}
  }

  const getUserId = async (accessTokenOther) => {
    if (!accessTokenOther) {
      return
    }
    try {
      const response = await api.get(`/user/getUserId?token=${accessTokenOther}`, {
        headers: {
          Authorization: `Bearer ${accessTokenOther}`,
          'Content-Type': 'application/json',
        },
      })

      // setLoading(true)
      return localStorage.setItem('userId', response.data.user_id)
    } catch (error) {}
  }

  const getCollection = async (accesTokenOther, itemId) => {
    try {
      const response = await api.get(
        `/collection/getCollection?collection_id=${itemId}&token=${accesTokenOther}`,
        {
          headers: {
            Authorization: `Bearer ${accesTokenOther}`,
            'Content-Type': 'application/json',
          },
        }
      )

      setCollection(response.data)
      // setLoading(true)
      return response.data
    } catch (error) {}
  }

  const createPost = async (postData) => {
    checkBalance()

    const requestWithTimeout = async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await api.post('/posts', postData)
          resolve(response.data)
        } catch (error) {
          setShowErrorImage(true)
          reject(error)
        }
      })
    }

    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'))
      }, 30000) // 10 saniye
    })

    try {
      const response = await Promise.race([requestWithTimeout(), timeout])
      return response
    } catch (error) {
      if (error.message === 'Request timed out') {
        return createPost(postData) // İstek zaman aşımına uğrarsa, işlemi tekrar dene.
      } else {
      }
    }
  }

  const updateBalance = async () => {
    checkBalance()
    try {
      const response = await api.get(`/user/getBalance?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setBalance(response.data)
      return response.data
    } catch (error) {}
  }

  const getAllApps = async (page, count) => {
    try {
      let url = `/user/allApps?page=${page}&count=${count}`

      if (accessToken) {
        url += `&token=${accessToken}`
      }

      const response = await api.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setAllApps(response.data)
      return response.data
    } catch (error) {
      // Burada hatayı yakalayabilir ve gerekli işlemleri yapabilirsiniz.
      console.error('Bir hata oluştu:', error)
    }
  }

  const getTrendingApps = async () => {
    try {
      const response = await api.get(`/app/getTrendingApps?`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setTrendingApps(response.data)
      return response.data
    } catch (error) {}
  }
  const getUpcoming = async (page, count) => {
    try {
      const response = await api.get(`/user/upcomingApps?page=${page}&count=${count}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setUpComingApp(response.data)
      return response.data
    } catch (error) {}
  }

  const getIntegrated = async (page, count) => {
    try {
      const response = await api.get(`/app/getIntegratedApps`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setIntegratedApp(response.data)
      return response.data
    } catch (error) {}
  }

  const getNewApps = async () => {
    try {
      const response = await api.get(`/app/getNewApps?`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setNewApps(response.data)
      return response.data
    } catch (error) {}
  }

  const getVerifiedApp = async () => {
    try {
      const response = await api.get(`/app/getVerifiedApps?`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setVerifiedApps(response.data)
      return response.data
    } catch (error) {}
  }

  const getValidators = async (id) => {
    try {
      const response = await api.get(`/app/validators?token=${accessToken}&app_id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {}
  }

  const getContributors = async (id) => {
    try {
      const response = await api.get(`/app/contributors?token=${accessToken}&app_id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {}
  }

  const getApps = async () => {
    try {
      const response = await api.get(`/user/getApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setApps(response.data)
      return response.data
    } catch (error) {}
  }

  const getAppsById = async (id) => {
    try {
      const response = await api.get(`/user/allAppsWithId?app_id=${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setAppsById(response.data[0])
      return response.data
    } catch (error) {}
  }
  const getAppInSpace = async (id) => {
    try {
      const response = await api.get(`/user/appInSpace?token=${accessToken}&app_id=${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setIsVisited(response.data)
      return response.data
    } catch (error) {}
  }

  const getAppsOther = async (data) => {
    try {
      const response = await api.get(`/user/getApps?token=${data}`, {
        headers: {
          Authorization: `Bearer ${data}`,
          'Content-Type': 'application/json',
        },
      })
      setApps(response.data)
      return response.data
    } catch (error) {}
  }

  const createTextToImage = async (formData) => {
    checkBalance()

    try {
      const response = await api.post(
        `/ai/st_texttoimage?token=${accessToken}&Prompt=${formData.get(
          'Prompt'
        )}&sample=${formData.get('sample')}&steps=${formData.get('steps')}&negative=${
          formData.get('negative') ? formData.get('negative') : 'negative'
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const createImageToImage = async (postData) => {
    checkBalance()
    try {
      // Append the accessToken to the postData
      postData.append('token', accessToken)
      const response = await api.post(`/ai/imagetoimage?token=${accessToken}`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }
  const updateUser = async (
    userId,
    gmailToken,
    discordToken,
    metamask_id,
    icon,
    userName,
    discordUsername,
    discordIcon,
    gmailUserName,
    gmailIcon,
    discord_email,
    gmail_email,
    discordId, // eklenen
    discordRole // eklenen
  ) => {
    try {
      const response = await api.post(
        `/user/updateUser?user_uid=${userId}&gmailToken=${gmailToken || 'None'}&discordToken=${
          discordToken || 'None'
        }&metamask_id=${metamask_id || 'None'}&icon=${icon || 'None'}&username=${
          userName || 'None'
        }&discord_username=${discordUsername || 'None'}&discord_icon=${
          discordIcon || 'None'
        }&gmail_username=${gmailUserName || 'None'}&gmail_icon=${
          gmailIcon || 'None'
        }&discord_email=${discord_email || 'None'}&gmail_email=${
          gmail_email || 'None'
        }&discord_id=${
          discordId || 'None' // eklenen
        }&discord_role=${discordRole || 'None'}`, // eklenen

        {
          headers: {
            'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, DELETE, OPTIONS, PATCH',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      getRole(accessToken)
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const connectDiscordAccount = async (
    discordId,
    discordToken,
    discordIcon,
    discordUsername,
    discordEmail
  ) => {
    try {
      const response = await api.post(
        `/user/connectDiscordAccount?token=${accessToken}&discord_id=${discordId}&discord_token=${discordToken}&icon=${discordIcon}&discord_username=${discordUsername}&discord_email=${discordEmail}`,
        {
          headers: {
            'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, DELETE, OPTIONS, PATCH',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const connectGoogleAccount = async (gmail_token, gmail_username, gmail_email) => {
    try {
      const response = await api.post(
        `/user/connectGmailAccount?token=${accessToken}&gmail_token=${gmail_token}&gmail_username=${gmail_username}&gmail_email=${gmail_email}`,
        {
          headers: {
            'Access-Control-Allow-Methods': 'GET, POST',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const connectMetamaskAccount = async (metamaskId) => {
    try {
      const response = await api.post(
        `/user/connectMetamaskAccount?token=${accessToken}&metamaskId=${metamaskId}`,
        {
          headers: {
            'Access-Control-Allow-Methods': 'GET, POST',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const disConnectDiscordAccount = async () => {
    try {
      const response = await api.post(`/user/disconnectDiscordAccount?token=${accessToken}`, {
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, DELETE, OPTIONS, PATCH',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const addCampaign = async (campaignName, imageLink, description, prize, start_date, end_date) => {
    try {
      const response = await api.post(
        `/campaign/addCampaign?campaign_name=${campaignName}&image_link=${
          imageLink || 'None'
        }&description=${description || 'None'}&prize=${prize || 'None'}&start_date=${
          start_date || 'None'
        }&end_date=${end_date || 'None'}`,
        {
          headers: {
            'Access-Control-Allow-Methods': 'GET, POST, HEAD, PUT, DELETE, OPTIONS, PATCH',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const fileUpload = async (formData) => {
    try {
      const response = await api.post(`/site/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const verifyProfile = async (email) => {
    try {
      const response = await api.post(`/user/verify_profile?token=${accessToken}&email=${email}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      localStorage.setItem('isVerifiedUser', 'true')

      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const addApp = async (formData) => {
    try {
      const response = await api.post(`/discord_user/addapp?token=${accessToken}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const fixApp = async (formData, app_id) => {
    try {
      const response = await api.post(
        `/app/fixapp?token=${accessToken}&app_id=${app_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const sendForgot = async (mail) => {
    try {
      const response = await api.post(`/user/forgotpassword?email=${mail}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const sendForgotVerification = async (params, newPass) => {
    try {
      const response = await api.post(
        `/user/forgot_pass_verification_link?url_safe=${params}&new_password=${newPass}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const addAppAdmin = async (formData) => {
    try {
      const response = await api.post(`/app/addAppAdmin?token=${accessToken}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const approveReview = async (id) => {
    try {
      const response = await api.post(
        `/user/approveAppReview?token=${accessToken}&app_review_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const rejectReview = async (id, reason) => {
    try {
      const response = await api.post(
        `/user/rejectAppReview?token=${accessToken}&app_review_id=${id}&reject_reason=${reason}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const approveApp = async (id, publish_date) => {
    try {
      const response = await api.post(
        `/user/approveApp?token=${accessToken}&app_id=${id}&publish_date=${publish_date}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const rejectApp = async (id, reason) => {
    try {
      const response = await api.post(
        `/user/rejectApp?token=${accessToken}&app_id=${id}&reject_reason=${reason}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const addReview = async ({appId, userName, rating, comment}) => {
    try {
      const response = await api.post(
        `/user/add_review?token=${accessToken}&appid=${appId}&username=${userName}&rating=${rating}&comment=${comment}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const appJoin = async (appId) => {
    try {
      const response = await api.post(`/user/appjoin?app_id=${appId}&token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setIsSuccess(response.data.app_join.appid)
      return response.data
    } catch (error) {}
  }

  // LIKE POST AND  GET

  const addLike = async (appid) => {
    try {
      const response = await api.post(`/user/add_like?token=${accessToken}&appid=${appid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {}
  }

  const logOut = async (id) => {
    try {
      const response = await api.post(
        `/discord_user/logout?token=${accessToken}&discord_token=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {}
  }

  const googleLogout = async () => {
    try {
      const response = await api.post(`/gmail_user/logout?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {}
  }

  const metamaskLogout = async () => {
    try {
      const response = await api.post(`/metamask_user/logout?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {}
  }

  const discordLogout = async () => {
    try {
      const response = await api.post(`/discord_user/logout?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {}
  }

  const getLike = async (appid) => {
    try {
      const response = await api.get(`/app/get_app_like?appid=${appid}`, {
        headers: {
          Authorization: `Bearer "${accessToken}"`,
        },
      })
      setLikeCount(response.data)
      return response.data
    } catch (error) {}
  }

  const getUserInfo = async () => {
    try {
      const response = await api.get(`/user/getUserInformation?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer "${accessToken}"`,
        },
      })
      setUserInfo(response)
      return response.data
    } catch (error) {}
  }

  const verification = async (param, token) => {
    try {
      const response = await api.get(`/user/verification_link?url_safe=${param}&token=${token}`, {
        headers: {
          Authorization: `Bearer "${accessToken}"`,
        },
      })
      return response.data
    } catch (error) {}
  }
  const profileVerification = async (param, token) => {
    try {
      const response = await api.get(`/user/profile_verification_link?url_safe=${param}`, {
        headers: {
          Authorization: `Bearer "${accessToken}"`,
        },
      })
      return response.data
    } catch (error) {}
  }

  const resendVerification = async (email) => {
    try {
      const response = await api.get(`/user/resend_verification_link?email=${email}`, {
        headers: {
          Authorization: `Bearer "${accessToken}"`,
        },
      })
      setLikeCount(response.data)
      return response.data
    } catch (error) {}
  }

  // GET AND POST VISIT

  const addVisit = async (appid) => {
    try {
      const response = await api.post(`/collection/add_visit?token=${accessToken}&appid=${appid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      return response.data
    } catch (error) {}
  }

  const getVisit = async (appid) => {
    try {
      const response = await api.get(`/app/get_app_visit?appid=${appid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setVisitCount(response.data)
      return response.data
    } catch (error) {}
  }

  // COLLETION POST AND  GET
  const addCollectionList = async (colid, image) => {
    try {
      const response = await api.post(
        `/collection/import_collection?colid=${colid}&resource_ur=${image}&token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      setImageId(response.data.id)
      return response.data
    } catch (error) {}
  }

  const removeCollection = async (colid) => {
    try {
      const response = await api.get(
        `/collection/delete_collection?colid=${colid}&token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {}
  }

  const removeCollectionItem = async (colid, itemId, url) => {
    try {
      const response = await api.post(
        `/collection/delete_collection_images?colid=${colid}&id=${itemId}&resource_ur=${url}&token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {}
  }

  const addCollection = async (collectionName) => {
    try {
      const response = await api.post(
        `/collection/addCollection?token=${accessToken}&collection_name=${collectionName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'content-type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {}
  }

  // ADD AND GET COMMENT

  const addComment = async (reviewData) => {
    try {
      const response = await api.post(
        `/user/add_comment?token=${accessToken}&appid=${reviewData.appId}&comment=${reviewData.comment}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      setAlertComment(response.data.status)
      return response.data
    } catch (error) {
      setShowErrorImage(true)
      console.error(error)
    }
  }

  const getReview = async (page, appid) => {
    try {
      const response = await api.get(`/app/get_review_by_appid?page=${page}&appid=${appid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      // setComments(response.data)
      setCommentLength(response.data.total)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
  const getComment = async (page, appid) => {
    try {
      const response = await api.get(`/app/get_comments_by_appid?page=${page}&appid=${appid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      // setCommentsOther(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getCategories = async () => {
    try {
      const response = await api.get(`/category/getCategories`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
  const getTaskTypes = async () => {
    try {
      const response = await api.get(`/task/getTaskTypes`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getUserCampaignConditions = async () => {
    try {
      const response = await api.get(`/campaign/getUserCampaignConditions?token=${accessToken}`)
      setCampaignsUser(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    } 
  }

  const getWaitingApps = async () => {
    try {
      const response = await api.get(`/user/getWaitingForApprovalApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }
  const getWaitingForAdmin = async () => {
    try {
      const response = await api.get(`/user/getWaitingForAdminApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getUserWaitingForAdmin = async () => {
    try {
      const response = await api.get(`/user/getUserWaitingForAdminApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getUserWaitingApp = async () => {
    try {
      const response = await api.get(`/user/getUserWaitingForApprovalApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getUserApprovedApp = async () => {
    try {
      const response = await api.get(`/user/getUserApprovedApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getUserRejectedApp = async () => {
    try {
      const response = await api.get(`/user/getUserRejectedApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getApprovedApps = async () => {
    try {
      const response = await api.get(`/user/getApprovedApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getRejectedApps = async () => {
    try {
      const response = await api.get(`/user/getRejectedApps?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }
  const getForApprovalReviews = async () => {
    try {
      const response = await api.get(`/user/getWaitingForApprovalAppReviews?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getWaitingReviewsForAdmin = async () => {
    try {
      const response = await api.get(`/user/getWaitingForAdminAppReviews?token=${accessToken}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const getAppSlider = async (appid) => {
    try {
      const response = await api.get(`/user/appslider?appid=${appid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      setAppSlider(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const createOcr = async (postData) => {
    checkBalance()

    try {
      const response = await api.post(`/ai/ocr?token=${accessToken}`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,

          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const createFeature = async (postData) => {
    checkBalance()

    try {
      const response = await api.post(`/ai/imagetotext?token=${accessToken}`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const createTextToDavinci = async (postData) => {
    checkBalance()

    try {
      const response = await api.post(
        `/ai/davincitext2img?prompt=${postData.Prompt}&token=${accessToken}&number=${postData.number}&w=512&h=512`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const createContracts = async (data) => {
    checkBalance()

    try {
      const response = await api.post(
        `/ai/code?user=${data.user}&Prompt=${data.Prompt}&token=${accessToken}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const createPosts = (data) => {
    checkBalance()

    try {
      const response = api.post(
        `/ai/code?user=${data.user}&Prompt=${data.Prompt}&token=${accessToken}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      setShowErrorImage(true)
    }
  }

  const createCodeChat = async (data) => {
    checkBalance()
    try {
      const response = await api.post(
        `/ai/gpt3?User=${data.user}&Prompt=${data.Prompt}&token=${accessToken}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('createCodeChat error:', error)
      setShowErrorImage(true)
    }
  }

  const resetPassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.post(
        `/user/resetpassword?token=${accessToken}&old_password=${oldPassword}&new_password=${newPassword}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('createCodeChat error:', error)
      setShowErrorImage(true)
    }
  }

  const createCodeChatGoogle = async (data) => {
    checkBalance()
    try {
      const response = await api.post(
        `/ai/google?Prompt=${data.Prompt}&token=${accessToken}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('createCodeChat error:', error)
      setShowErrorImage(true)
    }
  }

  // GET HISTORY

  const getHistory = async (accesTokenOther) => {
    try {
      const response = await api.get(`/user/userhistory?token=${accesTokenOther}`, {
        headers: {
          Authorization: `Bearer ${accesTokenOther}`,
          'Content-Type': 'application/json',
        },
      })

      return response.data
    } catch (error) {}
  }

  const createCode = async (data) => {
    checkBalance()

    const requestWithTimeout = async () => {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await api.post(
            `/ai/code?user=${data.user}&Prompt=${data.Prompt}&token=${accessToken}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          updateBalance()
          resolve(response.data)
        } catch (error) {
          setShowErrorImage(true)
          reject(error)
        }
      })
    }

    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'))
      }, 30000) // 10 saniye
    })

    try {
      const response = await Promise.race([requestWithTimeout(), timeout])
      return response
    } catch (error) {
      if (error.message === 'Request timed out') {
        return createCode(data) // İstek zaman aşımına uğrarsa, işlemi tekrar dene.
      } else {
      }
    }
  }

  const getImageStyles = async () => {
    try {
      const response = await api.post(
        `/ai/styles`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      return response.data
    } catch (error) {}
  }

  return {
    createPost,
    createTextToImage,
    getImageStyles,
    createContracts,
    createPosts,
    createCode,
    createTextToDavinci,
    createImageToImage,
    createOcr,
    createFeature,
    getAllApps,
    getApps,
    appJoin,
    addCollection,
    getAllCollection,
    getCollection,
    addCollectionList,
    addLike,
    getLike,
    addVisit,
    getVisit,
    createCodeChat,
    getHistory,
    createCodeChatGoogle,
    addComment,
    getComment,
    getAppSlider,
    removeCollection,
    removeCollectionItem,
    getAppsOther,
    getRole,
    fileUpload,
    addApp,
    getCategories,
    getWaitingApps,
    getTaskTypes,
    getApprovedApps,
    getRejectedApps,
    getForApprovalReviews,
    getUserWaitingApp,
    getUserApprovedApp,
    getUserRejectedApp,
    approveReview,
    getUserCampaignConditions,
    addReview,
    approveApp,
    getPublished,
    getAppValidation,
    getReviewValidation,
    getRanking,
    getCampigns,
    verification,
    logOut,
    getValidators,
    getContributors,
    getWaitingForAdmin,
    getUserWaitingForAdmin,
    getWaitingReviewsForAdmin,
    addAppAdmin,
    getTrendingApps,
    getNewApps,
    getVerifiedApp,
    getUserId,
    updateUser,
    rejectApp,
    rejectReview,
    getReviewsPublished,
    addCampaign,
    getReview,
    getUserInfo,
    resetPassword,
    fixApp,
    sendForgot,
    sendForgotVerification,
    getUserRanking,
    getAppsById,
    getAppInSpace,
    getRanking,
    getRating,
    search,
    getUpcoming,
    connectDiscordAccount,
    disConnectDiscordAccount,
    getSliderTop,
    verifyProfile,
    getIntegrated,
    getSpaceCount,
    resendVerification,
    getTokenBalance,
    profileVerification,
    googleLogout,
    connectGoogleAccount,
    connectMetamaskAccount,
    getTokenBalance,
    discordLogout,
    metamaskLogout,
  }
}
