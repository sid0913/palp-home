import * as React from "react"
import { Link } from "gatsby";
import MainTemplate from "../components/layouts/MainTemplate";
import { Router, Route } from "@reach/router"
import Explore from "./Explore";
const IndexPage = () => {
  return (
    <>
      <Link href="/Explore"> Explore</Link>

    </>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
