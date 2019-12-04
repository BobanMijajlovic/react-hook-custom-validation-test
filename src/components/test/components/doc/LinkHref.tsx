import React from 'react'

const LinkHref = ({href,name} : any) => {
  return (
    <a target={'_blank'} href={href}>
      {name}
    </a>
  )
}

export default LinkHref
