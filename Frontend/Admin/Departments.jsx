import Navbar from "./Navbar";
import ReactECharts from "echarts-for-react";
import { RiAddCircleLine } from "react-icons/ri";
import {
    Tabs,
    Tab,
    Card,
    CardHeader,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Pagination,
} from "@nextui-org/react";
import { useState, useEffect, useMemo, useCallback } from "react";

export function Dep() {
    const [tabdata, setTabdata] = useState([]);
    const [tabledata, setTabledata] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [ApprovalWorkflow, setApprovalWorkflow] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState("");
    const [editingProject, setEditingProject] = useState(null);
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    const { isOpen: isOpenWrongName, onOpen: onOpenWrongName, onOpenChange: onOpenChangeWrongName } = useDisclosure();
    const { isOpen: isOpenCannotDelete, onOpen: onOpenCannotDelete, onOpenChange: onOpenChangeCannotDelete } = useDisclosure();
    const [addName, setaddName] = useState("");
    const [addBudget, setaddBudget] = useState("");
    const [totalBudget, settotalBudget] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [page, setPage] = useState(1);
    const [editedProject, seteditedProject] = useState("");
    const [currentTabKey, setCurrentTabKey] = useState(""); // To track the current tab

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys],
    );

    const fetchTable = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Attempting to fetch projects...");
            const response = await fetch("http://localhost:3000/api/tabledep");
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched projects:", data);
            setTabledata(data);
        } catch (err) {
            console.error("Error fetching project data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTable(); // Fetch table data on component mount
    }, [fetchTable]);

    const fetchTabs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Attempting to fetch departments...");
            const response = await fetch("http://localhost:3000/api/tabsdep");
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched departments:", data);
            setTabdata(data);
            if (data.length > 0) {
                setSelectedDepartmentId(data[0].id);
                setCurrentTabKey(data[0].name); // Initialize current tab key
            }
        } catch (err) {
            console.error("Error fetching department data:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTabs();
    }, [fetchTabs]);

    useEffect(() => {
        const fetchEmp = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Attempting to fetch employees...");
                const response = await fetch("http://localhost:3000/api/emp");
                console.log("Response status:", response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched employees:", data);
                setEmployees(data);
            } catch (err) {
                console.error("Error fetching employee data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmp();
    }, []);
    useEffect(() => {
        const fetchApproval = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Attempting to fetch approvals...");
                const response = await fetch("http://localhost:3000/api/approval");
                console.log("Response status:", response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched approvals:", data);
                setApprovalWorkflow(data);
            } catch (err) {
                console.error("Error fetching employee data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApproval();
    }, []);
    const employee = employees.map((emp) => ({
        id: emp.department_id,
        name: emp.name,
        role: emp.role,
    }));

    const departments = tabdata.map((department) => ({
        id: department.id,
        name: department.name,
        total_budget: department.total_budget,
        allocated_budget: department.allocated_budget,
    }));

    const projects = tabledata.map((project) => ({
        id: project.department_id,
        name: project.projectname,
        allocated_budget: project.allocated_budget,
        projectId: project.id,
        total_budget: project.total_budget
    }));
    const approval=ApprovalWorkflow.map((approval) => ({
        id: approval.project_id,
    }))
    const DeleteIcon = (props) => {
        return (
            <svg
                aria-hidden="true"
                fill="none"
                focusable="false"
                height="1em"
                role="presentation"
                viewBox="0 0 20 20"
                width="1em"
                {...props}
            >
                <path
                    d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
                <path
                    d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
                <path
                    d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
                <path
                    d="M8.60834 13.75H11.3833"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
                <path
                    d="M7.91669 10.4167H12.0834"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                />
            </svg>
        );
    };

    const EditIcon = (props) => {
        return (
            <svg
                aria-hidden="true"
                fill="none"
                focusable="false"
                height="1em"
                role="presentation"
                viewBox="0 0 20 20"
                width="1em"
                {...props}
            >
                <path
                    d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={1.5}
                />
                <path
                    d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={1.5}
                />
                <path
                    d="M2.5 18.3333H17.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={1.5}
                />
            </svg>
        );
    };

    const chartOption = {
        option: {
            tooltip: {
                trigger: 'item'
            },
            color: ["#2E6B5C"],
            grid: {
                top: 30,
                left: 20,
                right: 10,
                bottom: 50,
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
                    offset: 20,
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
                show: false,
                max: 100,
            },
            series: [
                {
                    type: "bar",
                    barGap: "-100%",
                    data: Array(8).fill(100),
                    barWidth: "40%",
                    itemStyle: {
                        color: "#d9d9d9",
                        borderRadius: [20, 20, 20, 20],
                    },
                },
                {
                    data: [60, 90, 100, 50, 40, 70, 80, 75],
                    type: "bar",
                    barWidth: "40%",
                    itemStyle: {
                        borderRadius: [20, 20, 20, 20],
                    },
                },
            ],
        },
        option2: {
            tooltip: {
                trigger: 'item'
            },
            color: ["#1abc9c"],
            grid: {
                top: 30,
                left: 20,
                right: 10,
                bottom: 50,
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
                    offset: 20,
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
                show: false,
                max: 100,
            },
            series: [
                {
                    type: "bar",
                    barGap: "-100%",
                    data: Array(8).fill(100),
                    barWidth: "40%",
                    itemStyle: {
                        color: "#d9d9d9",
                        borderRadius: [20, 20, 20, 20],
                    },
                },
                {
                    data: [90, 60, 50, 100, 70, 40, 80, 75],
                    type: "bar",
                    barWidth: "40%",
                    itemStyle: {
                        borderRadius: [20, 20, 20, 20],
                    },
                },
            ],
        }
    };
    const handleAddProject = async () => {
        const projectNameExists = projects
            .filter((project) => project.id === selectedDepartmentId)
            .some((project) => project.name.toLowerCase() === addName.toLowerCase());
            const test=addName==""?true:false;
            const test2=addBudget>totalBudget?true:false;
        if (projectNameExists || addName == ""||Number(addBudget)>Number(totalBudget)) {
            console.log("Project Name Exists:", projectNameExists);
            console.log("Project Name:", test);
            console.log("Allocated Budget:", test2);
            onOpenWrongName();
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectName: addName,
                    totalBudget: totalBudget,
                    allocatedBudget: addBudget,
                    departmentId: selectedDepartmentId,
                    employeeNames: Array.from(selectedKeys),
                }),
            });

            if (response.ok) {
                const newProject = {
                    department_id: selectedDepartmentId,
                    projectname: addName,
                    allocated_budget: parseFloat(addBudget),
                };
                setTabledata(prevTabledata => [...prevTabledata, newProject]);
                setaddName("");
                setaddBudget("");
                settotalBudget("");
                setSelectedKeys(new Set());
                onOpenChangeAdd(false);
                fetchTable();
                fetchTabs();
            } else {
                const errorData = await response.json();
                console.error('Failed to add project:', errorData);
            }
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    const getHighestAllocatedBudgetProject = (departmentId) => {
        const departmentProjects = projects.filter((project) => project.id === departmentId);
        if (!departmentProjects || departmentProjects.length === 0) return "No Projects";
        const highestProject = departmentProjects.reduce((max, project) =>
            project.allocated_budget > max.allocated_budget ? project : max
        );
        return highestProject.name;
    };

    const handleTabChange = (key) => {
        setCurrentTabKey(key); // Update the current tab key
        const selectedDepartment = departments.find(dept => dept.name === key);
        if (selectedDepartment) {
            setSelectedDepartmentId(selectedDepartment.id);
            setaddName("");
            setaddBudget("");
            setNewName("");
            settotalBudget("");
            setSelectedKeys(new Set());
            fetchTable(); // Refresh the table data when the tab changes
        }
    };
    const handleEditClick = (project) => {
        setEditingProject(project);
        setNewName(project.name);
        seteditedProject(project.projectId);
        onOpenEdit();
    };
    const handleUpdateProject = async () => {
        if (!newName || !editedProject) {
            console.error('Project name or ID is missing.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/editedprojects/${editedProject}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectName: newName,
                }),
            });

            if (response.ok) {
                console.log('Project updated successfully!');
                setTabledata(prevTabledata =>
                    prevTabledata.map(project =>
                        project.projectId === editedProject
                            ? { ...project, projectname: newName }
                            : project
                    )
                );
                setNewName("");
                setEditingProject(null);
                seteditedProject(null);
                onOpenChangeEdit(false);
                fetchTable(); // Ensure latest data is fetched
            } else {
                const errorData = await response.json();
                console.error('Failed to update project:', errorData);
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleDeleteClick = async (project) => {
        try {
            const department = departments.find((dept) => dept.id === project.id);

            if (!department) {
                console.error("Department not found for project:", project);
                return;
            }
            setEditingProject(project);

            onOpenDelete();
        } catch (error) {
            console.error("Error in handleDeleteClick:", error);
        }
    };

    const handleDelete = async (deletedProject) => {
        const projectInApprovalWorkflow = approval.find(approval => approval.id === deletedProject.projectId);
        if (projectInApprovalWorkflow) {
            onOpenCannotDelete();
            return; 
        }
        const { projectId, allocated_budget, id: departmentId, total_budget } = deletedProject;
        console.log("Deleting project with data:", {
            projectId: projectId,
            departmentId: deletedProject.id, // Assuming project.id holds the departmentId
            AllocatedBudget: allocated_budget,
            totalBudget: total_budget,
        });
        try {
            const response = await fetch(`http://localhost:3000/api/deletedprojects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    departmentId: departmentId, // Correctly using the aliased variable
                    totalBudget: total_budget,
                    AllocatedBudget: allocated_budget
                }),
            });

            if (response.ok) {
                console.log('Project deleted successfully!');
                setTabledata(prevTabledata =>
                    prevTabledata.filter(project => project.projectId !== projectId)
                );
                onOpenChangeDelete(false);
                fetchTable();
                fetchTabs();
            } else {
                const errorData = await response.json();
                console.error('Failed to delete project:', errorData);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };
    const filteredProjects = projects.filter((project) => project.id === selectedDepartmentId);
    const rowsPerPage = 3;
    const pages = Math.ceil(filteredProjects.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredProjects.slice(start, end);
    }, [page, filteredProjects]);

    return (
        <>
            <div className="flex">
                <Navbar />
                <div>
                    <div className="mt-12 ml-12">
                        <h1 className="text-4xl font-bold text-neutral-800">Project Expense by Departments</h1>
                    </div>
                    <div className="ml-6 mt-4 flex w-full flex-col">
                        <Tabs selectedKey={currentTabKey} onSelectionChange={handleTabChange} aria-label="Department Tabs">
                            {departments.map((department) => (
                                <Tab key={department.name} title={department.name}>
                                    <div className="flex ml-12 mt-6">
                                        <Card className="py-1 mr-8 w-[328px] h-[262px]">
                                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                <p className="text-tiny text-gray-400 font-normal">Operational Budget</p>
                                                <small className="text-xl font-bold">${department.total_budget.toLocaleString()}</small>
                                            </CardHeader>
                                            <CardBody className="overflow-hidden p-4">
                                                <ReactECharts
                                                    option={chartOption.option}
                                                    style={{
                                                        height: "150px",
                                                        width: "100%",
                                                    }}
                                                />
                                            </CardBody>
                                        </Card>
                                        <Card className="py-1 mr-8 w-[328px] h-[262px]">
                                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                <p className="text-tiny text-gray-400 font-normal">Allocated Budget</p>
                                                <small className="text-xl font-bold">${department.allocated_budget.toLocaleString()}</small>
                                            </CardHeader>
                                            <CardBody className="overflow-hidden p-4">
                                                <ReactECharts
                                                    option={chartOption.option2}
                                                    style={{
                                                        height: "150px",
                                                        width: "100%",
                                                    }}
                                                />
                                            </CardBody>
                                        </Card>
                                        <Card className="py-1 w-[328px] h-[262px]">
                                            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                                <p className="text-tiny text-gray-400 font-normal">Highest Expense </p>
                                                <small className="text-xl font-bold">Project</small>
                                            </CardHeader>
                                            <CardBody className="overflow-hidden p-4">
                                                <div className="flex items-center justify-center w-full h-full">
                                                    <h1 className="text-3xl font-bold text-lime-600">
                                                        {getHighestAllocatedBudgetProject(department.id)}
                                                    </h1>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    <div className="mt-4 ml-12 w-full">
                                        <div className="flex justify-end mb-2">
                                            <Button
                                                onPress={onOpenAdd}
                                                className="bg-[#cecece] flex font-bold"
                                                startContent={<RiAddCircleLine className="text-xl" />}
                                            >
                                                Add Project
                                            </Button>
                                        </div>
                                        <Table aria-label="Project Table"
                                            bottomContent={
                                                <div className="flex w-full justify-center">
                                                <Pagination
                                                    isCompact
                                                    showControls
                                                    showShadow
                                                    color="success"
                                                    variant="light"
                                                    page={page}
                                                    total={pages}
                                                    onChange={(page) => setPage(page)}
                                                />
                                                </div>
                                            }
                                        >
                                            <TableHeader>
                                                <TableColumn>Project Name</TableColumn>
                                                <TableColumn>Allocated Budget</TableColumn>
                                                <TableColumn>Actions</TableColumn>
                                            </TableHeader>
                                            <TableBody items={items}>
                                                {(item) => (
                                                    <TableRow key={item.name}>
                                                        <TableCell className=" text-md">{item.name}</TableCell>
                                                        <TableCell className=" text-md">${item.allocated_budget.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <div className="relative flex items-center gap-2">
                                                                <Tooltip content="Edit Project">
                                                                    <span onClick={() =>handleEditClick(item)} className=" px-2 text-xl text-default-400 cursor-pointer active:opacity-50">
                                                                        <EditIcon />
                                                                    </span>
                                                                </Tooltip>
                                                                <Tooltip color="danger" content="Delete Project">
                                                                    <span onClick={() => handleDeleteClick(item)} className="text-xl text-danger cursor-pointer active:opacity-50">
                                                                        <DeleteIcon />
                                                                    </span>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Tab>
                            ))}
                        </Tabs>
                        <Modal
                            backdrop="opaque"
                            isOpen={isOpenEdit}
                            motionProps={{
                                variants: {
                                    enter: {
                                        y: 0,
                                        opacity: 1,
                                        transition: {
                                            duration: 0.3,
                                            ease: "easeOut",
                                        },
                                    },
                                    exit: {
                                        y: -20,
                                        opacity: 0,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeIn",
                                        },
                                    },
                                },
                            }}
                            onOpenChange={onOpenChangeEdit}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Edit Project</ModalHeader>
                                        <ModalBody>
                                            <div className="flex flex-col gap-4">
                                                <Input label="Project Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                            <Button color="success" onPress={handleUpdateProject}>
                                                Update</Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Modal
                            backdrop="opaque"
                            isOpen={isOpenDelete}
                            motionProps={{
                                variants: {
                                    enter: {
                                        y: 0,
                                        opacity: 1,
                                        transition: {
                                            duration: 0.3,
                                            ease: "easeOut",
                                        },
                                    },
                                    exit: {
                                        y: -20,
                                        opacity: 0,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeIn",
                                        },
                                    },
                                },
                            }}
                            onOpenChange={onOpenChangeDelete}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">
                                            Are you sure you want to delete this project?
                                        </ModalHeader>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={() => handleDelete(editingProject)}>
                                                Yes
                                            </Button>
                                            <Button color="default" onPress={onClose}>
                                                No
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Modal
                            backdrop="opaque"
                            isOpen={isOpenAdd}
                            motionProps={{
                                variants: {
                                    enter: {
                                        y: 0,
                                        opacity: 1,
                                        transition: {
                                            duration: 0.3,
                                            ease: "easeOut",
                                        },
                                    },
                                    exit: {
                                        y: -20,
                                        opacity: 0,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeIn",
                                        },
                                    },
                                },
                            }}
                            onOpenChange={onOpenChangeAdd}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Add Project</ModalHeader>
                                        <ModalBody>
                                            <div className="flex flex-col gap-4">
                                                <Input label="Project Name" value={addName} onChange={(e) => setaddName(e.target.value)} />
                                                <Input label="Total Budget" type="number" value={totalBudget} onChange={(e) => settotalBudget(e.target.value)} />
                                                <Input label="Allocated Budget" type="number" value={addBudget} onChange={(e) => setaddBudget(e.target.value)} />
                                                <Dropdown>
                                                    <DropdownTrigger>
                                                        <Button className="capitalize" variant="bordered">
                                                            {selectedValue.length > 0 ? `${selectedValue}` : "Select employees"}
                                                        </Button>
                                                    </DropdownTrigger>
                                                    <DropdownMenu
                                                        disallowEmptySelection
                                                        aria-label="Multiple selection example"
                                                        closeOnSelect={false}
                                                        selectedKeys={selectedKeys}
                                                        selectionMode="multiple"
                                                        variant="flat"
                                                        onSelectionChange={setSelectedKeys}
                                                    >   {employee.filter(employee => employee.id == selectedDepartmentId).map((employee) => (
                                                        <DropdownItem description={employee.role} key={employee.name}>{employee.name}</DropdownItem>
                                                    ))}
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                            <Button color="success" variant="light" onPress={handleAddProject}>
                                                Add
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Modal
                            backdrop="opaque"
                            isOpen={isOpenWrongName}
                            motionProps={{
                                variants: {
                                    enter: {
                                        y: -10,
                                        opacity: 1,
                                        transition: {
                                            duration: 0.3,
                                            ease: "easeOut",
                                        },
                                    },
                                    exit: {
                                        y: -20,
                                        opacity: 0,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeIn",
                                        },
                                    },
                                },
                            }}
                            onOpenChange={onOpenChangeWrongName}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalBody>
                                            <div className="flex flex-col gap-4">
                                                <h2 className="text-2xl font-bold text-red-800">Please enter a valid project</h2>
                                                <p className="text-xl font-semibold text-default-800">Either the name is invalid or the total budget is less than the allocated budget</p>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <Modal
                            backdrop="opaque"
                            isOpen={isOpenCannotDelete}
                            motionProps={{
                                variants: {
                                    enter: {
                                        y: -10,
                                        opacity: 1,
                                        transition: {
                                            duration: 0.3,
                                            ease: "easeOut",
                                        },
                                    },
                                    exit: {
                                        y: -20,
                                        opacity: 0,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeIn",
                                        },
                                    },
                                },
                            }}
                            onOpenChange={onOpenChangeCannotDelete}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalBody>
                                            <div className="flex flex-col gap-4">
                                                <h2 className="text-2xl font-bold text-red-800">Cannot delete project</h2>
                                                <p className="text-2xl font-bold text-default-800">This project is currently in progress</p>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}