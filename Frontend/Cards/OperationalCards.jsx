import { Card, CardHeader, CardBody } from "@nextui-org/react";
import React, { useState, useEffect } from "react"; 
import ReactECharts from "echarts-for-react";

const App = (props) => {
  const [budget, setBudget] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBudget() { 
      setLoading(true);
      setError(null);
      try {
        console.log("Attempting to fetch budget...");
        const response = await fetch("http://localhost:3000/api/homepagebudget");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setBudget(data);
      } catch (err) {
        console.error("Error fetching budget data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBudget();
  }, []);

  const data=props.Oper;
  const option = {
    tooltip: {
      trigger: 'item'
    },
    color: ["#2E6B5C"],
    grid: {
      top: 30, // Adjust spacing from the top
      left: 20, // Adjust left margin
      right: 10, // Adjust right margin
      bottom: 50, // Adjust spacing for the second x-axis
    },
    xAxis: [
      {
        type: "category",
        data: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"],
        axisLabel: {
          interval: 0,
          color: "#333",
          fontSize: 12, 
        },
        axisLine: {
          lineStyle: {
            color: "#ccc",
          },
        },
        axisTick: {
          show: false,
        },
      },
      {
        type: "category",
        position: "bottom",
        offset: 20, // Align second axis labels properly
        axisTick: { show: false },
        axisLine: { show: false },
        data: ["2023", "2024"],
        axisLabel: {
          align: "center",
          color: "#c0c0c0",
          fontSize: 12,
        },
      },
    ],
    yAxis: {
      type: "value",
      show: false, // Hide y-axis for cleaner layout
      max: 100,
    },
    series: [
      {
        type: "bar",
        barGap: "-100%",
        data: Array(8).fill(100), // Background bars
        barWidth: "40%", // Adjust bar width for proper spacing
        itemStyle: {
          color: "#d9d9d9",
          borderRadius: [20, 20, 20, 20], // Smooth corners
        },
      },
      {
        data: data, // Actual data
        type: "bar",
        barWidth: "40%", // Adjust bar width
        itemStyle: {
          borderRadius: [20, 20, 20, 20], // Smooth corners
        },
      },
    ],
  };

  if (loading) {
    return <div>Loading budget...</div>;
  }

  if (error) {
    return <div>Error loading budget: {error.message}</div>;
  }

  const totalBudget = budget[0].total_budget; 

  return (
    console.log(totalBudget),
    <Card className="py-1 w-[328px] h-[262px]">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny text-gray-400 font-normal">Operational Budget</p>
        <small className="text-xl font-bold">${totalBudget.toLocaleString()}</small>
      </CardHeader>
      <CardBody className="overflow-hidden p-4">
        <ReactECharts option={option} style={{ height: "150px", width: "100%" }} />
      </CardBody>
    </Card>
  );
};

export default App;