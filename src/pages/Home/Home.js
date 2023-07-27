import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Chip,
  Container,
  Link,
  Tooltip,
  Typography,
  colors,
} from "@mui/material";
import { Add, Info, Settings } from "@mui/icons-material";

const Home = (props) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          background: "url(/cloud-blue-sky.jpg) center center fixed",
          backgroundSize: "cover",
          filter: "blur(10px) ",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      ></Box>
      <Box
        sx={{
          backgroundColor: "rgba(0,0,0, 0.7)",
          minHeight: "100vh",
          minWidth: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          //   alignItems: "center",
        }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={2}
        >
          <Add
            sx={{
              color: "#fff",
              fontSize: 34,
            }}
          />
          <Box>
            <Typography variant="h4" color={"#fff"}>
              Varanasi
            </Typography>
          </Box>
          <Settings
            sx={{
              color: "#fff",
              fontSize: 34,
            }}
          />
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          p={2}
          gap={2}
        >
          <Box
            display={"flex"}
            alignItems={"start"}
            justifyContent={"center"}
            gap={1}
          >
            <Typography variant="h2">16</Typography>
            <Typography variant="h4">o</Typography>
            <Typography variant="h2">C</Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"start"}
            justifyContent={"center"}
            gap={2}
          >
            <Typography variant="h2">Clear</Typography>
            <Box
              display={"flex"}
              alignItems={"start"}
              justifyContent={"center"}
              //   gap={1}
            >
              <Box
                display={"flex"}
                alignItems={"start"}
                justifyContent={"center"}
              >
                <Typography variant="h2">29</Typography>
                <Typography variant="h4">o</Typography>
              </Box>
              <Typography variant="h2">/</Typography>
              <Box
                display={"flex"}
                alignItems={"start"}
                justifyContent={"center"}
              >
                <Typography variant="h2">8</Typography>
                <Typography variant="h4">o</Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Chip
              size="large"
              label={"AQI Poor"}
              sx={{
                padding: "20px",
                fontSize: "24px",
              }}
            />
          </Box>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={4}
          gap={2}
        >
          <Box
            sx={{
              flex: 1,
              borderRadius: 2,
              boxShadow: "0 0 5px black",
              background: "rgba(0,0,0,0.8)",
              minHeight: 200,
            }}
          ></Box>
          <Box
            sx={{
              flex: 1,
              borderRadius: 2,
              boxShadow: "0 0 5px black",
              background: "rgba(0,0,0,0.8)",
              minHeight: 200,
            }}
          ></Box>
          <Box
            sx={{
              flex: 2,
              borderRadius: 2,
              boxShadow: "0 0 5px black",
              background: "rgba(0,0,0,0.8)",
              minHeight: 200,
            }}
          ></Box>
          <Box
            sx={{
              flex: 1,
              borderRadius: 2,
              boxShadow: "0 0 5px black",
              background: "rgba(0,0,0,0.8)",
              minHeight: 200,
            }}
          ></Box>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={4}
          gap={2}
        >
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <Typography variant="body1">Data provided by</Typography>
            <img src="/ow.png" width={"60px"} />
          </Box>
          <Tooltip
            arrow
            placement="left"
            title={
              <React.Fragment>
                <Link
                  href="https://www.freepik.com/free-photo/cloud-blue-sky_1017702.htm#query=weather&position=6&from_view=search&track=sph"
                  target="_blank"
                  sx={{
                    color: "#fff",
                  }}
                >
                  Background Image by jannoon028 on Freepik
                </Link>
              </React.Fragment>
            }
          >
            <Info />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

Home.propTypes = {};

export default Home;
