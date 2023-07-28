import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Chip,
  Container,
  Grid,
  IconButton,
  Link,
  Tooltip,
  Typography,
  colors,
} from "@mui/material";
import {
  Add,
  ArrowRightAlt,
  Circle,
  Info,
  NearMe,
  Settings,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "../../utils/axios";
import {
  addLocation,
  setCurrentLocationId,
  setTimeOfUpdate,
  updateWeatherData,
} from "../../redux/features/locations/locationsSlice";
import { convertTemp } from "../../utils";
import moment from "moment";
// linear-gradient(90deg, rgba(87,87,87,0.8049681588505091) 0%, rgba(189,189,189,0.7937322037943293) 68%, rgba(121,121,121,0.7965411925583743) 98%)

const Home = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { locations, timeOfUpdate, currentLocationId, activeLocationIndex } =
    useSelector((state) => state.locations);
  const {
    temperatureUnit,
    windSpeedUnit,
    pressureUnit,
    nightUpdates,
    soundEffects,
  } = useSelector((state) => state.settings);

  const swiperRef = useRef();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationIndex, setCurrenLocationIndex] = useState(
    activeLocationIndex !== undefined ? activeLocationIndex : 0
  );

  useEffect(() => {
    if (
      locations &&
      Array.isArray(locations) &&
      locations.length > 0 &&
      currentLocationId
    ) {
      setCurrentLocation(
        locations.filter((location) => location.id === currentLocationId)[0]
      );
    }
  }, [locations, currentLocationId]);

  useEffect(() => {
    setCurrenLocationIndex(activeLocationIndex);
  }, [activeLocationIndex]);

  useEffect(() => {
    if (navigator && navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          async ({ coords }) => {
            try {
              // Set Current location latitude and longitude
              // Get Current location details from latitude and longitude (city, state, country)
              // Set Current location in locations
              // Get Todays weather report for current location
              // Get 5-days weather report for current location
              // Get 24 hour weather forecast for current location
              // Get Air pollution data for current location
              const locationData = await axios.get("get-rev-geo-loc-details", {
                params: {
                  lat: coords?.latitude,
                  lon: coords?.longitude,
                },
              });
              // console.log(
              //   "current location data",
              //   JSON.stringify(locationData, null, 2)
              // );
              const locationDetail = {
                ...locationData?.data?.[0],
                id: `${locationData?.data?.[0]?.name
                  ?.toLowerCase()
                  ?.split(" ")
                  ?.join("-")}-${locationData?.data?.[0]?.state
                  ?.toLowerCase()
                  ?.split(" ")
                  ?.join("-")}-${locationData?.data?.[0]?.country
                  ?.toLowerCase()
                  ?.split(" ")
                  ?.join("-")}`,
              };
              // console.log(
              //   locations.find(
              //     (location) => location?.id === locationDetail?.id
              //   ) === undefined
              // );
              if (
                locations.find(
                  (location) => location?.id === locationDetail?.id
                ) === undefined &&
                new Date().getTime() - timeOfUpdate > 99999999999
              ) {
                console.log("coming here");
                await dispatch(setTimeOfUpdate(new Date().getTime()));
                await dispatch(addLocation(locationDetail));
                await dispatch(
                  setCurrentLocationId({
                    currentLocationId: locationDetail?.id,
                  })
                );
                try {
                  const weatherData = await axios.get("get-weather-data", {
                    params: {
                      lat: coords?.latitude,
                      lon: coords?.longitude,
                    },
                  });
                  // console.log(
                  //   'weatherData',
                  //   JSON.stringify(weatherData?.data, null, 2),
                  // );
                  await dispatch(
                    updateWeatherData({
                      key: "weatherData",
                      weatherData: weatherData?.data,
                      locationId: locationDetail?.id,
                    })
                  );
                  try {
                    const airPollutionData = await axios.get(
                      "get-air-pollution-data",
                      {
                        params: {
                          lat: coords?.latitude,
                          lon: coords?.longitude,
                        },
                      }
                    );
                    // console.log(
                    //   'air pollution data',
                    //   JSON.stringify(airPollutionData?.data, null, 2),
                    // );
                    await dispatch(
                      updateWeatherData({
                        key: "airPollution",
                        weatherData: airPollutionData?.data,
                        locationId: locationDetail?.id,
                      })
                    );
                  } catch (e) {
                    console.log(
                      "getAirPollutionDataForCurrentLocationError",
                      e
                    );
                  }
                } catch (e) {
                  console.log("getWeatherForCurrentLocationError", e);
                }
              }
            } catch (e) {
              console.log("getLocationDetailError", e);
            }
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.log(
                  "The request was denied. If a message seeking persmission was not displayed then check your browser settings."
                );
                break;
              case error.POSITION_UNAVAILABLE:
                console.log(
                  "The position of the device could not be determined. For instance, one or more of the location providers used in the location acquisition process reported an internal error that caused the process to fail entirely."
                );
                break;
              case error.TIMEOUT:
                console.log(
                  "The request to get user location timed out before the operation could complete."
                );
                break;
              case error.UNKNOWN_ERROR:
                console.log("Something unexpected happened.");
                break;
            }
          },
          {
            enableHighAccuracy: true,
          }
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("browser doesn't support geolocation api");
    }
    // getUniqueId()
    //   .then(uId => {
    //     dispatch(
    //       updateSettings({
    //         key: 'deviceId',
    //         value: uId,
    //       }),
    //     );
    //   })
    //   .catch(err => console.log(err));
    return () => {};
  }, []);

  // console.log(locations);
  // console.log(timeOfUpdate);
  // console.log(currentLocationIndex);

  return (
    <Swiper
    // spaceBetween={50}
    // slidesPerView={3}
    // onSlideChange={() => console.log('slide change')}
    // onSwiper={(swiper) => console.log(swiper)}
    >
      {locations && Array.isArray(locations) && locations.length > 0 ? (
        locations.map((location) => (
          <SwiperSlide>
            <Box
              sx={{
                background: "#111015",
                minHeight: "100vh",
                minWidth: "100vw",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {currentLocation ? (
                <>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    p={2}
                    m={1}
                    sx={{
                      borderRadius: 4,
                    }}
                  >
                    <IconButton
                      sx={{
                        background: "#1b1b1d",
                      }}
                    >
                      <Add
                        sx={{
                          color: "#f3f3f4",
                          fontSize: 24,
                        }}
                      />
                    </IconButton>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography variant="h5" color={"#f3f3f4"}>
                        {location?.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          gap: 10,
                        }}
                      >
                        {locations?.map((location, index) =>
                          location?.id === currentLocationId ? (
                            <NearMe
                              key={index}
                              sx={{
                                fontSize: 20,
                                color:
                                  index === currentLocationIndex
                                    ? "#f1f1f1"
                                    : "#a4a4a4",
                              }}
                            />
                          ) : (
                            <Circle
                              key={index}
                              sx={{
                                fontSize: 8,
                                color:
                                  index === currentLocationIndex
                                    ? "#f1f1f1"
                                    : "#a4a4a4",
                              }}
                            />
                          )
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      sx={{
                        background: "#1b1b1d",
                      }}
                    >
                      <Settings
                        sx={{
                          color: "#f3f3f4",
                          fontSize: 24,
                        }}
                      />
                    </IconButton>
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
                      <Typography variant="h3">
                        {temperatureUnit === "C"
                          ? locations?.[
                              currentLocationIndex
                            ]?.weatherData?.current?.temp?.toFixed(0)
                          : (
                              (locations?.[
                                currentLocationIndex
                              ]?.weatherData?.current?.temp?.toFixed(0) *
                                9) /
                                5 +
                              32
                            ).toFixed(0)}
                      </Typography>
                      <Typography variant="h6">o</Typography>
                      <Typography variant="h3">{temperatureUnit}</Typography>
                    </Box>
                    <Box
                      display={"flex"}
                      alignItems={"start"}
                      justifyContent={"center"}
                      gap={2}
                    >
                      <Typography variant="h3">
                        {locations?.[currentLocationIndex]?.weatherData?.current
                          ?.weather?.[0]?.main || ""}
                      </Typography>
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
                          <Typography variant="h3">
                            {temperatureUnit === "C"
                              ? locations?.[
                                  currentLocationIndex
                                ]?.weatherData?.daily?.[0]?.temp?.max?.toFixed(
                                  0
                                )
                              : convertTemp(
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.daily?.[0]?.temp?.max,
                                  "C",
                                  "F"
                                )}
                          </Typography>
                          <Typography variant="h6">o</Typography>
                        </Box>
                        <Typography variant="h3">/</Typography>
                        <Box
                          display={"flex"}
                          alignItems={"start"}
                          justifyContent={"center"}
                        >
                          <Typography variant="h3">
                            {temperatureUnit === "C"
                              ? locations?.[
                                  currentLocationIndex
                                ]?.weatherData?.daily?.[0]?.temp?.min?.toFixed(
                                  0
                                )
                              : convertTemp(
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.daily?.[0]?.temp?.min,
                                  "C",
                                  "F"
                                )}
                          </Typography>
                          <Typography variant="h6">o</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <Chip
                        size="large"
                        label={`AQI ${
                          locations?.[currentLocationIndex]?.airPollution
                            ?.list?.[0]?.main?.aqi === 1
                            ? "Good"
                            : locations?.[currentLocationIndex]?.airPollution
                                ?.list?.[0]?.main?.aqi === 2
                            ? "Fair"
                            : locations?.[currentLocationIndex]?.airPollution
                                ?.list?.[0]?.main?.aqi === 3
                            ? "Moderate"
                            : locations?.[currentLocationIndex]?.airPollution
                                ?.list?.[0]?.main?.aqi === 4
                            ? "Poor"
                            : locations?.[currentLocationIndex]?.airPollution
                                ?.list?.[0]?.main?.aqi === 5
                            ? "Very Poor"
                            : ""
                        }`}
                        sx={{
                          padding: "20px",
                          fontSize: "20px",
                          background: theme.palette.background.level2,
                          color: "#343a40",
                        }}
                      />
                    </Box>
                  </Box>
                  <Grid container spacing={2} p={2}>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Box
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          // boxShadow: "0 0 5px black",
                          background: "url(/bg.jpg) top center fixed",
                          backgroundSize: "cover",
                          padding: 2,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          position: "relative",
                          height: 1,
                        }}
                      >
                        <Box
                          sx={{
                            background: "rgba(0,0,0,0.8)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 1,
                            height: 1,
                            borderRadius: 2,
                            zIndex: 1,
                          }}
                        ></Box>
                        <Box
                          zIndex={6}
                          display={"flex"}
                          flexDirection={"column"}
                          flex={1}
                        >
                          <Typography>North</Typography>
                          <Typography>
                            {windSpeedUnit === "km/h"
                              ? (
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.daily?.[0]?.wind_speed * 3.6
                                ).toFixed(2)
                              : windSpeedUnit === "m/s"
                              ? locations?.[
                                  currentLocationIndex
                                ]?.weatherData?.daily?.[0]?.wind_speed.toFixed(
                                  2
                                )
                              : windSpeedUnit === "mph"
                              ? (
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.daily?.[0]?.wind_speed * 2.2369
                                ).toFixed(2)
                              : windSpeedUnit === "kn"
                              ? (
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.daily?.[0]?.wind_speed * 1.943844
                                ).toFixed(2)
                              : locations?.[
                                  currentLocationIndex
                                ]?.weatherData?.daily?.[0]?.wind_speed.toFixed(
                                  2
                                )}{" "}
                            {windSpeedUnit}
                          </Typography>
                        </Box>
                        <Box
                          zIndex={5}
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            border: "1px solid #d3d3d3",
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                            position: "relative",
                            padding: 1,
                          }}
                        >
                          <Typography textAlign={"center"}>N</Typography>
                          <Typography
                            sx={{
                              alignSelf: "center",
                              height: 10,
                            }}
                          ></Typography>
                          <Box
                            sx={{
                              width: 1,
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>W</Typography>
                            <Typography>E</Typography>
                          </Box>
                          <Typography
                            sx={{
                              alignSelf: "center",
                              height: 10,
                            }}
                          ></Typography>
                          <Typography
                            sx={{
                              alignSelf: "center",
                            }}
                          >
                            S
                          </Typography>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              position: "absolute",
                              top: 8,
                              left: 8,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ArrowRightAlt
                              name="arrow-projectile"
                              sx={{
                                fontSize: 40,
                                color: "#fff",
                                transform: `rotate(${
                                  -45 +
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.current?.wind_deg
                                }deg)`,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={3}>
                      <Box
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          background: "url(/bg.jpg) top center fixed",
                          backgroundSize: "cover",
                          padding: 2,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          position: "relative",
                          height: 1,
                        }}
                      >
                        <Box
                          sx={{
                            background: "rgba(0,0,0,0.8)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 1,
                            height: 1,
                            borderRadius: 2,
                            zIndex: 1,
                          }}
                        ></Box>
                        <Box
                          zIndex={4}
                          display={"flex"}
                          flexDirection={"column"}
                          gap={2}
                        >
                          <Typography>
                            {moment(
                              locations?.[currentLocationIndex]?.weatherData
                                ?.daily?.[0]?.sunrise * 1000
                            ).format("hh:mm A")}
                          </Typography>
                          <Typography>
                            {moment(
                              locations?.[currentLocationIndex]?.weatherData
                                ?.daily?.[0]?.sunset * 1000
                            ).format("hh:mm A")}
                          </Typography>
                        </Box>
                        <Box
                          zIndex={8}
                          display={"flex"}
                          flexDirection={"column"}
                          gap={2}
                        >
                          <Typography>Sunrise</Typography>
                          <Typography>Sunset</Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <Box
                        sx={{
                          flex: 2,
                          borderRadius: 2,
                          background: "url(/bg.jpg) top center fixed",
                          backgroundSize: "cover",
                          padding: 2,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          position: "relative",
                          height: 1,
                        }}
                      >
                        <Box
                          sx={{
                            background: "rgba(0,0,0,0.8)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 1,
                            height: 1,
                            borderRadius: 2,
                            zIndex: 1,
                          }}
                        ></Box>
                        <Box
                          zIndex={2}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Typography>Humidity</Typography>
                          <Typography>Real Feel</Typography>
                          <Typography>Clouds</Typography>
                          <Typography>Pressure</Typography>
                        </Box>
                        <Box
                          zIndex={3}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            gap: 2,
                          }}
                        >
                          <Typography>
                            {
                              locations?.[currentLocationIndex]?.weatherData
                                ?.current?.humidity
                            }
                            %
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Typography>
                              {temperatureUnit === "C"
                                ? locations?.[
                                    currentLocationIndex
                                  ]?.weatherData?.current?.feels_like.toFixed(0)
                                : convertTemp(
                                    locations?.[currentLocationIndex]
                                      ?.weatherData?.current?.feels_like,
                                    "C",
                                    "F"
                                  )}
                            </Typography>
                            <Typography sx={{ fontSize: 10 }}>o</Typography>
                          </Box>
                          <Typography>
                            {
                              locations?.[currentLocationIndex]?.weatherData
                                ?.current?.clouds
                            }
                            %
                          </Typography>
                          <Typography>
                            {pressureUnit === "mbar" || pressureUnit === "hpa"
                              ? locations?.[currentLocationIndex]?.weatherData
                                  ?.current?.pressure
                              : pressureUnit === "mmhg"
                              ? (
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.current?.pressure * 0.750062
                                ).toFixed(0)
                              : pressureUnit === "inhg"
                              ? (
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.current?.pressure * 0.02953
                                ).toFixed(0)
                              : pressureUnit === "atm"
                              ? (
                                  locations?.[currentLocationIndex]?.weatherData
                                    ?.current?.pressure * 0.000986923
                                ).toFixed(2)
                              : locations?.[currentLocationIndex]?.weatherData
                                  ?.current?.pressure}{" "}
                            {pressureUnit}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
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
                </>
              ) : null}
            </Box>
          </SwiperSlide>
        ))
      ) : (
        <Box>
          <h1>test</h1>
        </Box>
      )}
    </Swiper>
  );
};

Home.propTypes = {};

export default Home;
