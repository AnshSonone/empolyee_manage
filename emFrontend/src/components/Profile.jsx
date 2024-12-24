import React, { useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Flex, Avatar, Text, Button } from '@radix-ui/themes';

export default function Profile(props) {

	const navigate = useNavigate()

	const handleLogout = async () => {
		try {
		  // Send logout request to the backend
		  await axios.post(
			"http://127.0.0.1:8000/api/users/logout/",
			{},
			{
			  headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken"),
				Authorization: `Bearer ${Cookies.get("accessToken")}`,
			  },
			}
		  );
	
		  // Remove authentication cookies
		  Cookies.remove('accessToken');
		  localStorage.removeItem('refreshToken');
		  Cookies.remove('csrftoken');
		  Cookies.remove("sessionid");
	
		  // Redirect to login page after logout
		  navigate("/login");
		} catch (err) {
		  console.error("Logout failed:", err);
		}
	  };

  return (
    <div key={props.data.id} className='sm:relative top-[-20px] w-full'>
<Box maxWidth="95%" className='my-4 bg-blackA7 rounded-lg'>
	<Card className='shadow-md'>
		<Flex gap="5" align="center" justify="center" className='sm:h-[10vw]'>
			<Box className=''>
				<Text as="div" size="5" weight="medium" color='gray'>
				<span className='font-bold'>Username</span> {props && props.data?.username}
				</Text>
				<Text as="div" size="5" color="gray">
				<span className='font-bold'>E-mail</span> {props && props.data?.user_role}
				</Text>
                <Text as="div" size="5" color="gray">
				<span className='font-bold'>Phone</span> {props && props.data?.phone_no}
				</Text>
                <Text as="div" size="5" color="gray">
					<span className='font-bold'>DOB</span> {props && props.data?.date_of_birth}
				</Text>
			</Box>
		</Flex>
	</Card>
</Box>
<div className='space-x-2 flex justify-center items-center my-2'>
        <Button variant='surface' >Edit Profile</Button>
        <Button variant='surface' onClick={handleLogout} >Logout</Button>
        </div>
    </div>
        
  )
}

/*

<div className="info_container">
        <img src="" alt="profile photo" />
        <h2>{props.data && `${props.data?.username[0]?.toUpperCase()}${data[0]?.username?.slice(1, )}`}</h2>
        <h3>{props.data && `${props.data?.user_role[0]?.toUpperCase()}${data[0]?.user_role?.slice(1, )}`}</h3>
        <h4>{props.data && props.data?.email}</h4>
        <h4>{props.data && props.data?.phone_no}</h4>
        <div className="button_container">
        </div>
        <button>Edit Profile</button>
        <button onClick={handleLogout}>LOGOUT</button>
        </div>
*/