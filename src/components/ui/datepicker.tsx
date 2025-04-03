'use client'

import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type DatePickerProps = {
  onChange: (date: Date | undefined) => void
  date: Date | undefined
  id: string
  name: string
  disabled?: boolean
  minDate?: Date
}

export function DatePicker({
  date,
  onChange,
  id,
  name,
  disabled,
  minDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild name={name} id={id} disabled={disabled}>
        <Button
          variant={'outline'}
          className={cn(
            'w-full p-2 justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'dd MMMM yyyy', { locale: idLocale })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 left-0" side="bottom">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
          className="bg-white"
          minDate={minDate}
        />
      </PopoverContent>
    </Popover>
  )
}
