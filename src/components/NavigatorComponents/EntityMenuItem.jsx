import React from 'react'
import { FaPlay } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import { Link } from '@reach/router';

const EntityMenuItem = ({lowerCaseName, label, setSecondaryEntity}) => {
    return(
        <li className='text-cyan-800 flex flex-row space-x-2'>
                <a  href={`/browse/${lowerCaseName}`} className='decoration-cyan-800 hover:underline' >
                    {label}
                </a>

            <button className='text-black text-sm hover:opacity-50' onClick={()=>{
                setSecondaryEntity(lowerCaseName)
            }}>
                <FaPlay className=''/>
            </button>

            <a href={`/browse/${lowerCaseName}`} target = "_blank" className='text-black text-sm hover:opacity-50 flex justify-center' >
                <MdOpenInNew className='my-auto' />
            </a>
        </li>
    );
}

export default EntityMenuItem