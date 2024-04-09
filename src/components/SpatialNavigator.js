import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import LoadingComponent from './LoadingComponent'


const SpatialNavigator = ({selectedConcept, selectedConceptLabel, entityType}) => {

    
    selectedConcept = selectedConcept?selectedConcept:""

    //if the entity type is concept, this stores conceptual ancestors of the concept as JSONs
    const [ancestors, setAncestors] = useState([])

    //if the entity type is concept, this stores conceptual children of the concept as JSONs
    const [spatialChildren, setSpatialChildren] = useState([])
    
    //if the entity type is spatialEntity or city, this list stores the concepts depicted in the spatialEntity or city as JSONs
    const [listOfconceptsDepictedInSpatialEntity, setListOfconceptsDepictedInSpatialEntity] = useState([])

    //checks the state of the fetches
    const [fetchedAncestors, setFetchedAncestors] = useState(false)
    const [fetchedChildren, setFetchedChildren] = useState(false)
    const [fetchedConceptSpaces, setFetchedConceptSpaces] = useState(false)
 

    
    async function getAncestors(concept){
        /**
         * given a concept like snake, it retrieves a list of JSONs of conceptual ancestors for the concept
         * @param  {[string]} concept the concept we want the ancestors for
         * @return {[JSON]}     a list of JSONs of the ancestors
         */
        
        
            const response = await fetch(`https://api.p-lod.org/spatial-ancestors/${concept}`);
        
            if(response.ok){
                const listOfAncestors = await response.json()

                //set the state for ancestors
                setAncestors(listOfAncestors.reverse().slice(0,-1))
                setFetchedAncestors(true)
        
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
        
        
            const response = await fetch(`https://api.p-lod.org/spatial-children/${concept}`);
        
            if(response.ok){
                const listOfChildren = await response.json()

                if(listOfChildren.length === 0){
                    return 

                }

                else{
                    //set the state for children
                    setSpatialChildren(listOfChildren.reverse().slice(0,-1))
                    setFetchedChildren(true)
                }

                
        
            }
            else{
                console.log("Error retrieving children for "+concept)
            }
    }


    async function getDepictedConceptsInSpatialEntity(spatialEntity){
        /**
         * given a spatialEntity or city  like r1, it retrieves a list of JSONs of conceptual children for the concept
         * @param  {[String]} spatialEntity the spatialEntity or city we want the depicted concepts for
         * @return {[JSON]}     a list of JSONs of the depicted concepts
         */
        
        
            const response = await fetch(`https://api.p-lod.org/depicted-where/${spatialEntity}`);
        
            if(response.ok){
                const listOfDepictedConcepts = await response.json()


                if(listOfDepictedConcepts.length === 0){
                    setFetchedConceptSpaces(true)
                    return 

                }

                else{
                    setFetchedConceptSpaces(true)
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

                //get the immediate children of the concept and all the ancestors
                (async ()=>{getConceptualChildren(selectedConcept);getAncestors(selectedConcept)})()


                return 

            //for spatialEntities
            case "spatial-entity":
                //get the immediate children of the concept and all the ancestors
                (async ()=>{getConceptualChildren(selectedConcept);getAncestors(selectedConcept)})()
                return

            //for Pompeii
            case "concept":
                
                (async()=>getDepictedConceptsInSpatialEntity(selectedConcept))()
                

                return

        }

    }, [])

    

    

  return (
    <div className='p-5 flex flex-col space-y-5'>
        <h1 className='font-semibold text-2xl'>
            Spaces
        </h1>

        <ul className='text-green-500 text-left ml-5 '>
            {/* if the entity type is spatialEntity or city, show a list of the concepts depicted in that spatialEntity or city */}
            { 
            
            // if the entity type has not been fetched yet, don't render anything
            entityType === ""?

                <></>

                :
                
                entityType === "concept"? 
                    function (){return (
                        <>
                            <LoadingComponent hiddenWhen={fetchedConceptSpaces}/>
                            {listOfconceptsDepictedInSpatialEntity.map((concept)=>{
                                //if selected, highlight it
                                
        
                                    return (
        
                                        <>
                                            

                                            
                                        
                                            <li className='text-cyan-800  decoration-cyan-800 hover:underline'>
                                                <Link href={`/browse/${concept["within"].replace("urn:p-lod:id:","")}`}>
                                                    {/* {concept["urn"].replace("urn:p-lod:id:","")} */}
                                                    {concept["within"].replace("urn:p-lod:id:","")}
                                                </Link>
                                            </li>
        
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
                                <LoadingComponent hiddenWhen={fetchedAncestors && fetchedChildren}/>
                                
                                {ancestors.map((ancestor)=>{

                                    const label = ancestor['label']? ancestor['label'] : ancestor['urn'].replace("urn:p-lod:id:","")
                                    const lowerCaseName = ancestor['urn'].replace("urn:p-lod:id:","")

                                    return(
                                        <li className='text-cyan-800  decoration-cyan-800 hover:underline'>
                                                <Link href={`/browse/${lowerCaseName}`}>
                                                    {label}
                                                </Link>
                                        </li>
                                    );
                                    })}



                                    {/* Make the selected concept bold and display it */}


                                    <li className='ml-3 text-black font-semibold'>{selectedConceptLabel}</li>


                                            

                                    {/* the conceptual children */}
                                    {spatialChildren.map((conceptualChild)=>{

                                    const label = conceptualChild['urn'].replace("urn:p-lod:id:","")
                                    const lowerCaseName = conceptualChild['urn'].replace("urn:p-lod:id:","")

                                    return(
                                    <li className='ml-6 text-cyan-800  decoration-cyan-800 hover:underline'>
                                            <Link href={`/browse/${lowerCaseName}`}>
                                                {label}
                                            </Link>
                                    </li>
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