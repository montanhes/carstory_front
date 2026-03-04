import { useRegisterSW } from 'virtual:pwa-register/react'

export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="alert bg-base-200 border border-base-300 shadow-xl gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-sm flex-1">Nova versão disponível!</span>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setNeedRefresh(false)}
          >
            Depois
          </button>
          <button
            className="btn btn-primary btn-xs"
            onClick={() => updateServiceWorker(true)}
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  )
}
