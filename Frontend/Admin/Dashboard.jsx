import Navbar from "./Navbar"
import OperCard from "../Cards/OperationalCards"
import AllocCard from "../Cards/AllocatedCrads"
import NumberCard from "../Cards/NumberofProjects"
import Table from "../Tables/DashboardTable"
import { useState } from "react"

export  function Dash() {
    const [Oper, SetOper] = useState([60, 90, 100, 50, 40, 70, 80, 75]);
    const [Alloc, SetAlloc] = useState([90, 60, 50, 100, 70, 40, 80, 75]);

    return (
        <>
        <div className="flex">
        <Navbar/>
        <div>
        <div className="mt-6 ml-12">
           <h1 className="text-4xl font-bold text-neutral-800">Dashboard</h1> 
           <p className="text-l font-bold mt-2 text-gray-300">Welcome back, Admin</p>
            </div>
            <div className=" flex ml-12 mt-6">
               <div className="mr-8"> <OperCard Oper={Oper}></OperCard></div>
               <div className="mr-8 "> <AllocCard Alloc={Alloc}></AllocCard></div>
               <div className="mr-8"> <NumberCard></NumberCard></div>
            </div>
            <div>
            <h1 className="text-2xl font-bold text-neutral-800 my-4 ml-12">Departments</h1>
            </div>
            <div className="w-full ml-12">
            <Table></Table>
            </div>
        </div>
        </div>
        </>
    )
}