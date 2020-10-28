import React, { FC } from 'react'

type TextareaProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  placeholder?: string
  maxLength?: number
  autoFocus?: boolean
}

const Textarea: FC<TextareaProps> = ({
  value,
  onChange,
  rows,
  placeholder,
  maxLength,
  autoFocus,
}) => {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event)}
      rows={rows}
      placeholder={placeholder || ''}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className="textarea-description shadow appearance-none border rounded w-full py-2 pl-3 pr-12 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
    />
  )
}

export default Textarea
