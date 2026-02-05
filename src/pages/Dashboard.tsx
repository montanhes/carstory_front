export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-base-content">Painel de Controle</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stats bg-base-200 shadow-md border border-base-300">
          <div className="stat">
            <div className="stat-title text-base-content/70">Veículos</div>
            <div className="stat-value text-base-content">0</div>
            <div className="stat-desc text-base-content/50">Total cadastrado</div>
          </div>
        </div>
        <div className="stats bg-base-200 shadow-md border border-base-300">
          <div className="stat">
            <div className="stat-title text-base-content/70">Manutenções</div>
            <div className="stat-value text-base-content">0</div>
            <div className="stat-desc text-base-content/50">Registradas</div>
          </div>
        </div>
        <div className="stats bg-base-200 shadow-md border border-base-300">
          <div className="stat">
            <div className="stat-title text-base-content/70">Gastos</div>
            <div className="stat-value text-base-content">R$ 0</div>
            <div className="stat-desc text-base-content/50">Total este mês</div>
          </div>
        </div>
      </div>
    </div>
  )
}
