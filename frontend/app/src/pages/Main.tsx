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
  BrowserRouter as Router, json,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {BE_URL} from "../constanta";
import {useEffect} from "react";

const Main = () => {
  const endpoint = BE_URL;

  const [datasetList, setDatasetList] = React.useState([
    {
      "id": 1,
      "name": "isengg",
      "metadata": "testaafdsadf",
      "fileLocation": "7995c231-fd3c-4ff2-abd1-12ba339e2612.rar",
      "owner": "tester",
      "createdAt": "2022-11-18T14:50:14.349499+07:00",
      "updatedAt": "2022-11-18T14:50:14.349499+07:00",
      "DeletedAt": null
    },
    {
      "id": 2,
      "name": "isengg2",
      "metadata": "testaafdsadf22222",
      "fileLocation": "7995c231-fd3c-4ff2-abd1-12ba339e2612.rar",
      "owner": "tester",
      "createdAt": "2022-11-18T14:50:14.349499+07:00",
      "updatedAt": "2022-11-18T14:50:14.349499+07:00",
      "DeletedAt": null
    },
    {
      "id": 3,
      "name": "isengg3",
      "metadata": "testaafdsadf33333",
      "fileLocation": "7995c231-fd3c-4ff2-abd1-12ba339e2612.rar",
      "owner": "tester",
      "createdAt": "2022-11-18T14:50:14.349499+07:00",
      "updatedAt": "2022-11-18T14:50:14.349499+07:00",
      "DeletedAt": null
    }
  ])
  const [dataset, setDataset] = React.useState(datasetList[0]);
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

  useEffect( () => {

    const fetchData = async () => {
      if (localStorage.getItem("token")) {
        const res = await fetch(BE_URL + "datasets?owner=" + localStorage.getItem("token"))
        if(res.status==200){
          const jsonData = await res.json()
          console.log(jsonData)
          setDataset(jsonData["data"])
        }
      }
    }

    fetchData()
  }, [])

  const handleFileUpload = () => {
    const owner = localStorage.getItem("token")
    const formData = new FormData();
    formData.append("annotation_file", uploadedFile! as string | Blob);
    formData.append("dataset_name", uploadedFileName);
    formData.append("description", uploadedFileDescription);
    formData.append("labels", uploadedFileLabels);
    formData.append("owner", owner ?? "")
    //formData.
    fetch(endpoint + "datasets", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if(response.status == 200){
          alert("berhasil unggah")
          return response.json()
        }
        return null
      })
      .then((result) => {
        if (result!=null){
          window.location.reload()
        }
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
            {datasetList.map((dset) => (
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
                  onClick={() => setDataset(dset)}
                >
                  <Text>{dset.name}</Text>
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
          {dataset.name}
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
            <Input placeholder="ex: Shop Review" marginBottom={"10px"} onChange={(e)=>setUploadedFileName(e.target.value)}/>
            <Text fontWeight={"bold"}>Dataset Description</Text>
            <Input placeholder="ex: Contains shoe shop customer reviews" marginBottom={"10px"} onChange={(e)=>setUploadedFileDescription(e.target.value)}/>
            <Text fontWeight={"bold"}>Dataset Labels</Text>
            <Input placeholder="seperate with comma, ex: good,bad,neutral" marginBottom={"10px"} onChange={(e)=>setUploadedFileLabels(e.target.value)}/>
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
