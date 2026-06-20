
import React from 'react'

const MaxWidth: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`w-full max-w-[1680px] mx-auto px-4 sm:px-6 xl:px-10 ${className}`}>{children}</div>
  )
}

export default MaxWidth