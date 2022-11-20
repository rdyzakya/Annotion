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
  GridItem,
  Input,
  Image,
  Center,
  Spacer,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import doge from "../doge.png";

import {
  BrowserRouter as Router,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Main = () => {
  const endpoint = "http://localhost:8010/";
  const datasets_list = [
    {
      name: "Dataset 1",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 2",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 3",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 1",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 2",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 3",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 1",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 2",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 3",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 2",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 3",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 1",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 2",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Dataset 3",
      description: "This is a description of the dataset",
      image: "https://via.placeholder.com/150",
    },
  ];

  const [dataset, setDataset] = React.useState(datasets_list[0]);
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [uploadedFileName, setUploadedFileName] = React.useState("");
  const [uploadedFileDescription, setUploadedFileDescription] = React.useState(
    ""
  );
  const [uploadedFileLabels, setUploadedFileLabels] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileChange = (e: any) => {
    setUploadedFile(e.target.files[0]);
    console.log(e);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", uploadedFile! as string | Blob);
    formData.append("name", uploadedFileName);
    formData.append("description", uploadedFileDescription);
    formData.append("labels", uploadedFileLabels);
    fetch(endpoint + "upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  console.log(doge);

  return (
    <Box>
      <Grid
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={"0px 1fr 0px"}
        gridTemplateColumns={"200px 1fr"}
        h={"100vh"}
        gap="0"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        {/* <GridItem pl="2" bg="orange.300" area={"header"}>
          Annotion
        </GridItem> */}
        <GridItem bg="green.300" area={"nav"} textAlign={"center"} padding={1}>
          <Center>
            <Image
              h={"10vh"}
              p={1}
              borderRadius="full"
              src={doge}
              alt="Annotion"
            />
          </Center>
          <Box h={"60vh"} overflowY={"auto"}>
            {datasets_list.map((dataset) => (
              <Center>
                <Box
                  as={"button"}
                  fontWeight="bold"
                  bg="white"
                  w="180px"
                  h="fit-content"
                  p="1"
                  borderRadius="md"
                  boxShadow="md"
                  m="1"
                >
                  <Text>{dataset.name}</Text>
                </Box>
              </Center>
            ))}
          </Box>
          <Center>
            <Box
              bg={"teal.500"}
              w="180px"
              h="23vh"
              p="1"
              borderRadius="md"
              boxShadow="md"
              m="1"
              marginTop={10}
            >
              <Text fontSize={"18px"} marginBottom={3}>
                MENU PALETTE
              </Text>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
                onClick={onOpen}
              >
                <Text>UPLOAD</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
              >
                <Text>EDIT METADATA</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
              >
                <Text>ANNOTATE</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
              >
                <Text>EDIT</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
              >
                <Text>DELETE</Text>
              </Button>
            </Box>
          </Center>
        </GridItem>
        <GridItem bg="white" area={"main"} textAlign={"center"}>
          Main
        </GridItem>
        {/* <GridItem pl="2" bg="blue.300" area={"footer"}>
          Footer
        </GridItem> */}
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Dataset</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight={"bold"}>File Upload</Text>
            <Input type="file"  marginBottom={"10px"} onChange={handleFileChange} />
            <Text fontWeight={"bold"}>Dataset Name</Text>
            <Input placeholder="ex: Shop Review" marginBottom={"10px"}/>
            <Text fontWeight={"bold"}>Dataset Description</Text>
            <Input placeholder="ex: Contains shoe shop customer reviews" marginBottom={"10px"}/>
            <Text fontWeight={"bold"}>Dataset Labels</Text>
            <Input placeholder="seperate with comma, ex: good,bad,neutral" marginBottom={"10px"}/>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleFileUpload}>
              Upload
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>


  );
};

export default Main;
