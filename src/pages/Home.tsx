import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Bem-vindo ao CarStory</h1>
          <p className="py-6">
            Gerencie seus veículos e históricos de manutenção de forma simples e eficiente.
          </p>
          <Link to="/login" className="btn btn-primary">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  )
}
