import { benchmark, Suite } from "@isitfast/suite";
import {
  sub,
  $sample,
  $benchmarkEnd,
  $offsetEnd,
  $benchmarkStart,
  $iterationEnd,
} from "@isitfast/events";
import { writeFile, appendFile } from "fs/promises";

// sub($benchmarkEnd, async (v) => console.log("END", {
//   cpu: v.data.cpu.deviation.standard.percent,
//   ram: v.data.ram.deviation.standard.percent
// }, v));
// sub($offsetEnd, async (v) => console.log("OFFSET", v));

const samples: number[] = [];

let index = 0;

sub($iterationEnd, async (v) => {
  if (v.mode === "cpu") {
    await appendFile(
      "./test.json",
      `${index > 0 ? "," : ""}{"index":${index},"value":${v.data},"ignore":${
        v.isFluke
      }}`,
    );
    index += 1;
  }
});

sub($benchmarkStart, async (v) => {
  await writeFile("./test.json", "[");
});

sub($benchmarkEnd, async (v) => {
  console.log(v);
  await appendFile("./test.json", "]");
});

let result = 0;
const data = [...new Array(1_000)].map(() => Math.random() * 10);

benchmark(() => {
  for (let i = 0; i < data.length; ++i) {
    result = data[i];
  }
});

// new Suite("Empty functions")
//   .add("empty async", async function () {
//     /* */
//   })
//   .add("empty sync", function () {
//     /* */
//   })
//   .run();

// new Suite("Array loops")
//   .setup(() => ({
//     result: { _: 0 },
//     data: [...new Array(1_000)].map(() => Math.random() * 10),
//   }))
//   .add("for", ({ result, data }) => {
//     for (let i = 0; i < data.length; ++i) {
//       result._ = data[i];
//     }
//   })
//   .add("while", ({ result, data }) => {
//     let i = -1;
//
//     while (++i < data.length) {
//       result._ = data[i];
//     }
//   })
//   .add("forOf", ({ result, data }) => {
//     for (const v of data) {
//       result._ = v;
//     }
//   })
//   .add("forEach", ({ result, data }) => {
//     data.forEach((v) => (result._ = v));
//   })
//   .run();

// benchmark(() => {
//   data.forEach((v) => {
//     result = v;
//   });
// });
