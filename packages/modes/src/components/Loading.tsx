import { Text } from "ink";
import {FunctionComponent, useEffect, useState} from "react";

type Props = {};

export const Loading: FunctionComponent<Props> = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((dotCount) => (dotCount + 1) % 4);
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <Text>{[...new Array(dotCount)].fill(".").join("")}</Text>;
};
