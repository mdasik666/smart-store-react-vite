import { Paper, Stack } from "@mui/material";

const Sspanel = () => {    
    return (
        <Stack spacing={2} direction="row" width={"100%"} height={"100%"} alignItems={"center"} justifyContent={"center"}>
          <Paper sx={{p:2}}>
            Total Products
          </Paper>
          <Paper sx={{p:2}}>
            Total Invoices
          </Paper>
          <Paper sx={{p:2}}>
            Total Uers
          </Paper>
        </Stack>
    )
}

export default Sspanel;