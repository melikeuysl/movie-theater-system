import React from 'react'

const BlurCircle = ({ top = "auto", left = "auto", right = "auto", bottom = "auto" }) => {
  return (
    <div
      className='absolute -z-10 rounded-full bg-primary/30 blur-2xl'
      style={{
        top: top,
        left: left,
        right: right,
        bottom: bottom,
        width: '240px',
        height: '240px',
      }}
    ></div>
  )
}

export default BlurCircle
