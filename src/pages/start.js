import * as React from "react"
import { Link } from "gatsby";
import MenuButton from "../components/LandingPageComponents/MenuButton";
import CompleteMapComponent from "../components/CompleteMapComponent";
import { useState } from "react";
import {SwiperSlide, Swiper } from 'swiper/react';
import {Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import '../styles/Carousel.module.css'

const IndexPage = () => {

  //the title with the entity name
  const [entityTitle, setEntityTitle] = useState("snake")

  //the type of the entity
  const [entityType, setEntityType] = useState("concept")
  
  const [popularEntities, setPopularEntities] = useState(["snake", "hercules", "ariadne"])

  const [currEntity, setCurrEntity] = useState("snake")

  const [imageURLs, setImageURLs] = useState([{name: "ariadne", url:"http://umassamherst.lunaimaging.com/MediaManager/srvr?mediafile=/Size3/umass~14~14/4240/image53085.jpg"}, {name:"snake", url:"http://umassamherst.lunaimaging.com/MediaManager/srvr?mediafile=/Size3/umass~16~16/4276/PPM3_1904.jpg"}, {name:"hercules", url:"http://umassamherst.lunaimaging.com/MediaManager/srvr?mediafile=/Size3/umass~14~14/4064/image2735.jpg"}, {name:"zeus", url:"http://umassamherst.lunaimaging.com/MediaManager/srvr?mediafile=/Size3/umass~16~16/4275/PPM2_737.jpg"}])

  //function to capitalize the first letter of a string
  function capitalize(input){
  
  
    if(!input){
      return input
    }
  
    if (input.length === 0){
      return input
    }
  
    else if(input.length === 1){
      return input.toUpperCase()
    }
    return input[0].toUpperCase()+input.substring(1)
  }

  async function getEntityDetails(itemName){
    const response = await fetch(`https://api.p-lod.org/id/${itemName}`);

    if (response.ok){
      const responseIdList = await response.json()

      let label = "";
      let type = "";

      responseIdList.forEach(element => {
        
        //get the label
        if (element["http://www.w3.org/2000/01/rdf-schema#label"]){
          label = element["http://www.w3.org/2000/01/rdf-schema#label"]
        }

        //get the type
        if(element["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]){
          type = element["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
        }







      }); 


      if (label === ""){
        setEntityTitle(itemName)
      }
      else{
        //get the label and type of the entity
        setEntityTitle(label)
      }
      


      if (type.includes("concept")){
        setEntityType("concept")
      }

      else if(type.includes("city")){
        setEntityType("city")
      }

      else{
        setEntityType("spatial-entity")
      }


    }
    else{
      throw new Error ("Unable to get entity label and entity type from the /id call");
    }
  }

  return (
    <>
    <div className="text-left my-[10vh] container mx-auto">
    The <b>Pompeii Artistic Landscape Project</b>  (PALP) is an online resource that supports site-wide discovery, mapping, analysis, and sharing of information about Pompeian artworks in their architectural and urban contexts. The goal of PALP is to dramatically increase the number of researchers and members of the public who can access, analyze, interpret, and share the artworks of the most richly documented urban environment of the Roman world: Pompeii.
    </div>    
    <div className="mt-10 flex flex-col px-10">
      <div className="mx-auto">
        <CompleteMapComponent width={"40vw"} height={"50vh"}  itemName={currEntity} entityTitle={entityTitle} entityType={entityType} secondaryEntity={[]}  />
      </div>  
      <div className="w-[70vw] mx-auto bg-black text-white p-5 rounded-md my-5">
        <Swiper  navigation={true} modules={[Navigation, Thumbs, FreeMode]}
          // thumbs={{ swiper: thumbsSwiper }}
          spaceBetween={10}
          slidesPerView={2}
          onSlideChange={(swiper) => {
            // setCurrImageIndex(swiper.activeIndex)



          }}
          onSwiper={(swiper) => {}}
          className='mySwiper3'
          style={{
            '--swiper-navigation-color': 'white',
            '--swiper-pagination-color': '#000',

            'padding-top':'1vh',
            'padding-bottom':'1vh',
            'padding-right':'1vw',
            'padding-left':'2vw'
          }}
        >


          {imageURLs.map((imgURL, index)=>
          {
            return (
            <div  key={index.toString()+Math.floor(Math.random()*1000).toString()}>
              <SwiperSlide onClick={()=>{
                setCurrEntity(imgURL["name"])
                setEntityTitle(imgURL["name"])
              }}>
              <div className={`${currEntity === imgURL["name"]?"border-white bg-white text-black":"border-black hover:border-white"} w-[20vw]  flex flex-col text-wrap border-2 rounded-md py-2  mx-5`}>
                <img className='h-[20vh] mx-auto' src={imgURL["url"]}/>
                <p >
                  {capitalize(imgURL["name"])}
                </p>
              </div>
              
              </SwiperSlide>

            </div>)
            
          })}
          {/* ... */}
        </Swiper>
      </div>
      
      {/* <CompleteImageGallery width={"40vw"} height={"50vh"}  setCurrImageIndex={setCurrImageIndex} setImageLocation={setImageLocation} imageURLs={imageURLs} currImageIndex={currImageIndex}/> */}
      

      {/* <div className="p-5 flex flex-col space-y-5 ">


        <MenuButton disabled={false} title={"Browse"} description={"Browse the map of Pompeii, discover artistic motifs, and peruse images of artworks"} href={"/browse/pompeii"}/>
        <MenuButton disabled={true} title={"Search (Coming Soon)"} description={"Search through the Concepts and Spatial Entities of Pompeii"} href={"/"}/>
        <MenuButton disabled={true} title={"Compare (Coming Soon)"} description={"Compare the Concepts and Spatial Entities of Pompeii"} href={"/"}/>


      </div> */}

    </div>
    <div className="container mx-auto text-center">
      <Link className="link" href="/browse/pompeii">
        Browse
      </Link>
       {" "}to see more
    </div>

    <div className="container text-center my-[10vh] mx-auto ">
      PALP is a collaborative initiative between <Link className="link" href="https://www.umass.edu/classics/member/eric-poehler">Eric Poehler</Link>  at the University of Massachusetts Amherst and <Link className="link" href="https://isaw.nyu.edu/people/faculty/sebastian-heath">Sebastian Heath</Link>  at the Institute for the Study of the Ancient World at New York University. It builds on data from the <Link className="link" href="https://digitalhumanities.umass.edu/pbmp/">Pompeii Bibliography and Mapping Project</Link> and uses other public resources such as <Link className="link" href="http://pompeiiinpictures.com/">Pompeii in Pictures</Link>. It is developed using open source software and is informed by Linked Open Data approaches to sharing information. PALP is generously funded through a grant from the <Link className="link" href="https://www.getty.edu/foundation/">Getty Foundation</Link>, as part of its <Link className="link" href="https://www.getty.edu/foundation/initiatives/current/dah/index.html">Digital Art History initiative</Link>. The <Link className="link" href="https://palp.p-lod.umasscreate.net/">project blog</Link> has more information about PALP's scope and goals.
    </div>
    </>
    
  )
}

export default IndexPage

export const Head = () => <title>PALP Home</title>
