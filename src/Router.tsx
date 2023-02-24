import { Box } from "@mui/material";
import { Cards } from "./components/Cards";
import { Issue } from "./components/Issue";
import { StartScreen } from "./components/StarScreen";
import { Table } from "./components/Table";
import { useAppContext } from "./Context";

export const Router = () => {
  const appContext = useAppContext();

  if (appContext.session) {
    return (
      <Box
        justifySelf="flex-start"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        minHeight="100vh"
      >
        <Issue />
        <Table />
        <Cards />
      </Box>
    );
  }

  return <StartScreen />;
};
