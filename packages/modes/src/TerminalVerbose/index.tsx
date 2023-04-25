import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { sub } from "ueve/async";
import {$benchmarkEnd, $benchmarkStart, $offsetEnd, $offsetStart, $suiteEnd, $suiteStart} from "@isitfast/events";
import {Either, BenchmarkResult, SuiteAny, Type} from "@isitfast/types";
import { Box, render, Text } from "ink";
import {Loading} from "../components/Loading.js";

type Props = { suite: SuiteAny };

export const TerminalVerbose: FunctionComponent<Props> = ({ suite }) => {
  const [, _] = useState({});
  const _suiteName = useRef<Either<[string, null]>>(null);
  const _benchmarks = useRef<Record<string, { type: Type, data?: { cpu: BenchmarkResult, ram: BenchmarkResult } }>>({});
  const _benchmarkNames = useRef<string[]>([]);
  const _offsets = useRef<Record<string, Either<[BenchmarkResult, null]>>>({} as never);
  const _offsetNames = useRef<string[]>([]);
  const _longestBenchmarkName = useRef<number>(0);
  // TODO: get rid of this and use a proper state management solution
  const forceRender = useCallback(() => _({}), []);

  useEffect(() => {
    const unsubs = [
      sub($suiteStart, async ({ suiteName, benchmarkNames }) => {
        _suiteName.current = suiteName;
        _longestBenchmarkName.current = Math.max(...benchmarkNames.map((v) => v.length));

        forceRender();
      }),
      sub($suiteEnd, async () => {
        forceRender();
      }),
      sub($benchmarkStart, async ({ benchmarkName, type }) => {
        _benchmarks.current[benchmarkName] = { type };
        _benchmarkNames.current.push(benchmarkName);

        forceRender();
      }),
      sub($benchmarkEnd, async ({ benchmarkName, data }) => {
        _benchmarks.current[benchmarkName].data = data;

        forceRender();
      }),
      sub($offsetStart, async ({ type, mode }) => {
        const name = `${type}-${mode}`;
        _offsets.current[name] = null;
        _offsetNames.current.push(name);

        forceRender();
      }),
      sub($offsetEnd, async ({ type, mode, offset }) => {
        const name = `${type}-${mode}`;
        _offsets.current[name] = offset;

        forceRender();
      })
    ];

    suite.run();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return (
    <Box flexDirection="column">
      <Text bold={true} color="white">
        {_suiteName.current}
      </Text>

      <Box flexDirection="column" marginTop={1}>
        {_benchmarkNames.current.map((name) => {
          const { type, data } = _benchmarks.current[name];
          const paddedName = name.padEnd(_longestBenchmarkName.current);
          const offsetCpu = _offsets.current[`${type}-cpu`]?.median || 0
          const offsetRam = _offsets.current[`${type}-ram`]?.median || 0
          const isLoading = data === undefined;
          const cpuRaw = data?.cpu.median || 0;
          const ramRaw = data?.ram.median || 0;
          const cpu = cpuRaw - offsetCpu;
          const ram = ramRaw - offsetRam;

          return (
            <Text key={name}>
              {paddedName} {isLoading ? <Loading />: `${cpu} | ${ram}`}
            </Text>
          );
        })}
      </Box>

      <Box flexDirection="column" marginTop={1}>
        {_offsetNames.current.map((name) => {
          const [type, mode] = name.split("-");
          const offset = _offsets.current[name];
          const isLoading = offset === null;

          return (
            <Text key={name}>{type} {mode} {isLoading ? <Loading />: offset.median}</Text>
          );
        })}
      </Box>
    </Box>
  );
};

export const useTerminalVerbose = (suite: SuiteAny) => render(<TerminalVerbose suite={suite} />);
