import React, { useState } from 'react'
import MainTemplate from '../components/layouts/MainTemplate'
import MapComponent from '../components/Map'
const Explore = () => {
    const itemList = ["snake", "lion","r1-i1-p1"]
    const colors = ["#FF7259", "#E7A10C", "#7759FF"]

    const [currItem, setCurrItem] = useState("snake")
    const [currColor, setCurrColor] = useState(colors[itemList.indexOf(currItem)])
    const [mapProps, setMapProps] = useState({item:"snake", color:colors[itemList.indexOf("snake")]})
    const [dummyState, setDummyState] = useState(1)
    
  return (
    <MainTemplate>
        {itemList.map((item)=>{
            return (
            <>
                <button onClick={()=>{setCurrItem(item); console.log("index is", itemList.indexOf(currItem)); setCurrColor(colors[itemList.indexOf(currItem)]); setMapProps({item:item, color:colors[itemList.indexOf(item)]})}}>{item}</button> <br/>
            </> 
            )
        })}
        

        <span>Currently Selected:{currItem}</span>
        <br></br>

        <button onClick={()=>setDummyState(dummyState+1)}>
            you clicked me {dummyState} times
        </button>

        <MapComponent item={mapProps.item} color={mapProps.color}/>
        
    </MainTemplate>
    
  )
}

export default Explore

export const Head = () => <title>Explore Page</title>
