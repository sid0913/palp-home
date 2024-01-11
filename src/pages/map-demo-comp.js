import React from 'react'
import MapComponent from '../components/Map'
const MapDemoComp = () => {
  return (
    <>
      <div>map-demo-comp</div>
      <MapComponent item="snake" color={"#b029d7"}/>
    </>
    
  )
}

export default MapDemoComp

export const Head = ()=> <title>Map demo with Polygon</title>