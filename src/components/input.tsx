import React, { FC } from 'react'

type InputProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  maxLength?: number
  autoFocus?: boolean
}

const Input: FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  maxLength,
  autoFocus,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event)}
      placeholder={placeholder || ''}
      maxLength={maxLength}
      autoFocus={autoFocus}
      className="shadow appearance-none border rounded w-full py-2 px-2 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
    />
  )
}

// TODO: input string length counter {{{
// <span className="text-sm text-gray-300 relative bottom-0 right-12">
//   {newTodoNameInput ? (
//     <span>{newTodoNameInput.length}/50</span>
//   ) : (
//     <span>0/50</span>
//   )}
// </span>
//}}}

export default Input
