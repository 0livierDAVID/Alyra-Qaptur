import { useState } from 'react'
import axios from 'axios'
import { Button, Input } from '@mui/material'
import { Box } from '@mui/system'

import Layout from '@/components/Layout'


export default function Test() {
  const [fileImg, setFileImg] = useState("")

  const onFileChange = (evt) => {
    setFileImg(evt.target.files[0]); //file object
  }

  const checkAuth = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileImg);

      // Check auth on API
      const resFile = await axios({
        method: "get",
        url: "https://api.pinata.cloud/data/testAuthentication",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
        },
      })
      // console.log(resFile);
      console.log(resFile.data.message);
    } catch (error) {
      console.log("Auth to IPFS: ")
      console.log(error)
    }
  }

  const uploadImageAndMetadataIPFS = async () => {
    if (fileImg) {
      try {
        const myfieldvalue = "zut";
        const formData = new FormData();
        formData.append("file", fileImg);
        const metadata = JSON.stringify({
          name: "file name",
          keyvalues: {
            "altname": "MickeyMouse",
            "description": "A famous mouse",
            "customKey": myfieldvalue,
            "customKey2": "customValue2"
          }
        });
        formData.append('pinataMetadata', metadata);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            "Content-Type": "multipart/form-data",
          },
        })
        // console.log(resFile);
        console.log("IpfsHash:", resFile.data.IpfsHash);
        console.log("PinSize:", resFile.data.PinSize);
      } catch (error) {
        console.log("Error sending File to IPFS: ")
        console.log(error)
      }
    }
  }

  const uploadMetadataIPFS = async () => {
    try {
      const myfieldvalue = "prout";
      const data = JSON.stringify({
        "pinataOptions": {
          "cidVersion": 1
        },
        "pinataMetadata": {
          "name": "testing",
          "keyvalues": {
            "customKey": myfieldvalue,
            "customKey2": "customValue2"
          }
        },
        "pinataContent": {
          "somekey": myfieldvalue,
          "hello": "Good",
          "Ola": "Nice"
        }
      });

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      })
      // console.log(resFile);
      console.log("IpfsHash:", resFile.data.IpfsHash);
      console.log("PinSize:", resFile.data.PinSize);
    } catch (error) {
      console.log("Error sending File to IPFS: ")
      console.log(error)
    }
  }

  const updateMetadataIPFS = async () => {
    try {
      const hash = "bafkreickyfc4vfwfanoc67dgce7ikehwb22y7bne6gjkdxott2rwrsj3hu";
      const myfieldvalue = "prout";
      const data = JSON.stringify({
        "ipfsPinHash": hash,
        "name": "another true name",
        "keyvalues": {
          "customKey2": "customValue2bis",
          "customKey3": "customValue3ter"
        }
      });

      const resFile = await axios({
        method: "put",
        url: `https://api.pinata.cloud/pinning/hashMetadata`,
        data: data,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      })
      console.log(resFile);
      // console.log("IpfsHash:", resFile.data.IpfsHash);
      // console.log("PinSize:", resFile.data.PinSize);
    } catch (error) {
      console.log("Error sending File to IPFS: ")
      console.log(error)
    }
  }

  const getData = async () => {
    const hash = "bafkreickyfc4vfwfanoc67dgce7ikehwb22y7bne6gjkdxott2rwrsj3hu";
    try {
      const resFile = await axios({
        method: "get",
        url: `https://gateway.pinata.cloud/ipfs/${hash}`,
      })
      // console.log(resFile);
      console.log(resFile.data);
      console.log(resFile.data.somekey);

    } catch (error) {
      console.log("Error sending File to IPFS: ")
      console.log(error)
    }
  }

  return (
    <>
      <Layout>
        <h2>Upload to IPFS with Pinata API</h2>

        <Box sx={{ border: '1px solid grey', borderRadius: '10px', mb: 2, p: 1 }}>
          <h3>Check auth</h3>
          <Button onClick={checkAuth} variant="contained">Upload</Button>
        </Box>

        <Box sx={{ border: '1px solid grey', borderRadius: '10px', mb: 2, p: 1 }}>
          <h3>Upload image and metadata</h3>
          <form
            encType="multipart/form-data"
            onSubmit={() => {
              sendFileToIPFS
            }}
          >
            <Input onChange={onFileChange} type="file" />
            <Button onClick={uploadImageAndMetadataIPFS} variant="contained">Upload</Button>
          </form>
        </Box>

        <Box sx={{ border: '1px solid grey', borderRadius: '10px', mb: 2, p: 1 }}>
          <h3>Upload metadata</h3>
          <Button onClick={uploadMetadataIPFS} variant="contained">Upload</Button>
        </Box>

        <Box sx={{ border: '1px solid grey', borderRadius: '10px', mb: 2, p: 1 }}>
          <h3>Update metadata</h3>
          <Button onClick={updateMetadataIPFS} variant="contained">Update</Button>
        </Box>

        <Box sx={{ border: '1px solid grey', borderRadius: '10px', mb: 2, p: 1 }}>
          <h3>Get data</h3>
          <Button onClick={getData} variant="contained">Get data</Button>
        </Box>


      </Layout>
    </>
  )
}