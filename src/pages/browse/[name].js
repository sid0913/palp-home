import React, { useEffect } from 'react'
import MapComponent from '../../components/Map'
import { useState } from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ConceptNavigator from '../../components/ConceptNavigator';
import SpaceNavigator from '../../components/SpaceNavigator';
import PageLayout from '../../components/layouts/PageLayout';
import SpatialNavigator from '../../components/SpatialNavigator';

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
  const itemName = props.params.name;

  const [imageURLs, setImageURLs] = useState([])

  //the title with the entity name
  const [entityTitle, setEntityTitle] = useState("")

  //the type of the entity
  const [entityType, setEntityType] = useState("")



  async function getEntityDetails(itemName){
    const response = await fetch(`https://api.p-lod.org/id/${itemName}`);

    if (response.ok){
      const responseIdList = await response.json()

      console.log(responseIdList)
      //get the label and type of the entity
      setEntityTitle(responseIdList[0]["http://www.w3.org/2000/01/rdf-schema#label"])

      let entityTypeJSON;

      if(responseIdList[1]["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]){
        entityTypeJSON = responseIdList[1]["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
      }

      else{
        //happens with spaces
        entityTypeJSON = responseIdList[0]["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
      }


      if (entityTypeJSON.includes("concept")){
        setEntityType("concept")
      }

      else if(entityTypeJSON.includes("city")){
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
      throw new Error("Network response was not OK");
    }
    else{
    //get the image from the response
    const jsonBody = await response.json()
    const urls = jsonBody.filter((element)=>{
      return element["l_img_url"] !== "nan"
    }).map((element)=>{
      
      return {"original":element["l_img_url"], "thumbnail":element["l_img_url"]}
    })


    setImageURLs(urls)


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

      
        <div className={`text-left mt-10 text-6xl my-28 md:pl-28 lg:pl-64 `}>  
          {entityTitle}
        </div> 

        <div className='flex flex-col'>

          <div className='flex flex-row justify-evenly'>
            <div className='border-2 border-amber-700 w-full flex justify-start overflow-y-auto max-h-[30vh] lg:max-h-[50vh]'>
              {/* <SpaceNavigator selectedConcept={itemName}/> */}
              {entityType !== "" ?<SpatialNavigator selectedConcept={itemName} selectedConceptLabel={entityTitle} entityType={entityType}/> :""}
            </div>

            <div  className='border-2 border-amber-700 w-full z-0'>
              <MapComponent zoom={15} width="600px" height="300px" item={itemName} color={"#FF7259"}/>
            </div>

          </div>

          <div className='flex flex-row justify-evenly mb-32'>
            <div className='border-2 border-amber-700 w-full flex justify-start overflow-y-auto max-h-[30vh] lg:max-h-[50vh]'>
              {entityType !== "" ?<ConceptNavigator selectedConcept={itemName} selectedConceptLabel={entityTitle} entityType={entityType}/> :""}
            </div>

            <div className='border-2 border-amber-700 w-full'>

              {imageURLs?(imageURLs.length > 0?
              <div className='overflow-hidden p-5 w-[40vw] h-auto z-0'>
                {/* https://github.com/xiaolin/react-image-gallery */}
                <ImageGallery   items={imageURLs} />

                
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