import * as React from "react"
import header from 'src/images/header.jpg';
import footer from 'src/images/footer-no-bg.png';
import { Link } from "gatsby";
import { GoHomeFill } from "react-icons/go";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}
const headingAccentStyles = {
  color: "#663399",
}
const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}
const listStyles = {
  marginBottom: 96,
  paddingLeft: 0,
}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  marginBottom: 24,
}

const descriptionStyle = {
  color: "#232129",
  fontSize: 14,
  marginTop: 10,
  marginBottom: 0,
  lineHeight: 1.25,
}

const docLink = {
  text: "Documentation",
  url: "https://www.gatsbyjs.com/docs/",
  color: "#8954A8",
}

const badgeStyle = {
  color: "#fff",
  backgroundColor: "#088413",
  border: "1px solid #088413",
  fontSize: 11,
  fontWeight: "bold",
  letterSpacing: 1,
  borderRadius: 4,
  padding: "4px 6px",
  display: "inline-block",
  position: "relative",
  top: -2,
  marginLeft: 10,
  lineHeight: 1,
}

const links = [
  {
    text: "Tutorial",
    url: "https://www.gatsbyjs.com/docs/tutorial/getting-started/",
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
    color: "#E95800",
  },
  {
    text: "How to Guides",
    url: "https://www.gatsbyjs.com/docs/how-to/",
    description:
      "Practical step-by-step guides to help you achieve a specific goal. Most useful when you're trying to get something done.",
    color: "#1099A8",
  },
  {
    text: "Reference Guides",
    url: "https://www.gatsbyjs.com/docs/reference/",
    description:
      "Nitty-gritty technical descriptions of how Gatsby works. Most useful when you need detailed information about Gatsby's APIs.",
    color: "#BC027F",
  },
  {
    text: "Conceptual Guides",
    url: "https://www.gatsbyjs.com/docs/conceptual/",
    description:
      "Big-picture explanations of higher-level Gatsby concepts. Most useful for building understanding of a particular topic.",
    color: "#0D96F2",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
    color: "#8EB814",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    badge: true,
    description:
      "Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!",
    color: "#663399",
  },
]

const MainTemplate = ({children}) => {
  return (
    <div className="text-center h-full flex-col flex relative">
      <header className="text-xl bg-[#ecf0f1] w-full top-0">
        
        
        
        {/* header image */}
        {/* <img className='h-20 object-none w-full' src={header}/> */}
        <div className=" bg-[url('src/images/header.jpg')] text-center object-none flex flex-row justify-between py-3 px-5">
          <div className="flex flex-row ">
            {/* <Link href="/start">
              <button className='my-auto p-1 m-5 bg-white rounded-md hover:bg-black hover:text-white  border-2 border-black text-black'>
                <GoHomeFill  /> 
              </button>
            </Link> */}
            <Link href="/start" className="my-auto text-2xl text-center text-black font-semibold h-full hover:underline">
              <span className="">
                Pompeii’s Artistic Landscape Project
              </span>
            
            </Link>
          </div>

          <div className="flex flex-row justify-evenly bg-slate-50/50 py-1 px-4 rounded-md space-x-5">
            <Link className="black-link" href="/browse/pompeii">
              Browse
            </Link>
            <span className="disabled-black-link flex flex-col">
              <p>
                Search
              </p>
              <p className="text-xs">
                (Coming soon)
              </p>

            </span>

            <span className="disabled-black-link" >
              <p>
                Compare
              </p>
              <p className="text-xs">
                (Coming soon)
              </p>
            </span>

          </div>  
          
        </div>

      </header>

      <div className=" overflow-y-auto h-full">
        <div style={{minHeight:"86vh"}}>
          {children}
        </div>
        
        {/* <div className='z-50 absolute bottom-0 text-center w-full bg-[#234774]'> */}
        <div className=' bottom-0 text-center w-full bg-[#234774]'>
          <img className='object-fit h-14 mx-auto ' src={footer}/>
        </div>
      </div>

      

    </div>
  )
}

export default MainTemplate

export const Head = () => <title>Home Page</title>
