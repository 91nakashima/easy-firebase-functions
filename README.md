# インストール

```bash
npm install easy-firebase-functions
```

# 使い方

```bash
const { easySetData } = require('easy-firebase-functions')

easySetData({
  collection: 'anime',
  doc: {
    title: 'ナルト',
    Character: ['ナルト', 'サスケ', 'サクラ'],
    }
})
```

# おまけ

下記が作成したドキュメントに自動追加される

```bash
{
  created_at: new Date(),
  id: document id
}
```
