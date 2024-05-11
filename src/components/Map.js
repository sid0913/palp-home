

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import { useState, useEffect } from 'react';
import { element } from 'prop-types';
import { Link } from 'gatsby';

const DEFAULT_CENTER = [40.75, 14.485]


async function getGeoJSON(item){
  /**
 * given an entity like snake or an address like r1-i1-p1, it returns a geojsons where the item is found or the location of the address respectiely, from the palp.art server
 * @param  {[string]} item the entity or address we want the geojson for
 * @return {[Array]}     a list of geojsons where the item is found on the pompeii map
 */

  let geo_json;
  //whether the endpoint was found
  let found = false;
  let text;


  //fetch the api response

      // const response = await fetch("https://api.p-lod.org/geojson/snake", { headers: {'Content-Type':'application/json','Access-Control-Request-Method':'GET', 'Access-Control-Request-Headers': 'Content-Type, Authorization'}});
      const response = await fetch(`https://api.p-lod.org/geojson/${item}`);

      if (!response.ok) {
        console.log("url not found")
        throw new Error("Network response was not OK. item:"+item);
      }
      else{
        

        try{
          //get text from the response
          text = await response.text()

          //if text is empty aka the item doesn't exist in the palp api then show an alert saying that it doesn't exist
          if(text === ""){
            alert("searched item doesn't exist")
          }
          else{
            // geo_json = response.json();

            //get the geojson
            geo_json = await JSON.parse(text)

            found = true;

          }

        }
        catch(err){
          console.log(err)
          console.log("Error while retrieving the geojson")
        }



      }

  return [geo_json, found];
}

const MapComponent = ({item, color, height, width, zoom, additionalItems, imageARC}) => {
    /**
 * given an entity like snake or an address like r1-i1-p1, it returns a map component where that entity or address is plotted
 * @param  {string} item the entity or address we want plotted- must be lower case
 * @param  {string} color the color we want it plotted in
 * @param  {string} width width as a string in pixels, the default value is "1200px"
 * @param  {string} height height as a string in pixels like "200px"
 * @param  {Integer} zoom how far out the map should be zoomed like 15. The higher the value the more zoomed in
 * @param  {[JSON]} additionalItems array of jsons of the itemName and color
 * @return {Component}   the map component
 */

  //assigning default values
  height = height? height: "200px" 
  width = width? width: "1200px"
  zoom = zoom? zoom: 15
  additionalItems = additionalItems? additionalItems : []
  color = color? color : "#b029d7"
  imageARC = imageARC? imageARC : ""

  

  //the geojson style of the currently selected image
  const currImageGeoJSONStyle = {
    "color": "#000000",
    "weight": 9,
    "opacity": 0.9
  } 

  //style of the geojsons to be plotted for all the occurences of the current item on the map
  const currentItemGeoJSONStyle={"color": "#00ff80",
    "weight": 5,
    "opacity": 0.50}

  //the styling for the additional geojson plots on the map
  const additionalGeoJSONStyle = {
    "color": "#FF7259",
    "weight": 6,
    "opacity": 0.25
  };

  //state to hold the polygon locations for the map
  const [PolygonDeets, setPolygon]  = useState([]);

  const [currImagePolygonDeets, setCurrImagePolygonDeets]  = useState([]);

  //hold the polygon details for additional items
  const [additionalItemsPolygonDeets, setAdditionalItemsPolygonDeets]  = useState([]);
  // const [imagePolygonState, setImagePolygonState]  = useState(undefined);
  


  useEffect(()=>{

    //asynchronously get the geojsons and assign them to the Polygon react state of the current item
    (async ()=>{

      //if this is any empty item- do nothing, showing a plain map
      if (item === ""){
        return
      }

      const result = await getGeoJSON(item);
      if (result === null){
        return
      }
      const api_response = result[0];
      let list_of_geo_jsons;
      if(api_response.features){
        list_of_geo_jsons = api_response.features;
    
      }
    
      else{
        list_of_geo_jsons = [api_response]
      }
  
  
      setPolygon(list_of_geo_jsons);
    })();

    //asynchronously assign the polygons for the ARC wall of the currently viewed image
    (async ()=>{


      //if this is any empty item- do nothing, showing a plain map
      if (imageARC === ""){
        return
      }

      const result = await getGeoJSON(imageARC);
      if (result === null){
        return
      }
      console.log("result is", result)
      const api_response = result[0];
      let list_of_geo_jsons;
      if(api_response.features){
        list_of_geo_jsons = api_response.features;
    
      }
    
      else{
        list_of_geo_jsons = [api_response]
      }

  
  
      // setCurrImagePolygonDeets([]);
      setCurrImagePolygonDeets(list_of_geo_jsons);

      //this dynamically adds a growing black spot that grows when the navigation arrows are used- indicating that it can be changed and that the new geojson values are different
      // setCurrImagePolygonDeets((prev, props)=>{
      //   return prev.concat(list_of_geo_jsons)
      // });

      //this stays stationary
      // setCurrImagePolygonDeets((prev, props)=>{
      //   const newArray = []
      //   return newArray.concat(prev)
      // });


    })();



    (async ()=>{

      if (additionalItems.length === 0){
        setAdditionalItemsPolygonDeets([])
        return 
      }

      

      async function fillGeoJSONArray(){
        const additionalItemsGeoJSONs = []

        // additionalItems.forEach(async(item) => {

        for (let indexElement = 0; indexElement < additionalItems.length; indexElement++){
          
          const item = additionalItems[indexElement]
        


          //if this is any empty item- do nothing, showing a plain map
          if (item === ""){
            return
          }

          
  
          const result = await getGeoJSON(item);
          if (result === null){
            return
          }
          const api_response = result[0];
          let list_of_geo_jsons;
          if(api_response.features){
            list_of_geo_jsons = api_response.features;
        
          }
        
          else{
            list_of_geo_jsons = [api_response]
          }
      
          additionalItemsGeoJSONs.push({geojson:list_of_geo_jsons, color:"#ff0000"});
          if(indexElement === additionalItems.length-1){

            setAdditionalItemsPolygonDeets(additionalItemsGeoJSONs)



          }
          
        }
        
        // return additionalItemsGeoJSONs;
      }


      await fillGeoJSONArray()

      


    })();
  }, [item, additionalItems, imageARC])

  return (

    <>
    <MapContainer style={{ height: height, width:width }} center={DEFAULT_CENTER} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://palp.art/xyz-tiles/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

      {/* the polygons of the current item */}
      {
        PolygonDeets.map((element)=>{
          return (<GeoJSON key={element["id"]+Math.floor(Math.random()*1000).toString()} pathOptions={currentItemGeoJSONStyle} data={element} >
            <Popup>
              {`${element['id'].replace("urn:p-lod:id:","")}`}
            </Popup>
          </GeoJSON>);
        })

      }

      {/* shows the location of the currently presenting image on the gallery */}
      {

        currImagePolygonDeets.map((currentImagePolygon)=>{
          return (
            // IMP:the key enables the geojson to change when the data prop is changed
          <GeoJSON key={currentImagePolygon['id']+Math.floor(Math.random()*1000).toString()} pathOptions={currImageGeoJSONStyle} data={currentImagePolygon}>
            <Popup>
              The selected image is in <Link className='hover:underline' href={`/browse/${currentImagePolygon['id'].replace("urn:p-lod:id:","")}`}>{`${currentImagePolygon['id'].replace("urn:p-lod:id:","")}`}</Link> 
            </Popup>
          </GeoJSON>);
        })
      }
      
      {/* shows the additional items on the map */}
      {
        additionalItemsPolygonDeets.map((additionalItem)=>{

            return (<>


              {
                additionalItem["geojson"].map((element)=>{
                  return (<GeoJSON key={element["id"]+Math.floor(Math.random()*1000).toString()} pathOptions={additionalGeoJSONStyle} data={element} >
                    <Popup>
                      {`${element['id'].replace("urn:p-lod:id:","")}`}
                    </Popup>
                  </GeoJSON>);
                })
              }
            

            
            </>)

          
        })
      }




    </MapContainer>
  </>
  )
}

export default MapComponent

// export const Head = ()=> <title>Map demo with component</title>


