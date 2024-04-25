

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import { useState, useEffect } from 'react';

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

const MapComponent = ({item, color, height, width, zoom, additionalItems}) => {
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

  //the styling for the geojson plots on the map
  const [geoJsonStyle, setGeoJSONOptions ] = useState({
    "color": color,
    "weight": 5,
    "opacity": 0.25
});

  //state to hold the polygon locations for the map
  const [PolygonDeets, setPolygon]  = useState([]);

  //hold the polygon details for additional items
  const [additionalItemsPolygonDeets, setAdditionalItemsPolygonDeets]  = useState([]);


  useEffect(()=>{

    //asynchronously get the geojsons and assign them to the Polygon react state
    (async ()=>{

      //if this is any empty item- do nothing, showing a plain map
      if (item === ""){
        return
      }

      const result = await getGeoJSON(item);
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



    (async ()=>{

      if (additionalItems.length === 0){
        return 
      }
      console.log("additional items list not empty")

      

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
          const api_response = result[0];
          let list_of_geo_jsons;
          if(api_response.features){
            list_of_geo_jsons = api_response.features;
        
          }
        
          else{
            list_of_geo_jsons = [api_response]
          }
          // console.log({geojson:list_of_geo_jsons, color:"#ff0000"})
      
          additionalItemsGeoJSONs.push({geojson:list_of_geo_jsons, color:"#ff0000"});
          if(indexElement === additionalItems.length-1){

            setAdditionalItemsPolygonDeets(additionalItemsGeoJSONs)

          }
          
        }
        
        // return additionalItemsGeoJSONs;
      }


      await fillGeoJSONArray()

      

      // setAdditionalItemsPolygonDeets(FinalAdditionalItemsGeoJSONs)

    })();
  }, [item, additionalItems])

  return (

    <>
    <MapContainer style={{ height: height, width:width }} center={DEFAULT_CENTER} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://palp.art/xyz-tiles/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      {/* <Marker position={[52.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker> */}

      {/* {
        PolygonDeets.map((element)=>{
          // console.log(element, "polygon og element")
          return (<GeoJSON pathOptions={geoJsonStyle} data={element} />);
        })

      } */}

{
        PolygonDeets.map((element)=>{
          return (<GeoJSON pathOptions={{"color": "#00ff80",
          "weight": 5,
          "opacity": 0.90}} data={element} />);
        })

      }

      {/* {
        additionalItemsPolygonDeets.reduce((accumulator, additionalItem)=>{
            return accumulator.concat(additionalItem["geojson"].map((element)=>{
            console.log("here",additionalItem)
            return (<GeoJSON pathOptions={{"color": "#00ff80",
            "weight": 5,
            "opacity": 0.90}} data={element} />);
          }))

          
        }, [])
      } */}

{
        additionalItemsPolygonDeets.map((additionalItem)=>{
          console.log("this is the additional item", additionalItem)
          console.log("This is the addn deets", additionalItemsPolygonDeets)
            return (<>


              {
                additionalItem["geojson"].map((element)=>{
                  console.log(element, "printed")
                  return (<GeoJSON pathOptions={geoJsonStyle} data={element} />);
                })
              }
            
              {/* this is supposed to be right beside the other popup but it doesnt show up either- hardcoding before the map makes it show up though so multiple popups are allowed */}
              <Marker position={[52.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            
            </>)

          
        })
      }



      {/* {
        additionalItemsPolygonDeets?additionalItemsPolygonDeets.length>0?additionalItemsPolygonDeets[0]["geojson"].map((element)=>{
          console.log("here",additionalItemsPolygonDeets[0])
          return (<GeoJSON pathOptions={{"color": "#00ff80",
          "weight": 5,
          "opacity": 0.90}} data={element} />);
        }) :"":""
      } */}


    </MapContainer>
      {additionalItemsPolygonDeets.length === 0? <span>This is not empty </span>:""}
  </>
  )
}

export default MapComponent

// export const Head = ()=> <title>Map demo with component</title>


