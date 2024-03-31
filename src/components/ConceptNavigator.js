import React from 'react'
import { Link } from 'gatsby'

const ConceptNavigator = ({selectedConcept}) => {
    //the complete list of all the concepts
    const completeList = ["Lion", "Snake", "Zeus", "Sphinx"]

    selectedConcept = selectedConcept?selectedConcept:""

  return (
    <div>
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

export default ConceptNavigator