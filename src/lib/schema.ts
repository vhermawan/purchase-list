import { z } from 'zod'

export const itemSchema = z.object({
  productName: z
    .string()
    .min(1, 'Product name must be filled')
    .max(32, 'Product name must be 32 characters or less'),
  qty: z.number().positive().max(1000, 'Quantity must be between 1 and 1000'),
  price: z
    .number()
    .min(1, 'Price must be filled')
    .max(1000000, 'Price must be between 1 and 1,000,000'),
})

export const salesSchema = z.object({
  invoiceCode: z
    .string()
    .min(1, 'Invoice code must be filled')
    .max(32, 'Invoice code must be 32 characters or less'),
  invoiceDate: z
    .number()
    .refine(
      (date) => new Date(date).getFullYear() >= 2020,
      'Invoice date must be after 2020',
    ),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
  discount: z.number().min(0, 'Discount must be a non-negative number'),
})

export type Item = z.infer<typeof itemSchema>
export type SalesData = z.infer<typeof salesSchema>
