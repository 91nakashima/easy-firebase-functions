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

ドキュメントに下記が追加される
created_at: 時間
id: document id
