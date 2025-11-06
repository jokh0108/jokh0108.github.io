# CSS 학습 로드맵: 기초부터 실무까지 (1일 속성 과정)

## 📚 출처
- [MDN CSS Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [CSS-Tricks](https://css-tricks.com/)
- [Flexbox Froggy](https://flexboxfroggy.com/)
- [Grid Garden](https://cssgridgarden.com/)
- [Can I Use](https://caniuse.com/)

## 🎯 학습 목표
- CSS 기본 문법과 선택자 완전 이해
- 레이아웃 시스템 (Flexbox, Grid) 숙련도 달성
- 반응형 웹 디자인 구현 능력
- 최신 CSS 기법과 성능 최적화

## 📋 1일 학습 계획 (8시간)

### 1단계: CSS 기초와 선택자 (2시간)
#### 1.1 CSS 기본 문법 (30분)
```css
/* CSS 기본 구조 */
selector {
    property: value;
    property: value;
}

/* 주석 작성법 */
/* 이것은 CSS 주석입니다 */
```

#### 1.2 선택자 마스터하기 (1시간 30분)
```css
/* 기본 선택자 */
* { margin: 0; }                    /* 전체 선택자 */
h1 { color: blue; }                 /* 요소 선택자 */
.class-name { font-size: 16px; }    /* 클래스 선택자 */
#unique-id { background: red; }     /* ID 선택자 */

/* 복합 선택자 */
div p { color: gray; }              /* 자손 선택자 */
div > p { margin: 10px; }           /* 직계 자식 선택자 */
h1 + p { margin-top: 0; }           /* 인접 형제 선택자 */
h1 ~ p { color: green; }            /* 일반 형제 선택자 */

/* 속성 선택자 */
input[type="text"] { border: 1px solid #ccc; }
a[href^="https"] { color: green; }  /* 시작하는 값 */
img[src$=".jpg"] { border: 2px; }   /* 끝나는 값 */
div[class*="nav"] { display: flex; } /* 포함하는 값 */

/* 가상 클래스 */
a:hover { color: red; }
input:focus { outline: 2px solid blue; }
li:nth-child(2n) { background: #f0f0f0; }
p:first-child { margin-top: 0; }
p:last-child { margin-bottom: 0; }

/* 가상 요소 */
p::before { content: "→"; }
p::after { content: "←"; }
::selection { background: yellow; }
```

### 2단계: 박스 모델과 레이아웃 기초 (2시간)
#### 2.1 박스 모델 완전 이해 (1시간)
```css
/* 박스 모델 구성 요소 */
.box {
    /* 내용 영역 */
    width: 200px;
    height: 100px;
    
    /* 안쪽 여백 */
    padding: 20px;
    padding: 10px 15px; /* 상하 좌우 */
    padding: 5px 10px 15px 20px; /* 상 우 하 좌 */
    
    /* 테두리 */
    border: 2px solid #333;
    border-width: 1px;
    border-style: solid;
    border-color: blue;
    border-radius: 5px;
    
    /* 바깥쪽 여백 */
    margin: 10px auto; /* 상하 10px, 좌우 자동 (중앙정렬) */
    
    /* 박스 사이징 */
    box-sizing: border-box; /* 권장사항 */
}

/* 전역 박스 사이징 설정 */
*, *::before, *::after {
    box-sizing: border-box;
}
```

#### 2.2 Display와 Position (1시간)
```css
/* Display 속성 */
.block { display: block; }          /* 블록 요소 */
.inline { display: inline; }        /* 인라인 요소 */
.inline-block { display: inline-block; } /* 인라인 블록 */
.none { display: none; }            /* 숨기기 */
.flex { display: flex; }            /* 플렉스 컨테이너 */
.grid { display: grid; }            /* 그리드 컨테이너 */

/* Position 속성 */
.static { position: static; }       /* 기본값 */
.relative {
    position: relative;
    top: 10px;
    left: 20px;
}
.absolute {
    position: absolute;
    top: 0;
    right: 0;
}
.fixed {
    position: fixed;
    bottom: 20px;
    right: 20px;
}
.sticky {
    position: sticky;
    top: 0;
}
```

### 3단계: Flexbox와 Grid 레이아웃 (2시간)
#### 3.1 Flexbox 마스터 (1시간)
```css
/* Flex Container 속성 */
.flex-container {
    display: flex;
    
    /* 주축 방향 */
    flex-direction: row; /* row, row-reverse, column, column-reverse */
    
    /* 줄바꿈 */
    flex-wrap: wrap; /* nowrap, wrap, wrap-reverse */
    
    /* 주축 정렬 */
    justify-content: center; /* flex-start, flex-end, center, space-between, space-around, space-evenly */
    
    /* 교차축 정렬 */
    align-items: center; /* stretch, flex-start, flex-end, center, baseline */
    
    /* 여러 줄 정렬 */
    align-content: center; /* stretch, flex-start, flex-end, center, space-between, space-around */
    
    /* 간격 */
    gap: 20px; /* row-gap, column-gap */
}

/* Flex Item 속성 */
.flex-item {
    /* 확장 비율 */
    flex-grow: 1;
    
    /* 축소 비율 */
    flex-shrink: 1;
    
    /* 기본 크기 */
    flex-basis: 200px;
    
    /* 단축 속성 */
    flex: 1 1 200px; /* grow shrink basis */
    
    /* 개별 정렬 */
    align-self: flex-end;
    
    /* 순서 */
    order: 2;
}

/* 실용적인 Flexbox 패턴 */
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    flex: 1 1 300px; /* 최소 300px, 자동 확장 */
}
```

#### 3.2 CSS Grid 시스템 (1시간)
```css
/* Grid Container */
.grid-container {
    display: grid;
    
    /* 그리드 정의 */
    grid-template-columns: 200px 1fr 100px;
    grid-template-rows: auto 1fr auto;
    
    /* 반복 사용 */
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    
    /* 간격 */
    gap: 20px;
    grid-gap: 20px; /* 구버전 */
    
    /* 영역 이름 */
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
}

/* Grid Item */
.grid-item {
    /* 위치 지정 */
    grid-column: 2 / 4; /* 2번째부터 4번째 전까지 */
    grid-row: 1 / 3;
    
    /* 단축 속성 */
    grid-area: 2 / 1 / 4 / 3; /* row-start / col-start / row-end / col-end */
    
    /* 영역 이름 사용 */
    grid-area: header;
}

/* 실용적인 Grid 레이아웃 */
.page-layout {
    display: grid;
    min-height: 100vh;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
        "header"
        "main"
        "footer";
}

.header { grid-area: header; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### 4단계: 반응형 디자인과 고급 기법 (2시간)
#### 4.1 미디어 쿼리와 반응형 (1시간)
```css
/* 모바일 우선 접근법 */
.container {
    padding: 10px;
}

/* 태블릿 */
@media (min-width: 768px) {
    .container {
        padding: 20px;
        display: flex;
        gap: 20px;
    }
}

/* 데스크톱 */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 30px;
    }
}

/* 고해상도 디스플레이 */
@media (-webkit-min-device-pixel-ratio: 2),
       (min-resolution: 192dpi) {
    .logo {
        background-image: url('logo@2x.png');
        background-size: 100px 50px;
    }
}

/* 반응형 타이포그래피 */
html {
    font-size: 16px;
}

@media (min-width: 768px) {
    html { font-size: 18px; }
}

@media (min-width: 1024px) {
    html { font-size: 20px; }
}

/* 반응형 이미지 */
img {
    max-width: 100%;
    height: auto;
}

/* 반응형 비디오 */
.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 비율 */
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

#### 4.2 최신 CSS 기법 (1시간)
```css
/* CSS 커스텀 속성 (CSS Variables) */
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --font-size: 16px;
    --spacing: 20px;
}

.button {
    background-color: var(--primary-color);
    font-size: var(--font-size);
    padding: var(--spacing);
    
    /* 폴백 값 */
    color: var(--text-color, #333);
}

/* CSS Grid와 Flexbox 조합 */
.hybrid-layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* 현대적인 선택자 */
.card:not(:last-child) {
    margin-bottom: 20px;
}

.form-group:has(input:invalid) {
    border-color: red;
}

/* 컨테이너 쿼리 (최신 기능) */
.card {
    container-type: inline-size;
}

@container (min-width: 300px) {
    .card-content {
        display: flex;
        gap: 15px;
    }
}

/* CSS 논리적 속성 */
.text {
    margin-inline-start: 20px; /* 시작 방향 여백 */
    padding-block: 10px; /* 블록 방향 패딩 */
    border-inline-end: 1px solid #ccc; /* 끝 방향 테두리 */
}

/* CSS Subgrid */
.parent-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.subgrid-item {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
}
```

## 🎨 실용적인 CSS 패턴

### 1. 카드 디자인
```css
.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}
```

### 2. 버튼 스타일
```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: color-mix(in srgb, var(--primary-color) 90%, black);
}
```

### 3. 네비게이션 메뉴
```css
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: width 0.3s;
}

.nav-link:hover::after {
    width: 100%;
}
```

## 🚀 성능 최적화 팁

### 1. CSS 최적화
```css
/* 효율적인 선택자 사용 */
.nav-item { } /* Good */
ul li a { } /* 피하기 */

/* 하드웨어 가속 활용 */
.animated {
    transform: translateZ(0); /* GPU 가속 트리거 */
    will-change: transform; /* 브라우저에 힌트 제공 */
}

/* 불필요한 리플로우 방지 */
.moving-element {
    transform: translateX(100px); /* position 변경보다 효율적 */
}
```

### 2. 로딩 최적화
```css
/* 폰트 로딩 최적화 */
@font-face {
    font-family: 'CustomFont';
    src: url('font.woff2') format('woff2');
    font-display: swap; /* 폰트 로딩 중 fallback 폰트 사용 */
}

/* 이미지 최적화 */
.lazy-image {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy-image.loaded {
    opacity: 1;
}
```

## 📱 모바일 최적화

```css
/* 터치 친화적 디자인 */
.touchable {
    min-height: 44px; /* iOS 권장 터치 영역 */
    min-width: 44px;
}

/* 스크롤 최적화 */
.scroll-container {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
}

/* 뷰포트 단위 활용 */
.full-screen {
    height: 100vh; /* 뷰포트 높이 */
    width: 100vw; /* 뷰포트 너비 */
}

/* 안전 영역 고려 (노치 디자인) */
.safe-area {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
}
```

## 🛠️ 개발 도구

### 1. CSS 전처리기
- **Sass/SCSS**: 변수, 중첩, 믹스인
- **Less**: 동적 스타일시트
- **Stylus**: 간결한 문법

### 2. PostCSS 플러그인
- **Autoprefixer**: 벤더 접두사 자동 추가
- **PurgeCSS**: 사용하지 않는 CSS 제거
- **CSSNano**: CSS 압축 최적화

## 📚 추천 리소스

### 학습 사이트
- [CSS Diner](https://flukeout.github.io/) - 선택자 게임
- [Flexbox Zombies](https://flexboxzombies.com/) - Flexbox 게임
- [CSS Grid Garden](https://cssgridgarden.com/) - Grid 게임

### 참고 사이트
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [CSS-Tricks Almanac](https://css-tricks.com/almanac/)
- [Can I Use](https://caniuse.com/) - 브라우저 호환성

## 📝 체크리스트

- [ ] CSS 선택자 우선순위 이해
- [ ] 박스 모델과 box-sizing 적용
- [ ] Flexbox로 레이아웃 구현
- [ ] CSS Grid로 복잡한 레이아웃 구현  
- [ ] 미디어 쿼리로 반응형 디자인
- [ ] CSS 변수와 현대적 기법 활용
- [ ] 성능 최적화 기법 적용
- [ ] 실제 프로젝트에서 CSS 활용

---

💡 **학습 팁**: CSS는 실습이 가장 중요합니다. 다양한 레이아웃을 직접 구현해보고, 브라우저 개발자 도구를 적극 활용하여 실시간으로 스타일을 조정해보세요!