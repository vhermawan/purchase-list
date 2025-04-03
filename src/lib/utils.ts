import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maskingNumber(value: string) {
  const rawValue = value.replace(/[^0-9]/g, '')
  return Number(rawValue)
}
