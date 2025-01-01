import React, { useEffect, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { Box, Flex, Card, Text, Button } from "@radix-ui/themes";
import Update from "./Update";
import Cookies from 'js-cookie';
import axios from "axios";


export default function Task(props) {

	const [data, setData] = useState([])
	const [isChecked, setIsChecked] = useState(false)

	useEffect(() => {
		// Define the async function inside useEffect
		const token = Cookies.get("accessToken");
		const fetchData = async () => {
		  try {
			const res = await axios.get("api/users/get_user/", {
			  headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken"),
				Authorization: `Bearer ${token}`,
			  },
			});
	
			if (res.status == 200) {
			  // Set the user data to state
			  setData(res.data);
			}
		  } catch (err) {
			console.error("Error fetching user data:", err);
		  }
		};
	
		if (token) {
		  fetchData(); // Call the async function
		}
	  }, []);


  const dateString = (time) => {
    return new Date(time).toDateString()
  };

  return (
    <div className="sm:relative rounded-md w-[90%] mx-2 my-2">
      <Box maxWidth="100%" className="my-4 sm:p-4 bg-blackA7 rounded-lg">
	<Card className="shadow-md">
		<Flex gap="3" align="center" justify="center" className="sm:h-[10vh] w-[75vw] sm:w-full" >
			<Box>
		<div className=" space-y-2">
      <div className=" space-x-1 flex items-center">

				<Text as="div" size="5" weight="bold" className="flex-wrap">
					{props.data.assigned_task}
				</Text>
        </div>
				<Text as="div" size="3" className="flex-nowrap text-center">
					Task issued: {dateString(props.data.issued_date)}
				</Text>
          </div>

		  <div className="my-2 flex items-center justify-center">
          {/* {checked === true && <Button variant="surface" className="">Done</Button>} */}

		  {
			data.is_admin && <Update task={props} />
		  }
		  </div>
		  
			</Box>
		</Flex>
	</Card>
</Box>
    </div>
  );
}
