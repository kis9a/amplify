import React, { FC } from 'react'
import IconBan from './icons/ban'

type NoItemProp = {
  message?: string
}

const NoItem: FC<NoItemProp> = ({ message }) => {
  return (
    <div className="flex items-center">
      <div className="section-loading animate-spin m-4">
        <IconBan />
      </div>
      <p className="text-xl text-gray-600">{message}</p>
    </div>
  )
}

export default NoItem
