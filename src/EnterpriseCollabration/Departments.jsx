import { Box } from '@mui/material'
import React from 'react'
import EnterpriseDashboard from './EnterpriseDashboard'

const Departments = () => {
  return (
    <Box style={{display:"flex"}}>
        <Box style={{width:"300px",}}><EnterpriseDashboard /></Box>
        <Box style={{width:"700px", marginTop:"70px",}}>
          <h1>Department</h1>
        </Box>
    </Box>
  )
}

export default Departments