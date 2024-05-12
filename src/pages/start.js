import * as React from "react"
import { Link } from "gatsby";
import MenuButton from "../components/LandingPageComponents/MenuButton";

const IndexPage = () => {
  return (
    <div className="p-5 flex flex-col space-y-5 ">

      {/* <MenuButton title={"Explore"} description={"Browse the map of Pompeii, discover artistic motifs, and peruse images of artworks"} href={"/explore"}/> */}

      <MenuButton disabled={false} title={"Browse"} description={"Browse the map of Pompeii, discover artistic motifs, and peruse images of artworks"} href={"/browse/pompeii"}/>
      <MenuButton disabled={true} title={"Search (Coming Soon)"} description={"Search through the Concepts and Spatial Entities of Pompeii"} href={"/"}/>
      <MenuButton disabled={true} title={"Compare (Coming Soon)"} description={"Compare the Concepts and Spatial Entities of Pompeii"} href={"/"}/>

    </div>
  )
}

export default IndexPage

export const Head = () => <title>PALP Home</title>
