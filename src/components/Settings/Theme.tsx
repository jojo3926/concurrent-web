import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography, useTheme } from '@mui/material'
import { ThemeSelect } from './ThemeSelect'
import { ThemeCreator } from '../ThemeCreator'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type User } from '@concurrent-world/client'
import { useApi } from '../../context/api'
import { usePreference } from '../../context/PreferenceContext'
import { type ConcurrentTheme } from '../../model'
import { Themes, loadConcurrentTheme } from '../../themes'
import { DummyMessageView } from '../Message/DummyMessageView'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

export const ThemeSettings = (): JSX.Element => {
    const client = useApi()
    const [themeName, setThemeName] = usePreference('themeName')
    const [customThemes, setCustomTheme] = usePreference('customThemes')
    const theme = useTheme<ConcurrentTheme>()
    const { t } = useTranslation('', { keyPrefix: 'ui' })

    const previewTheme: Record<string, ConcurrentTheme> = useMemo(
        () => Object.fromEntries(Object.keys(Themes).map((e) => [e, loadConcurrentTheme(e)])),
        []
    )

    const renderedCustomThemes = useMemo(
        () => Object.fromEntries(Object.keys(customThemes).map((e) => [e, loadConcurrentTheme(e, customThemes)])),
        [customThemes]
    )

    const [themeAuthor, setThemeAuthor] = useState<User | undefined>(undefined)

    const [menuElem, setMenuElem] = useState<[string, null | HTMLElement]>(['', null])

    useEffect(() => {
        if (theme.meta?.author) {
            client
                .getUser(theme.meta.author)
                .then((e) => {
                    setThemeAuthor(e ?? undefined)
                })
                .catch((_) => {
                    setThemeAuthor(undefined)
                })
        } else {
            setThemeAuthor(undefined)
        }
    }, [theme])

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Box py={1}>
                <Typography variant="h3">Current Theme: {themeName}</Typography>
                <Typography variant="h5">Theme Createor:</Typography>
                <Paper
                    sx={{
                        p: 1
                    }}
                    variant="outlined"
                >
                    <DummyMessageView
                        message={{
                            body: theme.meta?.comment ?? 'I made this theme!'
                        }}
                        user={themeAuthor?.profile?.payload.body}
                        timestamp={
                            <Typography
                                sx={{
                                    backgroundColor: 'divider',
                                    color: 'primary.contrastText',
                                    px: 1,
                                    fontSize: '0.75rem'
                                }}
                            >
                                {t('draft.preview')}
                            </Typography>
                        }
                    />
                </Paper>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="h3">Select Theme:</Typography>
                <ThemeSelect themes={previewTheme} setThemeName={setThemeName} />
                <Divider />
                <ThemeSelect
                    additionalButtonIcon={<MoreHorizIcon />}
                    themes={renderedCustomThemes}
                    setThemeName={setThemeName}
                    onAdditionalButtonClick={(themeName, elem) => {
                        setMenuElem([themeName, elem])
                    }}
                />
            </Box>
            <Divider sx={{ my: 1 }} />
            <ThemeCreator />
            <Menu
                open={Boolean(menuElem[1])}
                onClose={() => {
                    setMenuElem(['', null])
                }}
                anchorEl={menuElem[1]}
            >
                <MenuItem
                    onClick={() => {
                        delete customThemes[menuElem[0]]
                        setCustomTheme({ ...customThemes })
                        setMenuElem(['', null])
                    }}
                >
                    <ListItemIcon>
                        <DeleteForeverIcon />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    )
}
