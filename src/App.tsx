
import GeneratedForm from './components/GeneratedForm'
import { ConnectButton } from './components/ConnectButton'

export default function App() {
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-left">Akxesa</div>
        <ConnectButton />
      </header>

      <main className="main-content">
        <GeneratedForm />
      </main>

      <footer className="footer">
        <div>Demo Version – Paseo Asset Hub Testnet</div>
        <div>© 2026 Akxesa</div>
      </footer>
    </div>
  )
}
