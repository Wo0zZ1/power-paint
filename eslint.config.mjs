import { FlatCompat } from '@eslint/eslintrc'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
})

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	...compat.extends(
		'@feature-sliced/eslint-config/rules/public-api',
		'@feature-sliced/eslint-config/rules/layers-slices',
		'@feature-sliced/eslint-config/rules/import-order',
	),
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
	]),

	{
		rules: {
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/consistent-type-imports': 'error',
			'react/no-unstable-nested-components': 'warn',
			'import/no-duplicates': 'error',
			'import/no-internal-modules': 'off',
		},
	},
])

export default eslintConfig
