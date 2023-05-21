import React from 'react'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import './network.css'
import Avalanche from "./avax.png"
import Ethereum from "./eth.png"

export function NetworkSwitcher() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const [ showList, setShowList ] = React.useState(false)

  function showChainList() {
    if(showList) setShowList(false)
    else setShowList(true)
  }

  if(isConnected) {

    return (
      <div className='chain-div'>
        <div className='chain-img-div' onClick={showChainList}>
          { chain.name == "Goerli" ? 
            <img className='chain-img' src={Ethereum} />
          : <img className='chain-img' src={Avalanche} /> }
        </div>

      { showList ?
        <div className='chain-switch'>
          {chains.map((x) => (
            <button
              className='chain-switch-btn'
              disabled={!switchNetwork || x.id === chain?.id}
              key={x.id}
              onClick={() => switchNetwork?.(x.id)}
            >
              {x.name}
              {isLoading && pendingChainId === x.id && ' (switching)'}
            </button>
          ))}

        </div>
      : "" }
      </div>
    )
  }
}
