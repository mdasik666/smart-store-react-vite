import { Alert, Snackbar } from "@mui/material";

const SnackbarAlert = (props: any) => {
  const { snackopen, setSnackOpen } = props
  
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen({ open: false, severity: undefined, message: "" });
  };
  return (
    snackopen.open && <Snackbar open={snackopen.open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={handleClose} severity={snackopen.severity} sx={{ width: '100%' }}>
        {snackopen.message}
      </Alert>
    </Snackbar>
  )


}

export default SnackbarAlert;