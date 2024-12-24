import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  
  return (
<div className="relative group">
  {/* Menu Label */}
  <h3 className="text-white pt-2 cursor-pointer text-center ">menu</h3>

  {/* Hidden Navbar - Appears only on hover */}
  <div className="absolute z-10 top-[-6px] left-0 w-full bg-gray-800 p-2 rounded-b-md shadow-lg opacity-10 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
    <ul className="list-none m-1 p-0 flex justify-center items-center flex-nowrap space-x-5 sm:space-x-6">
      <li>
        <Link to="/" className="text-white hover:text-azure transition">Home</Link>
      </li>
      <li>
        <Link to="/leaveForm" className="text-white hover:text-azure transition">Apply Leave</Link>
      </li>
      <li>
        <Link to="/leaves" className="text-white hover:text-azure transition">Check Leaves</Link>
      </li>
      <li>
        <Link to="/tasks" className="text-white hover:text-azure transition">View Tasks</Link>
      </li>
      <li>
        <Link to="/tasks_form" className="text-white hover:text-azure transition">Send Tasks</Link>
      </li>
    </ul>
  </div>
</div>

  )
}
