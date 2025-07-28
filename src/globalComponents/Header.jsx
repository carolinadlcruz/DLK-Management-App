import React from 'react'
import { MdOutlineAnalytics } from "react-icons/md";
import '../globalStyles/Header.css'
export const Header = ({title}) => {
  return (
    <>
    <div className='mt-2 d-flex justify-content-left align-items-center'>
          <h4 className="mx-4 mt-2 text-light titleHeader" >{title}</h4>
    </div>
    </>
  )
}
