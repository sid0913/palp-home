import React from 'react'

const PageLayout = ({children}) => {
  return (
    <section>
        <div className='container mb-10'>
            {children}
        </div>
    </section>
  )
}

export default PageLayout