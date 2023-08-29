import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Popover,
  Popper,
  Slide,
  TextField,
  Tooltip,
  Typography,
  colors,
} from "@mui/material";
import {
  Add,
  ArrowRightAlt,
  ChevronRight,
  Circle,
  Close,
  Download,
  Info,
  NearMe,
  Search,
  Settings,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import axios from "../../utils/axios";
import {
  addLocation,
  setActiveLocationIndex,
  setCurrentLocationId,
  setTimeOfUpdate,
  updateWeatherData,
} from "../../redux/features/locations/locationsSlice";
import { updateSettings } from "../../redux/features/settings/settingsSlice";
import { convertTemp } from "../../utils";
import moment from "moment";
import CommonPicker from "../../components/CommonPicker/CommonPicker";
import { Navigation } from "swiper/modules";
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

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [showSettingsBox, setShowSettingsBox] = useState(false);

  const handleChange = (newValue, key) => {
    dispatch(
      updateSettings({
        key,
        value: newValue,
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const locationDetails = await axios.get("get-location-details", {
        params: {
          city: searchValue,
          limit: 5,
          deviceId: null,
        },
      });
      // console.log(locationDetails.data);
      if (
        locationDetails?.data &&
        Array.isArray(locationDetails?.data) &&
        locationDetails?.data?.length > 0
      ) {
        setSearchData(
          locationDetails.data.map((location) => {
            return {
              ...location,
              id: `${location?.name
                ?.toLowerCase()
                ?.split(" ")
                ?.join("-")}-${location?.state
                ?.toLowerCase()
                ?.split(" ")
                ?.join("-")}-${location?.country
                ?.toLowerCase()
                ?.split(" ")
                ?.join("-")}`,
            };
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddNewLocation = async (location) => {
    dispatch(setTimeOfUpdate(new Date().getTime()));
    // console.log(JSON.stringify(location, null, 2));
    dispatch(
      addLocation({
        ...location,
        id: `${location?.name
          ?.toLowerCase()
          ?.split(" ")
          ?.join("-")}-${location?.state
          ?.toLowerCase()
          ?.split(" ")
          ?.join("-")}-${location?.country
          ?.toLowerCase()
          ?.split(" ")
          ?.join("-")}`,
      })
    );
    try {
      const weatherData = await axios.get("get-weather-data", {
        params: {
          lat: location?.lat,
          lon: location?.lon,
        },
      });
      // console.log('weatherData', JSON.stringify(weatherData?.data, null, 2));
      dispatch(
        updateWeatherData({
          key: "weatherData",
          weatherData: weatherData?.data,
          locationId: location?.id,
        })
      );
      try {
        const airPollutionData = await axios.get("get-air-pollution-data", {
          params: {
            lat: location?.lat,
            lon: location?.lon,
          },
        });
        // console.log(
        //   'air pollution data',
        //   JSON.stringify(airPollutionData?.data, null, 2),
        // );
        dispatch(
          updateWeatherData({
            key: "airPollution",
            weatherData: airPollutionData?.data,
            locationId: location?.id,
          })
        );
      } catch (e) {
        console.log("getAirPollutionDataForCurrentLocationError", e);
      }
    } catch (e) {
      console.log("getWeatherForCurrentLocationError", e);
    }
  };

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
    if (locations && Array.isArray(locations) && locations.length > 0) {
      dispatch(
        setActiveLocationIndex({
          activeLocationIndex: locations.length - 1,
        })
      );
      setCurrenLocationIndex(locations.length - 1);
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
  // console.log(showSearchBox);

  return (
    <Swiper
      parallax={true}
      navigation={true}
      modules={[Navigation]}
      // spaceBetween={50}
      // slidesPerView={3}
      onSlideChange={({ activeIndex }) => {
        dispatch(setActiveLocationIndex({ activeLocationIndex: activeIndex }));
        setCurrenLocationIndex(activeIndex);
      }}
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
                    alignItems={"baseline"}
                    p={2}
                    m={1}
                    gap={1}
                    sx={{
                      borderRadius: 4,
                      position: "relative",
                    }}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"row"}
                      alignItems={"center"}
                      gap={3}
                      position={"relative"}
                    >
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        alignItems={"center"}
                        gap={2}
                      >
                        <img
                          src="/Weatherly.png"
                          width={"40px"}
                          style={{
                            borderRadius: "20px",
                          }}
                        />
                        <Typography
                          style={{
                            textTransform: "uppercase",
                            letterSpacing: 3,
                            fontWeight: "bold",
                            fontSize: "18px",
                          }}
                        >
                          Weatherly
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 1,
                        position: "absolute",
                        top: 24,
                        left: "50%",
                        transform: "translate(-25%, -25%)",
                      }}
                    >
                      <Typography variant="h5" color={"#f3f3f4"}>
                        {locations?.[currentLocationIndex]?.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "row",
                          gap: 2,
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
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setCurrenLocationIndex(index);
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
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setCurrenLocationIndex(index);
                              }}
                            />
                          )
                        )}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        // alignItems: 'center',
                        gap: 2,
                        position: "relative",
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            borderLeft: `1px solid ${theme.palette.primary.main}`,
                            borderTop: `1px solid ${theme.palette.primary.main}`,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                            borderRight: `1px solid ${theme.palette.primary.main}`,
                            borderTopLeftRadius: "24px",
                            borderBottomLeftRadius: "24px",
                            borderTopRightRadius: "24px",
                            borderBottomRightRadius: "24px",
                            display: "flex",
                            position: "relative",
                            alignItems: "center",
                            background: "#1b1b1d",
                            zIndex: 20,
                          }}
                        >
                          <IconButton
                            sx={{
                              background: "#1b1b1d",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setShowSearchBox((prev) => !prev);
                            }}
                          >
                            {showSearchBox ? (
                              <Close
                                sx={{
                                  color: "#f3f3f4",
                                  fontSize: 24,
                                }}
                              />
                            ) : (
                              <Add
                                sx={{
                                  color: "#f3f3f4",
                                  fontSize: 24,
                                }}
                              />
                            )}
                          </IconButton>
                          {showSearchBox ? (
                            <Box
                              sx={{
                                zIndex: 11,
                                borderTopLeftRadius: "0px",
                                borderBottomLeftRadius: "0px",
                                borderTopRightRadius: "24px",
                                borderBottomRightRadius: "24px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <form
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                                onSubmit={handleSubmit}
                              >
                                <TextField
                                  autoFocus
                                  size="small"
                                  variant="outlined"
                                  value={searchValue}
                                  onChange={(e) =>
                                    setSearchValue(e.target.value)
                                  }
                                  sx={{
                                    "& input": {
                                      // paddingLeft: 5.5,
                                    },
                                    "& fieldset": {
                                      borderTopLeftRadius: "24px",
                                      borderBottomLeftRadius: "24px",
                                      borderTopRightRadius: 0,
                                      borderBottomRightRadius: 0,
                                      border: "none",
                                      "& :hover": {},
                                    },
                                  }}
                                />
                                <Button
                                  variant={"contained"}
                                  size="small"
                                  startIcon={<Search />}
                                  type="submit"
                                  sx={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                    borderTopRightRadius: "24px",
                                    borderBottomRightRadius: "24px",
                                    marginRight: "0.5px",
                                  }}
                                >
                                  Search
                                </Button>
                              </form>
                            </Box>
                          ) : null}
                        </Box>
                        {showSearchBox &&
                        searchData &&
                        searchData.length > 0 ? (
                          <Box
                            sx={{
                              background: "#1b1b1d",
                              border: `1px solid ${theme.palette.background.level2}`,
                              borderRadius: 2,
                              maxHeight: 300,
                              overflowY: "scroll",
                              width: 1,
                              position: "absolute",
                              top: 50,
                              left: 0,
                              "&::-webkit-scrollbar": {
                                width: "3px",
                              },
                              "&::-webkit-scrollbar-track": {
                                boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                                webkitBoxShadow:
                                  "inset 0 0 6px rgba(0,0,0,0.00)",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 2,
                              },
                              scrollBehavior: "smooth",
                              zIndex: 20,
                            }}
                          >
                            {searchData &&
                              searchData.length > 0 &&
                              searchData.map((lc) => {
                                return (
                                  <>
                                    <Box
                                      key={`${lc?.name}${lc?.state}${lc?.country}`}
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        padding: 2,
                                      }}
                                    >
                                      <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        gap={1}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: 16,
                                          }}
                                        >
                                          {lc?.name}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                          }}
                                        >
                                          {`${lc?.state}, ${lc?.country}`}
                                        </Typography>
                                      </Box>
                                      <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => {
                                          if (
                                            locations?.find(
                                              (location) =>
                                                location?.id === lc?.id
                                            ) !== undefined
                                          ) {
                                          } else {
                                            handleAddNewLocation(lc);
                                          }
                                        }}
                                        disabled={
                                          locations?.find(
                                            (location) =>
                                              location?.id === lc?.id
                                          ) !== undefined
                                        }
                                      >
                                        {locations?.find(
                                          (location) => location?.id === lc?.id
                                        ) !== undefined ? (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                color: "#fff",
                                              }}
                                            >
                                              Added
                                            </Typography>
                                            <ChevronRight
                                              sx={{
                                                color: "#fff",
                                              }}
                                            />
                                          </Box>
                                        ) : (
                                          <Add
                                            sx={{
                                              color: "#fff",
                                            }}
                                          />
                                        )}
                                      </Button>
                                    </Box>
                                    <Divider
                                      sx={{
                                        width: "100%",
                                        background: "#f3f3f3",
                                      }}
                                    />
                                  </>
                                );
                              })}
                          </Box>
                        ) : null}
                      </Box>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        gap={1}
                        position={"relative"}
                      >
                        <Box
                          sx={{
                            borderLeft: `1px solid ${theme.palette.primary.main}`,
                            borderTop: `1px solid ${theme.palette.primary.main}`,
                            borderBottom: `1px solid ${theme.palette.primary.main}`,
                            borderRight: `1px solid ${theme.palette.primary.main}`,
                            borderTopLeftRadius: "24px",
                            borderBottomLeftRadius: "24px",
                            borderTopRightRadius: "24px",
                            borderBottomRightRadius: "24px",
                            display: "flex",
                            position: "relative",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            sx={{
                              background: "#1b1b1d",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setShowSettingsBox((prev) => !prev);
                            }}
                          >
                            {showSettingsBox ? (
                              <Close
                                sx={{
                                  color: "#f3f3f4",
                                  fontSize: 24,
                                }}
                              />
                            ) : (
                              <Settings
                                sx={{
                                  color: "#f3f3f4",
                                  fontSize: 24,
                                }}
                              />
                            )}
                          </IconButton>
                        </Box>
                        {showSettingsBox ? (
                          <Box
                            sx={{
                              background: "#1b1b1d",
                              border: `1px solid ${theme.palette.background.level2}`,
                              borderRadius: 2,
                              // minHeight: 300,
                              minWidth: {
                                xs: "calc(100vw - 40px)",
                                sm: 300,
                                md: 400,
                              },
                              // overflowY: "scroll",
                              width: "auto",
                              position: "absolute",
                              top: 60,
                              right: 0,
                              zIndex: 19,
                            }}
                          >
                            <Box
                              sx={{
                                padding: 2,
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 14, fontWeight: "bold" }}
                              >
                                UNITS
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: 2,
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    flex: 1,
                                  }}
                                >
                                  Temperature Units
                                </Typography>
                                <CommonPicker
                                  items={[
                                    {
                                      label: "Celsius",
                                      value: "C",
                                    },
                                    {
                                      label: "Fahrenheit",
                                      value: "F",
                                    },
                                  ]}
                                  value={temperatureUnit}
                                  handleChange={handleChange}
                                  type={"temperatureUnit"}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: 2,
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    flex: 1,
                                  }}
                                >
                                  Wind speed units
                                </Typography>
                                <CommonPicker
                                  items={[
                                    {
                                      label: "Kilometers per hour (km/h)",
                                      value: "km/h",
                                    },
                                    {
                                      label: "Meters per second (m/s)",
                                      value: "m/s",
                                    },
                                    {
                                      label: "Miles per hour (mph)",
                                      value: "mph",
                                    },
                                    {
                                      label: "Knot (kn)",
                                      value: "kn",
                                    },
                                  ]}
                                  value={windSpeedUnit}
                                  handleChange={handleChange}
                                  type={"windSpeedUnit"}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: 2,
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    flex: 2,
                                  }}
                                >
                                  Atmospheric pressure units
                                </Typography>
                                <CommonPicker
                                  items={[
                                    {
                                      label: "Hectopascal (hPa)",
                                      value: "hpa",
                                    },
                                    {
                                      label: "Millibar (mbar)",
                                      value: "mbar",
                                    },
                                    {
                                      label: "Millimeter of mercury (mmHg)",
                                      value: "mmhg",
                                    },
                                    {
                                      label: "Inch of mercury (inHg)",
                                      value: "inhg",
                                    },
                                    {
                                      label: "Standard atmosphere (atm)",
                                      value: "atm",
                                    },
                                  ]}
                                  value={pressureUnit}
                                  handleChange={handleChange}
                                  type={"pressureUnit"}
                                />
                              </Box>
                            </Box>
                          </Box>
                        ) : null}
                      </Box>
                    </Box>
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
                    <Box display={"flex"} alignItems={"center"} gap={2}>
                      <Button
                        startIcon={<Download />}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          window.open(
                            "https://play.google.com/store/apps/details?id=com.weatherly",
                            "_blank"
                          )
                        }
                      >
                        Download Android App
                      </Button>
                      <Tooltip
                        arrow
                        placement="left"
                        title={
                          <React.Fragment>
                            <Link
                              href="https://icons8.com/icon/3LC5QTsCuh12/rain-cloud"
                              target="_blank"
                              sx={{
                                color: "#fff",
                                display: "block",
                              }}
                            >
                              Animated cloud gif provided by Icons8
                            </Link>
                            <Link
                              href="https://www.freepik.com/free-photo/cloud-blue-sky_1017702.htm#query=weather&position=6&from_view=search&track=sph"
                              target="_blank"
                              sx={{
                                color: "#fff",
                                display: "block",
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
                </>
              ) : null}
            </Box>
          </SwiperSlide>
        ))
      ) : (
        <Box
          sx={{
            background: "#111015",
            minHeight: "100vh",
            minWidth: "100vw",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src="/loader.gif" />
        </Box>
      )}
    </Swiper>
  );
};

Home.propTypes = {};

export default Home;
