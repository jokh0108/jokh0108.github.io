# 자연어처리 학습 로드맵 (1일 속성 과정)

## 📚 출처
- [Hugging Face NLP Course](https://huggingface.co/course/chapter1/1)
- [Stanford CS224N NLP Course](http://web.stanford.edu/class/cs224n/)
- [Spacy NLP Tutorial](https://spacy.io/usage/spacy-101)
- [NLTK Documentation](https://www.nltk.org/)

## 🎯 학습 목표
- 자연어처리의 기본 개념과 파이프라인 이해
- 텍스트 전처리와 토큰화 기법 습득
- 트랜스포머와 BERT 모델 활용
- 실무에서 사용하는 NLP 라이브러리 사용법

## 📋 1일 학습 계획 (8시간)

### 1단계: NLP 기초 (2시간)
#### 1.1 자연어처리 개요 (30분)
- NLP의 정의와 응용 분야
- 언어의 계층 구조 (음성학, 형태론, 구문론, 의미론)
- NLP의 주요 과제들

#### 1.2 텍스트 전처리 (1시간 30분)
```python
import nltk
import spacy
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer

# 기본 전처리 파이프라인
def preprocess_text(text):
    # 1. 토큰화
    tokens = word_tokenize(text.lower())
    
    # 2. 불용어 제거
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    
    # 3. 어간 추출 (Stemming)
    stemmer = PorterStemmer()
    stemmed = [stemmer.stem(token) for token in tokens]
    
    # 4. 표제어 추출 (Lemmatization)
    lemmatizer = WordNetLemmatizer()
    lemmatized = [lemmatizer.lemmatize(token) for token in tokens]
    
    return lemmatized
```

### 2단계: 언어 모델과 벡터화 (2시간)
#### 2.1 텍스트 벡터화 기법 (1시간)
```python
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from gensim.models import Word2Vec, FastText
import numpy as np

# TF-IDF 벡터화
vectorizer = TfidfVectorizer(max_features=1000)
tfidf_matrix = vectorizer.fit_transform(documents)

# Word2Vec 임베딩
sentences = [text.split() for text in documents]
w2v_model = Word2Vec(sentences, vector_size=100, window=5, min_count=1)

# 문서 임베딩 생성
def doc_embedding(text, model):
    words = text.split()
    vectors = [model.wv[word] for word in words if word in model.wv]
    return np.mean(vectors, axis=0) if vectors else np.zeros(100)
```

#### 2.2 언어 모델 기초 (1시간)
- N-gram 모델
- 통계적 언어 모델
- 신경망 언어 모델 (RNN, LSTM)

### 3단계: 트랜스포머와 BERT (2시간)
#### 3.1 트랜스포머 아키텍처 (1시간)
```python
from transformers import AutoTokenizer, AutoModel
import torch

# BERT 모델 로드
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModel.from_pretrained('bert-base-uncased')

# 텍스트 인코딩
def encode_text(text):
    inputs = tokenizer(text, return_tensors='pt', 
                      padding=True, truncation=True, max_length=512)
    
    with torch.no_grad():
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1)
    
    return embeddings
```

#### 3.2 Pre-trained 모델 활용 (1시간)
```python
from transformers import pipeline

# 감정 분석
sentiment_pipeline = pipeline("sentiment-analysis")
result = sentiment_pipeline("I love this product!")

# 질의응답
qa_pipeline = pipeline("question-answering")
context = "The quick brown fox jumps over the lazy dog."
question = "What animal jumps?"
answer = qa_pipeline(question=question, context=context)

# 텍스트 요약
summarizer = pipeline("summarization")
summary = summarizer("Long text to summarize...", max_length=50)
```

### 4단계: NLP 응용과 실습 (2시간)
#### 4.1 텍스트 분류 프로젝트 (1시간)
```python
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report

# 데이터 준비 (예: 스팸 분류)
X_train, X_test, y_train, y_test = train_test_split(texts, labels, test_size=0.2)

# 벡터화
vectorizer = TfidfVectorizer(max_features=5000)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# 모델 훈련
classifier = MultinomialNB()
classifier.fit(X_train_tfidf, y_train)

# 예측 및 평가
predictions = classifier.predict(X_test_tfidf)
print(classification_report(y_test, predictions))
```

#### 4.2 고급 NLP 태스크 (1시간)
```python
import spacy

# Named Entity Recognition (NER)
nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple Inc. was founded by Steve Jobs in Cupertino.")
for ent in doc.ents:
    print(f"{ent.text} - {ent.label_}")

# 의존성 파싱
for token in doc:
    print(f"{token.text} -> {token.dep_} -> {token.head.text}")

# 품사 태깅
for token in doc:
    print(f"{token.text} - {token.pos_}")
```

## 🔧 주요 NLP 라이브러리

### 1. NLTK (자연어 툴킷)
```python
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
```

### 2. spaCy (산업용 NLP)
```python
import spacy
nlp = spacy.load("en_core_web_sm")
```

### 3. Hugging Face Transformers
```python
from transformers import pipeline, AutoTokenizer, AutoModel
```

### 4. Gensim (토픽 모델링)
```python
from gensim.models import LdaModel, Word2Vec, Doc2Vec
```

## 📊 NLP 평가 지표

### 분류 태스크
- 정확도 (Accuracy)
- 정밀도 (Precision)
- 재현율 (Recall)
- F1-Score

### 생성 태스크
- BLEU Score (기계번역)
- ROUGE Score (요약)
- Perplexity (언어모델)

## 🚀 최신 NLP 트렌드

### 1. 대형 언어 모델 (LLM)
- GPT 시리즈
- BERT, RoBERTa
- T5, BART

### 2. 프롬프트 엔지니어링
```python
# Few-shot learning 예제
prompt = """
Classify the sentiment of the following texts:

Text: "I love this movie!"
Sentiment: Positive

Text: "This is terrible."
Sentiment: Negative

Text: "The weather is okay."
Sentiment: 
"""
```

### 3. 멀티모달 NLP
- 텍스트 + 이미지
- 음성 + 텍스트
- 비디오 + 텍스트

## 🎯 실무 프로젝트 아이디어

1. **챗봇 개발**
2. **감정 분석 대시보드**
3. **뉴스 요약 시스템**
4. **키워드 추출 도구**
5. **언어 번역기**

## 📚 추천 자료

### 도서
- "자연어 처리 쿡북" - 앨리스 정
- "밑바닥부터 시작하는 딥러닝 2" - 사이토 고키

### 온라인 강의
- CS224N: Natural Language Processing with Deep Learning
- Hugging Face NLP Course

## 📝 체크리스트

- [ ] 텍스트 전처리 파이프라인 구현
- [ ] TF-IDF와 Word2Vec 차이 이해
- [ ] BERT 모델 활용 가능
- [ ] 텍스트 분류 프로젝트 완성
- [ ] NER과 품사 태깅 구현
- [ ] 실무 프로젝트 1개 기획

---

💡 **학습 팁**: NLP는 다양한 언어와 도메인에 따라 성능이 달라집니다. 실제 데이터로 많이 실험해보고, 최신 모델들의 동향을 꾸준히 따라가세요!