# Roadmaps

> Last Updated 2026.02.14.

메아리 for 포트폴리오는 지난 2022년부터 2023년까지 Material Web 라이브러리와 SvelteKit, Firestore SDK를 사용하여 개발되었습니다.

그러나 Firestore의 저장 구조와 속도가 본 서비스에 적합한지에 대한 의문이 항시 있었고, Material Web 라이브러리가 유지보수 단계에 진입하면서 지속적인 이용이 어렵게 되었습니다.

이에 2026년 새해 `3.0` 버전 출시를 목표로, 다음과 같이 단계별로 전반적인 변화를 일구고자 합니다.

## 2026년 1분기

> Target version: 2.2.0

2025년 기획하였던 디자인 변경 사항을 선 적용합니다. Firestore SDK를 비롯해 주요 라이브러리는 보안 문제를 완화하는 선에서 업데이트하며, 향후 데이터베이스 및 실행 환경에 대비합니다.

## 2026년 2분기

> Target version: 3.0.0

종전 Vercel 환경에서 Cloudflare Workers, D1, R2 환경으로 단계적 이전에 들어갑니다.

가능한 GUI 상에서 관리가 가능한 구조로 계획하고 있습니다.

## 2026년 3분기

> Target version: 3.1.0

Fedify for Cloudflare Workers를 적용하여 각종 프로젝트의 공지사항을 연합우주 환경에서 볼 수 있는 형태로 본 사이트에 통합할 계획입니다.
