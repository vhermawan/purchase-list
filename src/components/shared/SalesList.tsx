import { useSalesStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, List, Pencil, Trash } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { ConfirmationDialog } from './ConfirmationDialog'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/hooks/use-toast'

interface SalesListProps {
  onEdit: (index: number) => void
  onView: (index: number) => void
  onHandleAddNew: () => void
}

export function SalesList({ onEdit, onView, onHandleAddNew }: SalesListProps) {
  const { sales, deleteSale } = useSalesStore()
  const [confirmationDialog, setConfirmationDialog] = useState({
    index: -1,
    isOpen: false,
  })

  const calculateGrandTotal = (index: number) => {
    const sale = sales[index]
    const subtotal = sale.items.reduce((sum, item) => {
      return sum + item.qty * item.price
    }, 0)

    return subtotal - sale.discount
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Data</h2>
        <Button onClick={onHandleAddNew}>Add New Sale</Button>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sales List</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No sales data available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Code</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Grand Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.invoiceCode}</TableCell>
                    <TableCell>
                      {format(new Date(sale.invoiceDate), 'dd MMMM yyyy', {
                        locale: id,
                      })}
                    </TableCell>
                    <TableCell>{sale.items.length} items</TableCell>
                    <TableCell className="text-right">
                      Rp {calculateGrandTotal(index).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="block sm:hidden">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="icon">
                                <List className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-max flex flex-col bg-white p-2 gap-2">
                              <Button
                                size="sm"
                                className="w-max"
                                variant="outline"
                                onClick={() => onView(index)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(index)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="w-max"
                                variant="destructive"
                                onClick={() =>
                                  setConfirmationDialog({ index, isOpen: true })
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="hidden sm:flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            data-testid="btn-detail"
                            onClick={() => onView(index)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            data-testid="btn-edit"
                            onClick={() => onEdit(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            data-testid="btn-delete"
                            onClick={() =>
                              setConfirmationDialog({ index, isOpen: true })
                            }
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <ConfirmationDialog
            isOpen={confirmationDialog.isOpen}
            onConfirm={() => {
              setConfirmationDialog({ index: -1, isOpen: false })
              deleteSale(confirmationDialog.index)
              toast({ title: 'Sale deleted successfully' })
            }}
            onCancel={() => setConfirmationDialog({ index: -1, isOpen: false })}
            title="Delete Sale"
            description="Are you sure you want to delete this sale?"
          />
        </CardContent>
      </Card>
    </>
  )
}
