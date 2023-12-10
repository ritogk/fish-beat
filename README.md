# fish-beat

## 概要

魚類のためのクソオーディオプレイヤーアプリ
<img width="539" alt="image" src="https://github.com/ritogk/fish-beat/assets/72111956/eec62daf-bf12-4145-8c85-44591d75f308">

https://fish-beat.homisoftware.net/

## デプロイ

```
npm run build
cd infra
cp .env.base .env
vim .env
cdk deploy --all
```
