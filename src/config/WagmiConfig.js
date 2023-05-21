import { infuraProvider } from 'wagmi/providers/infura'
import { mainnet, avalanche } from 'wagmi/chains'
import { createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, avalanche],
    [
        infuraProvider({
            apiKey: process.env.REACT_APP_INFURA_ID,
            stallTimeout: 1_000,
        }),
        publicProvider()
    ]
)


// Set up wagmi config
export const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'HybridgeX',
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  })
