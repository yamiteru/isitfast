import { join } from "node:path";
import { parseFile } from "@swc/core";

const span = { start: 0, end: 0, ctxt: 0 };

const clean = (v) => {
  if(typeof v === "object" && v !== null) {
    if (Array.isArray(v)) {
      const res = [];

      for(let i = 0; i < v.length; ++i) {
        res[i] = clean(v[i]);
      }

      return res;
    } else {
      const keys = Object.keys(v);
      const res = {};

      for(let i = 0; i < keys.length; ++i) {
        const key = keys[i];

        if(key === "span") {
          res.span = span;
        } else {
          res[key] = clean(v[key]);
        }
      }

      return res;
    }
  } else {
    return v;
  }
};

(async () => {
  const path = join(process.cwd(), process.env.FILE);
  const ast = await parseFile(path);
  console.log(JSON.stringify(clean(ast), null, 2));
})();
