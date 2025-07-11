"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export function DatePicker({ 
  label, 
  initialDate, 
  onDateChange,
  fromDate,
  toDate,
  disabled,
  placeholder
}: { 
  label: string, 
  initialDate: Date | undefined,
  onDateChange?: (date: Date | undefined) => void,
  fromDate?: Date,
  toDate?: Date,
  disabled?: boolean,
  placeholder?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(initialDate)
  const [month, setMonth] = React.useState<Date | undefined>(initialDate)
  const [value, setValue] = React.useState(formatDate(initialDate))

  // Synchroniser avec les changements de initialDate
  React.useEffect(() => {
    setDate(initialDate)
    setMonth(initialDate)
    setValue(formatDate(initialDate))
  }, [initialDate])

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    setValue(formatDate(newDate))
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={placeholder || "June 01, 2025"}
          className="bg-background pr-10"
          onChange={(e) => {
            const inputValue = e.target.value
            setValue(inputValue)
            
            if (inputValue === "") {
              handleDateChange(undefined)
              return
            }
            
            const date = new Date(inputValue)
            if (isValidDate(date)) {
              handleDateChange(date)
              setMonth(date)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
          disabled={disabled}
        />
        {!disabled && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
                          <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                month={month}
                onMonthChange={setMonth}
                onSelect={(newDate) => {
                  handleDateChange(newDate)
                  setOpen(false)
                }}
                fromDate={fromDate}
                toDate={toDate}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
