import * as React from "react"
import { Link } from "gatsby";

const IndexPage = () => {
  return (
    <div className="p-5">
      <Link href="/Explore"> 
        <div className="card border-2 border-[#843c0b] bg-[url('src/images/header.jpg')] hover:opacity-75 text-white bg-center h-[20vh] w-[50vw] mx-auto">
          <h1 className="text-2xl font-bold">
            Explore
          </h1>

          <br/>

          <p class="font-semibold">
          Browse the map of Pompeii, discover artistic motifs, and peruse images of artworks
          </p>
        </div>
      </Link>

    </div>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
