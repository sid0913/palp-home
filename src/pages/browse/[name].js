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

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const itemName = props.params.name;

  //the image urls
  const [imageURLs, setImageURLs] = useState([])

  //the location string of the currently viewed image
  const [imageLocation, setImageLocation] = useState("")


  //the index number of the currently showing image in the gallery
  const [currImageIndex, setCurrImageIndex] = useState(0)

  //the title with the entity name
  const [entityTitle, setEntityTitle] = useState("")
  const [secondaryEntity, setSecondaryEntity] = useState([])

  //the type of the entity
  const [entityType, setEntityType] = useState("")
  



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
        

        return {"url":element["l_img_url"], "arc":element["feature"].replace("urn:p-lod:id:",""), "description":element["l_description"]}
      })


      setImageURLs(urls)

      //show the location of the current image in the gallery on the map
      if(urls.length > 0 && imageLocation.length === 0){
        setImageLocation(urls[0]["arc"]);
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

      
        <div className={`text-left text-base font-semibold py-2 md:pl-28 lg:pl-5 `}>  
          {entityTitle}
        </div> 

        <div className='flex flex-col'>

          <div className='flex lg:flex-row flex-col justify-evenly h-[30vh] w-full'>
            <div className='border-2 border-amber-700  flex justify-start overflow-auto w-[25vw] '>
              {/* <SpaceNavigator selectedConcept={itemName}/> */}
              {entityType !== "" ?<SpatialNavigator selectedEntity={itemName} selectedEntityLabel={entityTitle} entityType={entityType} setSecondaryEntity={setSecondaryEntity}/> :""}
            </div>

            <div  className='border-2 border-amber-700 w-full overflow-auto relative'>
              {/* <span className='z-10 relative top-0 right-0'> */}
                <button disabled={secondaryEntity.length === 0 } className={ `z-50 p-2 m-2 rounded-lg text-xs absolute top-0 right-0 ${secondaryEntity.length > 0 ?'bg-black text-white border-2 border-black hover:bg-white hover:text-black ':"bg-slate-300 border-2 border-slate-300 text-slate-400"}`} onClick={()=>{
                  //empty the secondary entities array
                  setSecondaryEntity([])
                }}>Clear</button>
              {/* </span> */}
              {/* <MapComponent zoom={15} width="600px" height="300px" item={itemName} color={"#FF7259"} additionalItems={secondaryEntity}  imageARC={imageLocation}/> */}
              <MapComponent zoom={15} width="100%" height="100%" item={itemName} color={"#FF7259"} additionalItems={secondaryEntity}  imageARC={imageLocation}/>
            </div>

          </div>

          <div className='flex flex-col lg:flex-row justify-evenly h-[47vh] w-full'>
            <div className='border-2 border-amber-700 w-[25vw] flex justify-start overflow-auto '>
              {entityType !== "" ? <ConceptNavigator selectedEntity={itemName} selectedEntityLabel={entityTitle} entityType={entityType} setSecondaryEntity={setSecondaryEntity}/> :""}
            </div>

            <div className='border-2 border-amber-700 w-full bg-slate-950 overflow-auto '>

              {imageURLs?(imageURLs.length > 0?
              <div className='overflow-hidden p-5 w-[40vw] z-0 space-y-5 mx-auto'>
                {/* https://github.com/xiaolin/react-image-gallery */}
                {/* <ImageGallery  items={imageURLs} /> */}
                <Swiper  navigation={true} modules={[Navigation, Thumbs, FreeMode]}
                  thumbs={{ swiper: thumbsSwiper }}
                  spaceBetween={50}
                  slidesPerView={1}
                  onSlideChange={(swiper) => {
                    setCurrImageIndex(swiper.activeIndex)

                    setImageLocation(imageURLs[Number(swiper.activeIndex)]["arc"])


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
                      
                      </SwiperSlide>)
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
      

    </PageLayout>
    
    
  )
}
export const Head = (props) => <title>{"PALP Browse "+capitalize(props.params.name)} </title>

export default Item