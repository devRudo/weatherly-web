import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deviceId: null,
  temperatureUnit: 'C',
  windSpeedUnit: 'km/h',
  pressureUnit: 'mbar',
  nightUpdates: false,
  soundEffects: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

export const { updateSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
