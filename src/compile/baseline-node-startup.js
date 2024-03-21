import { join } from "path";
import {
  ISITFAST_BASELINE_PATH,
  BASELINE_BENCHMARK_NAME,
  BUFFER_STARTUP_SIZE,
  BUFFER_TYPE_INDEX,
  BUFFER_DURATION_INDEX,
  TEMPLATE_BENCHMARK,
  TEMPLATE_GENERATOR,
  TEMPLATE_PERFORMANCE_TIMING,
  TEMPLATE_SOCKET_CLASS,
  TEMPLATE_SOCKET_INSTANCE,
  TEMPLATE_BUFFER,
} from "../constants.js";
import { writeCompiledContent } from "./utils.js";

export const baselineCompileStartupNode = async () => {
  await writeCompiledContent(
    join(ISITFAST_BASELINE_PATH, `${BASELINE_BENCHMARK_NAME}-startup.js`),
    `
      const ${TEMPLATE_PERFORMANCE_TIMING} = process.hrtime.bigint();

      import { Socket as ${TEMPLATE_SOCKET_CLASS} } from "node:net";

      const ${TEMPLATE_BENCHMARK} = (value, blackbox) => {
        blackbox(value + value);
      };

      const ${TEMPLATE_GENERATOR} = () => {
        return Math.round(Math.random() * 10);
      };

      const ${TEMPLATE_SOCKET_INSTANCE} = new ${TEMPLATE_SOCKET_CLASS}({ fd: 3, readable: true, writable: true });
      const ${TEMPLATE_BUFFER} = Buffer.alloc(${BUFFER_STARTUP_SIZE});

      ${TEMPLATE_BUFFER}.writeUInt32LE(0, ${BUFFER_TYPE_INDEX});
      ${TEMPLATE_BUFFER}.writeBigUInt64LE(${TEMPLATE_PERFORMANCE_TIMING}, ${BUFFER_DURATION_INDEX});

      ${TEMPLATE_SOCKET_INSTANCE}.write(${TEMPLATE_BUFFER});
    `
  );
};
