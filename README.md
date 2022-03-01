# インストール

Nakashima Package Manager
略して【npm】で入れます。

```bash
npm install easy-firebase-functions
```

# 使い方

```bash
// js
const { easySetDoc, easyGetData, easyDelete } = require('easy-firebase-functions')

// ts
import { easySetDoc, easyGetData, easyDelete } from 'easy-firebase-functions'

// Type
import { EasySetDoc, QueryOption, WhereOption } from 'easy-firebase-functions'
```

# 機能

作成したドキュメント(フィールド)に自動追加されます。

```js
{
  id: string // document id
  created_at: Date
  updated_at?: Date // If it was an update
}
```

登録と更新ができます。 doc に `id` を追加すると、ドキュメント ID の指定・id が一致したドキュメントの更新を行えます。

```js
// create
easySetDoc({
  collection: 'anime',
  doc: {
    title: 'ナルト',
    character: ['ナルト', 'サスケ', 'サクラ']
  }
})

// update or create(add)
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
// get Collection data as an Array
/** @return {array<T>} */
easyGetData('anime', {
  where: [['title', '==', 'ナルト'], ['character', 'array-contains', 'サスケ']],
  orderBy: 'created_at'
  limit: 99,
})

// get document data as an Object
/** @return {Objrct} */
easyGetData('anime/hugahuga')
```

情報の削除

```js
// delete document
easyDelete('anime/hogehoge')
```
