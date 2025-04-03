import { useSalesStore } from '@/lib/store'
import { Button } from '../ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Eye, Pencil, Trash } from 'lucide-react'

interface SalesListProps {
  onEdit: (index: number) => void
  onView: (index: number) => void
}

export function SalesList({ onEdit, onView }: SalesListProps) {
  const { sales, deleteSale } = useSalesStore()

  const calculateGrandTotal = (index: number) => {
    const sale = sales[index]
    const subtotal = sale.items.reduce((sum, item) => {
      return sum + item.qty * item.price
    }, 0)

    return subtotal - sale.discount
  }

  return (
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
                    {/* {new Date(sale.invoiceDate).toLocaleDateString()} */}
                  </TableCell>
                  <TableCell>{sale.items.length} items</TableCell>
                  <TableCell className="text-right">
                    {calculateGrandTotal(index).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onView(index)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteSale(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
