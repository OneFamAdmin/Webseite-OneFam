
import React from 'react'

const MaxWidth: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <div className={`w-full max-w-[1440px] mx-auto px-4 xl:px-8 ${className}`}>{children}</div>
  )
}

export default MaxWidth