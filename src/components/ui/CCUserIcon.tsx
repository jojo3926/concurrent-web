import { type User } from '@concurrent-world/client'
import { CCAvatar } from './CCAvatar'
import { useApi } from '../../context/api'
import { useEffect, useState } from 'react'
import { type SxProps } from '@mui/material'

export interface CCUserIconProps {
    ccid?: string
    user?: User
    sx?: SxProps
}

export const CCUserIcon = (props: CCUserIconProps): JSX.Element => {
    const api = useApi()
    const [user, setUser] = useState<User | null | undefined>(props.user)

    useEffect(() => {
        if (user !== undefined) return
        if (!props.ccid) return
        api.getUser(props.ccid).then((user) => {
            setUser(user)
        })
    }, [props.ccid])

    return <CCAvatar sx={props.sx} avatarURL={user?.profile?.payload.body.avatar} identiconSource={user?.ccid ?? ''} />
}
