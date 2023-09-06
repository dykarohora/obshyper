export type Heading = {
	type: 'heading'
	depth: 1 | 2 | 3 | 4 | 5 | 6
	children: InlineContent[]
}

export type Text = {
	type: 'text'
	value: string
}

export type CodeSpans = {
	type: 'codeSpans'
	value: string
}

export type Link = {
	type: 'link'
	url: string
	title?: string
	children: InlineContent[]
}

export type Strong = {
	type: 'strong'
	children: InlineContent[]
}

export type BlockContent =
	| Heading

export type InlineContent =
	| Text
	| CodeSpans
	| Strong
