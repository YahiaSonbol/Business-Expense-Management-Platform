import { Card, CardHeader, CardBody } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
export default function App() {
    const [numberofproject, SetNumberofproject] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function fetchNumberofproject() { 
        setLoading(true);
        setError(null);
        try {
          console.log("Attempting to fetch budget...");
          const response = await fetch("http://localhost:3000/api/numberofproject");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched data:", data);
          SetNumberofproject(data);
        } catch (err) {
          console.error("Error fetching budget data:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      }
      fetchNumberofproject();
    }, []);
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading employees...</div>;
    }
  
    if (error) {
      return <div className="flex justify-center items-center h-screen">Error fetching employees: {error.message}</div>;
    }
    const data=numberofproject[0].total_number_of_project;
  return (
    <Card className="py-1 w-[328px] h-[262px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny text-gray-400 font-normal">Number of </p>
        <small className="text-xl font-bold">Projects</small>
      </CardHeader>
      <CardBody className="overflow-hidden p-4">
        <div className="flex items-center justify-center w-full h-full">
            <h1 className="text-8xl font-bold text-lime-600	">{data}</h1>
        </div>
      </CardBody>
    </Card>
  );
}
