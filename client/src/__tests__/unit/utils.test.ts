import { describe, it, expect } from 'vitest'
import { formatDate, formatRelativeTime, truncate, slugify } from '@utils/formatters'
import { isValidEmail, isValidPassword } from '@utils/validation'

describe('Formatters', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2026-05-25')
      const formatted = formatDate(date)
      expect(formatted).toContain('2026')
      expect(formatted).toContain('May')
      expect(formatted).toContain('25')
    })
  })

  describe('truncate', () => {
    it('truncates long strings', () => {
      const result = truncate('Hello World', 5)
      expect(result).toBe('Hello...')
    })

    it('does not truncate short strings', () => {
      const result = truncate('Hello', 10)
      expect(result).toBe('Hello')
    })
  })

  describe('slugify', () => {
    it('converts string to slug', () => {
      const result = slugify('Hello World')
      expect(result).toBe('hello-world')
    })
  })
})

describe('Validation', () => {
  describe('isValidEmail', () => {
    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(isValidEmail('not-an-email')).toBe(false)
    })
  })

  describe('isValidPassword', () => {
    it('validates password length', () => {
      expect(isValidPassword('12345678')).toBe(true)
      expect(isValidPassword('123')).toBe(false)
    })
  })
})