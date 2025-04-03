import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { salesSchema, SalesData } from '@/lib/schema'
import { useSalesStore } from '@/lib/store'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Plus, Trash } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useMemo } from 'react'
import { maskingNumber } from '@/lib/utils'

interface SalesFormProps {
  editIndex?: number
  onSubmitSuccess?: () => void
}

export function SalesForm({ editIndex, onSubmitSuccess }: SalesFormProps) {
  const { addSale, updateSale, getSale } = useSalesStore()
  const editSale = editIndex !== undefined ? getSale(editIndex) : undefined

  const defaultValues: Partial<SalesData> = editSale || {
    invoiceCode: '',
    invoiceDate: Date.now(),
    items: [{ productName: '', qty: 1, price: 0 }],
    discount: 0,
  }

  const form = useForm<SalesData>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(salesSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const grandTotal = useMemo(() => {
    const items = form.watch('items')
    const discount = form.watch('discount') || 0

    const subtotal = items.reduce((sum, item) => {
      return sum + (Number(item.qty) || 0) * (Number(item.price) || 0)
    }, 0)

    return subtotal - discount
  }, [form])

  const onSubmit = (data: SalesData) => {
    if (editIndex !== undefined) {
      updateSale(editIndex, data)
      toast({ title: 'Sale updated successfully' })
    } else {
      addSale(data)
      toast({ title: 'Sale added successfully' })
    }

    if (onSubmitSuccess) {
      onSubmitSuccess()
    }
  }

  function formatRupiah(value: number | string): string {
    const number = typeof value === 'string' ? parseInt(value) : value
    if (isNaN(number)) return 'Rp 0'

    return 'Rp ' + number.toLocaleString('id-ID')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {editIndex !== undefined ? 'Edit Sale' : 'New Sale'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="invoiceCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Code</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          new Date(field.value).toISOString().split('T')[0]
                        }
                        onChange={(e) => {
                          const date = new Date(e.target.value)
                          field.onChange(date.getTime())
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productName: '', qty: 1, price: 0 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.qty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Quantity"
                              {...field}
                              onChange={(e) =>
                                field.onChange(maskingNumber(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Price"
                                {...field}
                                value={formatRupiah(field.value)}
                                onChange={(e) =>
                                  field.onChange(maskingNumber(e.target.value))
                                }
                              />
                            </FormControl>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index < fields.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Discount"
                      {...field}
                      value={formatRupiah(field.value)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, '')
                        const numeric = Number(rawValue)
                        field.onChange(numeric)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
              <span className="font-medium">Grand Total:</span>
              <span className="text-lg font-bold">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">
                {editIndex !== undefined ? 'Update Sale' : 'Add Sale'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
