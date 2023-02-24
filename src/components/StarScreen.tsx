import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";
import { STATUS, useAppContext } from "../Context";

export const StartScreen = () => {
  const appContext = useAppContext();
  const sessionInputRef = useRef<HTMLInputElement>();
  const nameInputRef = useRef<HTMLInputElement>();
  const [error, setError] = useState<null | string>(null);

  const onPlayClick = async () => {
    const sessionInputEl = sessionInputRef.current;
    const nameInputEl = nameInputRef.current;

    if (!sessionInputEl || !nameInputEl?.value) {
      return;
    }

    appContext.setStatus(STATUS.LOADING);
    try {
      await appContext.startSession(sessionInputEl.value, nameInputEl.value);
      appContext.setStatus(STATUS.SUCCESS);
    } catch (error) {
      console.error(error);
      appContext.setStatus(STATUS.FAIL);
    }
  };

  const renderContent = () => {
    return (
      <Box>
        <TextField
          onFocus={() => setError(null)}
          onBlur={(event) => {
            if (event.currentTarget.value) {
              return;
            }

            setError("this filed is required");
          }}
          required
          inputRef={nameInputRef}
          defaultValue={appContext.user?.name}
          label="Name"
          error={Boolean(error)}
          helperText={
            Boolean(error) ? error : "Your name (seen by other participants)"
          }
          fullWidth
        />
        <Box mt={3} />
        <TextField
          inputRef={sessionInputRef}
          defaultValue={appContext.sessionId}
          label="Session ID"
          helperText="leave empty if you want to create new session"
          fullWidth
        />
        <Box my={6} />
        <Button onClick={() => onPlayClick()}>Play</Button>
      </Box>
    );
  };

  return (
    <Container maxWidth="sm">
      {appContext.status === STATUS.LOADING ||
      appContext.status === STATUS.IDLE ? (
        <CircularProgress />
      ) : (
        renderContent()
      )}
    </Container>
  );
};
