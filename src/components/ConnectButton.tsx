import * as React from 'react'
import { useConnect, useDisconnect, useConnection, useConnectors } from 'wagmi'
import type { Connector } from 'wagmi'

// Función para abreviar dirección
function shortenAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4)
}

export function ConnectButton() {
  const { isConnected, address } = useConnection()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()

  const [menuOpen, setMenuOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Cierra menú automáticamente al conectar/desconectar
  React.useEffect(() => {
    setMenuOpen(false)
  }, [isConnected])

  // Cierra menú al hacer click fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Función para conectar una sola wallet
  function connectSingle(connector: Connector) {
    connectors.forEach(c => {
      if (c.id !== connector.id) {
        try { disconnect({ connector: c }) } catch {}
      }
    })
    connect({ connector })
  }

  return (
    <div className="connect-btn-container" ref={containerRef}>
      {/* Botón principal */}
      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className="connect-btn"
        type="button"
      >
        {isConnected ? shortenAddress(address || '') : 'Connect Wallet'}
      </button>

      {/* Menú desplegable */}
      {menuOpen && (
        <div className="connect-menu">
          {!isConnected
            ? connectors.map(connector => (
                <button
                  key={connector.id}
                  onClick={() => connectSingle(connector)}
                  type="button"
                >
                  {connector.name}
                </button>
              ))
            : (
                <button
                  onClick={() => disconnect()}
                  type="button"
                >
                  Disconnect
                </button>
              )
          }
        </div>
      )}
    </div>
  )
}
