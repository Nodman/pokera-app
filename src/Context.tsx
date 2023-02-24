import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Session, UserT } from "./session";

type ContextDataT = {
  sessionId: null | string;
  user: UserT | null;
  status: STATUS;
  startSession: (id: string | undefined, name: string) => Promise<void>;
  updateUser: (name: string) => void;
  session: Session | null;
  setStatus: Dispatch<React.SetStateAction<STATUS>>;
};

export enum STATUS {
  "IDLE",
  "LOADING",
  "SUCCESS",
  "FAIL",
}

const getFromStorage = (storage: Storage, key: string) => {
  const value = storage.getItem(key);

  try {
    if (value) {
      return value;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const AppContext = createContext<null | ContextDataT>(null);

export const useAppContext = () => {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error("value is null");
  }

  return value;
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sessionId, setSessionId] = useState<null | string>(null);
  const [user, setUser] = useState<null | UserT>(null);
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [session, setSession] = useState<null | Session>(null);

  useEffect(() => {
    if (status === STATUS.IDLE) {
      setStatus(STATUS.LOADING);
      const id = getFromStorage(localStorage, "sessionId");
      const user = getFromStorage(localStorage, "user");

      if (user) {
        setUser(JSON.parse(user));
      }
      if (id) {
        setSessionId(id);
      }

      setStatus(STATUS.SUCCESS);
    }
  }, [status]);

  const startSession = async (id: string | undefined, name: string) => {
    if (!name) {
      return;
    }

    setStatus(STATUS.LOADING);

    const nextUser = user ?? { id: uuidv4(), name };

    if (nextUser.name !== name) {
      nextUser.name = name;
    }

    localStorage.setItem("user", JSON.stringify(nextUser));

    setUser(nextUser);

    const session = new Session(id);

    await session.start(nextUser);

    setSession(session);

    localStorage.setItem("sessionId", session.id);
    setSessionId(session.id);
  };

  const updateUser = (name: string) => {
    if (name === user?.name) {
      return;
    }
  };

  return (
    <AppContext.Provider
      value={{
        sessionId,
        user,
        status,
        startSession,
        setStatus,
        updateUser,
        session,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
