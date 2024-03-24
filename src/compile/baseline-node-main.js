import { join } from "path";
import {
  ISITFAST_BASELINE_PATH,
  BASELINE_BENCHMARK_NAME,
  BUFFER_MAIN_SIZE,
  BUFFER_TYPE_INDEX,
  BUFFER_CPU_BEFORE_INDEX,
  BUFFER_CPU_AFTER_INDEX,
  BUFFER_RAM_BEFORE_INDEX,
  BUFFER_RAM_AFTER_INDEX,
  TEMPLATE_SOCKET_CLASS,
  TEMPLATE_SOCKET_INSTANCE,
  TEMPLATE_SOCKET_ON_DATA,
  TEMPLATE_BUFFER,
  TEMPLATE_BENCHMARK,
  TEMPLATE_GENERATOR,
  TEMPLATE_TMP,
  TEMPLATE_BLACKBOX,
  BENCHMARKS
} from "../constants.js";
import { writeCompiledContent } from "./utils.js";

export const baselineCompileMainNode = async () => {
  await writeCompiledContent(
    join(ISITFAST_BASELINE_PATH, `${BASELINE_BENCHMARK_NAME}-main.js`),
    `
      import { Socket as ${TEMPLATE_SOCKET_CLASS} } from "node:net";

      const ${TEMPLATE_BENCHMARK} = (value, blackbox) => {
        blackbox(value + value);
      };

      const ${TEMPLATE_GENERATOR} = () => {
        return Math.round(Math.random() * 10);
      };

      let ${TEMPLATE_TMP} = 0;

      const ${TEMPLATE_SOCKET_INSTANCE} = new ${TEMPLATE_SOCKET_CLASS}({ fd: 3, readable: true, writable: true });
      const ${TEMPLATE_BUFFER} = Buffer.alloc(${BUFFER_MAIN_SIZE});

      const ${TEMPLATE_BLACKBOX} = (v) => {
        ${TEMPLATE_TMP} = v;
      }

      const ${TEMPLATE_SOCKET_ON_DATA} = () => {
        const data = ${TEMPLATE_GENERATOR}();

        ${TEMPLATE_BUFFER}.writeUInt32LE(1, ${BUFFER_TYPE_INDEX});

        ${TEMPLATE_BUFFER}.writeBigUInt64LE(process.hrtime.bigint(), ${BUFFER_CPU_BEFORE_INDEX});
        ${TEMPLATE_BUFFER}.writeUInt32LE(process.memoryUsage().heapUsed, ${BUFFER_RAM_BEFORE_INDEX});

        ${TEMPLATE_BENCHMARK}(data, ${TEMPLATE_BLACKBOX});

        ${TEMPLATE_BUFFER}.writeUInt32LE(process.memoryUsage().heapUsed, ${BUFFER_RAM_AFTER_INDEX});
        ${TEMPLATE_BUFFER}.writeBigUInt64LE(process.hrtime.bigint(), ${BUFFER_CPU_AFTER_INDEX});

        ${TEMPLATE_SOCKET_INSTANCE}.write(${TEMPLATE_BUFFER});
      }

      ${TEMPLATE_SOCKET_INSTANCE}.on("data", ${TEMPLATE_SOCKET_ON_DATA});

      ${TEMPLATE_BUFFER}.writeUInt8(0, ${BUFFER_TYPE_INDEX});

      ${TEMPLATE_SOCKET_INSTANCE}.write(${TEMPLATE_BUFFER});
    `
  );
};

