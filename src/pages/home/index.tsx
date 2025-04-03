import { useState } from 'react'
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
        {view === 'list' && (
          <SalesList
            onEdit={handleEdit}
            onView={handleView}
            onHandleAddNew={handleNew}
          />
        )}
        {view === 'new' && <SalesForm handleBack={handleBack} type="new" />}
        {view === 'edit' && (
          <SalesForm
            editIndex={selectedIndex}
            handleBack={handleBack}
            type="edit"
          />
        )}
        {view === 'detail' && selectedIndex !== undefined && (
          <SalesDetail index={selectedIndex} onBack={handleBack} />
        )}
      </main>
      <Toaster />
    </div>
  )
}
