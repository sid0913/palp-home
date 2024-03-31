import React, { useEffect } from 'react'
import MapComponent from '../../components/Map'
import { useState } from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ConceptNavigator from '../../components/ConceptNavigator';
import PageLayout from '../../components/layouts/PageLayout';

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


  


  //get the images of the item
  useEffect(async()=>{
    //if this is any empty item- do nothing, showing a plain map
    if (itemName === ""){
      return
    }
    //fetch the images
    const response = await fetch(`https://api.p-lod.org/depicted-where/${itemName}`)

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


  }, [])

  return (
    <PageLayout>
      <div className='text-left mt-10 text-6xl my-28 md:pl-28 lg:pl-64'>
        {capitalize(itemName)}
      </div> 

      <div className='flex flex-row justify-evenly'>
        <ConceptNavigator selectedConcept={itemName}/>
        <MapComponent zoom={14} width="500px" item={itemName} color={"#FF7259"}/>
      </div>

      
      {imageURLs?(imageURLs.length > 0?
      <div className='border-2 border-black overflow-hidden w-[50vw] lg:w-[25vw] h-auto mx-auto my-10 '>

        <ImageGallery  items={imageURLs} />

        
      </div>
    
    :""):""}

    </PageLayout>
    
    
  )
}
export const Head = (props) => <title>{"PALP Browse "+capitalize(props.params.name)} </title>

export default Item