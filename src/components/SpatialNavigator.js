import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import LoadingComponent from './LoadingComponent'
import EntityMenuItem from './NavigatorComponents/EntityMenuItem'
import Dropdown from 'rsuite/Dropdown';

// (Optional) Import component styles. If you are using Less, import the `index.less` file. 
import 'rsuite/Dropdown/styles/index.css';
const SpatialNavigator = ({selectedEntity, selectedEntityLabel, entityType, setSecondaryEntity}) => {

    //the options of space levels
    const levels = ["Region", "Insula","Property", "Room", "Wall"] //, "Space"]
    const [selectedLevel, setSelectedLevel] = useState("Region")

    //the options of space levels and their mapping to their respective url parameter
    const spatialDepthLevels = {"Region":"region", "Insula":"insula","Property":"property", "Wall":"feature"} //, "Space"]
    //if the entity is a concept, this state records the level of depth at which the spatial navigator shows the spaces where the concept is depicted
    const [selectedLevelOfDepth, setSelectedLevelOfDepth] = useState("Wall")

    //give it a default empty string value
    selectedEntity = selectedEntity?selectedEntity:""



    //if the entity type is spatial-entity, this stores spatial ancestors of the spatial-entity as JSONs
    const [ancestors, setAncestors] = useState([])

    //if the entity type is spatial-entity, this stores spatial children of the spatial-entity as JSONs
    const [spatialChildren, setSpatialChildren] = useState([])
    
    //if the entity type is concept, this list stores JSONs of the spatial entities where the concept is depicted
    const [listOfSpacesDepictingTheConcept, setListOfSpacesDepictingTheConcept] = useState([])

    //checks the state of the fetches
    const [fetchedAncestors, setFetchedAncestors] = useState(false)
    const [fetchedChildren, setFetchedChildren] = useState(false)
    const [fetchedConceptSpaces, setFetchedConceptSpaces] = useState(false)
 

    
    async function getAncestors(spatialEntity){
        /**
         * given a spatialEntity like r1, it retrieves a list of JSONs of spatial ancestors for the selected spatial entity and sets the states
         * @param  {[string]} spatialEntity the spatial entity we want the ancestors for
         * @return {[JSON]}     a list of JSONs of the ancestors
         */
        
        
            const response = await fetch(`https://api.p-lod.org/spatial-ancestors/${spatialEntity}`);
        
            if(response.ok){
                const listOfAncestors = await response.json()

                //set the state for ancestors
                setAncestors(listOfAncestors.reverse().slice(0,-1))
                setFetchedAncestors(true)
        
            }
            else{
                console.log("Error retrieving ancestors for "+spatialEntity)
            }
    }

    async function getConceptualChildren(spatialEntity){
        /**
         * given a spatialEntity like r1, it retrieves a list of JSONs of spatial children for the selected spatial entity
         * @param  {[string]} spatialEntity the spatialEntity we want the spatial children for
         * @return {[JSON]}     a list of JSONs of the children
         */
        
            const response = await fetch(`https://api.p-lod.org/spatial-children/${spatialEntity}`);
        
            if(response.ok){
                const listOfChildren = await response.json()

                // if(listOfChildren.length === 0){
                //     return 

                // }

                // else{
                    //set the state for children
                    const finalChildrenList = listOfChildren.reverse().slice(0,-1)
                    const ranking=["city", "region","property","insula","space","street"]
                    //sort to make sure the children are sorted according to the above ranking
                    finalChildrenList.sort((elementA,elementB)=>{
                        let a = "space"
                        let b = "space"
                        if (elementA["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]){
                            a = elementA["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"].replace("urn:p-lod:id:","")
                        }

                        if (elementB["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]){
                            b = elementB["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"].replace("urn:p-lod:id:","")
                        }
                         

                        let valueA = 10
                        let valueB = 10
                        if (ranking.includes(a)){
                            valueA = ranking.reverse().indexOf(a)
                        }

                        if (ranking.includes(b)){
                            valueB = ranking.reverse().indexOf(b)
                        }

                        return valueA-valueB
                    })
                    setSpatialChildren(finalChildrenList)
                    setFetchedChildren(true)
                // }

                
        
            }
            else{
                console.log("Error retrieving children for "+spatialEntity)
            }
    }

    async function getSpatialAncestors(room){
        /**
         * given a spatialEntity like r1, it retrieves a list of JSONs of spatial ancestors for the selected spatial entity
         * @param  {[string]} room the room we want the ancestors for
         * @return {[JSON]}     a list of JSONs of the ancestors
         */
        
        
        const response = await fetch(`https://api.p-lod.org/spatial-ancestors/${room}`);
        
        if(response.ok){
            const listOfAncestors = await response.json()

            //set the state for ancestors
            return listOfAncestors.reverse().slice(0,-1)
    
        }
        else{
            console.log("Error retrieving ancestors for "+room)
        }
    }

    async function getSpatialParentsForAllRooms(arrayOfRooms){
        const uniqueRooms = new Set(arrayOfRooms);

        const Regions = []
        const RegionsJSONs = []
        const Properties = []
        const PropertiesJSONs = []
        const Insulae = []
        const InsulaeJSONs = []

        uniqueRooms.forEach((element)=>{
            // const result = await getSpatialAncestors(room)

        })
        
    }

    async function getSpatialEntitiesWhereTheConceptIsDepicted(concept){
        /**
         * retrieves a list of spatial entities where the selected concept is depicted
         * @param  {[String]} concept the concept for which we are search spatialEntities
         * @return {[JSON]}     a list of JSONs of the spatialEntities
         */
            //fetch the spaces where the concept is depicted to the select of depth that the user selects
            const response = await fetch(`https://api.p-lod.org/depicted-where/${concept}?level_of_detail=${spatialDepthLevels[selectedLevelOfDepth]}`);
        
            if(response.ok){
                const listOfDepictedConcepts = await response.json()


                if(listOfDepictedConcepts.length === 0){
                    setFetchedConceptSpaces(true)
                    return 

                }

                else{
                    setFetchedConceptSpaces(true)
                    //set the state for children
                    setListOfSpacesDepictingTheConcept(listOfDepictedConcepts)
                    getSpatialParentsForAllRooms(listOfDepictedConcepts.filter((element)=>{return element["within"]}).map((element)=>{
                        return element['within'].replace("urn:p-lod:id:","")
                    }))
                }

                
        
            }
            else{
                console.log("Error retrieving the spatial entities where the concept is depicted")
            }
    }

    useEffect(()=>{
    

        switch(entityType){
    
            //for Pompeii
            case "city":

                //get the immediate children of the spatialEntity and all the ancestors
                (async ()=>{getConceptualChildren(selectedEntity);getAncestors(selectedEntity)})()


                return 

            //for spatialEntities
            case "spatial-entity":
                //get the immediate children of the spatialEntity and all the ancestors
                (async ()=>{getConceptualChildren(selectedEntity);getAncestors(selectedEntity)})()
                return

            //for concepts
            case "concept":
                
                (async()=>getSpatialEntitiesWhereTheConceptIsDepicted(selectedEntity))()
                

                return

        }

    }, [selectedLevelOfDepth])

    

    

  return (
    <div className='p-2 flex flex-col space-y-1'>
        <h1 className='font-semibold text-lg text-left'>
            Spatial Units
        </h1>

        <ul className='text-left text-green-700'>
            {/* if the entity type is spatialEntity or city, show a heirarchy of it, or if it is a concept, render a list of spatial entities where the concept is depicted */}
            { 
            
            // if the entity type has not been fetched yet, don't render anything
            entityType === ""?

                <></>

                :
                //if it is concept, show all the locations where the concept shows up
                entityType === "concept"? 
                    function (){return (
                        <>
                            <LoadingComponent hiddenWhen={fetchedConceptSpaces}/>
                            {/* <Dropdown style={{margin:"2vh"}} trigger="click" title={selectedLevel} >
                                {levels.map((element)=>{
                                    return (<Dropdown.Item value={element}  onClick={()=>{
                                        setSelectedLevel(element)
                                        // setCompleteList(mappingLevelsToArray[element])
                                    }}>{element}</Dropdown.Item>)

                                })}
                            </Dropdown> */}


                            {/* <select className='border-2 border-slate-200 bg-slate-50 p-2 rounded-md' style={{margin:"2vh"}} trigger="click" title={selectedLevel}  >
                                {levels.map((element)=>{
                                    return (<option value={element}  onClick={()=>{
                                        setSelectedLevel(element)
                                        console.log("selected level", selectedLevel)
                                        // setCompleteList(mappingLevelsToArray[element])
                                    }}>{element}</option>)

                                })}
                                
                            </select>  */}
                            <details className="dropdown">
                                <summary className="btn m-1">
                                    {selectedLevelOfDepth}
                                </summary>
                                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    {Object.keys(spatialDepthLevels).map((depthLevel)=>{
                                        return (
                                            <button key={depthLevel}
                                            onClick={()=>{

                                                //set the level of depth selected to the option the user clicks on
                                                setSelectedLevelOfDepth(depthLevel)

                                            }}
                                            >
                                                {depthLevel}
                                            </button>
                                        )
                                    })}
                                    
                                </ul>
                            </details>

                            

                            {listOfSpacesDepictingTheConcept.map((concept)=>{
                                //if selected, highlight it
                                
                                const label = concept["urn"].replace("urn:p-lod:id:","")
                                    return (
                                            <EntityMenuItem key={label+Math.floor(Math.random()*1000).toString()} lowerCaseName={label} label={label} setSecondaryEntity={setSecondaryEntity}/>
                                        
                                    )
        
                            })}
                        </>
                        
                    )
                    
                    } ()
                    
                    

                    
                    :
                    
                    

                    //if the entity is not a concept execute this, show the hierarchy of the spatial entity
                    function (){
                        return (
                            <>
                                <LoadingComponent hiddenWhen={fetchedAncestors && fetchedChildren}/>
                                
                                {ancestors.map((ancestor)=>{

                                    const label = ancestor['label']? ancestor['label'] : ancestor['urn'].replace("urn:p-lod:id:","")
                                    const lowerCaseName = ancestor['urn'].replace("urn:p-lod:id:","")

                                    return(
     
                                        <EntityMenuItem key={lowerCaseName+Math.floor(Math.random()*1000).toString()} lowerCaseName={lowerCaseName} label={label} setSecondaryEntity={setSecondaryEntity}/>
                                        
                                    );
                                    })}



                                    {/* Make the selected concept bold and display it */}


                                    <li className='ml-3 text-black font-semibold'>{selectedEntityLabel}</li>


                                            

                                    {/* the spatial children */}

                                    <div className='ml-5'>

                                        {spatialChildren.map((conceptualChild)=>{

                                        const label = conceptualChild['urn'].replace("urn:p-lod:id:","")
                                        const lowerCaseName = conceptualChild['urn'].replace("urn:p-lod:id:","")

                                        return(
                                            
                                            <EntityMenuItem key={lowerCaseName+Math.floor(Math.random()*1000).toString()} lowerCaseName={lowerCaseName} label={label} setSecondaryEntity={setSecondaryEntity}/>
                                        );
                                        })}
                                    </div>
                                    
                            </>
                        )
                    }()

                
            }
        </ul>
    </div>
  )
}

export default SpatialNavigator