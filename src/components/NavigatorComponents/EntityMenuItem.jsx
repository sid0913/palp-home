import React from 'react'
import { FaPlay } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import { Link } from '@reach/router';
import { FaArrowRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

const EntityMenuItem = ({lowerCaseName, label, setSecondaryEntity}) => {
    return(
        <li className='text-cyan-800 flex flex-row space-x-2'>
                {/* <a  href={`/browse/${lowerCaseName}`} className='decoration-cyan-800 hover:underline' > */}
                <span>{label}</span>    
                {/* </a> */}

            <button className='text-black text-sm hover:opacity-50' onClick={()=>{
                // setSecondaryEntity([lowerCaseName])
                setSecondaryEntity((prev, props)=>{
                    return prev.concat([lowerCaseName])
                })
            }}>
                <FaPlus className=''/>
            </button>

            <a href={`/browse/${lowerCaseName}`}  className='text-black text-sm hover:opacity-50 flex justify-center' >
                <FaArrowRight  className='my-auto' />
            </a>
        </li>
    );
}

export default EntityMenuItem