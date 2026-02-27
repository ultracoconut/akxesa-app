import { createConfig, http, injected } from 'wagmi'

// ======================= Custom Chain =======================

export const paseoChain = {
  id: 420420417,
  name: 'Paseo Asset Hub',
  nativeCurrency: { name: 'Paseo', symbol: 'PAS', decimals: 18 },
  rpcUrls: { 
    default: { http: ['https://eth-rpc-testnet.polkadot.io/'] } 
  },
  blockExplers: { 
    default: { name: 'Subscan', url: 'https://assethub-paseo.subscan.io/' } 
  },
  testnet: true,
}

// ======================= Wagmi Config =======================

export const config = createConfig({
  connectors: [
    injected(), // Metamask u otro injected
    // walletConnect({ projectId: '' }), // desactivado
    // safe(), // desactivado
  ],
  chains: [paseoChain],
  transports: {
    [paseoChain.id]: http('https://eth-rpc-testnet.polkadot.io/'),
  },
})
