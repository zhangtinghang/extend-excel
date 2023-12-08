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
      extensions: ['.js'],
      // Optional peer deps of ws. Native deps that are mostly for performance.
      // Since ws is not that perf critical for us, just ignore these deps.
      ignore: ['bufferutil', 'utf-8-validate']
    }),
    json(),
    isProduction && terser()
  ]
}

const sharedNodeOptions = defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false
  },
  output: {
    dir: path.resolve(__dirname, 'dist'),
    name: 'extend-excel',
    entryFileNames: `[name].js`,
    chunkFileNames: 'chunks/dep-[hash].js',
    exports: 'named',
    format: 'esm',
    externalLiveBindings: false,
    freeze: false
  },
  onwarn(warning, warn) {
    // node-resolve complains a lot about this but seems to still work?
    if (warning.message.includes('Package subpath')) {
      return
    }
    // we use the eval('require') trick to deal with optional deps
    if (warning.message.includes('Use of eval')) {
      return
    }
    if (warning.message.includes('Circular dependency')) {
      return
    }
    warn(warning)
  }
})

function createNodeConfig(isProduction) {
  return defineConfig({
    ...sharedNodeOptions,
    input: {
      index: path.resolve(__dirname, 'src/index.ts')
    },
    output: [
      {
        ...sharedNodeOptions.output,
        sourcemap: !isProduction
      },
      isProduction && {
        ...sharedNodeOptions.output,
        entryFileNames: `[name].min.js`,
        chunkFileNames: 'chunks/dep-[hash].min.js',
        plugins: [terser()]
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies))
    ],
    plugins: createNodePlugins(
      isProduction,
      !isProduction,
      // in production we use api-extractor for dts generation
      // in development we need to rely on the rollup ts plugin
      isProduction ? false : path.resolve(__dirname, 'dist')
    )
  })
}

function createCjsConfig(isProduction) {
  return defineConfig({
    ...sharedNodeOptions,
    input: {
      index: path.resolve(__dirname, 'src/index.ts')
    },
    output: [
      {
        ...sharedNodeOptions.output,
        entryFileNames: `[name].cjs`,
        chunkFileNames: 'chunks/dep-[hash].js',
        format: 'cjs',
        sourcemap: true
      },
      isProduction && {
        ...sharedNodeOptions.output,
        entryFileNames: `[name].min.cjs`,
        chunkFileNames: 'chunks/dep-[hash].min.js',
        format: 'cjs',
        sourcemap: false,
        plugins: [terser()]
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies))
    ],
    plugins: [
      ...createNodePlugins(isProduction, !isProduction, false),
      bundleSizeLimit(120)
    ]
  })
}

/**
 * Guard the bundle size
 *
 * @param limit size in KB
 */
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
  // return defineConfig([])
  return defineConfig([
    createNodeConfig(isProduction),
    createCjsConfig(isProduction)
  ])
}
