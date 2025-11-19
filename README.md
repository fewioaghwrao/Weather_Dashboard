🌤️ 天気ダッシュボード（Weather Dashboard）

Next.js / Prisma / MySQL / Heroku

ブラウザ上で 都市の天気検索・表示・お気に入り登録・PDF出力・会員管理 を行える Web アプリケーションです。
Next.js App Router と Prisma を採用し、認証 / メール検証 / パスワードリセット / 管理者ページを備えたフルスタック構成になっています。

📌 主な特徴

Next.js App Router（13+） を使用したモダンな構成

Prisma ORM によるスキーマ管理

JawsDB MySQL（Heroku） を使用

都市の現在の天気 + 5日間予報の表示

お気に入り都市を保存・削除

天気情報を JSON 形式でキャッシュ（WeatherCache）

会員登録 / ログイン / メール認証 / パスワードリセット

管理者による会員一覧・検索・並び替え・CSV 出力

PDF 出力対応（都市別の天気）

🖥️ デモ（サンプル）

デプロイ済み URL があればこちらに記述
例）https://weather-dashboard-xxxx.herokuapp.com

🚀 技術スタック
分類	使用技術
フロント / SSR	Next.js 14（App Router）
UI / CSS	Tailwind CSS
API / BFF	Next.js Route Handlers
DB / ORM	MySQL（JawsDB） / Prisma
デプロイ	Heroku（Node Buildpack）
認証	メール認証 / パスワードリセット
外部 API	OpenWeatherMap API
📱 画面一覧（一般ユーザー）
■ ログインページ

ログインフォーム

会員登録ページへのリンク

パスワード再設定リンク

■ 会員登録ページ

メール認証によるユーザー作成

■ 天気ダッシュボード

都市検索

都市一覧表示

天気表示（現在 + 5日間予報）

お気に入り追加・削除

会員情報ページへの遷移

PDF 出力

■ 会員情報編集ページ

入力フォーム（氏名 / 郵便番号 / 住所 / 電話番号）

更新機能

■ パスワード再設定

メール送信

トークン認証

パスワード更新

🛠️ 管理者機能（/admin）

会員一覧表示

検索 / 絞り込み

並び替え

会員情報編集

CSV 出力

ログアウト

🗂️ ER 図（実装準拠）

📌 ここに ER 図 PNG を貼ってください
例）

![ER Diagram](./docs/er_diagram.png)


（テキスト版）

USERS
├─ id (PK)
├─ name
├─ email
├─ postal_code
├─ address
├─ phone
├─ password_hash
├─ role (ADMIN / MEMBER)
├─ is_active
├─ last_login_at
├─ created_at
└─ updated_at

CITIES
├─ id (PK)
├─ name_ja
├─ name_en
├─ prefecture
├─ api_city_code
├─ created_at
└─ updated_at

FAVORITES
├─ id (PK)
├─ user_id (FK → USERS)
└─ city_id (FK → CITIES)

WEATHER_CACHE
├─ id (PK)
├─ city_id (FK → CITIES)
├─ date
├─ data_json
└─ fetched_at

EMAIL_VERIFICATION_TOKENS
├─ id (PK)
├─ user_id (FK → USERS)
├─ token
├─ expires_at
├─ used_at
└─ created_at

PASSWORD_RESET_TOKENS
├─ id (PK)
├─ user_id (FK → USERS)
├─ token
├─ expires_at
├─ used_at
└─ created_at

🔄 画面遷移図（一般ユーザー）

📌 PNG を後で貼るスペース
例）

![User Flow](./docs/user_flow.png)


テキスト版：

パスワード再設定 → メール認証 → パスワード編集 → ログイン
                      ↑
会員登録ページ → メール認証 → ログインページ → 天気ダッシュボード
                                          ↓
                                 会員情報編集ページ

🔒 認証フロー
◎ 会員登録

入力されたメール宛に認証メールを送信

EmailVerificationToken に記録

トークン認証後、ユーザーが Active 状態に

◎ ログイン

email + password の照合

last_login_at の更新

◎ パスワードリセット

メール送信 → トークン発行

有効期限内であればパスワード更新可能

🌤 天気データ取得処理
1. OpenWeather API から天気情報を取得
2. WeatherCache に JSON を保存
3. 直近キャッシュがあれば API 呼び出しを抑制（高速化）
📦 ローカル開発環境構築
① プロジェクト取得
git clone <repo-url>
cd weather-dashboard

② 依存関係インストール
npm install

③ .env.local を設定
DATABASE_URL="mysql://user:pass@localhost:3306/weather_dashboard"
OPENWEATHER_API_KEY="XXXX"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

④ Prisma マイグレーション
npx prisma migrate dev

⑤ 開発サーバー起動
npm run dev

☁ デプロイ手順（Heroku）
1. Heroku アプリを作成
heroku create weather-dashboard-xxxx

2. JawsDB MySQL を追加
heroku addons:create jawsdb:kitefin

3. 環境変数の設定
heroku config:set OPENWEATHER_API_KEY=XXXX
heroku config:set NEXT_PUBLIC_BASE_URL="https://weather-dashboard-xxxx.herokuapp.com"

4. デプロイ
git push heroku main