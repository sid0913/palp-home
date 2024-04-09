import React from 'react'
import MapComponent from '../../components/Map'
import { Link } from 'gatsby'
import ConceptNavigator from '../../components/ConceptNavigator';

const Browse = (props) => {
  return (
    <div className='flex flex-row justify-evenly p-5'>
        <ConceptNavigator selectedConcept={""} entityType={"concept"}/>
        <MapComponent zoom={14} width="500px" item={""} color={"#FF7259"}/>
    </div>
    
    
  )
}
export const Head = () => <title>PALP Browse</title>

export default Browse