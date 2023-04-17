import { FunctionComponent, useEffect, useState } from "react";
import { sub } from "ueve/async";
import {$benchmarkEnd, $benchmarkStart, $suiteEnd, $suiteStart} from "@isitfast/events";
import {Either, Offset, SuiteAny} from "@isitfast/types";
import { Box, render, Text } from "ink";

type Props = { suite: SuiteAny };

export const TerminalVerbose: FunctionComponent<Props> = ({ suite }) => {
  const [suiteName, setSuiteName] = useState<Either<[string, null]>>(null);
  const [benchmarks, setBenchmarks] = useState<{ name: string, data?: { cpu: Offset; ram: Offset; } }[]>([]);
  const [, setEnd] = useState(false);

  useEffect(() => {
    const unsubs = [
      sub($suiteStart, async ({ suiteName }) => {
        setSuiteName(suiteName);
      }),
      sub($suiteEnd, async () => {
        setEnd(true);
      }),
      sub($benchmarkStart, async ({ benchmarkName }) => {
        setBenchmarks((v) => [...v, { name: benchmarkName}]);
      }),
      sub($benchmarkEnd, async ({ data }) => {
        setBenchmarks((v) => {
          const last = v[v.length - 1];

          if(last) last.data = data;

          return v;
        });
      }),
    ];

    suite.run();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <Box flexDirection="column">
      <Text bold={true} color="whiteBright">{suiteName}</Text>


      <Box flexDirection="column" marginTop={1}>
        {benchmarks.map(({ name, data }) => (
          <Text key={name}>
            {name} - {data?.cpu.median}({data?.cpu.iterations}) - {data?.ram.median}({data?.ram.iterations})
          </Text>)
        )}
      </Box>
    </Box>
  );
};

export const useTerminalVerbose = (suite: SuiteAny) => render(<TerminalVerbose suite={suite} />);
