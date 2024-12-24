import React, { useEffect, useState } from 'react'
import Leaves from '../components/Leaves'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function LeavePage() {

  const [leaveData, setLeaveData] = useState([])

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
  
        const token = Cookies.get('accessToken')
  
        let res = await axios.get(
          '/api/users/leaves/',
          {
            headers : {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (res.status == 200){
          setLeaveData(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchLeaveData()
  }, [])

  return (
    <div className='ml-4 mt-10 grid place-content-center sm:grid-flow-col'>
      {
        leaveData.map((items) => (
          <div key={items.id}>
            <Leaves data={items}/>
          </div>
        ))
      }
    </div>
  )
}
