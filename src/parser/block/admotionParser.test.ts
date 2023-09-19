import { admotionParser } from './admotionParser.js'

describe('admotionParser', () => {
	it.each([
		['info', '> [!info]\n> hello\n\nworld'],
		['warning', '> [!warning]\n> hello'],
		['danger', '> [!danger]\n> hello'],
		['check', '> [!check]\n> hello'],
	])('AdTypeが%sのAdmotionブロックをパースできる', (adType, input) => {
		const result = admotionParser({ input })

		if (result.type === 'Failure') {
			throw new Error(`admotionParser failed: ${result.reason}`)
		}

		const expected = {
			type: 'admotion',
			adType,
			children: [{
				type: 'paragraph',
				children: [{ type: 'text', value: 'hello' }]
			}]
		}

		expect(result.value).toStrictEqual(expected)
	})
})
