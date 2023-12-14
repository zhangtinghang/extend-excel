import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import clear from 'rollup-plugin-clear'

import { defineConfig } from 'rollup'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)).toString()
)

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const sharedOptions = {
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  },
  output: {
    dir: path.resolve(__dirname, 'dist'),
    name: 'extend-excel',
    entryFileNames: `[name].js`,
    exports: 'named'
  },
  onwarn(warning, warn) {
    if (warning.message.includes('Package subpath')) {
      return
    }
    if (warning.message.includes('Use of eval')) {
      return
    }
    if (warning.message.includes('Circular dependency')) {
      return
    }
    warn(warning)
  }
}

function createNodePlugins(isProduction, sourceMap, declarationDir) {
  return [
    clear({
      targets: ['dist']
    }),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      tsconfig: path.resolve(__dirname, './tsconfig.json'),
      sourceMap,
      declaration: declarationDir !== false,
      declarationDir: declarationDir !== false ? declarationDir : undefined
    }),
    commonjs({
      extensions: ['.js']
    }),
    json(),
    isProduction && terser()
  ]
}

function createConfig(format, isProduction) {
  return defineConfig({
    ...sharedOptions,
    input: {
      index: path.resolve(__dirname, 'src/index.ts')
    },
    output: [
      {
        ...sharedOptions.output,
        format: format === 'esm' ? 'esm' : 'cjs',
        sourcemap: !isProduction,
        entryFileNames: `[name].${format === 'esm' ? 'mjs' : 'cjs'}`,
        exports: 'auto'
      },
      isProduction && {
        ...sharedOptions.output,
        format: format === 'esm' ? 'esm' : 'cjs',
        sourcemap: !isProduction,
        entryFileNames: `[name].min.${format === 'esm' ? 'mjs' : 'cjs'}`,
        exports: 'auto',
        plugins: [terser()]
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies))
    ],
    plugins: [
      ...createNodePlugins(
        isProduction,
        !isProduction,
        path.resolve(__dirname, 'dist')
      ),
      format === 'cjs' && bundleSizeLimit(120)
    ]
  })
}

function bundleSizeLimit(limit) {
  return {
    name: 'bundle-limit',
    generateBundle(options, bundle) {
      const size = Buffer.byteLength(
        Object.values(bundle)
          .map((i) => ('code' in i ? i.code : ''))
          .join(''),
        'utf-8'
      )
      const kb = size / 1024
      if (kb > limit) {
        throw new Error(
          `Bundle size exceeded ${limit}kb, current size is ${kb.toFixed(2)}kb.`
        )
      }
    }
  }
}

export default (commandLineArgs) => {
  const isDev = commandLineArgs.watch
  const isProduction = !isDev
  return [
    createConfig('esm', isProduction),
    createConfig('cjs', isProduction),
    createUmdConfig(isProduction) // 添加 UMD 格式的配置
  ]
}

// 添加 UMD 格式的配置
function createUmdConfig(isProduction) {
  return defineConfig({
    ...sharedOptions,
    input: {
      index: path.resolve(__dirname, 'src/index.ts')
    },
    output: [
      {
        ...sharedOptions.output,
        format: 'umd',
        sourcemap: !isProduction,
        entryFileNames: `[name].umd.js`,
        name: 'extendExcel',
        exports: 'auto'
      },
      isProduction && {
        ...sharedOptions.output,
        format: 'umd',
        sourcemap: false,
        entryFileNames: `[name].min.umd.js`,
        name: 'extendExcel',
        exports: 'auto',
        plugins: [terser()]
      }
    ],
    external: [],
    plugins: createNodePlugins(
      isProduction,
      !isProduction,
      path.resolve(__dirname, 'dist')
    )
  })
}
