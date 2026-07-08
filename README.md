# v0.1.6 패치 노트

- `.gitignore` 추가
- GitHub 업로드 안내 문서 추가
- 압축파일에서 `node_modules`, `dist`, `.vercel`, `.git` 제외
- 앱 상단 버전 표시를 `v0.1.6`으로 갱신

---

# v0.1.5 패치 노트

- 상단 헤더에 현재 버전 표시 추가
- `Target Notes` 라벨을 명확하게 표시
- `Negative Prompt` 카드가 항상 보이도록 fallback 표시 추가
- 모델 지시에 `negative_prompt`와 `target_notes` 필수 생성 조건 강화

---

# v0.1.4 패치 노트

- 출력 대상 선택 추가: GPT / Midjourney / Nano Banana Pro / Generic
- Negative Prompt 생성 추가
- API 키 보기/숨김 토글 추가
- 모든 API 키 삭제 버튼 추가
- 분석 결과 TXT 다운로드 추가
- API 오류 메시지 개선
- SPA 배포 안정성을 위한 Vercel rewrite 추가

---

# v0.1.3 패치 노트

- Vercel 빌드 오류 수정: OpenAI `input_image` 객체에 `detail: "auto"` 추가
- Vercel 빌드 오류 수정: CSS side-effect import 타입 인식을 위한 `src/vite-env.d.ts` 추가
- package version을 `0.1.3`으로 갱신

---

# v0.1.2 패치 노트

- Vercel 빌드 실패 가능성이 높은 TypeScript 검증 로직을 수정했습니다.
- `@types/react`, `@types/react-dom`을 devDependencies에 추가했습니다.
- Vercel 배포 설정을 명시하는 `vercel.json`을 추가했습니다.

---

# 먼저 읽기

`index.html`을 더블클릭해서 직접 열면 실행되지 않습니다.

아래 순서로 실행하세요.

```bash
npm install
npm run dev
```

그 다음 터미널에 표시되는 `http://localhost:5173` 같은 주소를 브라우저에서 여세요.

---

# PromptLens

PromptLens는 개인용·개발자용 BYOK(Bring Your Own Key) 이미지 분석 프롬프트 생성기입니다.

사용자가 OpenAI 또는 Claude 중 하나를 선택하고 자신의 API 키를 입력하면, 브라우저에서 이미지를 분석 API로 직접 전송해 정리용 재생성 프롬프트를 생성합니다.

## 핵심 기능

- OpenAI / Claude 중 하나 선택
- API 키 1개 입력
- 기본값: 로컬 저장
- 저장 안 함 / 세션 저장 / 로컬 저장 지원
- 저장된 API 키 삭제
- 이미지 업로드 및 미리보기
- 브라우저에서 이미지 리사이즈/압축
- 이미지 분석 요약
- 유지할 요소 / 줄일 요소
- `detail_level` 추천
- 한국어 프롬프트 / 영어 프롬프트 생성
- 복사 버튼

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 주의

이 프로젝트는 개인용·개발자용 도구입니다.

API 키는 선택한 저장 방식에 따라 브라우저의 localStorage 또는 sessionStorage에 저장됩니다. “저장하지 않음”을 선택하면 브라우저 저장소에 저장하지 않습니다.

이미지 분석 시 업로드한 이미지는 선택한 API 제공자(OpenAI 또는 Claude)로 직접 전송됩니다.
