/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
    '*.{mjs,js,jsx}': (files) => [
        `npx prettier --write ${files.join(' ')}`,
        `npx eslint ${files.join(' ')} --fix`,
        `node scripts/lint.js --js --fix --only -- ${files.join(' ')}`,
        `npx standard ${files.join(' ')} --fix`,
    ],

    '{!*.d.ts,*.{mts,ts,tsx}}': (files) => [
        `npx prettier --write ${files.join(' ')}`,
        `npx eslint ${files.join(' ')} --fix`,
        `npx ts-standard ${files.join(' ')} --fix`,
    ],

    '*.d.ts': (files) => [`npx prettier --write ${files.join(' ')}`],

    '{!(CHANGELOG.md|UNSUPPORTED_VERSIONS.md|**/changes/v*),*.md}': (files) => {
        const mdOnly = files.filter((f) => f.endsWith('.md') && ['CHANGELOG.md', 'UNSUPPORTED_VERSIONS.md'])
        return [
            `npx textlint ${mdOnly.join(' ')} --fix`,
            `npx markdownlint-cli2 "!{CHANGELOG.md,node_modules/**,out/**}" ${mdOnly.join(' ')} --fix`,
        ]
    },

    '*.{gn,gni}': ['npm run gn-check', 'npm run gn-format'],

    '*.{png,jpeg,jpg,gif,svg}': 'imagemin-lint-staged',

    '*.css': (files) => [
        `stylelint --fix ${files.filter().join(' ')}`,
        `prettier --write ${files.join(' ')}`,
    ],

    '{*.patch,.patches}': (files) => [
        `node scripts/lint.js --patches --only -- ${files.join(' ')}`,
        `ts-node scripts/js/check-patch-diff.ts ${files.join(' ')}`,
    ],

    '*.{yml,yaml}': (files) => [`npx prettier ${files.join(' ')} --write`],

    '*.json': (files) => [`npx eslint ${files.join(' ')} --fix`],
};
