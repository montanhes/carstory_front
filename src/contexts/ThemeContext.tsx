import { createContext, useContext, useEffect, useState } from 'react'

type Theme =
  | 'abyss'
  | 'emerald'
  | 'cupcake'
  | 'garden'
  | 'forest'
  | 'fantasy'
  | 'black'
  | 'luxury'
  | 'dracula'
  | 'autumn'
  | 'lemonade'
  | 'coffee'
  | 'dim'
  | 'nord'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEMES: Theme[] = [
  'abyss',
  'emerald',
  'cupcake',
  'garden',
  'forest',
  'fantasy',
  'black',
  'luxury',
  'dracula',
  'autumn',
  'lemonade',
  'coffee',
  'dim',
  'nord',
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('abyss')

  useEffect(() => {
    // Carregar tema salvo
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved && THEMES.includes(saved)) {
      setThemeState(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve estar dentro de ThemeProvider')
  }
  return context
}
