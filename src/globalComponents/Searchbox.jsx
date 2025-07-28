import React from 'react'
import { ScanButton } from './ScanButton';
import '../globalStyles/SearchBox.css'
export const Searchbox = ({placeholder, description}) => {
  return (
    <>
    <div className='d-flex row'>
      <input className="searchbox col-2" type="search" placeholder={placeholder} aria-label="Search"/>
      <ScanButton />
      </div>
      </>
      
  )
}
