import React, { useState, useEffect } from "react";
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import log from "../Images/logo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginFailedModalVisible, setLoginFailedModalVisible] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Attempting to fetch employees...");
        const response = await fetch("http://localhost:3000/api/employees");

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

    fetchEmployees();
  }, []);

  const handleLogin = () => {
    console.log("Entered email:", email.trim());
    console.log("Entered Password:", password.trim());

    const user = employees.find(
      (emp) =>
        emp.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        emp.password.trim() === password.trim()
    );

    if (user) {
      navigate("/dashboard");
    } else {
      setLoginFailedModalVisible(true);
    }
  };

  const closeLoginFailedModal = () => {
    setLoginFailedModalVisible(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading employees...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error fetching employees: {error.message}</div>;
  }

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-r from-[#d1e7e0] to-[#2E6B5C]">
      {/* IMAGE PART */}
      <div className="absolute top-[27%] left-[14%] z-30">
        <img
          className="rounded-2xl w-[350px] ml-[0px]"
          src={log}
          alt="logo"
        />
      </div>
      {/* LOGIN FORM */}
      <div className="flex justify-center items-center h-screen w-[560px] mr-[10px]">
        <div className="flex justify-center items-center flex-wrap md:flex-nowrap gap-8 w-full max-w-2xl p-8 rounded-2xl shadow-lg bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-2xl border border-white/50 relative">
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="flex justify-center items-center">
              <h2 className="text-[26px] mr-4 font-[800] text-gray-800 mb-4">
                Login
              </h2>
            </div>
            <Input
              label="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              variant="underlined"
              required
            />
            <Input
              label="Password"
              type="password"
              variant="underlined"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="bg-gradient-to-t from-[#006D5B] to-[#1ABC9C] hover:opacity-90 text-white font-bold py-2 px-4 rounded-[45px]"
            >
              Login
            </button>
            <div className="flex justify-end text-center mt-4">
              <a
                href="#"
                className="text-gray-700 text-bold hover:underline delay-75"
              >
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
      <Modal hideCloseButton={true} isOpen={isLoginFailedModalVisible} onClose={closeLoginFailedModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Invalid Credentials
              </ModalHeader>
              <ModalBody>
                <p className="text-red-500">
                  The email or password you entered is incorrect. Please try
                  again.
                </p>
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
  );
};

export default LoginPage;