import React, { FC } from 'react'

type LinkItem = {
  name: string
  path: string
}

export type HeaderProps = {
  onClickTham?: () => void
  isOpenTham?: boolean
  links?: LinkItem[]
}

const Header: FC<HeaderProps> = ({
  onClickTham,
  links = [],
  isOpenTham = false,
}) => {
  return (
    <>
      <div className="section-header fixed top-0 right-0 left-0 p-4 z-50">
        <div className="section-tham flex justify-end">
          <div
            className={`tham tham-e-squeeze tham-w-6 ${
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
      {isOpenTham && (
        <div className="section-header-sidemenu">
          {links.map(
            (link: LinkItem, index: number) =>
              link && <div key={index}>{link.name}</div>
          )}
        </div>
      )}
    </>
  )
}

export default Header
