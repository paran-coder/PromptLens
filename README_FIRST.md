# PromptLens v0.1.4 실행 방법

이 버전은 출력 대상 선택, Negative Prompt, TXT 다운로드, API 키 관리 개선을 포함합니다.

# PromptLens v0.1.3 실행 방법

이 버전은 Vercel 빌드 오류 두 가지를 수정했습니다.

- OpenAI 이미지 입력에 `detail: "auto"` 추가
- Vite CSS import 타입 인식을 위한 `src/vite-env.d.ts` 추가

# PromptLens 실행 방법

이 프로젝트는 `index.html`을 더블클릭해서 여는 방식으로 실행되지 않습니다.

Vite + React + TypeScript 프로젝트이기 때문에 로컬 개발 서버를 실행해야 합니다.

## 1. 압축 풀기

```bash
unzip PromptLens_v0.1.1.zip
cd PromptLens_v0.1.1
```

## 2. 패키지 설치

```bash
npm install
```

## 3. 개발 서버 실행

```bash
npm run dev
```

터미널에 표시되는 주소를 브라우저에서 여세요.

예:

```text
http://localhost:5173
```

## 4. 배포용 빌드

```bash
npm run build
npm run preview
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## 중요한 점

- 루트의 `index.html`은 Vite가 앱을 시작하기 위한 진입 파일입니다.
- `file:///.../index.html`로 직접 열면 React/TypeScript 모듈이 처리되지 않아 정상 동작하지 않습니다.
- 정상 실행은 반드시 `npm run dev` 또는 `npm run preview`를 통해 해야 합니다.
