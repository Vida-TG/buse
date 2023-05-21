import React from 'react'
import {
    useAccount
  } from 'wagmi'
import './header.css'
import { Connect } from '../Config/Connect'
import { NetworkSwitcher } from '../Config/NetworkSwitcher'

const Header = () => {
  const { address, isConnected } = useAccount()
  const scanLink = window.location + "scan";
  return (
    <>
        <div className='header'>
            <Connect />
            <NetworkSwitcher />
        </div>
        { window.location.pathname == '/' ?
        <div className='scan-link-div'><a className="scan-link" href={scanLink}>Scan Now</a></div>
        : <div></div> }
    </>
  )
}

export default Header