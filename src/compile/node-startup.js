import {
  NS_IN_MS,
  BUFFER_STARTUP_SIZE,
  BUFFER_TYPE_INDEX,
  BUFFER_DURATION_INDEX,
  BUFFER_NODE_INDEX,
  BUFFER_V8_INDEX,
  BUFFER_BOOTSTRAP_INDEX,
  BUFFER_ENVIRONMENT_INDEX,
  BUFFER_LOOP_INDEX,
  TEMPLATE_PERFORMANCE_INSTANCE,
  TEMPLATE_PERFORMANCE_TIMING,
  TEMPLATE_SOCKET_CLASS,
  TEMPLATE_SOCKET_INSTANCE,
  TEMPLATE_BUFFER,
} from "../constants.js";
import { compileFiles } from "./utils.js";

export const compileStartupNode = () => compileFiles("startup", async ({
  body,
  benchmark,
}) => {
  console.log("CUSTOM START - startup");

  const content = `
    import { performance as ${TEMPLATE_PERFORMANCE_INSTANCE} } from "node:perf_hooks";

    const ${TEMPLATE_PERFORMANCE_TIMING} = ${TEMPLATE_PERFORMANCE_INSTANCE}.nodeTiming;

    import { Socket as ${TEMPLATE_SOCKET_CLASS} } from "node:net";

    ${body.code}

    ${benchmark.code}

    const ${TEMPLATE_SOCKET_INSTANCE} = new ${TEMPLATE_SOCKET_CLASS}({ fd: 3, readable: true, writable: true });
    const ${TEMPLATE_BUFFER} = Buffer.alloc(${BUFFER_STARTUP_SIZE});

    ${TEMPLATE_BUFFER}.writeUInt32LE(0, ${BUFFER_TYPE_INDEX});
    ${TEMPLATE_BUFFER}.writeUInt32LE(parseInt(${TEMPLATE_PERFORMANCE_TIMING}.duration * ${NS_IN_MS}), ${BUFFER_DURATION_INDEX});
    ${TEMPLATE_BUFFER}.writeUInt32LE(parseInt(${TEMPLATE_PERFORMANCE_TIMING}.nodeStart * ${NS_IN_MS}), ${BUFFER_NODE_INDEX});
    ${TEMPLATE_BUFFER}.writeUInt32LE(parseInt(${TEMPLATE_PERFORMANCE_TIMING}.v8Start * ${NS_IN_MS}), ${BUFFER_V8_INDEX});
    ${TEMPLATE_BUFFER}.writeUInt32LE(parseInt(${TEMPLATE_PERFORMANCE_TIMING}.bootstrapComplete * ${NS_IN_MS}), ${BUFFER_BOOTSTRAP_INDEX});
    ${TEMPLATE_BUFFER}.writeUInt32LE(parseInt(${TEMPLATE_PERFORMANCE_TIMING}.environment * ${NS_IN_MS}), ${BUFFER_ENVIRONMENT_INDEX});
    ${TEMPLATE_BUFFER}.writeUInt32LE(parseInt(${TEMPLATE_PERFORMANCE_TIMING}.loopStart * ${NS_IN_MS}), ${BUFFER_LOOP_INDEX});

    ${TEMPLATE_SOCKET_INSTANCE}.write(${TEMPLATE_BUFFER});
  `;

  console.log("CUSTOM END - startup");

  return content;
});
