import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeOfUpdate: 0,
  locations: [],
  currentLocationId: "",
  activeLocationIndex: 0,
  isLoading: false,
};

export const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    addLocation: (state, action) => {
      console.log("coming here 1");
      state.locations = [...state.locations, action.payload];
    },
    removeLocation: (state) => {},
    setCurrentLocationId: (state, action) => {
      state.currentLocationId = action.payload.currentLocationId;
    },
    setActiveLocationIndex: (state, action) => {
      state.activeLocationIndex = action.payload.activeLocationIndex;
    },
    setTimeOfUpdate: (state, action) => {
      state.timeOfUpdate = action.payload;
    },
    updateWeatherData: (state, action) => {
      const locationToBeUpdated = state?.locations?.filter(
        (loc) => loc?.id === action.payload.locationId
      )[0];
      const updatedLocation = {
        ...locationToBeUpdated,
        [action.payload.key]: action.payload.weatherData,
      };
      const updatedLocations = state.locations.map((location) => {
        if (location.id === action.payload.locationId) {
          return updatedLocation;
        } else {
          return location;
        }
      });
      state.locations = updatedLocations;
    },
  },
});

export const {
  addLocation,
  removeLocation,
  setCurrentLocationId,
  setActiveLocationIndex,
  updateWeatherData,
  setTimeOfUpdate,
} = locationsSlice.actions;

export default locationsSlice.reducer;
