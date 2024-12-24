import React, {useState, useEffect} from "react";
import Cookies from "js-cookie"
import axios from "axios";
import { Box, Flex, Card, Text, Button, Avatar } from "@radix-ui/themes";
import { jwtDecode } from "jwt-decode";

export default function Leaves(props) {


  const dateFormat = (date) => {
    return new Date().toLocaleDateString('en-IN', date)
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
          Leave Start: {dateFormat(props.data.start_leave_date)}
        </Text>
        <Text as="div" weight='bold'>
          {props.data.end_leave_date != '' ? '' : `Leave end: ${dateFormat(props.data.end_leave_date)}`}
        </Text>
        <Text as="div" weight='bold'>
        status: {props.data.Leave_status === true ? 'Approved' : 'Pending'}
        </Text>
			</Box>
		</Flex>
    {
      props.data.user == jwtDecode(Cookies.get('accessToken')).user_id &&
    <div className='space-x-2 ml-2 flex justify-center my-2 '>
        <Button variant='surface' className="cursor-pointer"  >Cancel Leave</Button>
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

/*

{
        leaveData.map((items, index) => (
          <div key={items.id}>
            <div className="leaves_container">
              <h3>{items.username}</h3>
          <div className="leaves_div">
            <p className="leaves_para">{items.leave_reason}</p>
          </div>
          <div className="leaves_div">
            <p className="leaves_para">Applied date: {dateString(items.applied_leave_date)}</p>
          </div>
        </div>
          <div className="leave_start_date_div">
            <h4 className="leaves_start">need leave date: {items.start_leave_date}</h4>
          </div>
          <div className="leave_end_date_div">
            <h4 className="leaves_end">leave end date: {items.end_leave_date !='' ? items.end_leave_date : items.start_leave_date}</h4>
          </div>
          <p className="blog-post__text">leave status: {items.Leave_status === true ? 'Approved' : 'Pending'}</p>
          </div>
        ))
      } 

*/