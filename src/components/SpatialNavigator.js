import React, { Component, useEffect, useState } from 'react'
import { Link } from 'gatsby'
import LoadingComponent from './LoadingComponent'
import EntityMenuItem from './NavigatorComponents/EntityMenuItem'
import { IoIosArrowDown } from "react-icons/io";
import Dropdown from 'rsuite/Dropdown';

// (Optional) Import component styles. If you are using Less, import the `index.less` file. 
import 'rsuite/Dropdown/styles/index.css';


const SpatialNavigator = ({selectedEntity, selectedEntityLabel, entityType, setSecondaryEntity, setSpacesWhereTheConceptIsDepictedGeoJSONs}) => {

    //the options of space levels
    // const levels = ["Region", "Insula","Property", "Room", "Wall"] //, "Space"]
    // const [selectedLevel, setSelectedLevel] = useState("Region")

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



    function onlyUniqueLabels(value, index, array) {
        /**
         * this is passed a arrray.filter() as a parameter to return an array without repeated pairs of elements (it only checks the second element of the pair which is from the urn id)
         * @param  {*} value the pair of one lowercase name and one label from the current iteration
         * @param  {Number} index the index from the current iteration
         * @param  {[*]} array the array with repeated elements
         * @return {[*]}     an array with no repeated elements
         */

        //get the lowercase names
        const lowerCaseNames = array.map((element)=> element[1])

        //check if this is the element's first occurence, if so, return true
        return lowerCaseNames.indexOf(value[1]) === index;
    }

    function getSortedUniqueLabelledEntityMenuItems(listOfEntitiesToShowcase){
        /**
         * Returns Entity Menu Items to populate the spatial navigator component. It takes in api response arrays and removes duplicates, sortes and converts them into Entity Menu Components
         * @param  {[*]} listOfEntitiesToShowcase the API Response array to convert into Entity Menu Items
         * @return {[Component]}     an array of Entity Menu Items to populate the Spatial Navigator
         */


        //get the label and lowercase names out of the api response JSON and filter out duplicates
        const listOfUniqueEntities = listOfEntitiesToShowcase.map((entity)=>{
            
            //lowercase name provided by the urn id
            const lowerCaseName = entity['urn'].replace("urn:p-lod:id:","") 

            //if the label parameter (normally a cased version of the lowercase urn name) and if it isn't None, use that, otherwise use the urn name
            const label = entity['label']? (entity['label'] !== "None" ? entity['label']: lowerCaseName) : lowerCaseName

            //return both the label and lowercase name
            return [label, lowerCaseName]
                
            
        }).filter(onlyUniqueLabels) //remove duplicates
        

        //sort the spaces
        listOfUniqueEntities.sort((a,b)=>a[1] < b[1]) 

        //build entity menu items to display them
        return listOfUniqueEntities.map(
            (entityName)=>{

                //get the label to show on the UI
                const label = entityName[0]

                //use the lowercase name for links
                const lowerCaseName = entityName[1]

                //rerturn the entity menu item
                return (
                    <EntityMenuItem key={lowerCaseName+Math.floor(Math.random()*1000).toString()} lowerCaseName={lowerCaseName} label={label} setSecondaryEntity={setSecondaryEntity}/>
                
                )
            })

    }
 

    
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

                    function onlyUnique(value, index, array) {
                        //to be used in a filter function to remove duplicates
                        return array.indexOf(value) === index;
                      }

                    //set the new values to show on the map component
                    const extractedGeojsons = listOfDepictedConcepts.filter(
                        (space)=>{
                            return space["geojson"] !== "None"
                        }
                    ).map(
                        (space)=>{
                            return JSON.parse(space['geojson'])
                        }
                    )

                    //remove duplicates to avoid overcoloring
                    const extractedGeojsonsIDs = extractedGeojsons.map((geojson)=>geojson["id"])
                    const uniqueExtractedGeojsonsIDs = extractedGeojsonsIDs.filter(onlyUnique)



                    const uniqueExtractedGeojsons = extractedGeojsons.filter((geojson)=>{
                        const id = geojson['id']
                        const indexOfID =  uniqueExtractedGeojsonsIDs.indexOf(id)
                        const isFirstInstance = indexOfID !== -1


                        //if this is the first instance of this id, remove it from the list of unique ids
                        if(isFirstInstance){
                            uniqueExtractedGeojsonsIDs.splice(indexOfID, 1)
                        }


                        return isFirstInstance
                    })
                    

                    //plot the spaces on the map
                    setSpacesWhereTheConceptIsDepictedGeoJSONs(uniqueExtractedGeojsons)

                    //get the spatial parent
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
                            {/* the loading component */}
                            <LoadingComponent hiddenWhen={fetchedConceptSpaces}/>

                            {/* the dropdown that allows the user to select the depth at which they want to view the spaces where the concept appears, namely: region, insula, property and wall */}
                            <details className={`dropdown my-2 ${fetchedConceptSpaces? "" :"hidden"}`}>
                                <summary className="btn m-1 bg-lime-300 hover:bg-lime-500">
                                    {selectedLevelOfDepth}
                                    <IoIosArrowDown />
                                </summary>
                                <ul className={`menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow `}>
                                    {Object.keys(spatialDepthLevels).map((depthLevel)=>{
                                        return (
                                            <div className={`${ selectedLevelOfDepth === depthLevel? "bg-lime-300 text-black":"hover:bg-lime-100 text-black"} rounded-sm p-1`} role="button" tabindex="0" key={depthLevel}
                                            onClick={(e)=>{

                                                //set the level of depth selected to the option the user clicks on
                                                setSelectedLevelOfDepth(depthLevel)

                                                // Close the dropdown by finding the details element and closing it
                                                const detailsElement = e.currentTarget.closest('details');
                                                if (detailsElement) {
                                                    detailsElement.removeAttribute('open');
                                                }

                                            }}
                                            >
                                                {depthLevel}
                                            </div>
                                        )
                                    })}
                                    
                                </ul>
                            </details>

                            
                            <div className='ml-2'>
                                {
                                    getSortedUniqueLabelledEntityMenuItems(listOfSpacesDepictingTheConcept)

                                }

                                {/* {listOfSpacesDepictingTheConcept.map((concept)=>{
                                    //if selected, highlight it
                                    
                                    const label = concept["urn"].replace("urn:p-lod:id:","")
                                        return (
                                                <EntityMenuItem key={label+Math.floor(Math.random()*1000).toString()} lowerCaseName={label} label={label} setSecondaryEntity={setSecondaryEntity}/>
                                            
                                        )
            
                                })} */}
                            </div>
                            
                        </>
                        
                    )
                    
                    } ()
                    
                    

                    
                    :
                    
                    

                    //if the entity is not a concept execute this, show the hierarchy of the spatial entity
                    function (){
                        return (
                            <>
                                <LoadingComponent hiddenWhen={fetchedAncestors && fetchedChildren}/>
                                
                                {


                                    getSortedUniqueLabelledEntityMenuItems(ancestors)
                                    
                                
                                }



                                    {/* Make the selected concept bold and display it */}


                                    <li className='ml-3 text-black font-semibold'>{selectedEntityLabel}</li>


                                            

                                    {/* the spatial children */}

                                    <div className='ml-5'>

                                        {

                                            getSortedUniqueLabelledEntityMenuItems(spatialChildren)
                                        

                                        
                                        }
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