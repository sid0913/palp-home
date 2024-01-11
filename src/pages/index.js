import * as React from "react"
import { Link } from "gatsby";
import MainTemplate from "../components/layouts/MainTemplate";


const IndexPage = () => {
  return (
    <MainTemplate>
      <Link href="/Explore"> Explore</Link>
    </MainTemplate>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
