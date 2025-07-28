import React from 'react'
import { AiOutlineBarcode  } from "react-icons/ai";
import '../globalStyles/ScanButton.css'
export const ScanButton = () => {
  return (
    <div className='col-2'>
       <button className="btnScan">
    <div className="inline-flex items-center space-x-2">
     
      <div> <AiOutlineBarcode/> Scan</div>
    </div>
  </button>
    </div>
  )
}
