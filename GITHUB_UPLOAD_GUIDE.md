# GitHub 업로드 안내

GitHub 웹 업로드에서 “100개 이상 파일” 오류가 나오면 보통 `node_modules`까지 같이 올린 것입니다.

## 올리면 안 되는 폴더

- `node_modules`
- `dist`
- `.vercel`
- `.git`

## GitHub 웹에서 올릴 때

압축을 푼 뒤 아래 파일/폴더만 저장소 루트에 올리세요.

- `src/`
- `package.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `vercel.json`
- `README.md`
- `README_FIRST.md`
- `.gitignore`

## 가장 추천하는 방법

터미널에서 Git으로 올리면 파일 개수 제한 문제를 피할 수 있습니다.

```bash
git add .
git commit -m "Update PromptLens to v0.1.6"
git push
```

`.gitignore`가 있으므로 `node_modules`와 `dist`는 자동으로 제외됩니다.
