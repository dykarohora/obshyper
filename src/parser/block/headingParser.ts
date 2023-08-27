import type { Parser } from '@dykarohora/funser/types'
import type { Heading } from '../../types/index.js'

export const headingParser: Parser<Heading> =
	({ input, position = 0 }) => {
		throw new Error(`Not implemented`)
	}
