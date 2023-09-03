import type { Parser } from '@dykarohora/funser/types'
import type { CodeSpans } from '../../types/index.js'

export const codeSpansParser: Parser<CodeSpans> =
	({ input, position = 0 }) => {
		throw new Error('not implemented')
	}
