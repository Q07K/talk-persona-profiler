# GitHub Pages 배포 가이드

Next.js 프로젝트를 GitHub Pages에 배포하기 위한 설정이 완료되었습니다.
이제 다음 단계를 따라 배포를 진행해주세요.

## 1. 변경 사항 커밋 및 푸시

터미널에서 다음 명령어를 실행하여 변경된 설정과 워크플로우 파일을 GitHub에 올립니다.

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push
```

## 2. GitHub 저장소 설정

1. GitHub 저장소 페이지로 이동합니다.
2. 상단 메뉴에서 **Settings** (설정) 탭을 클릭합니다.
3. 왼쪽 사이드바에서 **Pages** 메뉴를 클릭합니다.
4. **Build and deployment** 섹션에서:
   - **Source**를 `Deploy from a branch`에서 **`GitHub Actions`**로 변경합니다.
   - (이미 `GitHub Actions`가 선택되어 있거나, 워크플로우가 감지되면 자동으로 설정될 수도 있습니다.)

## 3. 배포 확인

1. 설정을 마치면 자동으로 **Actions** 탭에서 배포 작업이 시작됩니다.
2. **Actions** 탭을 클릭하여 `Deploy to GitHub Pages` 워크플로우가 성공적으로 실행되는지 확인합니다.
3. 배포가 완료되면 **Settings > Pages** 화면 상단에 생성된 사이트 주소(URL)가 표시됩니다.

## 주의사항 (이미지/스타일 깨짐)

만약 배포 후 사이트에서 이미지나 스타일이 깨져 보인다면, 저장소 이름(repo name) 때문에 경로 문제가 발생한 것입니다.
이 경우 `next.config.ts` 파일을 열어 `basePath` 설정을 추가해야 할 수 있습니다. (대부분의 경우 자동으로 처리되도록 설정해두었습니다.)
