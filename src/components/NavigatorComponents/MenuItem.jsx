import React from 'react'
import { FaPlay } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import { Link } from '@reach/router';

const MenuItem = ({lowerCaseName, label, setSecondaryEntity}) => {
    return(
        <li className='text-cyan-800 flex flex-row space-x-2'>
                <Link className='decoration-cyan-800 hover:underline' href={`/browse/${lowerCaseName}`}>
                    {label}
                </Link>

            <button className='text-black text-sm hover:opacity-50' onClick={()=>{
                setSecondaryEntity(lowerCaseName)
            }}>
                <FaPlay className=''/>
            </button>

            <Link href={`/browse/${lowerCaseName}`} className='text-black text-sm hover:opacity-50 flex justify-center' target="_blank">
                <MdOpenInNew className='my-auto' />
            </Link>
        </li>
    );
}

export default MenuItem