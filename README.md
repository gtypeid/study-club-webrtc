# 스터디 클럽 WEB-RTC
<img src="https://gtypeid.github.io/resource/path/folio/logo-1.png" width="300" alt="프로젝트 로고">

## 📝 프로젝트 개요
Web에서 N:N 다수의 사용자들과 화상 통화를 진행하거나,
연결된 P2P 데이터 채널을 통해 데이터를 교환하여 채팅 및 공용 보드의 낙서나 사진을 동기화합니다.
WebRTC 연결 과정을 NodeJs, Socket이 아닌 Http 메시지로 핸들링하고 싶었으며,
이벤트 지향성으로 확장성을 고려하여 시그널링 서버 및 클라이언를 맡았습니다.


## 🧩 프로젝트 의도 및 이점
### 스터디 클럽 WEB-RTC
- Web RTC를 알게 되어 흥미로운 기술이라고 생각하고, N:N 연결을 시도해 보았습니다.
- NodeJS 및 WebSocket을 사용하지 않고, HTTP 메시지 핸들링만으로 연결을 시도해 보았습니다.
- 리액티브 프로그래밍 이벤트 구독 발행 모델을 모방하여, 메시지 큐와 이벤트를 활용한 확장성 있는 구조를 의도해 보았습니다.
- 손쉬운 방 생성, 방 입장 API를 통해 프로젝트에 손 쉽게 부착하였습니다.

## 🛠️ 사용 기술
- 기술
  - JAVA
  - JAVASCRIPT
  - SPRING
- 라이브러리
  - WEB RTC
  
## 🔍 프로젝트 살펴보기
### RTC 시연
<img src="https://gtypeid.github.io/resource/path/folio/rtc-1.gif" width="500" alt="프로젝트 로고"><br><br>
- WebRTC 두 클라이언트의 P2P연결 후 화면입니다.
데이터 채널을 통해 채팅 및
캔버스 메타 데이터를 전달 받으며
드로잉 선 & 커서 & 이미지 파일들을 동기화합니다.
<br><br>

<img src="https://gtypeid.github.io/resource/path/folio/rtc-0.gif" width="500" alt="프로젝트 로고"><br><br>
- N:N 다수의 WebRTC 연결 모습입니다.
<br><br>

## 📋 구현 기능 
- 시그널링 서버
  - 이벤트 스트림 등록 API : SSE Event (Server Sent Event), 이벤트 핸들 API
  - 방 생성 API & 방 입장 API
  - 방 조회 API & 다수 방 조회 API
- 클라이언트
  - Web RTC N:N 연결 및 연결 후 P2P 데이터 채널을 통한
  - 화상 연결 & 채팅
- 캔버스 동기화 : 선 그리기, 선 색 변경, 화면 커서, 화면 지우기, 사진 객체
  - 백 버퍼 캔버스
- 방 버전 체크
- 이벤트 파이프라인
