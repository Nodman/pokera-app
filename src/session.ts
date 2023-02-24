import { FirebaseApp } from "firebase/app";
import {
  Database,
  getDatabase,
  ref,
  onValue,
  get,
  set,
  DatabaseReference,
  off,
  child,
  runTransaction,
} from "firebase/database";
import { init } from "./firebase";
import { v4 as uuidv4 } from "uuid";

export type ScoreT = number | "c" | "?";

export type SessionT = {
  id: string;
  issue: {
    id: string;
    name: string;
    description: string;
    scores?: { userId: string; value: ScoreT }[];
  } | null;
  issues: {
    id: string;
    name: string;
    value: ScoreT;
  }[];
  hostId: string;
  users: UserT[];
};

export type UserT = {
  id: string;
  name: string;
};

export type ListenerT = (value: any) => void;

export class Session {
  id: string;
  private db: Database;
  private app: FirebaseApp;
  private ref: DatabaseReference;

  constructor(id?: string) {
    this.app = init();
    this.db = getDatabase(this.app);
    this.id = id ? id : uuidv4();
    this.ref = ref(this.db, `/session/${this.id}`);
  }

  async start(user: UserT) {
    try {
      const snapshot = await get(this.ref);
      const exists = snapshot.exists();
      console.log(exists, snapshot);

      if (!exists) {
        const nextSessionData: SessionT = {
          id: this.id,
          issue: null,
          hostId: user.id,
          issues: [],
          users: [user],
        };
        set(this.ref, nextSessionData);
      } else {
        await runTransaction(
          child(this.ref, "/users"),
          (users: NonNullable<SessionT["users"]>) => {
            if (
              !users ||
              snapshot.val().hostId === user.id ||
              users.find((item) => item.id === user.id)
            ) {
              return users;
            }

            return [...users, user];
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getValue() {
    const snapshot = await get(this.ref);

    return snapshot.val();
  }

  addIssue({ name, description }: { name: string; description: string }) {
    const id = uuidv4();

    const nextIssue: SessionT["issue"] = {
      id,
      name,
      description,
      scores: [],
    };

    set(child(this.ref, "issue"), nextIssue);
  }

  vote(user: UserT, value: ScoreT) {
    runTransaction(
      child(this.ref, "issue/scores"),
      (scores: NonNullable<SessionT["issue"]>["scores"]) => {
        const nextScores = scores ?? [];
        const index = nextScores.findIndex((item) => item.userId === user.id);

        if (index >= 1) {
          return nextScores.map((item) => {
            return item.userId === user.id ? { ...item, value } : item;
          });
        }

        return [...nextScores, { userId: user.id, value }];
      }
    );
  }

  off() {
    off(this.ref);
  }

  listen(listener: ListenerT, entity: string) {
    onValue(child(this.ref, entity), (snapshot) => {
      try {
        const data = snapshot.val();
        listener(data);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
