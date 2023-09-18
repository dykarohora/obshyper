export type Heading = {
	type: 'heading'
	depth: 1 | 2 | 3 | 4 | 5 | 6
	children: InlineContent[]
}

export type FenceCodeBlock = {
	type: 'code',
	lang?: string,
	value: string
}

export type Paragraph = {
	type: 'paragraph'
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

export type InternalLink = {
	type: 'internalLink'
	path: string
	text: string
	embedding: boolean
}

export type Strong = {
	type: 'strong'
	children: InlineContent[]
}

export type Emphasis = {
	type: 'emphasis'
	children: InlineContent[]
}

export type BlockContent =
	| Heading
	| FenceCodeBlock

export type InlineContent =
	| Text
	| CodeSpans
	| Strong
	| Emphasis
	| Link
	| InternalLink
