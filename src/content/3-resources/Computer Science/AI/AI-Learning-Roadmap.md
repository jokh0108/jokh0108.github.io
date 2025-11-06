# 인공지능 학습 로드맵 (1일 속성 과정)

## 📚 출처
- [DataCamp - How to Learn AI from Scratch](https://www.datacamp.com/blog/how-to-learn-ai)
- [Udacity - AI Roadmap for Beginners](https://www.udacity.com/blog/2025/05/how-to-learn-ai-in-2025-a-roadmap-for-beginners-and-developers.html)
- [AI Engineer Roadmap](https://roadmap.sh/ai-engineer)
- [Medium - AI Roadmap 2025](https://medium.com/madhukarkumar/a-developers-roadmap-to-getting-started-with-ai-in-2025-f3f000ef6770)
- [GitHub - Complete AI ML Roadmap](https://github.com/aadi1011/AI-ML-Roadmap-from-scratch)

## 🎯 학습 목표
- AI의 핵심 개념과 분야 이해
- 머신러닝 알고리즘의 기본 원리 파악
- 딥러닝과 신경망의 구조 학습
- 실무에서 사용하는 AI 도구와 프레임워크 체험

## 📋 1일 학습 계획 (8시간)

### 1단계: AI 기초와 개념 (2시간)
#### 1.1 인공지능 개요 (45분)
- **AI의 정의와 역사**
  - 1950년대: 튜링 테스트
  - 1980년대: 전문가 시스템
  - 2010년대: 딥러닝 혁신
  - 2020년대: 생성형 AI 시대

- **AI의 분류**
```
인공지능 (AI)
├── 약한 AI (Narrow AI)
│   ├── 머신러닝 (ML)
│   │   ├── 지도학습 (Supervised)
│   │   ├── 비지도학습 (Unsupervised)
│   │   └── 강화학습 (Reinforcement)
│   └── 딥러닝 (Deep Learning)
│       ├── CNN (컨볼루션)
│       ├── RNN (순환신경망)
│       └── Transformer
└── 강한 AI (AGI) - 미래 목표
```

#### 1.2 주요 AI 분야 (45분)
- **컴퓨터 비전**: 이미지 인식, 객체 탐지
- **자연어 처리**: 텍스트 분석, 언어 모델
- **음성 인식**: STT, TTS 기술
- **로보틱스**: 자율 로봇, 제어 시스템
- **추천 시스템**: 개인화, 협업 필터링

#### 1.3 AI 윤리와 현실 (30분)
- AI 편향성과 공정성
- 개인정보 보호 이슈
- AI의 사회적 영향
- 일자리 변화와 대응 방안

### 2단계: 머신러닝 기초 (2시간)
#### 2.1 머신러닝 개념 (1시간)
- **학습 패러다임**
```python
# 지도학습 예제 (분류)
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import iris

# 데이터 로드
X, y = iris.data, iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 모델 학습
model = LogisticRegression()
model.fit(X_train, y_train)

# 예측
predictions = model.predict(X_test)
```

- **평가 지표**
  - 정확도 (Accuracy)
  - 정밀도 (Precision)
  - 재현율 (Recall)
  - F1-Score

#### 2.2 주요 알고리즘 (1시간)
- **선형 회귀**: 연속값 예측
- **로지스틱 회귀**: 분류 문제
- **결정 트리**: 규칙 기반 학습
- **랜덤 포레스트**: 앙상블 학습
- **SVM**: 서포트 벡터 머신
- **K-Means**: 클러스터링

### 3단계: 딥러닝과 신경망 (2시간)
#### 3.1 신경망 기초 (1시간)
```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# 간단한 신경망 구조
model = Sequential([
    Dense(128, activation='relu', input_shape=(784,)),  # 입력층
    Dense(64, activation='relu'),                       # 은닉층
    Dense(10, activation='softmax')                     # 출력층
])

# 모델 컴파일
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
```

- **활성화 함수**: ReLU, Sigmoid, Tanh
- **손실 함수**: MSE, Cross-Entropy
- **최적화**: Gradient Descent, Adam
- **역전파**: 가중치 업데이트 메커니즘

#### 3.2 딥러닝 아키텍처 (1시간)
- **CNN (Convolutional Neural Networks)**
```python
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten

cnn_model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])
```

- **RNN/LSTM**: 시계열 데이터 처리
- **Transformer**: 현대 NLP의 핵심
- **GAN**: 생성적 적대 신경망

### 4단계: 실무 도구와 실습 (2시간)
#### 4.1 주요 프레임워크 (1시간)
- **TensorFlow/Keras**
```python
# TensorFlow 예제 - 이미지 분류
import tensorflow as tf

# 데이터셋 로드
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

# 데이터 전처리
x_train = x_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
x_test = x_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0

# 모델 학습
model.fit(x_train, y_train, epochs=5, validation_data=(x_test, y_test))
```

- **PyTorch**
```python
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super(SimpleNet, self).__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = SimpleNet()
```

- **Scikit-learn**: 전통적 머신러닝
- **Hugging Face**: NLP 모델 라이브러리

#### 4.2 실습 프로젝트 (1시간)
**프로젝트 1: 손글씨 숫자 인식**
```python
# 완전한 MNIST 분류기
import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

# 데이터 로드 및 전처리
(train_images, train_labels), (test_images, test_labels) = tf.keras.datasets.mnist.load_data()
train_images = train_images.reshape((60000, 28, 28, 1)).astype('float32') / 255
test_images = test_images.reshape((10000, 28, 28, 1)).astype('float32') / 255

# CNN 모델 구성
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

# 컴파일 및 훈련
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

history = model.fit(train_images, train_labels, epochs=5,
                    validation_data=(test_images, test_labels))

# 결과 시각화
plt.plot(history.history['accuracy'], label='accuracy')
plt.plot(history.history['val_accuracy'], label='val_accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.show()
```

## 🚀 최신 AI 트렌드 (2025)

### 1. 생성형 AI (Generative AI)
- **대형 언어 모델 (LLM)**
  - GPT, Claude, Gemini
  - 프롬프트 엔지니어링
  - 파인튜닝과 RAG

- **멀티모달 AI**
  - 텍스트 + 이미지 + 음성
  - DALL-E, Midjourney
  - 비디오 생성 AI

### 2. AI 에이전트 (AI Agents)
```python
# 간단한 AI 에이전트 개념
class AIAgent:
    def __init__(self, llm_model):
        self.llm = llm_model
        self.memory = []
        self.tools = []
    
    def process_query(self, query):
        # 1. 쿼리 이해
        intent = self.understand_intent(query)
        
        # 2. 도구 선택
        tool = self.select_tool(intent)
        
        # 3. 실행 및 응답
        result = tool.execute(query)
        return result
```

### 3. AI 최적화 기술
- **모델 경량화**: Quantization, Pruning
- **엣지 AI**: 모바일, IoT 기기
- **연합 학습**: 분산 학습 패러다임

## 📊 AI 개발 환경 설정

### 필수 설치 목록
```bash
# Python 환경 (Anaconda 권장)
conda create -n ai_env python=3.9
conda activate ai_env

# 기본 라이브러리
pip install numpy pandas matplotlib seaborn
pip install scikit-learn

# 딥러닝 프레임워크
pip install tensorflow
pip install torch torchvision

# 시각화 도구
pip install plotly
pip install jupyter

# NLP 도구
pip install transformers
pip install spacy
```

### 개발 도구
- **IDE**: VS Code, PyCharm, Jupyter Notebook
- **클라우드 플랫폼**: Google Colab, Kaggle, AWS SageMaker
- **버전 관리**: Git, DVC (Data Version Control)
- **실험 관리**: MLflow, Weights & Biases

## 🎯 커리어 경로

### 1. 데이터 사이언티스트
- **필요 스킬**: 통계, SQL, 시각화
- **평균 연봉**: $150,000/년
- **주요 업무**: 데이터 분석, 인사이트 도출

### 2. 머신러닝 엔지니어
- **필요 스킬**: MLOps, 클라우드, 시스템 설계
- **평균 연봉**: $135,000/년
- **주요 업무**: 모델 배포, 파이프라인 구축

### 3. AI 연구원
- **필요 스킬**: 수학, 논문 작성, 알고리즘
- **평균 연봉**: $160,000/년
- **주요 업무**: 새로운 알고리즘 개발

## 🔍 심화 학습 방향

### 단기 목표 (1주일)
- Python 기반 머신러닝 프로젝트 3개 완성
- Kaggle 경진대회 참여
- TensorFlow/PyTorch 공식 튜토리얼 완주

### 중기 목표 (1개월)
- 컴퓨터 비전 또는 NLP 특화 학습
- 실제 데이터셋으로 end-to-end 프로젝트
- AI 논문 읽기 시작

### 장기 목표 (3개월)
- 전문 분야 선택하여 깊이 있는 학습
- 오픈소스 기여 또는 블로그 운영
- AI 커뮤니티 활동 및 네트워킹

## 💡 학습 리소스

### 온라인 강의
- **Coursera**: Andrew Ng의 Machine Learning Course
- **Fast.ai**: Practical Deep Learning for Coders
- **Udacity**: AI Nanodegree

### 실습 플랫폼
- **Kaggle**: 데이터 과학 경진대회
- **Papers With Code**: 최신 연구 논문과 코드
- **Google AI Education**: 무료 AI 교육 자료

### 도서 추천
- "파이썬 머신러닝 완벽 가이드" - 권철민
- "핸즈온 머신러닝" - 오렐리앙 제롱
- "딥러닝" - 이안 굿펠로우

## 📝 체크리스트

- [ ] AI의 기본 개념과 분야 이해
- [ ] 머신러닝 알고리즘 5개 이상 학습
- [ ] 신경망과 딥러닝 구조 파악
- [ ] TensorFlow 또는 PyTorch 기본 사용법
- [ ] MNIST 손글씨 인식 프로젝트 완성
- [ ] 개발 환경 설정 완료
- [ ] 향후 학습 계획 수립

---

💡 **성공 팁**: AI 학습은 이론과 실습의 균형이 중요합니다. 매일 조금씩이라도 코딩하고, 실제 문제를 해결하는 프로젝트를 진행하세요. 커뮤니티에 참여하여 다른 학습자들과 경험을 공유하는 것도 큰 도움이 됩니다!