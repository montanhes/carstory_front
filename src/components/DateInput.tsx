import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, parse, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-day-picker/style.css'

interface DateInputProps {
  value: string // Formato ISO: YYYY-MM-DD
  onChange: (isoDate: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export default function DateInput({
  value,
  onChange,
  placeholder = 'DD/MM/AAAA',
  required = false,
  className = '',
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayValue, setDisplayValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Atualiza displayValue quando value muda
  useEffect(() => {
    if (value) {
      try {
        const date = parse(value, 'yyyy-MM-dd', new Date())
        if (isValid(date)) {
          setDisplayValue(format(date, 'dd/MM/yyyy'))
        }
      } catch {
        setDisplayValue('')
      }
    } else {
      setDisplayValue('')
    }
  }, [value])

  // Fecha o calendário quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Remove tudo que não é número
    const cleaned = input.replace(/\D/g, '')

    if (!cleaned) {
      setDisplayValue('')
      return
    }

    // Formata enquanto digita
    let formatted = cleaned
    if (cleaned.length >= 3) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2)
    }
    if (cleaned.length >= 5) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8)
    }

    setDisplayValue(formatted)

    // Se completou DD/MM/AAAA, tenta converter para ISO
    if (cleaned.length === 8) {
      try {
        const date = parse(formatted, 'dd/MM/yyyy', new Date())
        if (isValid(date)) {
          onChange(format(date, 'yyyy-MM-dd'))
        }
      } catch {
        // Ignora data inválida
      }
    }
  }

  const handleDaySelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      const isoDate = format(date, 'yyyy-MM-dd')
      onChange(isoDate)
      setIsOpen(false)
    }
  }

  const selectedDate = value
    ? (() => {
        try {
          const date = parse(value, 'yyyy-MM-dd', new Date())
          return isValid(date) ? date : undefined
        } catch {
          return undefined
        }
      })()
    : undefined

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleTextChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          maxLength={10}
          className={className}
          required={required}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-lg"
          tabIndex={-1}
        >
          📅
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-xl p-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            locale={ptBR}
            className="rdp-custom"
          />
        </div>
      )}
    </div>
  )
}
