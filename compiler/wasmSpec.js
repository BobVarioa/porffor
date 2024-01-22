import { enumify } from "../util/enum.js";

export const Section = enumify('custom', 'type', 'import', 'func', 'table', 'memory', 'global', 'export', 'start', 'element', 'code', 'data', 'data_count', 'tag');
export const ExportDesc = enumify('func', 'table', 'mem', 'global', 'tag');

export const Mut = enumify('const', 'var');

export const Valtype = {
  i32: 0x7f,
  i64: 0x7e,
  f64: 0x7c,
  v128: 0x7b
};

export const Blocktype = {
  void: 0x40,
};

export const Opcodes = {
  unreachable: 0x00,
  nop: 0x01,

  block: 0x02,
  loop: 0x03,
  if: 0x04,
  else: 0x05,

  try: 0x06,
  catch: 0x07,
  catch_all: 0x19,
  delegate: 0x18,
  throw: 0x08,
  rethrow: 0x09,

  return: 0x0F,

  call: 0x10,
  call_indirect: 0x11,
  return_call: 0x12,
  return_call_indirect: 0x13,

  end: 0x0b,
  br: 0x0c,
  br_if: 0x0d,
  call: 0x10,
  drop: 0x1a,

  local_get: 0x20,
  local_set: 0x21,
  local_tee: 0x22, // set and return value (set and get combined)

  global_get: 0x23,
  global_set: 0x24,

  i32_load: 0x28,
  i64_load: 0x29,
  f64_load: 0x2b,

  i32_load16_s: 0x2e,
  i32_load16_u: 0x2f,

  i32_store16: 0x3b,

  i32_store: 0x36,
  i64_store: 0x37,
  f64_store: 0x39,

  memory_grow: 0x40,

  i32_const: 0x41,
  i64_const: 0x42,
  f64_const: 0x44,

  i32_eqz: 0x45,
  i32_eq: 0x46,
  i32_ne: 0x47,

  i32_lt_s: 0x48,
  i32_le_s: 0x4c,
  i32_gt_s: 0x4a,
  i32_ge_s: 0x4e,

  i32_clz: 0x67,
  i32_ctz: 0x68,
  i32_popcnt: 0x69,

  i32_add: 0x6a,
  i32_sub: 0x6b,
  i32_mul: 0x6c,
  i32_div_s: 0x6d,
  i32_rem_s: 0x6f,

  i32_and: 0x71,
  i32_or: 0x72,
  i32_xor: 0x73,
  i32_shl: 0x74,
  i32_shr_s: 0x75,
  i32_shr_u: 0x76,

  i64_eqz: 0x50,
  i64_eq: 0x51,
  i64_ne: 0x52,

  i64_lt_s: 0x53,
  i64_le_s: 0x57,
  i64_gt_s: 0x55,
  i64_ge_s: 0x59,

  i64_add: 0x7c,
  i64_sub: 0x7d,
  i64_mul: 0x7e,
  i64_div_s: 0x7f,
  i64_rem_s: 0x81,

  i64_and: 0x83,
  i64_or: 0x84,
  i64_xor: 0x85,
  i64_shl: 0x86,
  i64_shr_s: 0x87,
  i64_shr_u: 0x88,
  i64_rotl: 0x89,

  f64_eq: 0x61,
  f64_ne: 0x62,

  f64_lt: 0x63,
  f64_le: 0x65,
  f64_gt: 0x64,
  f64_ge: 0x66,

  f64_abs: 0x99,
  f64_neg: 0x9a,

  f64_ceil: 0x9b,
  f64_floor: 0x9c,
  f64_trunc: 0x9d,
  f64_nearest: 0x9e,

  f64_sqrt: 0x9f,
  f64_add: 0xa0,
  f64_sub: 0xa1,
  f64_mul: 0xa2,
  f64_div: 0xa3,
  f64_min: 0xa4,
  f64_max: 0xa5,
  f64_copysign: 0xa6,

  i32_wrap_i64: 0xa7,
  i64_extend_i32_s: 0xac,
  i64_extend_i32_u: 0xad,

  f32_demote_f64: 0xb6,
  f64_promote_f32: 0xbb,

  f64_convert_i32_s: 0xb7,
  f64_convert_i32_u: 0xb8,
  f64_convert_i64_s: 0xb9,
  f64_convert_i64_u: 0xba,

  f64_reinterpret_i64: 0xbf,

  i32_trunc_sat_f64_s: [ 0xfc, 0x02 ],
  i32_trunc_sat_f64_u: [ 0xfc, 0x03 ],

  memory_copy: [ 0xfc, 0x0a ],

  // simd insts are 0xFD simdop: varuint32
  v128_load: [ 0xfd, 0x00 ],
  v128_const: [ 0xfd, 0x0c ],

  i8x16_shuffle: [ 0xfd, 0x0d ],

  i32x4_splat: [ 0xfd, 0x11 ],
  i32x4_extract_lane: [ 0xfd, 0x1b ],
  i32x4_replace_lane: [ 0xfd, 0x1c ],

  i16x8_extract_lane: [ 0xfd, 0x18 ], // _s
  i16x8_replace_lane: [ 0xfd, 0x1a ],

  i32x4_add: [ 0xfd, 0xae, 0x01 ],
  i32x4_sub: [ 0xfd, 0xb1, 0x01 ],
  i32x4_mul: [ 0xfd, 0xb5, 0x01 ],

  i32x4_dot_i16x8_s: [ 0xfd, 0xba, 0x01 ],
};

export const FuncType = 0x60;
export const Empty = 0x00;

export const Magic = [0x00, 0x61, 0x73, 0x6d];
export const ModuleVersion = [0x01, 0x00, 0x00, 0x00];

export const PageSize = 65536; // 64KiB (1024 * 8)

export const ValtypeSize = {
  i32: 4,
  i64: 8,
  f64: 8,

  // special
  i8: 1,
  i16: 2
};