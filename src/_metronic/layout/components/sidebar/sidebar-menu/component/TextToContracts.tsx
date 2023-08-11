import React, {FC, useEffect, useState} from 'react'
import {useAuthService} from '../../../../../../app/services/authService'
import {useGlobal} from '../../../../../../app/context/AuthContext'

const TextToContract: FC = () => {
  const {createCodeChat} = useAuthService()
  const {
    setLoading,
    promptTitle,
    setPromptTitle,
    setContractData,
    showAlert,
    setShowAlert,
    contractData,
    messages,
    setMessages,
    setCode,
    isLoadingBotResponse,
    setIsLoadingBotResponse,
    setActiveBalance,
    activeBalance,
    balance,
    setShowGlobalAlert,
    setOpenHistory,
  } = useGlobal()
  const [data, setData] = useState<any>({prompt: '', network: 'Ethereum', contractType: 'Standard'})

  const networkList = ['Ethereum', 'Polygon', 'Binance Smart Chain']
  const contractTypeList = ['Standard', 'Deflationary', 'Taxable', 'Pausable']
  const functionsList = ['Transfer', 'TransferFrom', 'Burn', 'BurnFrom', 'Mint', 'Approve']

  const handleCreateCode = async (data: any): Promise<{content: string}> => {
    if (data) {
      try {
        const datas = await createCodeChat(data)
        setCode(datas)
        setLoading(false)
        return datas
      } catch (error) {
        console.error('Error creating post:', error)
        return {content: ''}
      }
    } else {
      return {content: ''}
    }
  }

  const exampleUsage = async () => {
    await setOpenHistory(false)

    if (balance <= 0) {
      setShowGlobalAlert(true)
      setTimeout(() => {
        setShowGlobalAlert(false)
      }, 3000) // 3 saniye sonra hata resmini gizle
    }
    // Check for validations
    if (!data.TokenName) {
      setShowAlert(`Please fill the Token Name`)
      return
    } else if (!data.Ticker) {
      setShowAlert(`Please fill the Ticker`)
      return
    } else if (!data['Total Token Supply']) {
      setShowAlert(`Please fill the Total Token Supply`)
      return
    } else if (isNaN(Number(data['Total Token Supply']))) {
      setShowAlert(`Total Token Supply must be a number value`)
      return
    } else if (!data.network) {
      setShowAlert(`Please provide a valid network`)
      return
    } else if (!data.contractType) {
      setShowAlert(`Please provide a valid contract type`)
      return
    } else if (functionsList.every((func) => !data[func])) {
      setShowAlert(`Please select at least one function`)
      return
    }

    setLoading(true)

    const lastMessage = messages[messages.length - 1]

    // Filter the selected networks, contract types, and functions
    const selectedFunctions = functionsList.filter((func) => data[func])

    const postData = {
      user: 'assistant',
      previousMessage: lastMessage,
      Prompt: `Write me a ${data.network} Network; ${
        data.contractType
      } token Solidity Smart Contract; Token Name: ${data.TokenName}; Ticker: ${
        data.Ticker
      }; Total Token Supply: ${data['Total Token Supply']}; ${selectedFunctions && 'Add'} ${
        selectedFunctions.length > 1 ? selectedFunctions.join(', ') : selectedFunctions
      } ${selectedFunctions && 'functions;'}. outputformat:markdown`,
    }

    setIsLoadingBotResponse(true)

    try {
      const response = await handleCreateCode(postData)

      setMessages((prevMessages: any) => [
        ...prevMessages,
        {isUser: false, text: response?.content},
      ])
      if (response) {
        setActiveBalance(!activeBalance)
      }
    } catch (error) {
      console.error('Error fetching response:', error)
    } finally {
      setLoading(false)
      setIsLoadingBotResponse(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target
    if (type === 'checkbox') {
      setData((prevState: any) => ({...prevState, [name]: checked}))
    } else {
      setData((prevState: any) => ({...prevState, [name]: value}))
    }
  }

  if (showAlert) {
    setTimeout(() => {
      setShowAlert('')
    }, 3000)
  }

  return (
    <div>
      <div className='row mb-8 flex-column'>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Token Name</label>
        <div className='col-lg-12'>
          <div className='spinner spinner-sm spinner-primary spinner-right'>
            <input
              className='form-control input-change-border'
              type='text'
              placeholder='Please enter token name'
              name='TokenName'
              style={{fontSize: '12px'}}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Ticker</label>
        <div className='col-lg-12'>
          <div className='spinner spinner-sm spinner-primary spinner-right'>
            <input
              className='form-control input-change-border'
              type='text'
              placeholder='Please enter ticker'
              name='Ticker'
              onChange={handleChange}
              style={{fontSize: '12px'}}
            />
          </div>
        </div>
      </div>
      <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>
          Total Token Supply
        </label>
        <div className='col-lg-12'>
          <div className='spinner spinner-sm spinner-primary spinner-right'>
            <input
              className='form-control input-change-border'
              type='text'
              placeholder='Please enter Total Token Supply'
              name='Total Token Supply'
              //   value={data.negativePrompt}
              onChange={handleChange}
              style={{fontSize: '12px'}}
            />
          </div>
        </div>
      </div>
      <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Network</label>
        <div className='col'>
          <div className='row align-items-center'>
            {networkList?.map((key: any) => (
              <div key={key} className='col-md-4'>
                <label className='form-check form-check-custom form-check-solid  d-flex'>
                  <input
                    className='form-check-input w-15px h-15px'
                    type='radio'
                    defaultChecked={key === 'Ethereum'}
                    checked={data.network ? data.network === key : key === 'Ethereum'}
                    value={key}
                    name='network'
                    onChange={handleChange}
                  />
                  <span className='form-check-label text-muted fs-9 '>{key}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Contract Type</label>
        <div className='col'>
          <div className='row align-items-center'>
            {contractTypeList?.map((key: any) => (
              <div key={key} className='col-md-4'>
                <label className='form-check form-check-custom form-check-solid  d-flex'>
                  <input
                    className='form-check-input w-15px h-15px'
                    type='radio'
                    value={key}
                    checked={data.contractType ? data.contractType === key : key === 'Standart'}
                    name='contractType'
                    onChange={handleChange}
                  />
                  <span className='form-check-label text-muted fs-9 '>{key}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='row mb-8 flex-column '>
        <label className='col-lg-3 col-form-label text-nowrap light-span-text'>Functions</label>
        <div className='col'>
          <div className='row align-items-center'>
            {functionsList?.map((key: any) => (
              <div key={key} className='col-md-4'>
                <label className='form-check form-check-custom form-check-solid  d-flex'>
                  <input
                    className='form-check-input w-15px h-15px'
                    type='checkbox'
                    value={key}
                    // checked={data.functionsList ? data.functionsList === key : key === 'Transfer'}
                    name={key} // değişiklik burada
                    onChange={handleChange}
                  />
                  <span className='form-check-label text-muted fs-9 '>{key}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type='button'
        className='btn btn-primary fw-bold btn-sm gradient-bg'
        onClick={exampleUsage}
      >
        Generate
      </button>
    </div>
  )
}

export default TextToContract
