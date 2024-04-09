import * as React from "react"
import { Link } from "gatsby";
import MenuButton from "../components/LandingPageComponents/MenuButton";

const IndexPage = () => {
  return (
    <div className="p-5 flex flex-col space-y-5 ">

      {/* <MenuButton title={"Explore"} description={"Browse the map of Pompeii, discover artistic motifs, and peruse images of artworks"} href={"/explore"}/> */}

      <MenuButton title={"Browse"} description={"Browse the map of Pompeii, discover artistic motifs, and peruse images of artworks"} href={"/browse/pompeii"}/>

    </div>
  )
}

export default IndexPage

export const Head = () => <title>PALP Home</title>
