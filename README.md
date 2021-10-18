# インストール

```bash
npm install easy-firebase-functions
```

# 使い方

登録と更新ができます。 doc に `id` を追加すると、ドキュメント ID の指定・id が一致したドキュメントの更新を行えます。

```bash
const { easySetData } = require('easy-firebase-functions')

easySetData({
  collection: 'anime',
  doc: {
    title: 'ナルト',
    character: ['ナルト', 'サスケ', 'サクラ'],
    }
})
```

サブコレクションの場合

```bash
easySetData({
  collection: 'anime/*****/animeDetail',
  doc: {
    title: 'ナルト',
    character: ['ナルト', 'サスケ', 'サクラ'],
    id: '*****'
    }
})
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
easySetData({
  collection: 'anime/docId/',
  doc: {}
})

easySetData({
  collection: 'anime/',
  doc: {}
})

easySetData({
  collection: '/anime',
  doc: {}
})
```
