import React, { useState, useEffect } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { Box, Flex, Card, Text, Button } from "@radix-ui/themes";


export default function Task(props) {

  const dateString = (time) => {
    return new Date().toLocaleDateString('en-IN')
  };

  return (
    <div className="sm:relative rounded-md w-[90%] mx-2 my-2">
      <Box maxWidth="100%" className="my-4 bg-blackA7 rounded-lg">
	<Card className="shadow-md">
		<Flex gap="3" align="center" justify="center" className="sm:h-[10vh] w-[75vw] sm:w-full" >
			<Box>
		<div className=" space-y-2">
      <div className=" space-x-1 flex items-center">

			<Checkbox.Root
				className="flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px_black]"
				defaultChecked
				id="c1"
        >
				<Checkbox.Indicator className="text-violet11 " >
					<CheckIcon checked/>
				</Checkbox.Indicator>
			</Checkbox.Root>

				<Text as="div" size="5" weight="bold" className="flex-wrap">
					{props.data.assigned_task}
				</Text>
        </div>
				<Text as="div" size="3" className="flex-nowrap text-center">
					Task issued: {dateString(props.data.issued_date)}
				</Text>
          </div>
          {/* {checked === true && <Button variant="surface" className="">Done</Button>} */}
			</Box>
		</Flex>
	</Card>
</Box>
    </div>
  );
}
