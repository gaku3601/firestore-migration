# 注意事項
現状、実装段階です。  
ご利用する際はツールの挙動等を理解した上でご利用いただけますと幸いです。

# firestore-migration
これはfirestoreのdatabaseをmigrationするためのcomman lineツールです。  

# 仕組み[バージョンの管理について]
このツールを利用すると、初回に「migrations」というcollectionがrootに作成されます。  
このcollectionでmigrationのバージョン管理を行っております。  
collection内のdocumentIDとmigrationファイル「version_file名.json」のversionを比較し、versionが存在しなかった場合、対象のmigrationファイルを実行するというロジックで制作しています。  

# 設定方法
## 環境変数
環境変数として以下を設定してください。  

```
$FS_KEY: gcpのサービスアカウントkey(json)をBase64でdecodeした文字列
```

### FS_KEYの作り方
[ここを](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=ja)参考に、IAM>サービスアカウントからkeyを発行します。jsonのkeyファイルをダウンロードしたら、以下コマンドでBase64デコードを行います。

```
cat [jsonkeyファイルパス] | base64 -w 0
```

出力された文字列をFS_KEY環境変数に設定すればOKです。

## インストール
npm or yarnで以下コマンドでinstallしてください。

```
npm install -g firestore-migration
or
yarn global add firestore-migration
```

# 使い方

```
fsmigrate -c [ファイル名]
```
このコマンドでmigrationを行うためのファイルを生成します。

```
fsmigrate -m [スクリプト格納フォルダパス]
```
migration -cで生成したファイルからmigrationを実施します。

# ファイルの記述方法
## Field Add
対象コレクションへのフィールドの追加を行う場合、以下のように記述します。  

```
{
   "method": "ADD",
   "collection": "tests", // collection nameを記載
   "params": [
      {"name": "propA", "value": "propB"}, // name: フィールド名、value:設定する値
      {"name": "propC", "value": "propD"}
   ]
}
```

## Field Delete
対象コレクションのフィールド削除を行う場合、以下のように記述します。

```
{
   "method": "DEL",
   "collection": "tests",
   "params": [
      {"name": "propA"},
      {"name": "propB"}
   ]
}
```

## Field Modify
コレクション内の対象フィールドの内容を変更する場合、以下のように記述します。

```
{
   "method": "MOD",
   "collection": "tests",
   "params": [
      {"name": "propA", "if":"{propA} === 2 && {propC} === 'val2'","value": 1}, // *1
      {"name": "propC", "value": "val"} //*2
   ]
}
[補足]
*1 if内では'{field名}'で現在格納されているfield内容を取得し、条件式を記述できます。trueの場合、value値を適用します。
*2 強制的にfieldの値をvalue値で上書きします。fieldが存在しない場合、valの値で新たにfieldを作成します。
```

## Change Field Name
Field名の変更を実施する場合、以下のように記述します。

```
{
   "method": "CHANGE_FIELD_NAME",
   "collection": "user",
   "params": [
      {"name": "name", "to": "nickname"},
      {"name": "age", "to": "tosi"}
   ]
}
```

## Delete Collection
Collecitonの削除処理を実施します。  
なお、サブコレクションまでは削除されませんのでご注意ください。  

```
{
   "method": "DELETE_COLLECTION",
   "collection": "test"
}
```

## Aggrigate Store Collection
集計処理を実施します。
例えば以下のようなデータがあり、

```
user
|-doc1{name: gaku}
|-doc2{name: gakuko}

purchese
|-pdoc1{uid: doc1, price: 500}
|-pdoc2{uid: doc2, price: 600}
|-pdoc3{uid: doc1, price: 700}
         ↓
user
|-doc1{name: gaku, priceall: 1200}
|-doc2{name: gakuko, priceall: 600}
```
と集計したい場合、

```
{
   "method": "AGG_COLLECTION",
   "collection": "user",
   "params": [
           {"name": "priceall", "aggCollection": "purchese", "if": "{uid} === $ID", "aggField": "price"}
   ]
}
```
で、aggFieldで指定したFieldの集計値をnameで指定したFieldに格納します。  
ifプロパティで条件を指定することができ、{aggCollectionのフィールド}で値を取得することができます。  
また、$IDと記述することで、collectionで指定したコレクションのdocumentIDを取得します。  

## Aggrigate Store Document
単一documentに集計結果を格納する場合、以下のように記述します。

```
{
   "method": "AGG_DOCUMENT",
   "document": "info/priceAgg",
   "params": [
           {"name": "priceall", "aggCollection": "purchese", "aggField": "price", "if":"{price} < 700"}
   ]
}
```

## Countup Store Collection
対象コレクションのdocument数を集計し格納します。

```
user
|-doc1{name: gaku}
|-doc2{name: gakuko}

purchese
|-pdoc1{uid: doc1, price: 500}
|-pdoc2{uid: doc2, price: 600}
|-pdoc3{uid: doc1, price: 700}
         ↓
user
|-doc1{name: gaku, purcheseCount: 2}
|-doc2{name: gakuko, purchessCount: 1}
```
としたい場合、

```
{
   "method": "COUNTUP_COLLECTION",
   "collection": "user",
   "params": [
           {"name": "purcheseCount", "aggCollection": "purchese", "if": "{uid} === $ID"}
   ]
}
```
とすることで、document数を計測し格納処理を実施します。

## Countup Store Document
単一documentに対象コレクションのdocument数を集計し格納する場合、以下のように記述します。

```
{
   "method": "COUNTUP_DOCUMENT",
   "document": "info/priceAgg",
   "params": [
           {"name": "purcheseAllCount", "aggCollection": "purchese", "if":"{price} < 700"}
   ]
}
```