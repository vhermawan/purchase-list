import { test, expect } from '@playwright/test'

test.describe('Data Persistence Tests', () => {
  const testSale = {
    invoiceCode: 'PERSIST-001',
    date: '2023-05-15',
    product: 'Persistence Test Product',
    qty: '3',
    price: '150',
  }

  test('should persist data after page reload', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Add New Sale' }).click()
    await page.getByLabel('Invoice Code').fill(testSale.invoiceCode)

    await page.getByTestId('date-picker-btn').click()

    await expect(page.getByTestId('Invoice Date')).toBeVisible()

    await page
      .getByTestId('Invoice Date')
      .getByRole('gridcell', { name: '15' })
      .click()

    await page.getByLabel('Product Name').first().fill(testSale.product)
    await page.getByLabel('Quantity').first().fill(testSale.qty)
    await page.getByLabel('Price').first().fill(testSale.price)
    await page.getByRole('button', { name: 'Add Sale' }).click()

    await expect(
      page.getByRole('cell', { name: testSale.invoiceCode }),
    ).toBeVisible()

    await page.reload()

    await expect(
      page.getByRole('cell', { name: testSale.invoiceCode }),
    ).toBeVisible()
  })
})
