#!/usr/bin/env node
/**
 * Scan production Bento for Tamagui v2 incompatibilities.
 * Run: cd apps/web && node scripts/verify-bento-v2.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve('src/tamagui/bento')

/** Must be fully typed (no @ts-nocheck). */
const productionPaths = new Set([
  'forms/inputs/components/inputsParts.tsx',
  'forms/switches/common/switchParts.tsx',
  'forms/checkboxes/common/checkboxParts.tsx',
  'elements/chips/components/chipsParts.tsx',
  'elements/dialogs/Alert.tsx',
])

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else if (/\.tsx?$/.test(entry)) out.push(full)
  }
  return out
}

const checks = [
  [/^(?!\s*\/\/).*from 'react-native'/, 'react-native import'],
  [/@tamagui\/core/, '@tamagui/core import'],
  [/process\.env\.TAMAGUI/, 'process.env.TAMAGUI'],
  [/\$gtSm|\$gtMd|\$gtLg|\$gtXs|\$maxSm|\$maxMd|\$2xl|\$2xs/, 'v1 media token'],
  [/animation=/, 'v1 animation prop (use transition)'],
  [/onHoverIn=|onHoverOut=/, 'v1 hover handlers (use onPointerEnter/Leave)'],
  [/^\/\/ @ts-nocheck/m, '@ts-nocheck in production bento'],
  [/\belevate=\{(?!false\})/, 'v1 elevate prop (use shadow styles)'],
  [/\bboxShadow\b/, 'v1 boxShadow (use shadowColor/shadowOffset/shadowRadius)'],
]

const issues = []
for (const file of walk(root)) {
  const content = readFileSync(file, 'utf8')
  const rel = path.relative(root, file)

  for (const [re, msg] of checks) {
    if (re.test(content)) issues.push(`${rel}: ${msg}`)
  }

  if (productionPaths.has(rel) && /^\/\/ @ts-nocheck/m.test(content)) {
    issues.push(`${rel}: production export must not use @ts-nocheck`)
  }
}

console.log(`Scanned ${walk(root).length} files under tamagui/bento`)
if (issues.length) {
  console.error(`\n${issues.length} issue(s):\n`)
  for (const issue of issues) issues.length && console.error(`  • ${issue}`)
  process.exit(1)
}
console.log('Bento v2 scan: all clear ✅')
