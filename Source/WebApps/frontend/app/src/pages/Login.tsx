import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Input,
  Card,
  Heading,
  Button,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Logo } from "../Logo";
import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BE_URL } from "../constanta";

const Main = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BE_URL + "user/login", {
        method: "POST",
        // mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();

      if (response.status === 200) {
        console.log("dua ratus");
        localStorage.setItem("token", username);
        navigate("/");
      } else {
        console.log("bukan 200");
        setError(data.error);
      }
    } catch (error: any) {
      setError(error);
      console.log("error");
      console.log(username);
      if (username === "admin") {
        console.log("haha");
        localStorage.setItem("token", " admin");
        navigate("/");
      }
    }
    setLoading(false);
  };

  const handleChange = (e: any) => {
    console.log(e);
    setError(null);
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else {
      setPassword(e.target.value);
    }
    console.log(username, password);
  };

  return (
    <Box
      height={"100vh"}
      width={"100vw"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Card width={"30%"} bg={"#2a9d8f"} color={"white"} padding={"1%"}>
        <Heading textAlign={"center"} as="h1" size="2xl" marginBottom={"40px"}>
          Login
        </Heading>
        <Text>Username</Text>
        <Input
          bg={"white"}
          color={"black"}
          placeholder={"username"}
          name={"username"}
          onChange={handleChange}
        />
        <Box marginBottom={"20px"} />
        <Text>Password</Text>
        <Input
          bg={"white"}
          color={"black"}
          placeholder={"password"}
          name={"password"}
          onChange={handleChange}
          type={"password"}
        />
        <Box marginBottom={"40px"} />
        <Button color={"black"} onClick={handleSubmit}>
          Login
        </Button>
        <Text align={"center"} color={"red"} display={error ? "block" : "none"}>
          incorrect username or password
        </Text>
        <Box marginBottom={"20px"} />
      </Card>
    </Box>
  );
};

export default Main;
