# インストール

Nakashima Package Manager
略して【npm】で入れます。

```bash
npm install easy-firebase-functions
```

# できること

```bash
const { easySetDoc } = require('easy-firebase-functions')
const { easyGetData } = require('easy-firebase-functions')
const { easyDelete } = require('easy-firebase-functions')
```

# 使い方

登録と更新ができます。 doc に `id` を追加すると、ドキュメント ID の指定・id が一致したドキュメントの更新を行えます。

```js
const { easySetDoc } = require('easy-firebase-functions')

easySetDoc({
  collection: 'anime',
  doc: {
    title: 'ナルト',
    character: ['ナルト', 'サスケ', 'サクラ']
  }
})
```

```js
easySetDoc({
  collection: 'anime/*****/animeDetail',
  doc: {
    title: 'ナルト',
    character: ['ナルト', 'サスケ', 'サクラ'],
    id: '*****'
  }
})
```

情報の取得ができます。

```js
const { easyGetData } = require('easy-firebase-functions')

/** @return {array} */
easyGetData('anime', {
  where: [['title', '==', 'ナルト'], ['character', 'array-contains', 'サスケ']],
  orderBy: 'created_at'
  limit: 99,
})

/** @return {objrct} */
easyGetData('anime/hugahuga')
```

# おまけ

下記が作成したドキュメントに自動追加されます。

```js
{
  created_at: new Date(),
  id: doc Id
}
```

# Type 情報

```js
import { EasySetDoc, QueryOption, WhereOption } from 'easy-firebase-functions'
```

# よくない例

Path の記述に関して、文字の始めや文字の終わりに`/`を記載するとエラーを返します。

```js
easySetDoc({
  collection: 'anime/docId/',
  doc: {}
})

easySetDoc({
  collection: 'anime/',
  doc: {}
})

easySetDoc({
  collection: '/anime',
  doc: {}
})

easyGetData('/anime/hugahuga')
```
