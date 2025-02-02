import React, { useState, useEffect, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import yahia from "../Images/Yahia.jpg"
import youssefa from "../Images/Youssef ah.jpg"
import ramzy from "../Images/Ramzy.jpg"
import youssefs from "../Images/Youssef Sh.jpg"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Avatar,
} from "@nextui-org/react";

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "DEPARTMENT BUDGET", uid: "budget" },
];

export default function App() {
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBudget() {
      setLoading(true);
      setError(null);
      try {
        console.log("Attempting to fetch budget...");
        const response = await fetch("http://localhost:3000/api/tabledash");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setBudgetData(data);
      } catch (err) {
        console.error("Error fetching budget data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBudget();
  }, []);

  const renderBudgetChart = useCallback((totalBudget, allocatedBudget) => {
    const numTotalBudget = Number(totalBudget);
    const numAllocatedBudget = Number(allocatedBudget);
    const percentageAllocated = (numAllocatedBudget / numTotalBudget) * 100;
    const remainingBudget = numTotalBudget - numAllocatedBudget;
  
    const chartOption = {
      grid: {
        left: '0%',
        right: '15%',
        top: '0%',
        bottom: '0%',
        containLabel: false,
      },
      xAxis: {
        type: 'value',
        max: 100,
        show: false,
      },
      yAxis: {
        type: 'category',
        show: false,
      },
      series: [
        {
          name: 'Total Budget',
          type: 'bar',
          barGap: '-100%',
          data: [100],
          barWidth: '70%',
          itemStyle: {
            color: '#d9d9d9',
            borderRadius: [90, 90, 90, 90],
          },
          label: {
            show: true,
            position: 'insideRight',
            formatter: () => `$${remainingBudget.toLocaleString()}`,
            color: '#000',
            fontWeight: 700,
            fontSize: 12,
            offset: [-5, 0],
          },
          emphasis: {
            itemStyle: {
              color: '#d9d9d9',
            },
          },
        },
        {
          name: 'Allocated Budget',
          type: 'bar',
          data: [percentageAllocated],
          barWidth: '70%',
          itemStyle: {
            color: '#2E6B5C',
            borderRadius: [90, 90, 90, 90],
          },
          label: {
            show: true,
            position: 'inside',
            formatter: () => `$${numAllocatedBudget.toLocaleString()}`, 
            color: '#000',
            fontWeight: 700,
            fontSize: 12,
          },
          emphasis: {
            itemStyle: {
              color: '#2E6B5C',
            },
          },
        },
      ]
    };
  
    return <ReactECharts option={chartOption} style={{ height: '40px', width: '270px' }} />;
  }, []);

  const avatars = {
    "19": yahia,
    "18": youssefa,
    "20": youssefs,
    "17": ramzy
  };

  const users = budgetData.map((item) => ({
    id: item.id,
    name: item.name,
    role: item.role,
    total_budget: item.total_budget,
    allocated_budget: item.allocated_budget || 0,
    email: item.email,
    d_name: item.d_name,
    employees: item.num_employees,
    avatar: avatars[item.id.toString()],
  }));

  const renderCell = useCallback((user, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex gap-4">
            <Badge color="success" content={user.employees} shape="circle">
              <Avatar isBordered radius="full" src={user.avatar} />
            </Badge>
            <div className="grid grid-cols-1 gap-1">
              <h2 className="text-bold">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{user.role}</p>
            <p className="text-bold text-sm capitalize text-default-400">{user.d_name}</p>
          </div>
        );
      case "budget":
        return renderBudgetChart(user.total_budget, user.allocated_budget);
      default:
        return user[columnKey];
    }
  }, [renderBudgetChart]);

  if (loading) {
    return <div>Loading budget data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Table aria-label="Department Budgets">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}