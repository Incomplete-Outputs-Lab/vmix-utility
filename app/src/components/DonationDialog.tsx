import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Grid2,
  SvgIcon,
} from '@mui/material';
import { FavoriteOutlined, Star } from '@mui/icons-material';
import { openUrl } from '@tauri-apps/plugin-opener';
import { useState } from 'react';
import { SvgIconProps } from '@mui/material/SvgIcon';

const TwitchIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M3 0 0 4v17h6v3h3l3-3h5l7-7V0H3zm18 11-3 3h-5l-3 3v-3H5V2h16v9zm-9-5h2v5h-2V6zm5 0h2v5h-2V6z" />
  </SvgIcon>
);

interface DonationDialogProps {
  open: boolean;
  onClose: (permanently: boolean) => void;
}

const DonationDialog = ({ open, onClose }: DonationDialogProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    onClose(dontShowAgain);
  };

  const openInBrowser = (url: string) => {
    openUrl(url);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FavoriteOutlined color="error" />
          <span>Support vmix-utility</span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Thank you for using vmix-utility!
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          This project is open source and completely free to use.
          If you find it helpful, please consider supporting its continued development via Twitch subscriptions.
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>💡 Did you know?</strong> If you have Amazon Prime, you can subscribe for free each month via Prime Gaming! Twitch subscriptions don't auto-renew, so you can choose to support the project every month.
        </Typography>

        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#9146FF',
                '&:hover': { backgroundColor: '#772CE8' },
                height: '56px',
                fontSize: '1.1rem',
              }}
              startIcon={<TwitchIcon />}
              onClick={() => openInBrowser('https://subs.twitch.tv/flowingspdg')}
              fullWidth
            >
              Subscribe on Twitch
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#FFA500',
                color: '#FFA500',
                '&:hover': {
                  borderColor: '#FF8C00',
                  backgroundColor: 'rgba(255, 165, 0, 0.08)',
                },
              }}
              startIcon={<Star />}
              onClick={() => openInBrowser('https://github.com/Incomplete-Outputs-Lab/vmix-utility')}
              fullWidth
            >
              Star on GitHub
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#13C3FF',
                color: '#13C3FF',
                '&:hover': {
                  borderColor: '#0FA8CC',
                  backgroundColor: 'rgba(19, 195, 255, 0.08)',
                },
              }}
              startIcon={<FavoriteOutlined />}
              onClick={() => openInBrowser('https://github.com/sponsors/FlowingSPDG')}
              fullWidth
            >
              GitHub Sponsors
            </Button>
          </Grid2>
        </Grid2>

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Don't show this again
              </Typography>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DonationDialog;
