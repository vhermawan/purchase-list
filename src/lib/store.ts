import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SalesData } from './schema'

interface SalesStore {
  sales: SalesData[]
  addSale: (sale: SalesData) => void
  updateSale: (index: number, sale: SalesData) => void
  deleteSale: (index: number) => void
  getSale: (index: number) => SalesData | undefined
}

export const useSalesStore = create<SalesStore>()(
  persist(
    (set, get) => ({
      sales: [],
      addSale: (sale) => set((state) => ({ sales: [...state.sales, sale] })),
      updateSale: (index, sale) =>
        set((state) => ({
          sales: state.sales.map((s, i) => (i === index ? sale : s)),
        })),
      deleteSale: (index) =>
        set((state) => ({
          sales: state.sales.filter((_, i) => i !== index),
        })),
      getSale: (index) => get().sales[index],
    }),
    {
      name: 'sales-storage',
    },
  ),
)
