import numeral from 'numeral'
import { ethers } from 'ethers'
import { Text } from 'rebass'

export const formatCurrency = (num = 0) => numeral(num).format('$0,0.00')
export const formattedPercent = (num) => numeral(num).format('0.0%')
export const formatPrice = (num = 0) => numeral(num).format('$0.00000')

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num, digits) => {
  const formatter = new Intl.NumberFormat([], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return formatter.format(num)
}

export const isAddress = (value) => {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}