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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

interface SalesDetailProps {
  index: number
  onBack: () => void
}

export function SalesDetail({ index, onBack }: SalesDetailProps) {
  const { getSale } = useSalesStore()
  const sale = getSale(index)

  if (!sale) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-500">Sale not found</p>
            <Button variant="link" onClick={onBack}>
              Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const calculateSubtotal = () => {
    return sale.items.reduce((sum, item) => sum + item.qty * item.price, 0)
  }

  const calculateGrandTotal = () => {
    return calculateSubtotal() - sale.discount
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Button size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="ml-2">Sale Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Invoice Code</h3>
            <p className="text-lg font-medium">{sale.invoiceCode}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Invoice Date</h3>
            <p className="text-lg font-medium">
              {new Date(sale.invoiceDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-right">{item.qty}</TableCell>
                  <TableCell className="text-right">
                    {item.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.qty * item.price).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>{sale.discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Grand Total</span>
            <span>{calculateGrandTotal().toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={onBack}>
          Back to List
        </Button>
      </CardFooter>
    </Card>
  )
}
