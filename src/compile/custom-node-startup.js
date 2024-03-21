import {
  BUFFER_STARTUP_SIZE,
  BUFFER_TYPE_INDEX,
  BUFFER_DURATION_INDEX,
  TEMPLATE_PERFORMANCE_TIMING,
  TEMPLATE_SOCKET_CLASS,
  TEMPLATE_SOCKET_INSTANCE,
  TEMPLATE_BUFFER,
} from "../constants.js";
import { compileFiles } from "./utils.js";

export const customCompileStartupNode = () => compileFiles("startup", async ({
  body,
  benchmark,
}) => {
  console.log("CUSTOM START - startup");

  const content = `
    const ${TEMPLATE_PERFORMANCE_TIMING} = process.hrtime.bigint();

    import { Socket as ${TEMPLATE_SOCKET_CLASS} } from "node:net";

    ${body.code}

    ${benchmark.code}

    const ${TEMPLATE_SOCKET_INSTANCE} = new ${TEMPLATE_SOCKET_CLASS}({ fd: 3, readable: true, writable: true });
    const ${TEMPLATE_BUFFER} = Buffer.alloc(${BUFFER_STARTUP_SIZE});

    ${TEMPLATE_BUFFER}.writeUInt32LE(0, ${BUFFER_TYPE_INDEX});
    ${TEMPLATE_BUFFER}.writeBigUInt64LE(${TEMPLATE_PERFORMANCE_TIMING}, ${BUFFER_DURATION_INDEX});

    ${TEMPLATE_SOCKET_INSTANCE}.write(${TEMPLATE_BUFFER});
  `;

  console.log("CUSTOM END - startup");

  return content;
});
