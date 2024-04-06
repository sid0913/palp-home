import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'



const ConceptNavigator = ({selectedConcept, selectedConceptLabel, entityType}) => {
    //the complete list of all the concepts
    const completeList = []

    selectedConcept = selectedConcept?selectedConcept:""

    //ancestors of the concept
    const [ancestors, setAncestors] = useState([])

    //conceptual children of the concept
    const [conceptualChildren, setConceptualChildren] = useState([])


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

    useEffect(()=>{
    

        switch(entityType){
    
            //for Pompeii
            case "city":
                //things to do for Pompeii
                return 

            //for Spaces
            case "space":
                //things to do for Spaces
                return

            //for Pompeii
            case "concept":
                //things to do for Concepts
                // (async ()=>getAncestors(selectedConcept))()
                // (async ()=>getConceptualChildren(selectedConcept))()
                (async ()=>{getConceptualChildren(selectedConcept);getAncestors(selectedConcept)})()
                

                return

        }

    }, [])

    

    

  return (
    <div className='p-5 flex flex-col space-y-5'>
        <h1 className='font-semibold text-2xl'>
            Artistic Concepts
        </h1>

        <ul className='text-green-500 text-left ml-5'>
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

            {/* Make the selected concept bold and display it */}

            
            <li className='ml-3 text-black font-semibold'>{selectedConceptLabel}</li>
            

                        

            {/* the conceptual children */}
            {conceptualChildren.map((conceptualChild)=>{

            const label = conceptualChild['label']? conceptualChild['label'] : conceptualChild['urn'].replace("urn:p-lod:id:","")
            const lowerCaseName = conceptualChild['urn'].replace("urn:p-lod:id:","")

            return(
                <li className='ml-6 text-cyan-800  decoration-cyan-800 hover:underline'>
                        <Link href={`/browse/${lowerCaseName}`}>
                            {label}
                        </Link>
                </li>
            );
            })}
        </ul>
    </div>
  )
}

export default ConceptNavigator