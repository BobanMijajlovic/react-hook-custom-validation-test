import React        from 'react'
import {withRouter} from 'react-router'
import {ListItem}   from '@material-ui/core'
import {NavLink}    from 'react-router-dom'

const LinkPath = (props : any) => {
  const {location,path, name, icon,className} = props

  const activeListItem = (location.pathname === path || location.pathname.includes(path)) && path !== '/'  ? 'nav-list-item-active' : ''
  return (
    <ListItem className={`nav-list-item ${activeListItem} ${className}`}>
      <NavLink
                className={'nav-item'}
                to={path}
                activeClassName={'active'}
      >
        {icon ? icon : null}
        {name}
      </NavLink>
    </ListItem>
  )
}

export default  withRouter(LinkPath)
