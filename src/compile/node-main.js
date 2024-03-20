import {
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
  TEMPLATE_BLACKBOX
} from "../constants.js";
import { compileFiles } from "./utils.js";

export const compileMainNode = () => compileFiles("main", async ({
  body,
  generator,
  benchmark,
}) => {
  console.log("CUSTOM START - main");

  const content = `
    import { Socket as ${TEMPLATE_SOCKET_CLASS} } from "node:net";

    ${body.code}

    ${benchmark.code}

    ${generator.code}

    const ${TEMPLATE_SOCKET_INSTANCE} = new ${TEMPLATE_SOCKET_CLASS}({ fd: 3, readable: true, writable: true });
    const ${TEMPLATE_BUFFER} = Buffer.alloc(${BUFFER_MAIN_SIZE});

    let ${TEMPLATE_TMP} = 0;

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
  `;

  console.log("CUSTOM END - main");

  return content;
});
