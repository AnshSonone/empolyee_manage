import React, { useState, useEffect } from "react";
import Task from "../components/Task";
import Cookies from "js-cookie";
import axios from "axios";

export default function TaskPage() {
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const token = Cookies.get("accessToken");

        let res = await axios.get("/api/users/task/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status == 200) {
          setTaskData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (Cookies.get("accessToken")) {
      fetchTaskData();
    }
  }, []);

  return (
    <div className="ml-4 mt-10 w-full grid place-content-center sm:grid-flow-col">
      {taskData.map((items) => (
        <div key={items.id}>
          <Task data={items} />
        </div>
      ))}
    </div>
  );
}
