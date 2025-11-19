# 🌤️ 天気ダッシュボード（Weather Dashboard）

**Next.js / Prisma / MySQL / Heroku**

ブラウザ上で **都市の天気検索・表示・お気に入り登録・PDF 出力・会員管理** を行える Web アプリケーションです。  
Next.js App Router と Prisma を採用し、**認証 / メール検証 / パスワードリセット / 管理者ページ** を備えたフルスタック構成になっています。

---

## 📌 主な特徴

- Next.js App Router（13+）を使用したモダンな構成
- Prisma ORM によるスキーマ管理
- JawsDB MySQL（Heroku）を使用
- 都市の **現在の天気 + 5 日間予報** の表示
- お気に入り都市を保存・解除
- 天気情報を JSON 形式でキャッシュ（`WeatherCache`）
- 会員登録 / ログイン / メール認証 / パスワードリセット
- 管理者による会員一覧・検索・並び替え・CSV 出力
- 都市別の天気情報を PDF で出力

---

## 🖥️ デモ（サンプル）

> 下記URLにあります。
> 
> https://weather-dashboard-xxxx.herokuapp.com](https://weather-dashboard-naoki2025-b551ca7a0859.herokuapp.com/auth/login
> 
> テストアカウント
> 
> 一般会員
>
> ユーザーID：user@example.com　パスワード：Test1234
> 
> 管理者
>
> ユーザーID：admin@example.com パスワード：Test1234
> 

---
## 📸 画面サンプル

<table>
  <tr>
    <td align="center">
      <strong>天気ダッシュボード（検索 & 現在の天気）</strong><br>
      <img src="./docs/sample1.png" width="380">
    </td>
    <td align="center">
      <strong>天気ダッシュボード（5日間予報）</strong><br>
      <img src="./docs/sample2.png" width="380">
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center">
      <strong>管理者ページ（会員一覧）</strong><br>
      <img src="./docs/sample3.png" width="600">
    </td>
  </tr>
</table>

---

## 🚀 技術スタック

| 分類            | 使用技術                             |
|-----------------|--------------------------------------|
| フロント / SSR  | Next.js 14（App Router）            |
| UI / CSS        | Tailwind CSS                        |
| API / BFF       | Next.js Route Handlers              |
| DB / ORM        | MySQL（JawsDB） / Prisma            |
| デプロイ        | Heroku（Node Buildpack）            |
| 認証            | メール認証 / パスワードリセット     |
| 外部 API        | OpenWeatherMap API                  |

---

## 📱 画面一覧（一般ユーザー）

### ■ ログインページ

- ログインフォーム  
- 会員登録ページへのリンク  
- パスワード再設定ページへのリンク  

### ■ 会員登録ページ

- メール認証によるユーザー作成  
- 登録完了後、メール内リンクから本登録

### ■ 天気ダッシュボード

- 都市検索
- 都市一覧表示
- 天気表示（現在 + 5 日間予報）
- お気に入り追加・削除
- 会員情報ページへの遷移
- 天気情報の PDF 出力

### ■ 会員情報編集ページ

- 入力フォーム（氏名 / 郵便番号 / 住所 / 電話番号）
- 更新ボタンで会員情報を変更

### ■ パスワード再設定フロー

- メールアドレス入力 → リセット用メール送信
- メール内リンク（トークン）でパスワード編集ページへ遷移
- 新しいパスワードを設定・保存

---

## 🛠️ 管理者機能（/admin）

- 会員一覧表示
- 検索 / 絞り込み
- 並び替え
- 会員情報編集
- CSV 出力
- ログアウト

---

## 🗂️ ER 図（実装準拠）

![ER Diagram](./docs/ERD.drawio.png)

## 🔄画面遷移図（一般ユーザー）
![ER Diagram](./docs/status_diagram_member.drawio.png)

## 🔄画面遷移図（管理者）
![ER Diagram](./docs/status_diagram_admin.drawio.png)

## 🧪 テスト方法

### 1.依存関係インストール
- npm install

### 2. .env.local を作成
- DATABASE_URL="mysql://user:pass@localhost:3306/weather_dashboard"
- OPENWEATHER_API_KEY="XXXX"
- NEXT_PUBLIC_BASE_URL="http://localhost:3000"

### 3.Prisma マイグレーション
- npx prisma migrate dev

### 4.開発サーバー起動
- npm run dev

### 5.ブラウザで動作確認
- http://localhost:3000

## ☁️ デプロイ手順（Heroku）

### 1.Heroku アプリ作成
- heroku create weather-dashboard-xxxx

### 2.JawsDB MySQL 追加
- heroku addons:create jawsdb:kitefin

### 3.環境変数設定
- heroku config:set OPENWEATHER_API_KEY=XXXX
- heroku config:set NEXT_PUBLIC_BASE_URL="https://weather-dashboard-xxxx.herokuapp.com"（DATABASE_URL は自動設定）

### 4.デプロイ
- git push heroku main

### 5.Heroku URL で動作確認

## 📄 ライセンス
- MIT License。商用・個人利用どちらも可。LICENSE ファイルを参照。

