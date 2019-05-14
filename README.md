# 注意事項
現状、実装段階です。決して本番環境等では利用しないでください。

# firestore-migration
これはfirestoreのdatabaseをmigrationするためのcomman lineツールです。  

# 設定方法
## 環境変数
環境変数として以下を設定してください。  

```
$FS_DIR: migration fileを格納するフォルダのパス  
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
このコマンドでmigrationを行うためのファイルを生成します。FS_DIR環境変数で設定したフォルダに格納してください。

```
fsmigrate -m
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
