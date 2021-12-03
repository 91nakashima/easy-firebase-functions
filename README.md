# インストール

Nakashima Package Manager
略して【npm】で入れます。

```bash
npm install easy-firebase-functions
```

※ firebase v8

# できること

```bash
const { easySetDoc } = require('easy-firebase-functions')
const { easyGetData } = require('easy-firebase-functions')
```

# 使い方

登録と更新ができます。 doc に `id` を追加すると、ドキュメント ID の指定・id が一致したドキュメントの更新を行えます。

```bash
const { easySetDoc } = require('easy-firebase-functions')

easySetDoc({
  collection: 'anime',
  doc: {
    title: 'ナルト',
    character: ['ナルト', 'サスケ', 'サクラ'],
    }
})
```

For subcollections

```bash
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

```bash
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

```bash
{
  created_at: new Date(),
  id: doc Id
}
```

# よくない例

```bash
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
