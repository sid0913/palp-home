import React, { useEffect } from 'react'
import MapComponent from '../../components/Map'
import { useState } from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ConceptNavigator from '../../components/ConceptNavigator';
import PageLayout from '../../components/layouts/PageLayout';
import SpatialNavigator from '../../components/SpatialNavigator';
import {SwiperSlide, Swiper } from 'swiper/react';
import {Navigation, Thumbs, FreeMode } from 'swiper/modules';

import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import '../../styles/Carousel.module.css'

// import Swiper styles
import 'swiper/css';
import { Link } from 'gatsby';

// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';
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

const Item = (props) => {

  //the thumbnail state for the thumbnails of the image gallery
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  //the Luna link citation for the current image
  const [LunaLink, setLunaLink] = useState("")

  //the name of the entity
  const itemName = props.params.name;

  //the list of geojsons where the entity, if a concept, is depicted
  const [spacesWhereTheConceptIsDepictedGeoJSONs, setSpacesWhereTheConceptIsDepictedGeoJSONs] = useState([])

  //the image urls
  const [imageURLs, setImageURLs] = useState([])

  //the location string of the currently viewed image
  const [imageLocation, setImageLocation] = useState("")


  //the index number of the currently showing image in the gallery
  const [currImageIndex, setCurrImageIndex] = useState(0)

  //the title with the entity name
  const [entityTitle, setEntityTitle] = useState("")
  const [secondaryEntity, setSecondaryEntity] = useState([])
  const [spatiallyWithin, setSpatiallyWithin] = useState("")

  //the type of the entity
  const [entityType, setEntityType] = useState("")
  

  const [WikiDataURL, setWikiDataURL] = useState("")
  const [WikiENDataURL, setWikiENDataURL] = useState("")
  const [WikiITDataURL, setWikiITDataURL] = useState("")
  const [PleiadesDataURL, setPleiadesDataURL] = useState("")
  const [PipDataURL, setPipDataURL] = useState("")

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

        //get the wiki data url
        if(element['urn:p-lod:id:wikidata-url']){
          setWikiDataURL(element['urn:p-lod:id:wikidata-url'])
        }

        //get the wiki en data url
        if(element['urn:p-lod:id:wiki-en-url']){
          setWikiENDataURL(element['urn:p-lod:id:wiki-en-url'])
        }

        //get the wiki it data url
        if(element['urn:p-lod:id:wiki-it-url']){
          setWikiITDataURL(element['urn:p-lod:id:wiki-it-url'])
        }

        //get the pleiades data url
        if(element['urn:p-lod:id:pleiades-url']){
          setPleiadesDataURL(element['urn:p-lod:id:pleiades-url'])
        }

        //get the Pompeii in pictures data url
        if(element['urn:p-lod:id:p-in-p-url']){
          setPipDataURL(element['urn:p-lod:id:p-in-p-url'])
        }



        //get the spatial parent, if any
        if(element['urn:p-lod:id:spatially-within']){
          setSpatiallyWithin(element['urn:p-lod:id:spatially-within'].replace("urn:p-lod:id:",""))
          console.log("set spatially within", element['urn:p-lod:id:spatially-within'].replace("urn:p-lod:id:",""))
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
  


  //get the images of the item
  useEffect(async()=>{
    //if this is any empty item- do nothing, showing a plain map
    if (itemName === ""){
      return
    }

    //if pompeii is used, render images from another url- for now region 2's images
    //the url to be used to request a list of image urls for the entity
    let imageURLsFetchURL = ""

    if (itemName === "pompeii"){
      imageURLsFetchURL = `https://api.p-lod.org/images/r2`
    }

    else{
      imageURLsFetchURL = `https://api.p-lod.org/images/${itemName}`
    }

    //fetch the images
    const response = await fetch(imageURLsFetchURL)

    if (!response.ok) {
      console.log("url not found- unable to fetch images")
      // throw new Error("Network response was not OK");
    }
    
    else{
      //get the image from the response
      const jsonBody = await response.json()
      const urls = jsonBody.filter((element)=>{
        return element["l_img_url"] !== "nan"
      }).map((element)=>{
        

        return {"url":element["l_img_url"], "arc":element["feature"].replace("urn:p-lod:id:",""), "description":element["l_description"], "l_img_url":element["l_img_url"]}
      })


      setImageURLs(urls)

      //show the location of the current image in the gallery on the map
      if(urls.length > 0 && imageLocation.length === 0){

        //set the image location pointer
        setImageLocation(urls[0]["arc"]);

        //set luna link citation
        setLunaLink(urls[0]["l_img_url"])
      }
        
      
  


    }

    //get the entity details
    (async ()=>getEntityDetails(itemName))()


  }, [])

  return (
    <PageLayout>
      <div className={` ${entityTitle !== ""?"hidden":""} slate-300 w-screen h-screen z-50 flex flex-row justify-center`}>
        <div className='flex flex-row justify-center my-auto space-x-5 '>
          <div class=" h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
          
          </div>

          <h1 className='text-lg my-auto'>
            Loading...
          </h1>
        </div>
          

      </div>

      <div className={`${entityTitle === ""?"invisible":""}`}>

      
        <div className={`text-left text-base font-semibold py-2 md:pl-28 lg:pl-5 flex flex-row justify-between`}>  
          <span>
            {entityTitle}
          </span>

          <span className='flex flex-row justify-evenly space-x-5'>
            <Link href={PipDataURL} className={`${PipDataURL !== "hidden"? '':""} link`} >
              Pompeii in Pictures
            </Link>

            <Link href={WikiENDataURL} className={`${WikiENDataURL !== ""? '':"hidden"} link`} >
              Wiki(en)
            </Link>

            <Link href={WikiITDataURL} className={`${WikiITDataURL !== ""? '':"hidden"} link`}>
              Wiki(it)
            </Link>
            
            <Link href={WikiDataURL} className={`${WikiDataURL !== ""? '':"hidden"} link`}>
              WikiData
            </Link>

            <Link href={PleiadesDataURL} className={`${PleiadesDataURL !== ""? '':"hidden"} link`}>
              Pleiades
            </Link>

            
          </span>
          
        </div> 

        <div className='flex flex-col'>

          <div className='flex lg:flex-row flex-col justify-evenly h-[30vh] w-full'>
            <div className='border-2 border-amber-700  flex justify-start overflow-auto w-[25vw] '>
              {/* <SpaceNavigator selectedConcept={itemName}/> */}
              {entityType !== "" ?<SpatialNavigator selectedEntity={itemName} selectedEntityLabel={entityTitle} entityType={entityType} setSecondaryEntity={setSecondaryEntity} setSpacesWhereTheConceptIsDepictedGeoJSONs={setSpacesWhereTheConceptIsDepictedGeoJSONs}/> :""}
            </div>

            <div  className='border-2 border-amber-700 w-full overflow-auto relative'>
              {/* <span className='z-10 relative top-0 right-0'> */}
                <button style={{zIndex:700}} disabled={secondaryEntity.length === 0 } className={ ` p-2 m-2 rounded-lg text-xs absolute top-0 right-0 ${secondaryEntity.length > 0 ?'bg-black text-white border-2 border-black hover:bg-white hover:text-black ':"bg-slate-300 border-2 border-slate-300 text-slate-400"}`} onClick={()=>{
                  //empty the secondary entities array
                  setSecondaryEntity([])
                }}>Clear</button>
              <div style={{zIndex:700}} className={ `p-2 m-2 rounded-lg text-xs absolute bottom-0 left-0 `}>
                <div className='flex flex-row space-x-2 bg-slate-50/75 rounded-md p-2'>

                  {[{color:"#dc143c", legendName:"current entity"}, {color:"#000000", legendName:"current image"}, {color:"#eee600", legendName:"spatial parent"}, {color:"#AAFF00", legendName:"added entities"}].map((element)=>{
                    return(
                    <span className={` flex flex-row space-x-1 ${element["legendName"] === "spatial parent" && spatiallyWithin === ""?"hidden":""} ${element["legendName"] === "added entities" && secondaryEntity.length === 0?"hidden":""} ${element["legendName"] === "spatial parent" && (entityType === "concept" || entityType === "")?"hidden":""}`}>
                      <div style={{backgroundColor:element["color"]}} className={`h-[10px] w-[10px] my-auto `}>

                      </div>
                      <p className='my-auto'>
                        {element['legendName'] !== "current entity" ? ( element['legendName'] !== "spatial parent" ? element['legendName']: <Link className='link' href={`/browse/${spatiallyWithin}`}> {spatiallyWithin}</Link>) : (entityTitle)}
                      </p>
                    </span>
                    )
                  })}
                  
                  
                </div>
              </div>

              {/* </span> */}
              {/* <MapComponent zoom={15} width="600px" height="300px" item={itemName} color={"#FF7259"} additionalItems={secondaryEntity}  imageARC={imageLocation}/> */}
              <MapComponent zoom={15} width="100%" height="100%" item={itemName} entityType={entityType} spacesWhereTheConceptIsDepictedGeoJSONs={spacesWhereTheConceptIsDepictedGeoJSONs}  spatiallyWithin={spatiallyWithin} color={"#FF7259"} additionalItems={secondaryEntity}  imageARC={imageLocation}/>
            </div>

          </div>

          <div className='flex flex-col lg:flex-row justify-evenly h-[47vh] w-full'>
            <div className='border-2 border-amber-700 w-[25vw] flex justify-start overflow-auto '>
              {entityType !== "" ? <ConceptNavigator selectedEntity={itemName} selectedEntityLabel={entityTitle} entityType={entityType} setSecondaryEntity={setSecondaryEntity}/> :""}
            </div>

            <div className='border-2 border-amber-700 w-full bg-slate-950 overflow-auto '>

              {imageURLs?(imageURLs.length > 0?
              <div className='overflow-hidden p-5 w-[40vw] z-0 space-y-5 mx-auto'>


                {/* credits for Luna's image gallery: */}
                <Link href={LunaLink?LunaLink:"/start"} target="_blank"
                  className='text-white text-sm link w-[100%] text-right'>
                    View in Luna (from UMass Amherst Library)
                </Link>


                {/* https://github.com/xiaolin/react-image-gallery */}
                {/* <ImageGallery  items={imageURLs} /> */}
                <Swiper  navigation={true} modules={[Navigation, Thumbs, FreeMode]}
                  thumbs={{ swiper: thumbsSwiper }}
                  spaceBetween={50}
                  slidesPerView={1}
                  onSlideChange={(swiper) => {
                    
                    //set the current image index
                    setCurrImageIndex(swiper.activeIndex)

                    //set the current image pointer
                    setImageLocation(imageURLs[Number(swiper.activeIndex)]["arc"])

                    //set the Luna citation link
                    setLunaLink(imageURLs[Number(swiper.activeIndex)]["l_img_url"])


                  }}
                  onSwiper={(swiper) => {}}
                  className='mySwiper2'
                  style={{
                    '--swiper-navigation-color': 'white',
                    '--swiper-pagination-color': '#000',
                  }}
                >


                  {imageURLs.map((imgURL, index)=>
                  {
                    return (
                    <div key={index.toString()+Math.floor(Math.random()*1000).toString()} className='flex flex-col'>
                      <SwiperSlide>
                      <img className='h-[30vh] mx-auto px-16' src={imgURL["url"]}/>
                      
                      </SwiperSlide>
                      {/* <span className='h-[20vh] overflow-y-auto text-white'>
                        {imgURL['description']}
                      </span> */}
                    </div>)
                    
                  })}
                  {/* ... */}
                </Swiper>

                
                

                {/* CITATION:https://github.com/leandrowd/react-responsive-carousel */}
                {/* <Carousel clas showIndicators={false} dynamicHeight={false}>
                  {imageURLs.map(imgURL=>{
                    return (<div>
                      <img src={imgURL}/>
                      <p></p>
                    </div>)
                  })}
                </Carousel> */}

                <div className='text-white overflow-y-auto h-[20vh] text-left p-3 border-2 border-white rounded-md'>

                  {
                    imageURLs.length>0 ? imageURLs[currImageIndex]['description'] : ""
                  }

                </div>

                {/* thumbnail swiper */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper"
                >

                  {imageURLs.map((imgURL, index)=>{
                    return (<SwiperSlide key={index.toString()+Math.floor(Math.random()*1000).toString()}>
                      {<img id={index} src={imgURL["url"]}/>}
                    </SwiperSlide>)
                  })}

                </Swiper>

                
              </div>
            
            :""):""}

            </div>
            
          </div>
          
        </div>
      </div>
      
      <span className='w-full  my-5'>
         View {" "}
         <Link className='link' href={`https://p-lod.org/urn/urn:p-lod:id:${itemName}`}>
            {entityTitle? entityTitle:itemName}
         </Link>
          {" "}on P-LOD
      </span>
      
    </PageLayout>
    
    
  )
}
export const Head = (props) => <title>{"PALP Browse "+capitalize(props.params.name)} </title>

export default Item