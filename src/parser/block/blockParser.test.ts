import { blockParser } from './blockParser.js'

describe('describe', () => {
	it('ブロックコンテンツをパースできる', () => {
		const input = `
## ルール内容

1. 引用の装飾(callout)だけに使用する
2. 使用可能なAdmotion Typeは以下に限定する
\t- info
\t- warning
\t- danger
\t- check

### 判断基準

> [!info]
> ノートや見出しの内容とは直接関係はないが、補足となる情報や関連する情報を書きたいときに使う

> [!warning]
> トラブルの元になりそうなことを注意喚起したいときに使う

> [!danger]
> 致命的なダメージを受けてしまうことを予防したいときに使う

> [!check]
> 

## 理由

- 判断基準を定義し、どのAdmotion Typeを使うべきか迷う時間を減らすため
- [[開発/Obshyper/🗺️Obshyper|Obshyper]]にてパース対象のAdmotion Typeを限定するため
`

		const result = blockParser({ input })
		expect(result.type).toEqual('Success')
	})
})
