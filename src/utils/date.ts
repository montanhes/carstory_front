/**
 * Converte data de ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
 * Exemplo: "2024-03-15" → "15/03/2024"
 */
export function formatDateToBR(dateStr: string): string {
  if (!dateStr) return ''

  try {
    const [year, month, day] = dateStr.split('-')
    if (!year || !month || !day) return ''
    return `${day}/${month}/${year}`
  } catch {
    return ''
  }
}

/**
 * Converte data de formato brasileiro (DD/MM/YYYY) para ISO (YYYY-MM-DD)
 * Exemplo: "15/03/2024" → "2024-03-15"
 */
export function formatDateToISO(dateStr: string): string {
  if (!dateStr) return ''

  try {
    const parts = dateStr.split('/')
    if (parts.length !== 3) return ''
    const [day, month, year] = parts
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

/**
 * Handler para input de data que formata conforme o usuário digita
 * Aceita entrada e formata automaticamente como DD/MM/YYYY
 * Exemplo: usuario digita "15032024" → "15/03/2024"
 */
export function handleDateChange(value: string): string {
  // Remove todos os caracteres não numéricos
  let cleaned = value.replace(/\D/g, '')

  if (!cleaned) return ''

  // Limita a 8 dígitos (DDMMYYYY)
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8)

  // Formata enquanto o usuário digita
  let formatted = ''
  if (cleaned.length <= 2) {
    formatted = cleaned
  } else if (cleaned.length <= 4) {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2)
  } else {
    formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4)
  }

  return formatted
}

/**
 * Valida se uma data está no formato DD/MM/YYYY e é válida
 */
export function isValidDateBR(dateStr: string): boolean {
  if (!dateStr) return false

  const parts = dateStr.split('/')
  if (parts.length !== 3) return false

  const [day, month, year] = parts.map(p => parseInt(p))

  if (isNaN(day) || isNaN(month) || isNaN(year)) return false

  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (year < 1900 || year > 2100) return false

  // Valida dias por mês
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    daysInMonth[1] = 29 // Ano bissexto
  }

  return day <= daysInMonth[month - 1]
}
