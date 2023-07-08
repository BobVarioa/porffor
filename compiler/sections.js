import { Valtype, FuncType, Empty, ExportDesc, Section, Magic, ModuleVersion, Opcodes } from './wasmSpec.js';
import { encodeVector, encodeString, encodeLocal } from './encoding.js';
import { number } from './embedding.js';

const createSection = (type, data) => [
  type,
  ...encodeVector(data)
];

const allImportFuncs = [ 'p', 'c', 'a' ];

export default (funcs, globals, tags, flags) => {
  const types = [], typeCache = {};

  const optLevel = parseInt(process.argv.find(x => x.startsWith('-O'))?.[2] ?? 1);

  const getType = (params, returns) => {
    const hash = `${params.join(',')}_${returns.join(',')}`;
    if (optLog) log('sections', `getType(${JSON.stringify(params)}, ${JSON.stringify(returns)}) -> ${hash} | cache: ${typeCache[hash]}`);
    if (optLevel >= 1 && typeCache[hash] !== undefined) return typeCache[hash];

    const type = [ FuncType, ...encodeVector(params), ...encodeVector(returns) ];
    const idx = types.length;

    types.push(type);

    return typeCache[hash] = idx;
  };

  let importFuncs = [];

  if (optLevel < 1) {
    importFuncs = allImportFuncs;
  } else {
    // tree shake imports
    for (const f of funcs) {
      for (const inst of f.wasm) {
        if (inst[0] === Opcodes.call && inst[1] < allImportFuncs.length) {
          const idx = inst[1];
          const func = allImportFuncs[idx];
          if (!importFuncs.includes(func)) importFuncs.push(func);

          inst[1] = importFuncs.indexOf(func);
          // if (optLog) console.log(`treeshake: rewrote call for ${func} (${idx} -> ${importFuncs.indexOf(func)})`);
        }
      }
    }

    // fix call indexes for non-imports
    const delta = allImportFuncs.length - importFuncs.length;
    for (const f of funcs) {
      f.index -= delta;

      for (const inst of f.wasm) {
        if (inst[0] === Opcodes.call && inst[1] >= allImportFuncs.length) {
          inst[1] -= delta;
        }
      }
    }
  }

  if (optLog) log('sections', `treeshake: using ${importFuncs.length}/${allImportFuncs.length} imports`);

  const importSection = importFuncs.length === 0 ? [] : createSection(
    Section.import,
    encodeVector(importFuncs.map((x, i) => [ 0, ...encodeString(x), ExportDesc.func, getType([ valtypeBinary ], []) ]))
  );

  const funcSection = createSection(
    Section.func,
    encodeVector(funcs.map(x => getType(x.params, x.returns))) // type indexes
  );

  const globalSection = Object.keys(globals).length === 0 ? [] : createSection(
    Section.global,
    encodeVector(Object.keys(globals).map(_ => [ valtypeBinary, 0x01, ...number(0).flat(), Opcodes.end ]))
  );

  const exports = funcs.filter(x => x.export).map((x, i) => [ ...encodeString(x.name === 'main' ? 'm' : x.name), ExportDesc.func, x.index ]);

  const usesMemory = funcs.some(x => x.memory);
  const memorySection = !usesMemory ? [] : createSection(
    Section.memory,
    encodeVector([ [ 0x00, 0x01 ] ])
  );

  // export memory if used
  if (usesMemory) exports.unshift([ ...encodeString('$'), ExportDesc.mem, 0x00 ]);

  const tagSection = tags.length === 0 ? [] : createSection(
    Section.tag,
    encodeVector(tags.map(x => [ 0x00, getType(x.params, x.results) ]))
  );

  // export first tag if used
  if (tags.length !== 0) exports.unshift([ ...encodeString('0'), ExportDesc.tag, 0x00 ]);

  const exportSection = createSection(
    Section.export,
    encodeVector(exports)
  );

  const codeSection = createSection(
    Section.code,
    encodeVector(funcs.map(x => {
      const locals = Object.values(x.locals).sort((a, b) => a.idx - b.idx).slice(x.params.length).sort((a, b) => a.idx - b.idx);

      let localDecl = [], typeCount = 0, lastType;
      for (let i = 0; i < locals.length; i++) {
        const local = locals[i];
        if (i !== 0 && local.type !== lastType) {
          localDecl.push(encodeLocal(typeCount, lastType));
          typeCount = 0;
        }

        typeCount++;
        lastType = local.type;
      }

      if (typeCount !== 0) localDecl.push(encodeLocal(typeCount, lastType));

      return encodeVector([ ...encodeVector(localDecl), ...x.wasm.flat().filter(x => x !== null), Opcodes.end ]);
    }))
  );

  const typeSection = createSection(
    Section.type,
    encodeVector(types)
  );

  if (process.argv.includes('-sections')) console.log({
    typeSection: typeSection.map(x => x.toString(16)),
    importSection: importSection.map(x => x.toString(16)),
    funcSection: funcSection.map(x => x.toString(16)),
    globalSection: globalSection.map(x => x.toString(16)),
    exportSection: exportSection.map(x => x.toString(16)),
    codeSection: codeSection.map(x => x.toString(16))
  });

  return Uint8Array.from([
    ...Magic,
    ...ModuleVersion,
    ...typeSection,
    ...importSection,
    ...funcSection,
    ...memorySection,
    ...tagSection,
    ...globalSection,
    ...exportSection,
    ...codeSection
  ]);
};