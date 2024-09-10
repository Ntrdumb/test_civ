import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import dayjs from 'dayjs';

export default function DateRangeSlider({ minDate, maxDate, onChange, selectedRange }) {
  const minDateObj = dayjs(minDate);
  const maxDateObj = dayjs(maxDate);

  const minTime = minDateObj.valueOf();  // Convert minDate to milliseconds
  const maxTime = maxDateObj.valueOf();  // Convert maxDate to milliseconds

  const [range, setRange] = useState([minTime, maxTime]);

  // Update the slider range only when the selectedRange prop changes (not min/max)
  useEffect(() => {
    if (selectedRange) {
      const [startDate, endDate] = selectedRange;
      setRange([dayjs(startDate).valueOf(), dayjs(endDate).valueOf()]);
    }
  }, [selectedRange]);

  const handleSliderChange = (values) => {
    setRange(values);
    const startDate = dayjs(values[0]).format('YYYY-MM-DD');
    const endDate = dayjs(values[1]).format('YYYY-MM-DD');
    onChange([startDate, endDate]); // Notify parent about the new range
  };

  return (
    <div>
      <p>Date Range: {dayjs(range[0]).format('YYYY-MM-DD')} to {dayjs(range[1]).format('YYYY-MM-DD')}</p>
      <Slider
        range
        min={minTime}
        max={maxTime}
        value={range}
        onChange={handleSliderChange}
        step={86400000} // Step in milliseconds (1 day)
        allowCross={false}
      />
    </div>
  );
}
