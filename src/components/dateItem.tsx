import React, { FC } from 'react'

type DateItemProps = {
  date: string
}

const formatDate = (dt: Date) => {
  const y = dt.getFullYear()
  const m = ('00' + (dt.getMonth() + 1)).slice(-2)
  const d = ('00' + dt.getDate()).slice(-2)
  return y + '-' + m + '-' + d
}

const DateItem: FC<DateItemProps> = ({ date }) => {
  return date ? <div>{formatDate(new Date(date))}</div> : null
}

export default DateItem
