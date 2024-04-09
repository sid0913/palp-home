import React, { useState } from 'react'
import { Link } from 'gatsby'
import * as styles from '../styles/SpaceNavigation.module.css'


//DEPRECATED: KEEPING AROUND TO EXTRACT THE REGION-INSULA-PROPERTY TAB SWITCHER- DELETE AFTER THIS
const SpaceNavigator = ({selectedConcept}) => {
    //the options of space levels
    const levels = ["Region", "Insula","Property"] //, "Space"]

    //the complete list of all the concepts
    const regions = ["r1", "r2", "r3", "r4"]
    const insulae = ["r1-i1", "r2-i1", "r3-i1", "r4-i1"]
    const properties= ["r1-i1-p1", "r2-i1-p3", "r3-i1-p1", "r4-i1-p3"]

    //this wasn't working with the endpoint for geojsons
    // const spaces = ["r1-i1-p1-space-a", "r2-i1-p3-space-2", "r3-i1-p1-space-1", "r4-i1-p3-space-1"]

    const mappingLevelsToArray = {Region:regions, Property: properties, Insula:insulae}

    selectedConcept = selectedConcept?selectedConcept:""

    const [selectedLevel, setSelectedLevel] = useState("Region")
    const [completeList, setCompleteList] = useState(regions)

  return (
    <div className='p-5'>

        {/* <div class={styles.dropdown}>
            <button class={styles.dropbtn}>{selectedLevel}</button>
            <div class={styles.dropdownContent}>
                {levels.map((element)=>{
                    return (<a href="#" onClick={()=>{
                        setSelectedLevel(element)
                        setCompleteList(mappingLevelsToArray[element])
                    }}>{element}</a>)

                })}
            </div>

    
        </div> */}


        <span className='space-x-3 px-1'>
            {levels.map((element)=>{
                return (<a href="#" className={`${selectedLevel === element ?"font-bold":""}`} onClick={()=>{
                    setSelectedLevel(element)
                    setCompleteList(mappingLevelsToArray[element])
                }}>{element}</a>)

            })}
        </span>


        <ul className='text-green-500 text-center p-5'>
            {completeList.map((concept)=>{
                //if selected, highlight it
                if (concept.toLowerCase() === selectedConcept.toLowerCase()){
                    return (
                        <li className='text-black font-semibold'>
                                {concept}
                        </li>
                    )
                }

                else{
                    return (
                        <li className='text-cyan-800  decoration-cyan-800 hover:underline'>
                            <Link href={`/browse/${concept.toLowerCase()}`}>
                                {concept}
                            </Link>
                        </li>
                    )
                }
            })}
        </ul>
    </div>
  )
}

export default SpaceNavigator