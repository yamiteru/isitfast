const binary = (brand, bytes) => ({ brand, bytes });

const u8 = binary('u8', 1);
const u32 = binary('u32', 4);
const u64 = binary('u64', 8);

const tuple = (binary_types) => {
  let bytes = 0;
  let brand = "";

  for (const [key, value] of Object.entries(binary_types)) {
    brand += `(${key})${value.brand}; `;
    bytes += value.bytes;
  }

  return binary(`[${brand}]`, bytes);
};

const slice = (binary_type, length) => {
  const brand = `[${binary_type.brand}; ${length}]`;
  const bytes = binary_type.bytes * length;

  return binary(brand, bytes);
};

const measurement_start = tuple({
  type: u8,
  start_time: u32,
  node_start: u32,
  v8_start: u32,
  environment: u32,
  loop_start: u32,
  idle_time: u32,
});

const measurement_iteration = tuple({
  // general
  type: u8,

  // gc
  more_gc: u8,
  gc_type: u8,
  gc_cost: u32,

  // before
  before_cpu: u64,
  before_ram: u32,
  before_involuntary_context_switches: u32,
  before_voluntary_context_switches: u32,
  before_minor_page_faults: u32,
  before_major_page_faults: u32,

  // after
  after_cpu: u64,
  after_ram: u32,
  after_involuntary_context_switches: u32,
  after_voluntary_context_switches: u32,
  after_minor_page_faults: u32,
  after_major_page_faults: u32,
});

console.log({
  measurement_start,
  measurement_iteration
});
