import { Box, Divider, Typography } from '@mui/material'

export function Notifications(): JSX.Element {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                padding: '20px',
                backgroundColor: 'background.paper',
                minHeight: '100%',
                overflow: 'scroll'
            }}
        >
            <Typography variant="h2" gutterBottom>
                Notifications
            </Typography>
            <Divider />
        </Box>
    )
}
