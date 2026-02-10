/**
 * Formata um número para moeda brasileira (sem símbolo R$)
 * Exemplo: 1234.56 → "1.234,56"
 */
export function formatCurrencyForDisplay(value: number | string): string {
  if (!value && value !== 0) return ''

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return ''

  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Converte uma string formatada em moeda brasileira para número
 * Exemplo: "1.234,56" → 1234.56
 */
export function parseCurrencyFromDisplay(value: string): number | '' {
  if (!value) return ''

  // Remove espaços
  const trimmed = value.trim()
  if (!trimmed) return ''

  // Remove TODOS os caracteres não-numéricos
  const onlyDigits = trimmed.replace(/\D/g, '')
  if (!onlyDigits) return ''

  // Interpreta os últimos 2 dígitos como parte decimal
  // Exemplo: "103456" → 1034.56
  const intValue = parseInt(onlyDigits)
  const numValue = intValue / 100

  return isNaN(numValue) ? '' : numValue
}

/**
 * Handler para input de moeda que formata conforme o usuário digita
 * Remove separadores, formata com . para milhares e , para decimal
 * Exemplos:
 *   "1.034,93" → armazena 1034.93, exibe "1.034,93"
 *   "103493" → armazena 1034.93, exibe "1.034,93"
 *   "1034,93" → armazena 1034.93, exibe "1.034,93"
 */
export function handleCurrencyChange(
  value: string,
  callback: (numValue: number | '') => void
): string {
  if (!value) {
    callback('')
    return ''
  }

  // Converte string formatada em moeda para número
  const numValue = parseCurrencyFromDisplay(value)

  if (numValue === '') {
    return ''
  }

  // Formata para exibição em moeda brasileira
  const formatted = numValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  // Atualiza o valor numérico no state
  callback(numValue)

  return formatted
}
