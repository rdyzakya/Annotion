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
  Textarea,
  Thead,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Tr,
  Select,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import doge from "../doge.png";

import {
  BrowserRouter as Router,
  json,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BE_URL, EXAMPLE_DATASET } from "../constanta";
import { useEffect } from "react";

const Main = () => {
  const endpoint = BE_URL;

  const [datasetList, setDatasetList] = React.useState([
    {
      id: -69420,
      name: "isengg",
      description: "testaafdsadf",
      fileLocation: "7995c231-fd3c-4ff2-abd1-12ba339e2612.rar",
      labels: "true, false",
      owner: "tester",
      trained: false,
      Annotations: null,
      createdAt: "2022-11-18T14:50:14.349499+07:00",
      updatedAt: "2022-11-18T14:50:14.349499+07:00",
      DeletedAt: null,
    },
  ]);
  const [annotateMode, setAnnotateMode] = React.useState(false);
  const [dataset, setDataset] = React.useState(datasetList[0]);
  const [datasetContent, setDatasetContent] = React.useState(
    EXAMPLE_DATASET["extraction"]
  );
  const [uploadedFile, setUploadedFile] = React.useState(null);
  const [uploadedFileName, setUploadedFileName] = React.useState("");
  const [uploadedFileDescription, setUploadedFileDescription] =
    React.useState("");
  const [uploadedFileLabels, setUploadedFileLabels] = React.useState("");
  const [changedFileName, setChangedFileName] = React.useState("");
  const [changedFileDescription, setChangedFileDescription] =
    React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleFileChange = (e: any) => {
    setUploadedFile(e.target.files[0]);
    console.log(e);
  };

  const handleFileDownload = async (e: any) => {
    e.preventDefault();
    fetch(BE_URL + dataset.fileLocation).then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = dataset.name + ".csv";
        alink.click();
      });
    });
  };

  const handleFileDelete = async (e: any) => {
    e.preventDefault();
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    fetch(BE_URL + "datasets/" + dataset.id, requestOptions).then((response) =>
      response.json()
    );
    setDatasetList(datasetList.filter((item) => item.id !== dataset.id));
    if (datasetList.length === 0) {
      setDataset({
        id: -69420,
        name: "isengg",
        description: "testaafdsadf",
        fileLocation: "7995c231-fd3c-4ff2-abd1-12ba339e2612.rar",
        labels: "true, false",
        owner: "tester",
        trained: false,
        Annotations: null,
        createdAt: "2022-11-18T14:50:14.349499+07:00",
        updatedAt: "2022-11-18T14:50:14.349499+07:00",
        DeletedAt: null,
      });
    } else {
      setDataset(datasetList[0]);
    }
    onClose2();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("token")) {
        const res = await fetch(
          BE_URL + "datasets?owner=" + localStorage.getItem("token")
        );
        if (res.status === 200) {
          const jsonData = await res.json();
          console.log(jsonData);
          setDatasetList(jsonData["data"]);
        }
      }
    };

    fetchData();
  }, [dataset]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(BE_URL + "datasets/" + dataset.id + "/csv");
      if (res.status === 200) {
        const jsonData = await res.json();
        console.log(jsonData);
        setDatasetContent(jsonData["extraction"]);
      }
    };

    if (dataset.id !== -69420) {
      fetchData();
    }
  }, [dataset]);

  const handleFileUpload = () => {
    const owner = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("annotation_file", uploadedFile! as string | Blob);
    formData.append("dataset_name", uploadedFileName);
    formData.append("description", uploadedFileDescription);
    formData.append("labels", uploadedFileLabels);
    formData.append("owner", owner ?? "");
    //formData.
    fetch(endpoint + "datasets", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((result) => {
        if (result != null) {
          setDatasetList([...datasetList, result.data]);
          console.log("upload", result.data);
          setDataset(result.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    onClose();
  };

  const handleMetadataChange = () => {
    const formData = new FormData();
    formData.append("dataset_name", changedFileName);
    formData.append("description", changedFileDescription);
    fetch(endpoint + "datasets/" + dataset.id, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((result) => {
        if (result != null) {
          setDatasetList(
            datasetList.map((item) => {
              if (item.id === dataset.id) {
                return result.data;
              }
              return item;
            })
          );
          console.log("upload", result.data);
          setDataset(result.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    onClose3();
  };

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

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
                <Button
                  // as={"button"}
                  fontWeight="bold"
                  bg={dset.id === dataset.id ? "gray.300" : "white"}
                  w="180px"
                  h="fit-content"
                  minH="32px"
                  p="1"
                  borderRadius="md"
                  boxShadow="md"
                  m="1"
                  onClick={() => {
                    setAnnotateMode(false);
                    setDataset(dset);
                    console.log(
                      (datasetContent["Rows"] as any)[0][
                        datasetContent["Columns"][
                          datasetContent["Columns"].length - 1
                        ]
                      ]
                    );
                  }}
                >
                  <Text>{dset.name}</Text>
                </Button>
              </Center>
            ))}
          </Box>
          <Center>
            <Box
              bg={"teal.500"}
              w="180px"
              h={"23vh"}
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
                onClick={dataset.id !== -69420 ? onOpen3 : undefined}
              >
                <Text>EDIT METADATA</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
                onClick={() => setAnnotateMode(true)}
              >
                <Text>ANNOTATE</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
                onClick={handleFileDownload}
              >
                <Text>DOWNLOAD</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
                onClick={onOpen2}
              >
                <Text>DELETE</Text>
              </Button>
              <Button
                fontWeight="bold"
                colorScheme={"teal"}
                w="150px"
                h="fit-content"
                color={"red.600"}
                onClick={handleLogout}
              >
                <Text>LOGOUT</Text>
              </Button>
              <br></br>
              <br></br>
            </Box>
          </Center>
        </GridItem>
        <GridItem
          bg="white"
          area={"main"}
          textAlign={"center"}
          overflowX={"auto"}
          overflowY={"auto"}
        >
          {dataset.id === -69420 ? (
            <Text
              fontSize={"20px"}
              marginTop={"40vh"}
              marginBottom={"40vh"}
              // maxH={"100vh"}
              fontWeight={"bold"}
            >
              Nothing to show
            </Text>
          ) : (
            <Center>
              <TableContainer margin={"20px"}>
                <Table variant="striped" colorScheme="teal" bg={"gray.300"}>
                  {/* <TableCaption>
                  Imperial to metric conversion factors
                </TableCaption> */}
                  <Thead bg={"gray.400"}>
                    <Tr>
                      {datasetContent["Columns"].map((col) => (
                        <Th>{col}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {datasetContent["Rows"].map((row) => (
                      <Tr>
                        {datasetContent["Columns"]
                          .filter(
                            (col) =>
                              col !==
                              datasetContent["Columns"][
                                datasetContent["Columns"].length - 1
                              ]
                          )
                          .map((col) => (
                            <Td>{(row as any)[col]}</Td>
                          ))}
                        {annotateMode ? (
                          <Td>
                            <Select
                              defaultValue={
                                (row as any)[
                                  datasetContent["Columns"][
                                    datasetContent["Columns"].length - 1
                                  ]
                                ]
                              }
                              bg={"white"}
                              onChange={(e) => {
                                (row as any)[
                                  datasetContent["Columns"][
                                    datasetContent["Columns"].length - 1
                                  ]
                                ] = e.target.value;
                                console.log(
                                  (row as any)[
                                    datasetContent["Columns"][
                                      datasetContent["Columns"].length - 1
                                    ]
                                  ]
                                );
                              }}
                            >
                              <option
                                value={
                                  (row as any)[
                                    datasetContent["Columns"][
                                      datasetContent["Columns"].length - 1
                                    ]
                                  ]
                                }
                              >
                                {
                                  (row as any)[
                                    datasetContent["Columns"][
                                      datasetContent["Columns"].length - 1
                                    ]
                                  ]
                                }
                              </option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </Select>
                          </Td>
                        ) : (
                          <Td>
                            {
                              (row as any)[
                                datasetContent["Columns"][
                                  datasetContent["Columns"].length - 1
                                ]
                              ]
                            }
                          </Td>
                        )}
                      </Tr>
                    ))}
                  </Tbody>
                  {/* <Tfoot>
                  <Tr>
                    <Th>To convert</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                  </Tr>
                </Tfoot> */}
                </Table>
              </TableContainer>
            </Center>
          )}
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

            <Input
              type="file"
              accept=".csv"
              marginBottom={"10px"}
              onChange={handleFileChange}
            />
            <Text fontWeight={"bold"}>Dataset Name</Text>
            <Input
              placeholder="ex: Shop Review"
              marginBottom={"10px"}
              onChange={(e) => setUploadedFileName(e.target.value)}
            />
            <Text fontWeight={"bold"}>Dataset Description</Text>
            <Textarea
              placeholder={
                "ex: Dataset contains reviews of shoe shops in the UK."
              }
              size="sm"
              marginBottom={"10px"}
              onChange={(e) => setUploadedFileDescription(e.target.value)}
            />
            <Text fontWeight={"bold"}>Dataset Labels</Text>
            <Input
              placeholder="seperate with comma, ex: good,bad,neutral"
              marginBottom={"10px"}
              onChange={(e) => setUploadedFileLabels(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleFileUpload}>
              Upload
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this file?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleFileDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose2}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen3} onClose={onClose3}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Metadata</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight={"bold"}>Dataset Name</Text>
            <Input
              defaultValue={dataset["name"]}
              marginBottom={"10px"}
              onChange={(e) => setChangedFileName(e.target.value)}
            />
            <Text fontWeight={"bold"}>Dataset Description</Text>
            <Textarea
              defaultValue={dataset["description"]}
              size="sm"
              marginBottom={"10px"}
              onChange={(e) => setChangedFileDescription(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleMetadataChange}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Main;
