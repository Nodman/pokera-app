import { Box, Typography } from "@mui/material";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAppContext } from "../Context";
import { SessionT } from "../session";
import { distributeDots, Point } from "../utils/dots";
import card from "../card-mono.svg";
import "./Table.css";

const cardStyles = {
  left: {
    width: "20px",
    height: "30px",
    top: "50%",
    left: "100%",
    transformOrigin: "center",
    transform: "translate(60%, -50%) rotate(90deg)",
  },
  bottom: {
    width: "20px",
    height: "30px",
    top: "0%",
    left: "50%",
    transform: "translate(-50%, -140%)",
  },
  top: {
    width: "20px",
    height: "30px",
    top: "100%",
    left: "50%",
    transform: "translate(-50%, 40%)",
  },
};

export const Table = () => {
  const { session, user } = useAppContext();
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [players, setPlayers] = useState<
    (Point & { name: string; id: string })[]
  >([]);
  const [score, setScore] = useState<string | null>(null);
  const [issue, setIssue] = useState<SessionT["issue"] | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onUsersUpdate = useCallback(
    (data: SessionT["users"]) => {
      console.log("users update");
      const tableElement = tableRef.current;

      if (!session || !tableElement || !data) {
        return;
      }
      const dots = distributeDots(
        { width: tableElement.clientWidth, height: tableElement.clientHeight },
        data.length
      );

      const players = dots.map((item, index) => {
        const id = data[index].id;
        const name = data[index].name
          .split(" ")
          .map((item, _, array) =>
            item.slice(0, array.length > 1 ? 1 : 2).toUpperCase()
          )
          .join("");
        return { ...item, name, id };
      });

      setPlayers(players);
    },
    [session]
  );

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

  useLayoutEffect(() => {
    session?.listen(onUsersUpdate, "users");
    return () => {
      console.log("unsub");
      session?.off();
    };
  }, [session, onUsersUpdate]);

  useEffect(() => {
    if (issue?.scores == null || !issue.scores.length) {
      setScore(null);
      return;
    }
    if (
      players.every((item) =>
        issue?.scores?.find(({ userId }) => item.id === userId)
      )
    ) {
      const [sum, votes] = issue.scores.reduce(
        (acc, item) => {
          if (typeof item.value === "number") {
            return [acc[0] + item.value, acc[1] + 1];
          }

          return acc;
        },
        [0, 0]
      );

      if (!votes || !sum) {
        setScore("?");
        return;
      }

      const value = sum / votes;

      setScore(Number.isInteger(value) ? value.toString() : value.toFixed(1));
    }
  }, [players, issue]);

  return (
    <Box>
      <div className="Table" ref={tableRef}>
        {players.map((item) => {
          const vote = issue?.scores?.find(({ userId }) => userId === item.id);

          return (
            <Box
              key={`${item.x}-${item.y}`}
              className="Table-player"
              style={{ top: item.y, left: item.x }}
              sx={{
                "&::after": {
                  background: score ? "white" : `url(${card})`,
                  backgroundColor: "white",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  color: "black",
                  content: score ? `'${vote?.value}'` : "''",
                  position: "absolute",
                  display: vote ? "flex" : "none",
                  justifyContent: "center",
                  alignItems: "center",
                  ...cardStyles[item.position],
                },
              }}
            >
              {item.name}
            </Box>
          );
        })}
        <Typography
          sx={{
            textShadow: "1px 1px 2px black",
          }}
          variant="h1"
        >
          {score}
        </Typography>
      </div>
    </Box>
  );
};
