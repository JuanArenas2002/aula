import React, { forwardRef } from 'react';
import { Switch as MuiSwitch } from '@mui/material';

const CustomSwitch = forwardRef((props, ref) => {
  return <MuiSwitch ref={ref} {...props} />;
});

export default CustomSwitch;