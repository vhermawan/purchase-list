import { test, expect } from '@playwright/test'

test.describe('Responsive Design Tests', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'Sales Management App' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Add New Sale' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Add New Sale' }).click()
    await expect(page.getByRole('heading', { name: 'New Sale' })).toBeVisible()

    await expect(page.getByLabel('Invoice Code')).toBeVisible()
    await expect(page.getByTestId('date-picker-btn')).toBeVisible()
  })

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'Sales Management App' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Add New Sale' }),
    ).toBeVisible()
  })
})
