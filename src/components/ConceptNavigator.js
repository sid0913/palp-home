import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import LoadingComponent from './LoadingComponent'
// import MenuItem from './NavigatorComponents/MenuItem'
import EntityMenuItem from './NavigatorComponents/EntityMenuItem';
import { FaPlay } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";

const ConceptNavigator = ({selectedEntity, selectedEntityLabel, entityType, setSecondaryEntity}) => {

    
    selectedEntity = selectedEntity?selectedEntity:""

    //if the entity type is concept, this stores conceptual ancestors of the concept as JSONs
    const [ancestors, setAncestors] = useState([])

    //if the entity type is concept, this stores conceptual children of the concept as JSONs
    const [conceptualChildren, setConceptualChildren] = useState([])
    
    //if the entity type is spatialEntity or city, this list stores the concepts depicted in the spatialEntity or city as JSONs
    const [listOfconceptsDepictedInSpatialEntity, setListOfconceptsDepictedInSpatialEntity] = useState([])

    
    async function getAncestors(concept){
        /**
         * given a concept like snake, it retrieves a list of JSONs of conceptual ancestors for the concept
         * @param  {[string]} concept the concept we want the ancestors for
         * @return {[JSON]}     a list of JSONs of the ancestors
         */
        
        
            const response = await fetch(`https://api.p-lod.org/conceptual-ancestors/${concept}`);
        
            if(response.ok){
                const listOfAncestors = await response.json()

                //set the state for ancestors
                setAncestors(listOfAncestors.reverse().slice(0,-1))
        
            }
            else{
                console.log("Error retrieving ancestors for "+concept)
            }
    }

    async function getConceptualChildren(concept){
        /**
         * given a concept like snake, it retrieves a list of JSONs of conceptual children for the concept
         * @param  {[string]} concept the concept we want the children for
         * @return {[JSON]}     a list of JSONs of the children
         */
        
        
            const response = await fetch(`https://api.p-lod.org/conceptual-children/${concept}`);
        
            if(response.ok){
                const listOfChildren = await response.json()

                if(listOfChildren.length === 0){
                    return 

                }

                else{
                    //set the state for children
                    setConceptualChildren(listOfChildren.reverse().slice(0,-1))
                }

                
        
            }
            else{
                console.log("Error retrieving children for "+concept)
            }
    }


    async function getDepictedConceptsInSpatialEntity(spatialEntity){
        /**
         * gets the list of concepts depicted in the selected spatial entity or city
         * @param  {[String]} spatialEntity the spatialEntity or city we want the depicted concepts for
         * @return {[JSON]}     a list of JSONs of the depicted concepts
         */
        
        
            const response = await fetch(`https://api.p-lod.org/depicts-concepts/${spatialEntity}`);
        
            if(response.ok){
                const listOfDepictedConcepts = await response.json()

                console.log("depocted concepts:", listOfDepictedConcepts)

                if(listOfDepictedConcepts.length === 0){
                    return 

                }

                else{
                    //set the state for children
                    setListOfconceptsDepictedInSpatialEntity(listOfDepictedConcepts)
                }

                
        
            }
            else{
                console.log("Error retrieving the depicted concepts in spatialEntity: "+spatialEntity)
            }
    }

    useEffect(()=>{
    

        switch(entityType){
    
            //for Pompeii
            case "city":

                //get the concepts depicted in the city of Pompeii
                (async()=>getDepictedConceptsInSpatialEntity(selectedEntity))()
                return 

            //for spatialEntities
            case "spatial-entity":
                (async()=>getDepictedConceptsInSpatialEntity(selectedEntity))()
                return

            //for Pompeii
            case "concept":
                //get the immediate children of the concept and all the ancestors
                (async ()=>{getConceptualChildren(selectedEntity);getAncestors(selectedEntity)})()
                

                return

        }

    }, [])

    

    

  return (
    <div className='p-5 flex flex-col space-y-5'>
        <h1 className='font-semibold text-2xl'>
            Artistic Concepts
        </h1>

        <ul className='text-green-500 text-left ml-5 '>
            {/* if the entity type is spatialEntity or city, show a list of the concepts depicted in that spatialEntity or city */}
            { 
            
            // if the entity type has not been fetched yet, don't render anything
            entityType === ""?

                <></>

                :
                
                entityType !== "concept"? 
                    function (){return (
                        <>
                            <LoadingComponent hiddenWhen={listOfconceptsDepictedInSpatialEntity.length > 0 || entityType !== "city"}/>
                            {/* filter to get rid of border_frame type elements from the response */}
                            {listOfconceptsDepictedInSpatialEntity.filter((element)=> element["label"] !== null ).map((concept)=>{
                                console.log("this is an element0", concept)
                                //if selected, highlight it
                                
        
                                    return (
        
                                        <>
                                            <EntityMenuItem label={concept["label"]} lowerCaseName={concept["urn"].replace("urn:p-lod:id:","")} setSecondaryEntity={setSecondaryEntity}/>
                                        </>
                                    )
        
                            })}
                        </>
                        
                    )
                    
                    } ()
                    
                    

                    
                    :
                    
                    

                    //if the entity is a concept execute this
                    function ifEntityTypeIsConcept (){
                        return (
                            <>
                                
                                {ancestors.map((ancestor)=>{

                                    const label = ancestor['label']? ancestor['label'] : ancestor['urn'].replace("urn:p-lod:id:","")
                                    const lowerCaseName = ancestor['urn'].replace("urn:p-lod:id:","")

                                    return(    

                                        <EntityMenuItem lowerCaseName={lowerCaseName} label={label} setSecondaryEntity={setSecondaryEntity} />
                                
                                    );
                                    })}



                                    {/* Make the selected concept bold and display it */}


                                    <li className='ml-3 text-black font-semibold'>{selectedEntityLabel}</li>


                                            

                                    {/* the conceptual children */}
                                    {conceptualChildren.map((conceptualChild)=>{

                                    const label = conceptualChild['label']? conceptualChild['label'] : conceptualChild['urn'].replace("urn:p-lod:id:","")
                                    const lowerCaseName = conceptualChild['urn'].replace("urn:p-lod:id:","")

                                    return(
                                        
                                        <EntityMenuItem lowerCaseName={lowerCaseName} label={label} setSecondaryEntity={setSecondaryEntity} href={`/browse/${lowerCaseName}`}/>

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

export default ConceptNavigator