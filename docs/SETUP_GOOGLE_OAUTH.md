# Google OAuth 설정 — Supabase + GCP 한 번에

> 한 번만 설정하면 끝. launcher와 OAuth Client 공유 가능 — redirect URI만 추가하면 됨.

## 1. Google Cloud Console — OAuth Client 준비

이미 launcher용 OAuth Client가 있다면 그 client를 재사용. 없다면 새로 생성:

1. https://console.cloud.google.com/apis/credentials 접속
2. **Create Credentials → OAuth client ID** → Application type: **Web application**
3. **Authorized redirect URIs**에 아래 2개 추가 (이미 있으면 추가만):
   ```
   https://guokvncnimszrbucgafk.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
   - 첫 번째: Supabase가 Google에서 받아 우리 도메인으로 리다이렉트할 때 사용
   - 두 번째: 로컬 개발용. 배포 후 prod 도메인 추가 필요
4. **Client ID**와 **Client Secret** 복사

## 2. Supabase Studio — Google Provider 활성화

1. Supabase Dashboard → **`Authentication`** → **`Providers`**
2. **Google** 행을 클릭 → **Enable Sign in with Google** 토글 ON
3. 입력:
   - **Client IDs (for OAuth)** : 위에서 복사한 Client ID
   - **Client Secret** : 위에서 복사한 Client Secret
4. **Skip nonce check** : OFF 유지 (기본값)
5. **Save**

## 3. Supabase Studio — URL Configuration

Authentication → **URL Configuration**:

- **Site URL** : `http://localhost:3000` (개발 중). 배포 후 `https://acl.example.com`으로 교체.
- **Redirect URLs** : 아래 두 개 추가:
  ```
  http://localhost:3000/**
  http://localhost:3000/auth/callback
  ```

## 4. 동작 확인

```powershell
npm run dev
```

브라우저 → `http://localhost:3000/login` → **Google로 시작하기** 클릭 →
구글 로그인 → 자동으로 `/`로 리다이렉트 → 쿠키에 세션 존재.

확인 SQL (Supabase SQL Editor):
```sql
SELECT id, email, raw_user_meta_data->>'name' AS name FROM auth.users;
SELECT id, role, status, nickname FROM public.profiles;
```
auth.users에 1행, profiles에 1행이 있고 role='guest'이면 트리거가 잘 동작.

## 5. 본인을 admin으로 승급 (최초 1회만)

`0001_init.sql` 끝에도 적혀있지만 다시:

```sql
UPDATE public.profiles
   SET role = 'admin', role_changed_at = now()
 WHERE id = (SELECT id FROM auth.users WHERE email = 'money300jo@gmail.com');
```

이후로는 `/admin/members`에서 GUI로 다른 admin을 승급.

---

## 트러블슈팅

- **`redirect_uri_mismatch` 오류** — GCP의 Authorized redirect URIs에 Supabase의 callback URL (`https://...supabase.co/auth/v1/callback`)이 정확히 들어있는지 확인. trailing slash 차이도 영향.
- **로그인 후 무한 리다이렉트** — Supabase Site URL과 우리 `.env.local`의 `NEXT_PUBLIC_SITE_URL`이 같은지 확인.
- **profiles에 row가 안 생김** — `0001_init.sql`을 다시 실행. `on_auth_user_created` 트리거가 빠졌을 가능성.
