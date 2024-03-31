import React from 'react'
import { Link } from 'gatsby'


/**
 * function to return a menu item button for the landing page
 * @param  {String} title the title on the button
 * @param  {String} description the description of the menu item
 * @returns {Component} the component of the menu item
 */
const MenuButton = ({title, description, href}) => {
  return (
    <Link href={href}> 
        <div className="card border-2 border-[#843c0b] bg-[url('src/images/header.jpg')] hover:opacity-75 text-white bg-center h-[20vh] w-[50vw] mx-auto">
          <h1 className="text-2xl font-semibold">
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