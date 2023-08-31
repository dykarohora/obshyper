import { eof, newline, or, pipe } from '@dykarohora/funser'

export const lineEndParser = pipe(
	newline,
	or(eof)
)
