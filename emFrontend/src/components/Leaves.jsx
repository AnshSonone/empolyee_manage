import React from "react";
import Cookies from "js-cookie"
import axios from "axios";
import { Box, Flex, Card, Text, Button } from "@radix-ui/themes";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Leaves(props) {

  const navigate = useNavigate()

  console.log(props)

  
  const handleCancelLeave = async () => {
    const token = Cookies.get('accessToken')
    try{
      const res = await axios.delete(
        `http://localhost:8000/api/users/leaves/${props.data.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if(res.data ==200){
        navigate('/leaves')
      }
    }catch(error){
      console.log(error)
    }
  }

  const dateToString = (date) => {
    return new Date(date).toDateString()
  }

    return (
      <div className=" rounded-md my-4">
          <div className=" rounded-md">
            {props.data == [] && <h4 className="font-bold text-xl my-4 text-center">No Leaves in queue</h4>}
            <Box maxWidth="95%" className="my-4 bg-blackA7 rounded-lg">
	<Card className="shadow-md">
		<Flex gap="3" align="center" justify="center">
			<Box>
				<Text as="div" size="5" weight="bold">
					username: {props.data.username}
				</Text>
        <Text as="div" size="5" weight="bold">
        Reason: {props.data.leave_reason}
				</Text>
        <Text as="div" weight='bold'>
          Leave Applied: {dateToString(props.data.applied_leave_date)}
        </Text>
        <Text as="div" weight='bold'>
          Leave Start: {dateToString(props.data.start_leave_date)}
        </Text>
        <Text as="div" weight='bold'>
          Leave End: {dateToString(props.data.end_leave_date)}
        </Text>
        <Text as="div" weight='bold'>
        status: {props.data.Leave_status === true ? 'Approved' : 'Pending'}
        </Text>
			</Box>
		</Flex>
    {
      props.data.user == jwtDecode(Cookies.get('accessToken')).user_id &&
    <div className='space-x-2 ml-2 flex justify-center my-2 '>
        <Button variant='surface' className="cursor-pointer" onClick={handleCancelLeave}  >Cancel Leave</Button>
        </div>
    }
    {
      
    }
	</Card>
</Box>
      </div>
        </div>
    )
}