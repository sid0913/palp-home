// import React from 'react'
// // import Map from '../components/map'
// export const mapDemo = () => {
//   return (
//     <>
//     <div>map</div>
//     {/* <Map/> */}
//     </>
//   )
// }

// export default mapDemo
// export const Head = () => <title>Demo of React Leaflet</title>


import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import { useState, useEffect } from 'react';
import useSWR from 'swr';

const DEFAULT_CENTER = [40.749908945558815,  14.50079038639771]


async function getGeoJSON(item){
  let geo_json;
  //whether the endpoint was found
  let found = false;
  let text;


  //fetch the api response

      // const response = await fetch("http://palp.art/api/geojson/snake", { headers: {'Content-Type':'application/json','Access-Control-Request-Method':'GET', 'Access-Control-Request-Headers': 'Content-Type, Authorization'}});
      const response = await fetch(`http://palp.art/api/geojson/${item}`);

      console.log(response)
      if (!response.ok) {
        console.log("url not found")
        throw new Error("Network response was not OK");
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

const IndexPagePolygon = () => {
  const color = "#b029d7"


  const [geoJsonStyle, setGeoJSONOptions ] = useState({
    "color": color,
    "weight": 5,
    "opacity": 0.85
});
  const [PolygonDeets, setPolygon]  = useState([]);
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data } = useSWR(
    'http://palp.art/api/geojson/snake',
    fetcher
  );
  const item = "snake";

  useEffect(()=>{
    (async ()=>{
      const result = await getGeoJSON(item);
      console.log("this is the result", result[0])
      const api_response = result[0];
      let list_of_geo_jsons;
      if(api_response.features){
        list_of_geo_jsons = api_response.features;
    
      }
    
      else{
        list_of_geo_jsons = [api_response]
      }
  
      console.log("this is the polygon assignment", list_of_geo_jsons)
  
      setPolygon(list_of_geo_jsons);
    })();
  }, [])

  return (
    <MapContainer style={{ height: '400px' }} center={DEFAULT_CENTER} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>

      {
        PolygonDeets.map((element)=>{
          // console.log(element)
          return (<GeoJSON pathOptions={geoJsonStyle} data={element} />);
        })

      }
    </MapContainer>
  )
}

export default IndexPagePolygon

export const Head = ()=> <title>Map demo with Polygon</title>