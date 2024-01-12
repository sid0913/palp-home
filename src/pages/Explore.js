import React, { useState } from 'react'
import MapComponent from '../components/Map'
const Explore = () => {
    const itemList = ["snake", "lion","r1-i1-p2"]
    const colors = ["#FF7259", "#E7A10C", "#7759FF"]

    const [currItem, setCurrItem] = useState("snake")
    const [currColor, setCurrColor] = useState(colors[itemList.indexOf(currItem)])
    const [mapProps, setMapProps] = useState({item:"snake", color:colors[itemList.indexOf("snake")]})
    
  return (
    <>
        {itemList.map((item)=>{
            return (
            <>
                <button className='hover:bg-blue-500 bg-blue-800 text-white rounded-lg p-1 my-1' onClick={()=>{setCurrItem(item); console.log("index is", itemList.indexOf(currItem)); setCurrColor(colors[itemList.indexOf(currItem)]); setMapProps({item:item, color:colors[itemList.indexOf(item)]})}}>{item}</button> <br/>
            </> 
            )
        })}
        
        <span>Currently Selected:{" "} <span className='font-bold text-orange-800'>{currItem}</span> </span>
        <br></br>



        <MapComponent item={mapProps.item} color={mapProps.color}/>
        
    </>
    
  )
}

export default Explore

export const Head = () => <title>Explore Page</title>
