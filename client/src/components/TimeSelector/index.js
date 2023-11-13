import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Box, TextField, Button, Typography } from "@mui/material";

const CustomDateInput = forwardRef(({ label, value, onClick }, ref) => (
  <TextField
    size="small"
    label={label}
    ref={ref}
    value={value}
    onClick={onClick}
    sx={{ mr: 2 }}
  />
));

const TimeSelector = () => {
  const [startDate, setStartDate] = useState(new Date("2023/01/01"));
  const [endDate, setEndDate] = useState(new Date("2023/12/25"));

  const handleSearch = () => {
    // TODO: API CALL - POST
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography sx={{ fontWeight: "bold", fontSize: 16.5, mb: 2 }}>
        Time Selector
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          closeOnScroll={true}
          customInput={<CustomDateInput label="Start Date" />}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          showTimeSelect
          closeOnScroll={true}
          customInput={<CustomDateInput label="End Date" />}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default TimeSelector;
