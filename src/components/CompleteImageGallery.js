import React from 'react'
import {SwiperSlide, Swiper } from 'swiper/react';
import {Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import '../styles/Carousel.module.css'
import { useState } from 'react';

const CompleteImageGallery = ({setCurrImageIndex, setImageLocation, imageURLs, currImageIndex, height, width}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className={`border-2 border-amber-700 w-full h-[${height}] bg-slate-950 overflow-auto `}>

              {imageURLs?(imageURLs.length > 0?
    <div className={`overflow-hidden p-5 w-[${width}]  z-0 space-y-5 mx-auto`}>

                

                {/* https://github.com/xiaolin/react-image-gallery */}
                {/* <ImageGallery  items={imageURLs} /> */}
                <Swiper  navigation={true} modules={[Navigation, Thumbs, FreeMode]}
                  thumbs={{ swiper: thumbsSwiper }}
                  spaceBetween={50}
                  slidesPerView={1}
                  onSlideChange={(swiper) => {
                    setCurrImageIndex(swiper.activeIndex)

                    setImageLocation(imageURLs[Number(swiper.activeIndex)]["arc"])


                  }}
                  onSwiper={(swiper) => {}}
                  className='mySwiper2'
                  style={{
                    '--swiper-navigation-color': 'white',
                    '--swiper-pagination-color': '#000',
                  }}
                >

                  


                  {imageURLs.map((imgURL, index)=>
                  {
                    return (
                    <div key={index.toString()+Math.floor(Math.random()*1000).toString()} className='flex flex-col'>
                      <SwiperSlide>

                        
                        <img className='h-[30vh] mx-auto px-16' src={imgURL["url"]}/>
                      
                      </SwiperSlide>
                      {/* <span className='h-[20vh] overflow-y-auto text-white'>
                        {imgURL['description']}
                      </span> */}
                    </div>)
                    
                  })}
                  {/* ... */}
                </Swiper>

                
                

                {/* CITATION:https://github.com/leandrowd/react-responsive-carousel */}
                {/* <Carousel clas showIndicators={false} dynamicHeight={false}>
                  {imageURLs.map(imgURL=>{
                    return (<div>
                      <img src={imgURL}/>
                      <p></p>
                    </div>)
                  })}
                </Carousel> */}

                <div className='text-white overflow-y-auto h-[20vh] text-left p-3 border-2 border-white rounded-md'>

                  {
                    imageURLs.length>0 ? imageURLs[currImageIndex]['description'] : ""
                  }

                </div>

                {/* thumbnail swiper */}
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper"
                >

                  {imageURLs.map((imgURL, index)=>{
                    return (

                    <SwiperSlide key={index.toString()+Math.floor(Math.random()*1000).toString()}>
                      
                      {<img id={index} src={imgURL["url"]}/>}

                    </SwiperSlide>
                    
                  )
                  })}

                </Swiper>

                
              </div>:""):""}
            </div>
  )
}

export default CompleteImageGallery