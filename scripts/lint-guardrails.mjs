/* eslint-disable no-undef */
import fs from 'node:fs/promises'
import path from 'node:path'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const srcRoot = path.join(root, 'src')
const errors = []
const canonicalSpacingScale = new Map([
    ['0rem', '0'],
    ['0.125rem', '0.5'],
    ['0.25rem', '1'],
    ['0.375rem', '1.5'],
    ['0.5rem', '2'],
    ['0.625rem', '2.5'],
    ['0.75rem', '3'],
    ['0.875rem', '3.5'],
    ['1rem', '4'],
    ['1.25rem', '5'],
    ['1.5rem', '6'],
    ['1.75rem', '7'],
    ['2rem', '8'],
    ['2.25rem', '9'],
    ['2.5rem', '10'],
    ['2.75rem', '11'],
    ['3rem', '12'],
    ['3.5rem', '14'],
    ['4rem', '16'],
    ['5rem', '20'],
    ['6rem', '24'],
    ['7rem', '28'],
    ['8rem', '32'],
    ['9rem', '36'],
    ['10rem', '40'],
    ['11rem', '44'],
    ['12rem', '48'],
    ['13rem', '52'],
    ['14rem', '56'],
    ['15rem', '60'],
    ['16rem', '64'],
    ['18rem', '72'],
    ['20rem', '80'],
    ['24rem', '96'],
])

const sourceFiles = await collectSourceFiles(srcRoot)

for (const filePath of sourceFiles) {
    const text = await fs.readFile(filePath, 'utf8')
    const kind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, kind)

    visit(source, (node) => {
        if (!ts.isJsxOpeningLikeElement(node)) {
            if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
                validateTokenString(filePath, source, node, node.text, 'string literal')
            }
            return
        }

        validateClassAttributes(filePath, source, node)
    })
}

if (errors.length > 0) {
    console.error('\nGuardrail lint failed:\n')
    for (const error of errors) {
        console.error(`- ${error}`)
    }
    process.exit(1)
}

console.log('Guardrail lint passed.')

async function collectSourceFiles(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            return collectSourceFiles(entryPath)
        }

        if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
            return [entryPath]
        }

        return []
    }))

    return files.flat()
}

function validateClassAttributes(filePath, source, node) {
    for (const attributeName of ['className', 'class']) {
        const value = getJsxAttributeText(node, attributeName)
        if (!value) {
            continue
        }

        const tokens = value.trim().split(/\s+/).filter(Boolean)
        for (const token of tokens) {
            const suggestion = getCanonicalClassSuggestion(token)
            if (suggestion) {
                errors.push(`
                    ${formatLocation(filePath, source, node)}:
                    ${attributeName} uses \`${token}\`, write \`${suggestion}\` instead.
                `)
            }
        }
    }
}

function validateTokenString(filePath, source, node, value, label) {
    const tokens = value.trim().split(/\s+/).filter(Boolean)
    for (const token of tokens) {
        const suggestion = getCanonicalClassSuggestion(token)
        if (suggestion) {
            errors.push(`${formatLocation(filePath, source, node)}: ${label} uses \`${token}\`, write \`${suggestion}\` instead.`)
        }
    }
}

function getCanonicalClassSuggestion(token) {
    const match = token.match(/^((?:[^:\s]+:)*)((?:-)?(?:p|m)(?:[trblxy])?|gap(?:-[xy])?|space-[xy]|(?:min-|max-)?[wh]|size)-\[(.+)\]$/)
    if (!match) {
        return null
    }

    const [, variants, utility, rawValue] = match
    const normalized = normalizeSpacingValue(rawValue)
    if (!normalized) {
        return null
    }

    const canonical = canonicalSpacingScale.get(normalized)
    if (!canonical) {
        return null
    }

    return `${variants}${utility}-${canonical}`
}

function normalizeSpacingValue(rawValue) {
    const value = rawValue.trim().toLowerCase()
    const remMatch = value.match(/^(-?\d+(?:\.\d+)?)rem$/)
    if (!remMatch) {
        return null
    }

    const numeric = Number(remMatch[1])
    if (!Number.isFinite(numeric)) {
        return null
    }

    return `${numeric}rem`
}

function getJsxAttributeText(node, name) {
    const attribute = node.attributes.properties.find((property) => {
        return ts.isJsxAttribute(property) && property.name.text === name
    })

    if (!attribute || !attribute.initializer) {
        return null
    }

    if (ts.isStringLiteral(attribute.initializer)) {
        return attribute.initializer.text
    }

    if (!ts.isJsxExpression(attribute.initializer) || !attribute.initializer.expression) {
        return null
    }

    if (ts.isStringLiteral(attribute.initializer.expression) || ts.isNoSubstitutionTemplateLiteral(attribute.initializer.expression)) {
        return attribute.initializer.expression.text
    }

    return null
}

function visit(node, cb) {
    cb(node)
    ts.forEachChild(node, (child) => visit(child, cb))
}

function formatLocation(filePath, source, node) {
    const { line } = source.getLineAndCharacterOfPosition(node.getStart())
    return `${relative(filePath)}:${line + 1}`
}

function relative(filePath) {
    return path.relative(root, filePath)
}
