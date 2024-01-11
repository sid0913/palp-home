// import React from 'react'
// // import Map from '../components/map'
// export const mapDemo = () => {
//   return (
//     <>
//     <div>map</div>
//     {/* <Map/> */}
//     </>
//   )
// }

// export default mapDemo
// export const Head = () => <title>Demo of React Leaflet</title>


import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const IndexPage = () => {
  return (
    <MapContainer style={{ height: '400px' }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default IndexPage

export const Head = ()=> <title>Map demo</title>