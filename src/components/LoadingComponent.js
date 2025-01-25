import React from 'react'

const LoadingComponent = ({hiddenWhen}) => {
  return (
    <>
        <div className={` ${hiddenWhen?"hidden":""} slate-300 w-full h-full z-50 flex flex-row justify-center text-black`}>
            <div className='flex flex-row justify-center my-auto space-x-5 '>
            <div class=" h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" role="status">
            
            </div>

            <h1 className='text-lg my-auto'>
                Loading...
            </h1>
            </div>
            

        </div>
    </>
  )
}

export default LoadingComponent