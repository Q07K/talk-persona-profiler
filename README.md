# Talk Persona Profiler

KakaoTalk 대화 내용을 분석하여 사용자의 페르소나를 프로파일링해주는 웹 애플리케이션입니다.
AI가 대화 내용을 분석하여 사용자의 말투, 성격, 자주 사용하는 단어 등을 추출하고 시각화해줍니다.

## 배포 링크
[https://q07k.github.io/talk-persona-profiler/](https://q07k.github.io/talk-persona-profiler/)

## 스크린샷
![스크린샷](https://user-images.githubusercontent.com/10162718/299666015-61221c56-676b-4161-936b-66c2c222322b.png)

## 주요 기능

- **카카오톡 대화 분석**: 카카오톡에서 내보내기한 텍스트 파일을 파싱하여 분석합니다.
- **사용자 선택**: 대화방에 참여한 사용자 중 분석하고 싶은 대상을 선택할 수 있습니다.
- **AI 페르소나 생성**: LLM을 활용하여 선택된 사용자의 대화 스타일, 성격, 말투를 분석합니다.
- **시각화**: 분석된 페르소나 데이터(특성, 자주 쓰는 단어, 분석 요약)를 시각적으로 보여줍니다.

## 사용 방법

1. **카카오톡 대화 내보내기**: 카카오톡 채팅방 설정에서 '대화 내용 내보내기'를 통해 텍스트 파일(.txt)을 저장합니다.
2. **API 키 입력**: 서비스 이용을 위한 API 키를 입력합니다.
3. **파일 업로드**: 저장한 대화 파일을 업로드합니다.
4. **사용자 선택**: 분석하고자 하는 사용자를 선택합니다.
5. **결과 확인**: AI가 분석한 페르소나 프로필을 확인합니다.

## 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API (via LLMClient)

## 로컬 실행 방법

프로젝트를 로컬에서 실행하려면 다음 단계를 따르세요.

```bash
# 저장소 클론
git clone https://github.com/q07k/talk-persona-profiler.git

# 디렉토리 이동
cd talk-persona-profiler

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인할 수 있습니다.
