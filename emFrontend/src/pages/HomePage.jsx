import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Task from "../components/Task.jsx";
import Leaves from "../components/Leaves.jsx";
import Profile from "../components/Profile.jsx";
import { Button } from "@radix-ui/themes";

export default function Home() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("api/users/get_user/", {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        });

        if (res.status == 200) {
          // Set the user data to state
          setData(res.data);
        }
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated
    const token = Cookies.get("accessToken");
    if (token) {
      fetchData(); // Call the async function
    } else {
      setError("You are not logged in.");
    }
  }, []);

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
    } else {
      setError("you are not logged in !");
    }
  }, []);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const token = Cookies.get("accessToken");

        let res = await axios.get("/api/users/leaves/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status == 200) {
          setLeaveData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (Cookies.get("accessToken")) {
      fetchLeaveData();
    } else {
      setError("you are not logged in !");
    }
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="background_wall">
      {loading ? (
        <div>
          <h3>Loading ...</h3>
        </div>
      ) : (
        <div className="main grid grid-cols-1 sm:grid-cols-3 gap-2 place-content-center relative top-[10px] px-4 ">
          <div className="mt-4 flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-bold ">PROFILE</h2>
            {data.map((items) => (
              <div key={items.id} className="w-full">
                <Profile data={items} />
              </div>
            ))}
          </div>
          <div className=" pt-3 flex flex-col items-center ">
            <h2 className="text-2xl sm:text-4xl font-bold sm:relative z-0">
              TASKS
            </h2>
            {taskData.map((items) => (
              <div key={items.id} className="w-full ">
                <Task data={items} />
              </div>
            ))}
            <Link to={"/tasks"}>
              <Button variant="surface">Veiw all</Button>
            </Link>
          </div>
          <div className=" flex flex-col items-center ">
            <h2 className="text-2xl sm:text-4xl font-bold mt-4 ">LEAVES</h2>
            <div className="overflow-y-scroll h-screen no-scrollbar flex flex-col items-center">
              {leaveData.map((items) => (
                <div key={items.id} className="w-full">
                  <Leaves data={items} />
                </div>
              ))}
              <Link to={"/leaves"}>
                <Button variant="surface">Veiw all</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
