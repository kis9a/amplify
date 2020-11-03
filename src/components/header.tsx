import React, { FC } from 'react'

export type HeaderProps = {
  onClickTham: () => void
  isOpenTham: boolean
  userName: string
}

const Header: FC<HeaderProps> = ({
  onClickTham,
  isOpenTham = false,
  userName = '',
}) => {
  return (
    <>
      <div className="flex justify-between section-header fixed top-0 right-0 left-0 p-4 z-50 bg-white">
        <div>
          <p className="bg-gray-200 text-gray-800 text-bold p-2 px-2 rounded">
            {userName}
          </p>
        </div>
        <div className="section-tham">
          <div
            className={`tham tham-e-squeeze tham-w-6 h-6 ${
              isOpenTham ? 'tham-active' : ''
            }`}
            onClick={() => onClickTham()}
          >
            <div className="tham-box">
              <div className="tham-inner" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
