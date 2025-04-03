import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SalesList } from '@/components/shared/SalesList'
import { SalesForm } from '@/components/shared/SalesForm'
import { SalesDetail } from '@/components/shared/SalesDetail'
import { Toaster } from '@/components/ui/toaster'

type AppView = 'list' | 'new' | 'edit' | 'detail'

export default function Home() {
  const [view, setView] = useState<AppView>('list')
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  )

  const handleNew = () => {
    setView('new')
    setSelectedIndex(undefined)
  }

  const handleEdit = (index: number) => {
    setSelectedIndex(index)
    setView('edit')
  }

  const handleView = (index: number) => {
    setSelectedIndex(index)
    setView('detail')
  }

  const handleBack = () => {
    setView('list')
    setSelectedIndex(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-50 w-screen">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Sales Management App</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          {view === 'list' && (
            <>
              <h2 className="text-2xl font-bold">Sales Data</h2>
              <Button onClick={handleNew}>Add New Sale</Button>
            </>
          )}
          {view === 'new' && (
            <>
              <h2 className="text-2xl font-bold">New Sale</h2>
              <Button variant="outline" onClick={handleBack}>
                Back to List
              </Button>
            </>
          )}
          {view === 'edit' && (
            <>
              <h2 className="text-2xl font-bold">Edit Sale</h2>
              <Button variant="outline" onClick={handleBack}>
                Back to List
              </Button>
            </>
          )}
          {view === 'detail' && (
            <h2 className="text-2xl font-bold">Sale Details</h2>
          )}
        </div>

        {view === 'list' && (
          <SalesList onEdit={handleEdit} onView={handleView} />
        )}
        {view === 'new' && <SalesForm onSubmitSuccess={handleBack} />}
        {view === 'edit' && (
          <SalesForm editIndex={selectedIndex} onSubmitSuccess={handleBack} />
        )}
        {view === 'detail' && selectedIndex !== undefined && (
          <SalesDetail index={selectedIndex} onBack={handleBack} />
        )}
      </main>
      <Toaster />
    </div>
  )
}
