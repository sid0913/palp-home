import React from 'react'
import { Link } from 'gatsby'

const About = () => {
  return ( <>
    <div>Abut</div>
    <Link to="/"> go home </Link>
    </>
  )
}

export default About

export const Head = ()=> <title>The about page</title>