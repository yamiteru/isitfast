import { Command } from "./index.js";
import { InspectContext, useInspectContext } from "src/contexts/inspect.js";

export const inspect: Command = (props) => {
  const value = useInspectContext(props);

  return (
    <InspectContext.Provider value={value}>
      Hello
    </InspectContext.Provider>
  );
};
