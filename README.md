# fish-beat

## 概要

魚類のためのクソオーディオプレイヤーアプリ
<img width="539" alt="image" src="https://github.com/ritogk/fish-beat/assets/72111956/df9213aa-b82d-4b30-a4f9-d1bf421ae237">


https://fish-beat.homisoftware.net/

## デプロイ

```
npm run build
cd infra
cp .env.base .env
vim .env
cdk deploy --all
```
