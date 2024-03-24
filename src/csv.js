export const row = (values) => `${values.join(",")}\n`;
export const header = (values) => `${values.map((v) => `"${v}"`).join(",")}\n`;
