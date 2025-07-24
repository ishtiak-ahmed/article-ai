import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import React from 'react'

type IProps<T extends string> = {
  value: T
  onValueChange: (val: T) => void
  options: { value: T; label: string }[]
  placeholder?: string
}

const SelectComponent = <T extends string>({
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
}: IProps<T>) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className='min-w-40'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectComponent