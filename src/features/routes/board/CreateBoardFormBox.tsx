"use client"

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation'
import { useIsAuth } from '@/hooks/auth/useIsAuth';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import MenuSelectBox from '@/features/common/create/MenuSelectBox';
import type { User } from 'firebase/auth';
import { auth } from '@/app/firebase';
import { onAuthStateChanged, getAuth } from "firebase/auth"
import LoginPage from '@/features/routes/accounts/login/LoginPage';
import BoardViewForm from '@/features/common/forms/board/BoardViewForm';
import { BoardModel } from '@/types/board/Board';
import { useInsertBoard } from '@/hooks/board/useInsertBoard';
import GameForm from '@/features/common/forms/game/GameForm';
import dayjs from 'dayjs';
import LoadingPage from '@/components/LoadingPage';

type PageProps = {
    allContents: Array<any>,
    setContents: any,
    setIsLoading: Function,
    setMenu: Function,
    date: Date | String
}

export default function CreateBoardFormBox({ allContents, setContents, setIsLoading, setMenu, date }: PageProps) {
    const params = useParams()
    const router = useRouter()
    const [boardContents, setBoardContents] = React.useState(new BoardModel(dayjs(String(date)).format('YYYY-MM-DD')));


    const InsertBoardContents = async (contents, image) => {
        setIsLoading(true)
        setMenu(false)
        await useInsertBoard(contents, image).then((data) => {
            const resultContents = allContents.slice()
            resultContents.unshift(data)
            setContents([...resultContents])
            setIsLoading(false)
        })
    }

    return (
        <Container maxWidth="sm" sx={{ px: 0, minHeight: "100vh", overflowY: "hidden", position: "relative", zIndex: 1500 }}>
            <BoardViewForm contents={boardContents} postData={InsertBoardContents} onClose={() => { setMenu(false) }} />
        </Container>
    )
}