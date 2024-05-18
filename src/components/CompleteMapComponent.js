import React from 'react'
import MapComponent from './Map'

const CompleteMapComponent = ({itemName, spatiallyWithin, imageLocation, entityTitle, entityType, secondaryEntity, setSecondaryEntity, height, width}) => {

    spatiallyWithin = spatiallyWithin?spatiallyWithin:""
    secondaryEntity = secondaryEntity?secondaryEntity:[]
    imageLocation = imageLocation? imageLocation:""
  return (
    <div style={{height:height, width:width}} className={`border-2 border-amber-700 overflow-auto relative`}>
              {/* <span className='z-10 relative top-0 right-0'> */}
                {/* <button style={{zIndex:700}} disabled={secondaryEntity.length === 0 } className={ ` p-2 m-2 rounded-lg text-xs absolute top-0 right-0 ${secondaryEntity.length > 0 ?'bg-black text-white border-2 border-black hover:bg-white hover:text-black ':"bg-slate-300 border-2 border-slate-300 text-slate-400"}`} onClick={()=>{
                  //empty the secondary entities array
                  setSecondaryEntity([])
                }}>Clear</button> */}
              <div style={{zIndex:700}} className={ `p-2 m-2 rounded-lg text-xs absolute bottom-0 left-0 `}>
                <div className='flex flex-row space-x-2 bg-slate-50/75 rounded-md p-2'>

                  {[{color:"#dc143c", legendName:"current entity"}, {color:"#000000", legendName:"current image"}, {color:"#eee600", legendName:"spatial parent"}, {color:"#AAFF00", legendName:"added entities"}].map((element)=>{
                    return(
                    <span className={` flex flex-row space-x-1 ${element["legendName"] === "current image" && imageLocation === ""?"hidden":""} ${element["legendName"] === "added entities" && secondaryEntity.length === 0?"hidden":""} ${element["legendName"] === "spatial parent" && (entityType === "concept" || entityType === "")?"hidden":""}`}>
                      <div style={{backgroundColor:element["color"]}} className={`h-[10px] w-[10px] my-auto `}>

                      </div>
                      <p className='my-auto'>
                        {element['legendName'] !== "current entity" ? element['legendName'] : (entityTitle)}
                      </p>
                    </span>
                    )
                  })}
                  
                  
                </div>
              </div>

              {/* </span> */}
              {/* <MapComponent zoom={15} width="600px" height="300px" item={itemName} color={"#FF7259"} additionalItems={secondaryEntity}  imageARC={imageLocation}/> */}
              <MapComponent zoom={15} width="100%" height="100%" item={itemName} spatiallyWithin={spatiallyWithin} color={"#FF7259"} additionalItems={secondaryEntity}  imageARC={imageLocation}/>
            </div>
  )
}

export default CompleteMapComponent