import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function ModalDialog({ open, onClose, onConfirm, title, dividers, children }: { open: any, onClose?: any, onConfirm: any, title: any, dividers?: any, children: any }) {
  return (
    <Dialog open={open} >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={dividers}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained' color="error">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant='contained' color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalDialog;