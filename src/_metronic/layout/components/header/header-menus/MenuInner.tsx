import {useIntl} from 'react-intl'
import {MenuItem} from './MenuItem'

export function MenuInner() {
  const intl = useIntl()
  return (
    <>
      {/* <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/hyperchat' /> */}
      <MenuItem title='HyperCHAT' to='/hyperchat' />
      <MenuItem title='HyperCODES' to='/hypercodes' />
      <MenuItem title='HyperCONTRACTS' to='/hypercontracts' />
      {/* <MenuItem title='Hyper Diff' to='/hyper-diff' /> */}
      <MenuItem title='HyperIMAGES' to='/hyperimages' />
      <MenuItem title='HyperART' to='/hyperart' />
      <MenuItem title='HyperOCR' to='/hyperocr' />
      <MenuItem title='HyperEXTRACT' to='/hyperextract' />
      <MenuItem title='HyperPORTRAITS' to='/hyperportraits' />
      <MenuItem title='HyperPOSTS' to='/hyperposts' />
    </>
  )
}
