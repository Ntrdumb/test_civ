import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import dayjs from 'dayjs';

export default function DateRangeSlider({ minDate, maxDate, onChange }) {
  const minDateObj = dayjs(minDate);
  const maxDateObj = dayjs(maxDate);

  const minTime = minDateObj.valueOf();
  const maxTime = maxDateObj.valueOf();

  const [range, setRange] = useState([minTime, maxTime]);

  useEffect(() => {
    setRange([minTime, maxTime]); // Update the range when min/max dates change
  }, [minDate, maxDate]);

  const handleSliderChange = (values) => {
    setRange(values);
    const startDate = dayjs(values[0]).format('YYYY-MM-DD');
    const endDate = dayjs(values[1]).format('YYYY-MM-DD');
    onChange([startDate, endDate]); // Pass the new date range to the parent component
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
