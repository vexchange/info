import numeral from 'numeral'

export const formatCurrency = (num = 0) => numeral(num).format('$0,0.00')
export const formatPercentage = (num) => numeral(num).format('0.0%')
export const formatPrice = (num = 0) => numeral(num).format('$0.00000')
