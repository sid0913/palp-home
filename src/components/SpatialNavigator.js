import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import LoadingComponent from './LoadingComponent'
import EntityMenuItem from './NavigatorComponents/EntityMenuItem'

const SpatialNavigator = ({selectedEntity, selectedEntityLabel, entityType, setSecondaryEntity}) => {

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
         * given a spatialEntity like r1, it retrieves a list of JSONs of spatial ancestors for the selected spatial entity
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
        
            console.log(`https://api.p-lod.org/spatial-children/${spatialEntity}`)
            const response = await fetch(`https://api.p-lod.org/spatial-children/${spatialEntity}`);
        
            if(response.ok){
                const listOfChildren = await response.json()

                // if(listOfChildren.length === 0){
                //     return 

                // }

                // else{
                    //set the state for children
                    setSpatialChildren(listOfChildren.reverse().slice(0,-1))
                    setFetchedChildren(true)
                // }

                
        
            }
            else{
                console.log("Error retrieving children for "+spatialEntity)
            }
    }


    async function getSpatialEntitiesWhereTheConceptIsDepicted(concept){
        /**
         * retrieves a list of spatial entities where the selected concept is depicted
         * @param  {[String]} concept the concept for which we are search spatialEntities
         * @return {[JSON]}     a list of JSONs of the spatialEntities
         */
        
        
            const response = await fetch(`https://api.p-lod.org/depicted-where/${concept}`);
        
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

    }, [])

    

    

  return (
    <div className='p-5 flex flex-col space-y-5'>
        <h1 className='font-semibold text-2xl'>
            Spaces
        </h1>

        <ul className='text-green-500 text-left ml-5 '>
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
                    function ifEntityTypeIsConcept (){
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
                                    {spatialChildren.map((conceptualChild)=>{

                                    const label = conceptualChild['urn'].replace("urn:p-lod:id:","")
                                    const lowerCaseName = conceptualChild['urn'].replace("urn:p-lod:id:","")

                                    return(
                                        <EntityMenuItem key={lowerCaseName+Math.floor(Math.random()*1000).toString()} lowerCaseName={lowerCaseName} label={label} setSecondaryEntity={setSecondaryEntity}/>
                                    );
                                    })}
                            </>
                        )
                    }()

                
            }
        </ul>
    </div>
  )
}

export default SpatialNavigator