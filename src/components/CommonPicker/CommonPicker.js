import { FormControl, MenuItem, NativeSelect, Select } from "@mui/material";
import React from "react";

const CommonPicker = ({ items, value, handleChange, type }) => {
  return (
    <FormControl size="small" fullWidth sx={{ flex: 1 }}>
      <NativeSelect
        style={{ width: "100%" }}
        value={value}
        onChange={(e) => handleChange(e.target.value, type)}
      >
        {items && Array.isArray(items) && items.length > 0
          ? items.map((item) => {
              return (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              );
            })
          : null}
      </NativeSelect>
    </FormControl>
  );
};

export default CommonPicker;
