import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../Context";
import { SessionT } from "../session";

export const Issue = () => {
  const [error, setError] = useState<null | string>(null);
  const [open, setOpen] = useState(false);
  const [hostId, setHostId] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { session, user } = useAppContext();
  const [issue, setIssue] = useState<SessionT["issue"] | null>(null);
  const nameInputRef = useRef<HTMLInputElement>();
  const descInputRef = useRef<HTMLInputElement>();

  const onIssueUpdate = useCallback(
    (data: SessionT["issue"]) => {
      console.log("issue update");

      if (!session || !data) {
        return;
      }

      setIssue(data);
    },
    [session]
  );

  useEffect(() => {
    session?.listen(onIssueUpdate, "issue");
    return () => {
      console.log("unsub");
      session?.off();
    };
  }, [session, onIssueUpdate]);

  useEffect(() => {
    session?.listen(setHostId, "hostId");
    return () => {
      console.log("unsub");
      session?.off();
    };
  }, [session]);

  const addIssue = () => {
    const nameInputEl = nameInputRef.current;
    const descInputEl = descInputRef.current;
    if (!session || !nameInputEl || !descInputEl || error) {
      return;
    }

    session.addIssue({
      name: nameInputEl.value,
      description: descInputEl.value,
    });
    setOpen(false);
  };

  return (
    <>
      <Box mt={3}>
        <Box ml="1.5rem">
          <Typography variant="caption">session id: {session?.id}</Typography>

          <IconButton
            onClick={() => {
              if (session) {
                navigator.clipboard.writeText(session.id);
              }
            }}
          >
            <ContentCopyIcon sx={{ width: "1rem", height: "1rem" }} />
          </IconButton>
        </Box>
        <Typography variant="h2">{issue ? issue.name : "--"}</Typography>
        <Typography
          variant="body1"
          sx={{ wordBreak: "break-word", maxWidth: "80vw" }}
        >
          {issue ? issue.description : "host should add next issue to vote for"}
        </Typography>
        {user?.id === hostId ? (
          <IconButton
            sx={{ position: "absolute", top: 20, left: 20 }}
            onClick={handleOpen}
          >
            <BorderColorIcon />
          </IconButton>
        ) : null}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            border: "2px solid #000",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            inputRef={nameInputRef}
            label="Issue name"
            onFocus={() => setError(null)}
            onBlur={(event) => {
              if (event.currentTarget.value) {
                return;
              }

              setError("this filed is required");
            }}
            required
            error={Boolean(error)}
            helperText={
              Boolean(error) ? error : "Ticker number or short description"
            }
            fullWidth
          />
          <Box mt={3} />
          <TextField inputRef={descInputRef} label="description" fullWidth />

          <Box my={2} />
          <Button onClick={() => addIssue()}>Submit</Button>
        </Box>
      </Modal>
    </>
  );
};
