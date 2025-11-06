# HTML 학습 커리큘럼 (1일 속성 과정)

## 📚 출처
- [HTML Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/html/html-tutorial/)
- [Structuring content with HTML - MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content)
- [HTML Tutorial - W3Schools](https://www.w3schools.com/html/)
- [Learn HTML - Codecademy](https://www.codecademy.com/learn/learn-html)
- [HTML Roadmap - TutorialsPoint](https://www.tutorialspoint.com/html/html_roadmap.htm)

## 🎯 학습 목표
- HTML5의 기본 구조와 문법 완전 이해
- 시맨틱 마크업과 접근성 고려한 웹 페이지 작성
- 실무에서 바로 사용 가능한 HTML 스킬 습득

## 📋 1일 학습 계획 (8시간)

### 1단계: HTML 기초 (2시간)
#### 1.1 HTML 개요 및 환경 설정 (30분)
- HTML이란?
- HTML5의 특징과 장점
- 개발 환경 설정 (VS Code + Extensions)
- 브라우저 개발자 도구 활용법

#### 1.2 기본 문서 구조 (30분)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>문서 제목</title>
</head>
<body>
    <!-- 내용 -->
</body>
</html>
```

#### 1.3 기본 태그들 (1시간)
- 제목 태그: `<h1>` ~ `<h6>`
- 단락 태그: `<p>`, `<br>`, `<hr>`
- 텍스트 서식: `<strong>`, `<em>`, `<mark>`, `<del>`
- 링크 태그: `<a href="">`
- 이미지 태그: `<img src="" alt="">`

### 2단계: 구조적 마크업 (2시간)
#### 2.1 시맨틱 HTML5 (1시간)
```html
<header>
    <nav>
        <ul>
            <li><a href="#home">홈</a></li>
            <li><a href="#about">소개</a></li>
        </ul>
    </nav>
</header>

<main>
    <article>
        <section>
            <h2>섹션 제목</h2>
            <p>내용...</p>
        </section>
    </article>
    <aside>
        <h3>사이드바</h3>
    </aside>
</main>

<footer>
    <p>&copy; 2025 저작권 정보</p>
</footer>
```

#### 2.2 목록과 테이블 (1시간)
```html
<!-- 순서 없는 목록 -->
<ul>
    <li>항목 1</li>
    <li>항목 2</li>
</ul>

<!-- 순서 있는 목록 -->
<ol>
    <li>첫 번째</li>
    <li>두 번째</li>
</ol>

<!-- 테이블 -->
<table>
    <thead>
        <tr>
            <th>이름</th>
            <th>나이</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>홍길동</td>
            <td>25</td>
        </tr>
    </tbody>
</table>
```

### 3단계: 폼과 입력 요소 (2시간)
#### 3.1 기본 폼 구조 (1시간)
```html
<form action="/submit" method="post">
    <fieldset>
        <legend>개인정보</legend>
        
        <label for="name">이름:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">이메일:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="password">비밀번호:</label>
        <input type="password" id="password" name="password" required>
    </fieldset>
    
    <button type="submit">제출</button>
</form>
```

#### 3.2 다양한 입력 요소 (1시간)
```html
<!-- HTML5 입력 타입 -->
<input type="number" min="0" max="100">
<input type="range" min="0" max="100" value="50">
<input type="date">
<input type="color">
<input type="file" accept="image/*">

<!-- 선택 요소 -->
<select name="city">
    <option value="seoul">서울</option>
    <option value="busan">부산</option>
</select>

<textarea name="message" rows="5" cols="30"></textarea>

<!-- 체크박스와 라디오 버튼 -->
<input type="checkbox" id="agree" name="agree">
<label for="agree">약관에 동의합니다</label>

<input type="radio" id="male" name="gender" value="male">
<label for="male">남성</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">여성</label>
```

### 4단계: 멀티미디어와 고급 기능 (2시간)
#### 4.1 멀티미디어 요소 (1시간)
```html
<!-- 비디오 -->
<video controls width="400" height="300">
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    브라우저가 비디오를 지원하지 않습니다.
</video>

<!-- 오디오 -->
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    브라우저가 오디오를 지원하지 않습니다.
</audio>

<!-- 임베드 콘텐츠 -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID" 
        width="560" height="315">
</iframe>
```

#### 4.2 고급 HTML5 기능 (1시간)
```html
<!-- 캔버스 -->
<canvas id="myCanvas" width="200" height="100"></canvas>

<!-- SVG -->
<svg width="100" height="100">
    <circle cx="50" cy="50" r="40" fill="red" />
</svg>

<!-- 데이터 속성 -->
<div data-user-id="123" data-role="admin">사용자 정보</div>

<!-- 진행률 표시 -->
<progress value="70" max="100">70%</progress>

<!-- 세부 정보 -->
<details>
    <summary>더 보기</summary>
    <p>숨겨진 내용입니다.</p>
</details>
```

## 🛠️ 실습 프로젝트

### 프로젝트 1: 개인 포트폴리오 페이지
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>홍길동 - 웹 개발자</title>
</head>
<body>
    <header>
        <h1>홍길동</h1>
        <p>웹 개발자</p>
        <nav>
            <ul>
                <li><a href="#about">소개</a></li>
                <li><a href="#projects">프로젝트</a></li>
                <li><a href="#contact">연락처</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="about">
            <h2>소개</h2>
            <p>안녕하세요! 웹 개발에 열정을 가진 홍길동입니다.</p>
            <img src="profile.jpg" alt="홍길동 프로필 사진">
        </section>

        <section id="projects">
            <h2>프로젝트</h2>
            <article>
                <h3>프로젝트 1</h3>
                <p>프로젝트 설명...</p>
                <a href="https://project1.com">프로젝트 보기</a>
            </article>
        </section>

        <section id="contact">
            <h2>연락처</h2>
            <form>
                <label for="name">이름:</label>
                <input type="text" id="name" required>
                
                <label for="message">메시지:</label>
                <textarea id="message" required></textarea>
                
                <button type="submit">전송</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 홍길동. All rights reserved.</p>
    </footer>
</body>
</html>
```

## 📖 핵심 개념 정리

### 1. HTML5 시맨틱 요소
- `<header>`: 페이지나 섹션의 헤더
- `<nav>`: 내비게이션 링크
- `<main>`: 주요 콘텐츠
- `<article>`: 독립적인 콘텐츠
- `<section>`: 관련 콘텐츠 그룹
- `<aside>`: 사이드바 콘텐츠
- `<footer>`: 페이지나 섹션의 푸터

### 2. 접근성 고려사항
- `alt` 속성으로 이미지 설명
- `label`과 `input` 연결
- 시맨틱 마크업 사용
- 키보드 내비게이션 지원
- 적절한 헤딩 구조

### 3. SEO 최적화
- 적절한 `title` 태그
- `meta` 태그 활용
- 구조적 마크업
- 시맨틱 HTML 사용

## 🎯 심화 학습 방향

### 단기 목표 (1주일)
- CSS와 연계한 스타일링
- JavaScript와의 상호작용
- 반응형 웹 디자인 기초

### 중기 목표 (1개월)
- 웹 표준과 크로스 브라우징
- 성능 최적화 기법
- PWA(Progressive Web App) 기초

### 장기 목표 (3개월)
- 웹 컴포넌트 개발
- 최신 HTML5 API 활용
- 웹 접근성 전문가 수준

## 🔍 검증 도구

1. **HTML 유효성 검사**
   - [W3C Markup Validator](https://validator.w3.org/)
   - VS Code HTML Validation

2. **접근성 검사**
   - WAVE Web Accessibility Evaluator
   - axe DevTools

3. **SEO 검사**
   - Google PageSpeed Insights
   - SEO Site Checkup

## 📝 체크리스트

- [ ] HTML5 DOCTYPE과 기본 구조 이해
- [ ] 시맨틱 마크업 작성 가능
- [ ] 폼 요소와 유효성 검사 구현
- [ ] 멀티미디어 요소 활용
- [ ] 접근성 고려한 마크업 작성
- [ ] 개인 포트폴리오 페이지 완성
- [ ] HTML 유효성 검사 통과

---

💡 **학습 팁**: HTML은 마크업 언어이므로 직접 코드를 작성하면서 학습하는 것이 가장 효과적입니다. 각 태그의 의미를 이해하고 적절한 곳에 사용하는 연습을 하세요!