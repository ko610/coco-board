"use client"

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation'
import Box from '@mui/material/Box';
import Button from '@mui/material-next/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import ja from 'date-fns/locale/ja'
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { BoardModel, BoardType } from '@/types/board/Board';
import { FrameType } from '@/types/board/Frame';


type pageProps = {
    setOpen: Function,
    board: BoardType,
    onSubmit: any
}

export default function BoardInfoForm({ setOpen, board, onSubmit }: pageProps) {
    const [title, setTitle] = React.useState(undefined);
    const [comment, setComment] = React.useState(undefined);
    const [titleError, setTitleError] = React.useState(false);

    return (
        <Box sx={{
            zIndex: 2100,
            position: "relative", borderRight: "solid 0.5px #b2b2b2", borderLeft: "solid 0.5px #b2b2b2", backgroundColor: "#fbfbfb"
        }}>
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={{
                    '& .MuiTextField-root': { m: 1 },
                    marginBottom: "30px",
                    minHeight: "100vh"
                }}
                noValidate
                autoComplete="off"
                method='POST'
            >
                <Box sx={{ position: 'sticky', top: 0, backgroundColor: "white", zIndex: 100 }} >
                    <Grid sx={{ px: 1, height: "50px" }} container direction="row" alignItems="center" justifyContent="space-between">
                        <Grid >
                            <Button size="small" sx={{ color: 'black' }} variant='text' onClick={(event) => { setOpen(false) }}>
                                <Typography fontSize={13} component="p">
                                    キャンセル
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid >
                            <Button size="small" sx={{ backgroundColor: "#2e7d32 !important" }} variant='filled' type='submit'>
                                <Typography fontSize={13} component="p">
                                    記録する
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider />
                </Box>

                <Box>
                    <Box sx={{ my: 1, px: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: 13, mb: 0.5, color: "black" }} component="div">
                            タイトル
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined">
                            {/* </InputLabel sx={{ fontSize: 14 }} shrink={title != undefined} error={titleError} htmlFor="outlined-adornment-title">タイトル</InputLabel> */}
                            <OutlinedInput

                                required
                                id="outlined-adornment-title"
                                name="title"
                                aria-describedby="outlined-title-helper-text"
                                value={board.title}
                                error={titleError}
                                onSelect={() => { setTitleError(false) }}
                                onChange={newValue => {
                                    board.title = newValue.target.value
                                    setTitle(newValue.target.value)
                                }}
                                inputProps={{ style: { fontSize: 13 } }}
                                size="small"
                                notched={title != undefined}
                            />
                            {!!titleError && (
                                <FormHelperText error id="accountId-error">
                                    {"入力してください。"}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Box>

                    <Box sx={{ my: 1, px: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: 13, mb: 0.5, color: "black" }} component="div">
                            ボードの説明
                        </Typography>
                        <Typography variant="h6" sx={{ fontSize: 12, mb: 1, color: "#666" }} component="div">
                            フォーメーションの説明やシーンの説明など
                        </Typography>
                        <OutlinedInput
                            inputProps={{ style: { fontSize: 13 } }}
                            multiline
                            minRows={1}
                            value={board.comment}
                            onChange={newValue => {
                                board.comment = newValue.target.value
                                setComment(newValue.target.value)
                            }}
                            size="small"
                            fullWidth
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}


