import { test, expect } from '@playwright/test'

test.describe('Sales Management App E2E Tests', () => {
  const testSale = {
    invoiceCode: 'TEST-001',
    date: '03 April 2025',
    product: 'Test Product',
    qty: '5',
    price: '100',
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load the application', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Sales Management App' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Sales Data' }),
    ).toBeVisible()
  })

  test('should navigate to create new sale form', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Sale' }).click()
    await expect(page.getByRole('heading', { name: 'New Sale' })).toBeVisible()
  })

  test('should create a new sale', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Sale' }).click()

    await page.getByLabel('Invoice Code').fill(testSale.invoiceCode)

    await page.getByTestId('date-picker-btn').click()

    await expect(page.getByTestId('Invoice Date')).toBeVisible()

    await page
      .getByTestId('Invoice Date')
      .getByRole('gridcell', { name: '15' })
      .click()

    const buttonText = await page.getByTestId('date-picker-btn').textContent()
    expect(buttonText).toContain('15')

    await page.getByLabel('Product Name').first().fill(testSale.product)
    await page.getByLabel('Quantity').first().fill(testSale.qty)
    await page.getByLabel('Price').first().fill(testSale.price)

    await page.getByRole('button', { name: 'Add Sale' }).click()

    await expect(page.getByTestId('toast-title')).toHaveText(
      'Sale added successfully',
    )

    await expect(
      page.getByRole('cell', { name: testSale.invoiceCode }),
    ).toBeVisible()
  })

  test('should view sale details', async ({ page }) => {
    await test.step('Create a sale', async () => {
      await page.getByRole('button', { name: 'Add New Sale' }).click()
      await page.getByLabel('Invoice Code').fill(testSale.invoiceCode)

      await page.getByTestId('date-picker-btn').click()

      await expect(page.getByTestId('Invoice Date')).toBeVisible()

      await page
        .getByTestId('Invoice Date')
        .getByRole('gridcell', { name: '15' })
        .click()

      const buttonText = await page.getByTestId('date-picker-btn').textContent()
      expect(buttonText).toContain('15')

      await page.getByLabel('Product Name').first().fill(testSale.product)
      await page.getByLabel('Quantity').first().fill(testSale.qty)
      await page.getByLabel('Price').first().fill(testSale.price)
      await page.getByRole('button', { name: 'Add Sale' }).click()
    })

    await page.getByTestId('btn-detail').first().click()

    await expect(
      page.getByRole('heading', { name: 'Sale Details' }),
    ).toBeVisible()
    await expect(page.getByText(testSale.invoiceCode)).toBeVisible()
    await expect(page.getByText(testSale.product)).toBeVisible()

    const expectedTotal = Number(testSale.qty) * Number(testSale.price)
    await expect(page.getByTestId('grand-total')).toHaveText(
      `Rp ${expectedTotal.toLocaleString('id-ID')}`,
    )
  })

  test('should edit a sale', async ({ page }) => {
    await test.step('Create a sale', async () => {
      await page.getByRole('button', { name: 'Add New Sale' }).click()
      await page.getByLabel('Invoice Code').fill(testSale.invoiceCode)

      await page.getByTestId('date-picker-btn').click()

      await expect(page.getByTestId('Invoice Date')).toBeVisible()

      await page
        .getByTestId('Invoice Date')
        .getByRole('gridcell', { name: '15' })
        .click()

      const buttonText = await page.getByTestId('date-picker-btn').textContent()
      expect(buttonText).toContain('15')

      await page.getByLabel('Product Name').first().fill(testSale.product)
      await page.getByLabel('Quantity').first().fill(testSale.qty)
      await page.getByLabel('Price').first().fill(testSale.price)
      await page.getByRole('button', { name: 'Add Sale' }).click()
    })

    await page.getByTestId('btn-edit').first().click()
    await expect(page.getByRole('heading', { name: 'Edit Sale' })).toBeVisible()

    const updatedInvoiceCode = 'TEST-001-UPDATED'
    await page.getByLabel('Invoice Code').fill(updatedInvoiceCode)
    await page.getByRole('button', { name: 'Update Sale' }).click()

    await expect(page.getByTestId('toast-title')).toHaveText(
      'Sale updated successfully',
    )

    await expect(
      page.getByRole('cell', { name: updatedInvoiceCode }),
    ).toBeVisible()
  })

  test('should delete a sale', async ({ page }) => {
    await test.step('Create a sale', async () => {
      await page.getByRole('button', { name: 'Add New Sale' }).click()
      await page.getByLabel('Invoice Code').fill(testSale.invoiceCode)

      await page.getByTestId('date-picker-btn').click()

      await expect(page.getByTestId('Invoice Date')).toBeVisible()

      await page
        .getByTestId('Invoice Date')
        .getByRole('gridcell', { name: '15' })
        .click()

      const buttonText = await page.getByTestId('date-picker-btn').textContent()
      expect(buttonText).toContain('15')

      await page.getByLabel('Product Name').first().fill(testSale.product)
      await page.getByLabel('Quantity').first().fill(testSale.qty)
      await page.getByLabel('Price').first().fill(testSale.price)
      await page.getByRole('button', { name: 'Add Sale' }).click()
    })

    const rowsBefore = await page.locator('tbody tr').count()

    await page.getByTestId('btn-delete').first().click()

    await page.getByTestId('description-confirmation').isVisible()

    await page.getByTestId('btn-confirmation').first().click()

    const rowsAfter = await page.locator('tbody tr').count()
    expect(rowsAfter).toBe(rowsBefore - 1)

    if (rowsAfter === 0) {
      await expect(page.getByText('No sales data available')).toBeVisible()
    }
  })

  test('should add multiple items to a sale', async ({ page }) => {
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

    await page.getByRole('button', { name: 'Add Item' }).click()
    const secondProductName = 'Second Product'
    const secondQty = '2'
    const secondPrice = '200'

    await page.getByLabel('Product Name').nth(1).fill(secondProductName)
    await page.getByLabel('Quantity').nth(1).fill(secondQty)
    await page.getByLabel('Price').nth(1).fill(secondPrice)

    await page.getByRole('button', { name: 'Add Sale' }).click()

    await expect(page.getByTestId('toast-title')).toHaveText(
      'Sale added successfully',
    )

    await page.getByTestId('btn-detail').first().click()

    await expect(page.getByText(testSale.product)).toBeVisible()
    await expect(page.getByText(secondProductName)).toBeVisible()

    const expectedTotal =
      Number(testSale.qty) * Number(testSale.price) +
      Number(secondQty) * Number(secondPrice)
    await expect(page.getByText('Grand Total')).toBeVisible()
    await expect(page.getByTestId('grand-total')).toHaveText(
      `Rp ${expectedTotal.toLocaleString('id-ID')}`,
    )
  })

  test('should apply discount to sale', async ({ page }) => {
    // Navigate to new sale form
    await page.getByRole('button', { name: 'Add New Sale' }).click()

    // Fill the form with a discount
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

    const discount = '50'
    await page.getByLabel('Discount').fill(discount)

    // Submit the form
    await page.getByRole('button', { name: 'Add Sale' }).click()

    // View sale details
    await page.getByTestId('btn-detail').first().click()

    // Verify discount is applied and total is correct
    const subtotal = Number(testSale.qty) * Number(testSale.price)
    const grandTotal = subtotal - Number(discount)

    await expect(page.getByText('Discount')).toBeVisible()
    await expect(page.getByTestId('discount-total')).toHaveText(
      `Rp ${Number(discount).toLocaleString('id-ID')}`,
    )
    await expect(page.getByTestId('grand-total')).toHaveText(
      `Rp ${grandTotal.toLocaleString('id-ID')}`,
    )
  })

  test('should validate form fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Add New Sale' }).click()

    await page.getByRole('button', { name: 'Add Sale' }).click()

    await expect(page.getByText('Invoice code must be filled')).toBeVisible()

    await page.getByLabel('Quantity').fill('0')
    await page.getByLabel('Price').fill('0')

    await page.getByRole('button', { name: 'Add Sale' }).click()

    await expect(
      page.getByText('Quantity must be between 1 and 1000'),
    ).toBeVisible()
    await expect(
      page.getByText('Price must be between 1 and 1,000,000'),
    ).toBeVisible()
  })
})
