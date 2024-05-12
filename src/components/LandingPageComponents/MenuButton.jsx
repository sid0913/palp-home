import React from 'react'
import { Link } from 'gatsby'


/**
 * function to return a menu item button for the landing page
 * @param  {String} title the title on the button
 * @param  {String} description the description of the menu item
 * @returns {Component} the component of the menu item
 */
const MenuButton = ({disabled,title, description, href}) => {
  disabled = disabled?disabled:false
  return (
    <Link  href={href}> 
        <div className={`${disabled?"opacity-50 ":"hover:opacity-75 text-white"} card border-2  border-[#843c0b] bg-[url('src/images/header.jpg')]    bg-center h-[20vh] w-[50vw] mx-auto`}>
          <h1 className={`${disabled?"opacity-100 text-black":""} text-2xl font-semibold`}>
            {title}
          </h1>

          <br/>

          <p>
            {description}
          </p>
        </div>
    </Link>
  )
}

export default MenuButton