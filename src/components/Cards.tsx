import { Box } from "@mui/material";
import CoffeeIcon from "@mui/icons-material/Coffee";
import card from "../card.svg";
import { useAppContext } from "../Context";
import { useCallback, useEffect, useState } from "react";
import { ScoreT, SessionT } from "../session";

const CARDS: ScoreT[] = [1, 2, 3, 5, 8, "c", "?"];

const SYMBOLS_MAP: Record<string, React.ReactNode> = {
  c: <CoffeeIcon />,
};

export const Cards = () => {
  const { session, user } = useAppContext();
  const [issue, setIssue] = useState<SessionT["issue"] | null>(null);

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

  const vote = (value: ScoreT) => {
    if (!session || !user) {
      return;
    }

    session.vote(user, value);
  };

  const canVote =
    issue?.name && !issue.scores?.find((item) => item.userId === user?.id);

  return (
    <Box display="flex" justifyContent="center" mb={8} gap={2}>
      {CARDS.map((item) => {
        return (
          <Box
            key={item}
            component="button"
            onClick={() => vote(item)}
            sx={{
              background: "transparent",
              border: "none",
              filter: `grayscale(${canVote ? 0 : "100%"})`,
              pointerEvents: canVote ? "auto" : "none",
              "&:hover div": {
                background: "white",
                color: "black",
                filter: "hue-rotate(20deg);",
                transform: "translateY(-20px) rotate3d(0, 1, 0, 180deg)",

                "& span": {
                  transform: "scale(-1, 1)",
                },
              },
            }}
          >
            <Box
              sx={{
                color: "white",
                fontSize: "2rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 120,
                background: `url(${card})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                filter: "hue-rotate(90deg);",
                transition: "filter 0.2s, transform 0.2s",
              }}
            >
              <span>{SYMBOLS_MAP[item] ?? item}</span>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
