import React, { FC } from 'react'

export type HeaderProps = {
  onClickTham: () => void
  isOpenTham: boolean
}

const Header: FC<HeaderProps> = ({ onClickTham, isOpenTham = false }) => {
  return (
    <>
      <div className="section-header fixed top-0 right-0 left-0 p-4 z-50 bg-white">
        <div className="section-tham flex justify-end">
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
