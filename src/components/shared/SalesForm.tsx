import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { salesSchema, SalesData } from '@/lib/schema'
import { useSalesStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useMemo } from 'react'
import { cn, maskingNumber } from '@/lib/utils'
import { DatePicker } from '@/components/ui/datepicker'

interface SalesFormProps {
  editIndex?: number
  handleBack?: () => void
  type: 'new' | 'edit'
}

export function SalesForm({ editIndex, handleBack, type }: SalesFormProps) {
  const { addSale, updateSale, getSale } = useSalesStore()
  const editSale = editIndex !== undefined ? getSale(editIndex) : undefined

  const initialSale = useMemo(() => {
    if (!editSale) return null

    return {
      ...editSale,
      invoiceDate: new Date(editSale.invoiceDate),
    }
  }, [editSale])

  const defaultValues: Partial<SalesData> = initialSale || {
    invoiceCode: '',
    invoiceDate: new Date(),
    items: [{ productName: '', qty: 1, price: 0 }],
    discount: 0,
  }

  const form = useForm<SalesData>({
    reValidateMode: 'onChange',
    resolver: zodResolver(salesSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  // console.log(items)

  const grandTotal = () => {
    const items = form.watch('items')
    const discount = form.watch('discount') || 0
    const subtotal = items.reduce((sum, item) => {
      return sum + (Number(item.qty) || 0) * (Number(item.price) || 0)
    }, 0)

    return subtotal - discount
  }

  const onSubmit = (data: SalesData) => {
    if (editIndex !== undefined) {
      updateSale(editIndex, data)
      toast({ title: 'Sale updated successfully' })
    } else {
      addSale(data)
      toast({ title: 'Sale added successfully' })
    }

    if (handleBack) {
      handleBack()
    }
  }

  function formatRupiah(value: number | string): string {
    const number = typeof value === 'string' ? parseInt(value) : value
    if (isNaN(number)) return 'Rp 0'

    return 'Rp ' + number.toLocaleString('id-ID')
  }

  const minDate = new Date('2020-01-01')

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {type === 'edit' ? 'Edit Sale' : 'New Sale'}
        </h2>
        <Button variant="outline" onClick={handleBack}>
          Back to List
        </Button>
      </div>
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
                        <Input
                          placeholder="INV-001"
                          className={cn({
                            'border-red-500':
                              !!form.formState.errors.invoiceCode,
                          })}
                          {...field}
                        />
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
                        <DatePicker
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                          date={field.value}
                          id="invoiceDate"
                          name="invoiceDate"
                          minDate={minDate}
                          dataTestIdPicker="date-picker-btn"
                          dataTestIdCalendar="Invoice Date"
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
                    onClick={() =>
                      append({ productName: '', qty: 1, price: 0 })
                    }
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
                              <Input
                                placeholder="Product name"
                                className={cn({
                                  'border-red-500':
                                    !!form.formState.errors.items?.[index]
                                      ?.productName,
                                })}
                                {...field}
                              />
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
                                className={cn({
                                  'border-red-500':
                                    !!form.formState.errors.items?.[index]?.qty,
                                })}
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
                                  className={cn({
                                    'border-red-500':
                                      !!form.formState.errors.items?.[index]
                                        ?.price,
                                  })}
                                  onChange={(e) =>
                                    field.onChange(
                                      maskingNumber(e.target.value),
                                    )
                                  }
                                />
                              </FormControl>
                              {fields.length > 1 && index > 0 && (
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
                    {index < fields.length - 1 && (
                      <Separator className="my-2" />
                    )}
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
                        className={cn({
                          'border-red-500': !!form.formState.errors.discount,
                        })}
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
                  Rp {grandTotal().toLocaleString('id-ID')}
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
    </div>
  )
}
