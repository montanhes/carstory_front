import { useState, useEffect } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { X, Download, Share } from 'lucide-react'

const DISMISSED_KEY = 'moviu_pwa_banner_dismissed'
const DISMISS_DAYS  = 30

/* ── detecção de ambiente ── */
const ua = navigator.userAgent

function isMobileBrowser() {
  return /android|iphone|ipad|ipod/i.test(ua)
}
function isIOS() {
  return /iphone|ipad|ipod/i.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream
}
function isFirefox() {
  return /Firefox\/\d/i.test(ua)
}
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}
function wasDismissed() {
  const ts = localStorage.getItem(DISMISSED_KEY)
  return ts ? Date.now() - Number(ts) < DISMISS_DAYS * 86_400_000 : false
}

/* ── tipos de instrução ── */
type Mode = 'native' | 'ios' | 'firefox' | null

export default function PWAInstallBanner() {
  const { canInstall, isInstalled, install } = useInstallPrompt()
  const [mode, setMode]         = useState<Mode>(null)
  const [visible, setVisible]   = useState(false)

  useEffect(() => {
    if (isInstalled || isStandalone() || wasDismissed() || !isMobileBrowser()) return

    if (isIOS()) {
      setMode('ios')
      setVisible(true)
    } else if (isFirefox()) {
      setMode('firefox')
      setVisible(true)
    }
    // modo 'native' → aguarda o beforeinstallprompt
  }, [isInstalled])

  useEffect(() => {
    if (canInstall && !isFirefox() && !isIOS()) {
      setMode('native')
      setVisible(true)
    }
  }, [canInstall])

  if (!visible || !mode) return null

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISSED_KEY, String(Date.now()))
  }

  const handleInstall = async () => {
    const accepted = await install()
    if (!accepted) dismiss()
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-50 flex justify-center pointer-events-none">
      <div
        className="w-full max-w-sm pointer-events-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-base-300/60"
        style={{ background: 'oklch(var(--b2) / 0.97)', backdropFilter: 'blur(16px)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          {/* Ícone do app */}
          <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden shadow-md">
            <img src="/icons/pwa-192x192.png" alt="Moviu" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight">Instalar Moviu</p>
            <p className="text-xs text-base-content/55 mt-0.5 leading-snug">
              {mode === 'native'  && 'Acesse sem abrir o navegador'}
              {mode === 'ios'     && 'Adicione à tela inicial do iPhone'}
              {mode === 'firefox' && 'Instale diretamente pelo menu'}
            </p>
          </div>

          <button
            onClick={dismiss}
            className="btn btn-ghost btn-circle btn-xs shrink-0 text-base-content/40 hover:text-base-content"
          >
            <X size={15} />
          </button>
        </div>

        {/* Corpo */}
        <div className="px-4 pb-4">
          {mode === 'native' && (
            <button
              onClick={handleInstall}
              className="btn btn-primary btn-sm w-full gap-2 shadow-md shadow-primary/20"
            >
              <Download size={15} />
              Instalar agora
            </button>
          )}

          {mode === 'ios' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 text-xs text-base-content/70">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <span>Toque em <Share size={11} className="inline mx-0.5 mb-0.5" /> <strong>Compartilhar</strong> no Safari</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-base-content/70">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <span>Toque em <strong>"Adicionar à Tela de Início"</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-base-content/70">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <span>Confirme tocando em <strong>"Adicionar"</strong></span>
              </div>
            </div>
          )}

          {mode === 'firefox' && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 text-xs text-base-content/70">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <span>Toque no menu <strong>⋮</strong> (três pontos)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-base-content/70">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <span>Toque em <strong>"Instalar"</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-base-content/70">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <span>Confirme tocando em <strong>"Adicionar"</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
