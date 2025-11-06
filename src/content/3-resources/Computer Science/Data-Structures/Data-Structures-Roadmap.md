# 자료구조 학습 로드맵 (1일 속성 과정)

## 📚 출처
- [GeeksforGeeks Data Structures](https://www.geeksforgeeks.org/data-structures/)
- [LeetCode Study Guide](https://leetcode.com/explore/)
- [Introduction to Algorithms - CLRS](https://mitpress.mit.edu/books/introduction-algorithms)
- [Data Structures and Algorithms in Python](https://www.wiley.com/en-us/Data+Structures+and+Algorithms+in+Python-p-9781118290279)

## 🎯 학습 목표
- 기본 자료구조의 개념과 구현 방법 이해
- 각 자료구조의 시간/공간 복잡도 분석
- 실제 문제 해결에 적합한 자료구조 선택 능력
- 코딩 테스트 대비 핵심 자료구조 숙련도

## 📋 1일 학습 계획 (8시간)

### 1단계: 선형 자료구조 (2시간)
#### 1.1 배열과 리스트 (45분)
```python
# 정적 배열 (Python의 리스트는 동적 배열)
array = [1, 2, 3, 4, 5]

# 기본 연산
array.append(6)        # O(1) 평균, O(n) 최악
array.insert(0, 0)     # O(n)
array.pop()            # O(1)
array.pop(0)           # O(n)
array[2] = 10          # O(1) 접근

# 연결 리스트 구현
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0
    
    def append(self, val):          # O(n)
        new_node = ListNode(val)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        self.size += 1
    
    def prepend(self, val):         # O(1)
        new_node = ListNode(val)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
    
    def delete(self, val):          # O(n)
        if not self.head:
            return False
        
        if self.head.val == val:
            self.head = self.head.next
            self.size -= 1
            return True
        
        current = self.head
        while current.next and current.next.val != val:
            current = current.next
        
        if current.next:
            current.next = current.next.next
            self.size -= 1
            return True
        return False
```

#### 1.2 스택과 큐 (45분)
```python
# 스택 구현 (LIFO)
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):           # O(1)
        self.items.append(item)
    
    def pop(self):                  # O(1)
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items.pop()
    
    def peek(self):                 # O(1)
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# 큐 구현 (FIFO)
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):        # O(1)
        self.items.append(item)
    
    def dequeue(self):              # O(1)
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items.popleft()
    
    def front(self):                # O(1)
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# 덱(Deque) - 양방향 큐
class Deque:
    def __init__(self):
        self.items = deque()
    
    def add_front(self, item):      # O(1)
        self.items.appendleft(item)
    
    def add_rear(self, item):       # O(1)
        self.items.append(item)
    
    def remove_front(self):         # O(1)
        return self.items.popleft()
    
    def remove_rear(self):          # O(1)
        return self.items.pop()
```

#### 1.3 실습 문제 (30분)
```python
# 1. 유효한 괄호 검사 (스택 활용)
def is_valid_parentheses(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack

# 2. 큐를 이용한 BFS 구현
def bfs_level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result
```

### 2단계: 트리 자료구조 (2시간)
#### 2.1 이진 트리 기초 (1시간)
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BinaryTree:
    def __init__(self):
        self.root = None
    
    # 전위 순회 (Preorder: Root -> Left -> Right)
    def preorder(self, node):
        if node:
            print(node.val, end=' ')
            self.preorder(node.left)
            self.preorder(node.right)
    
    # 중위 순회 (Inorder: Left -> Root -> Right)
    def inorder(self, node):
        if node:
            self.inorder(node.left)
            print(node.val, end=' ')
            self.inorder(node.right)
    
    # 후위 순회 (Postorder: Left -> Right -> Root)
    def postorder(self, node):
        if node:
            self.postorder(node.left)
            self.postorder(node.right)
            print(node.val, end=' ')
    
    # 트리의 높이
    def height(self, node):
        if not node:
            return 0
        return 1 + max(self.height(node.left), self.height(node.right))
    
    # 노드 개수
    def count_nodes(self, node):
        if not node:
            return 0
        return 1 + self.count_nodes(node.left) + self.count_nodes(node.right)
```

#### 2.2 이진 탐색 트리 (BST) (1시간)
```python
class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, val):          # 평균 O(log n), 최악 O(n)
        self.root = self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if not node:
            return TreeNode(val)
        
        if val < node.val:
            node.left = self._insert_recursive(node.left, val)
        elif val > node.val:
            node.right = self._insert_recursive(node.right, val)
        
        return node
    
    def search(self, val):          # 평균 O(log n), 최악 O(n)
        return self._search_recursive(self.root, val)
    
    def _search_recursive(self, node, val):
        if not node or node.val == val:
            return node
        
        if val < node.val:
            return self._search_recursive(node.left, val)
        else:
            return self._search_recursive(node.right, val)
    
    def delete(self, val):          # 평균 O(log n), 최악 O(n)
        self.root = self._delete_recursive(self.root, val)
    
    def _delete_recursive(self, node, val):
        if not node:
            return node
        
        if val < node.val:
            node.left = self._delete_recursive(node.left, val)
        elif val > node.val:
            node.right = self._delete_recursive(node.right, val)
        else:
            # 삭제할 노드를 찾음
            if not node.left:
                return node.right
            elif not node.right:
                return node.left
            
            # 두 자식이 모두 있는 경우
            # 오른쪽 서브트리의 최솟값으로 대체
            min_node = self._find_min(node.right)
            node.val = min_node.val
            node.right = self._delete_recursive(node.right, min_node.val)
        
        return node
    
    def _find_min(self, node):
        while node.left:
            node = node.left
        return node
```

### 3단계: 해시 테이블과 그래프 (2시간)
#### 3.1 해시 테이블 (1시간)
```python
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]  # 체이닝 방식
    
    def _hash(self, key):           # O(1)
        return hash(key) % self.size
    
    def put(self, key, value):      # 평균 O(1), 최악 O(n)
        index = self._hash(key)
        bucket = self.table[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        
        bucket.append((key, value))
    
    def get(self, key):             # 평균 O(1), 최악 O(n)
        index = self._hash(key)
        bucket = self.table[index]
        
        for k, v in bucket:
            if k == key:
                return v
        
        raise KeyError(key)
    
    def delete(self, key):          # 평균 O(1), 최악 O(n)
        index = self._hash(key)
        bucket = self.table[index]
        
        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return v
        
        raise KeyError(key)

# 선형 탐사 방식 해시 테이블
class LinearProbingHashTable:
    def __init__(self, size=10):
        self.size = size
        self.keys = [None] * size
        self.values = [None] * size
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def put(self, key, value):
        index = self._hash(key)
        
        while self.keys[index] is not None:
            if self.keys[index] == key:
                self.values[index] = value
                return
            index = (index + 1) % self.size
        
        self.keys[index] = key
        self.values[index] = value
    
    def get(self, key):
        index = self._hash(key)
        
        while self.keys[index] is not None:
            if self.keys[index] == key:
                return self.values[index]
            index = (index + 1) % self.size
        
        raise KeyError(key)
```

#### 3.2 그래프 기초 (1시간)
```python
# 인접 리스트로 그래프 표현
class Graph:
    def __init__(self):
        self.graph = defaultdict(list)
    
    def add_edge(self, u, v, directed=False):
        self.graph[u].append(v)
        if not directed:
            self.graph[v].append(u)
    
    def dfs(self, start, visited=None):
        if visited is None:
            visited = set()
        
        visited.add(start)
        print(start, end=' ')
        
        for neighbor in self.graph[start]:
            if neighbor not in visited:
                self.dfs(neighbor, visited)
    
    def bfs(self, start):
        visited = set()
        queue = deque([start])
        visited.add(start)
        
        while queue:
            vertex = queue.popleft()
            print(vertex, end=' ')
            
            for neighbor in self.graph[vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
    
    def has_cycle(self):
        visited = set()
        rec_stack = set()
        
        def dfs_cycle(node):
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in self.graph[node]:
                if neighbor not in visited:
                    if dfs_cycle(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
            
            rec_stack.remove(node)
            return False
        
        for node in self.graph:
            if node not in visited:
                if dfs_cycle(node):
                    return True
        return False

# 가중치 그래프 (다익스트라 알고리즘)
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        
        if current_distance > distances[current_node]:
            continue
        
        for neighbor, weight in graph[current_node]:
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances
```

### 4단계: 고급 자료구조 (2시간)
#### 4.1 힙과 우선순위 큐 (1시간)
```python
import heapq

class MinHeap:
    def __init__(self):
        self.heap = []
    
    def push(self, val):            # O(log n)
        heapq.heappush(self.heap, val)
    
    def pop(self):                  # O(log n)
        if not self.heap:
            raise IndexError("Heap is empty")
        return heapq.heappop(self.heap)
    
    def peek(self):                 # O(1)
        if not self.heap:
            raise IndexError("Heap is empty")
        return self.heap[0]
    
    def size(self):
        return len(self.heap)

class MaxHeap:
    def __init__(self):
        self.heap = []
    
    def push(self, val):
        heapq.heappush(self.heap, -val)  # 음수로 변환하여 최대힙 구현
    
    def pop(self):
        if not self.heap:
            raise IndexError("Heap is empty")
        return -heapq.heappop(self.heap)
    
    def peek(self):
        if not self.heap:
            raise IndexError("Heap is empty")
        return -self.heap[0]

# 커스텀 우선순위 큐
class PriorityQueue:
    def __init__(self):
        self.queue = []
        self.index = 0
    
    def push(self, item, priority):
        heapq.heappush(self.queue, (priority, self.index, item))
        self.index += 1
    
    def pop(self):
        if not self.queue:
            raise IndexError("Queue is empty")
        return heapq.heappop(self.queue)[2]
```

#### 4.2 고급 트리 구조 (1시간)
```python
# 트라이(Trie) 구조
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):         # O(m), m은 단어 길이
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
    
    def search(self, word):         # O(m)
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word
    
    def starts_with(self, prefix):  # O(m)
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True
    
    def delete(self, word):
        def _delete(node, word, index):
            if index == len(word):
                if not node.is_end_of_word:
                    return False
                node.is_end_of_word = False
                return len(node.children) == 0
            
            char = word[index]
            if char not in node.children:
                return False
            
            should_delete = _delete(node.children[char], word, index + 1)
            
            if should_delete:
                del node.children[char]
                return len(node.children) == 0 and not node.is_end_of_word
            
            return False
        
        _delete(self.root, word, 0)

# 세그먼트 트리 (구간 합 쿼리)
class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.build(arr, 0, 0, self.n - 1)
    
    def build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
        else:
            mid = (start + end) // 2
            self.build(arr, 2 * node + 1, start, mid)
            self.build(arr, 2 * node + 2, mid + 1, end)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def update(self, idx, val):
        self._update(0, 0, self.n - 1, idx, val)
    
    def _update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
        else:
            mid = (start + end) // 2
            if idx <= mid:
                self._update(2 * node + 1, start, mid, idx, val)
            else:
                self._update(2 * node + 2, mid + 1, end, idx, val)
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]
    
    def query(self, left, right):
        return self._query(0, 0, self.n - 1, left, right)
    
    def _query(self, node, start, end, left, right):
        if right < start or end < left:
            return 0
        if left <= start and end <= right:
            return self.tree[node]
        
        mid = (start + end) // 2
        return (self._query(2 * node + 1, start, mid, left, right) +
                self._query(2 * node + 2, mid + 1, end, left, right))
```

## 📊 자료구조 선택 가이드

### 상황별 최적 자료구조
```python
# 1. 빠른 검색이 필요할 때
# - 해시 테이블: O(1) 평균
# - BST: O(log n) 보장
# - 트라이: 문자열 검색에 특화

# 2. 순서가 중요할 때
# - 배열/리스트: 인덱스 접근
# - 연결 리스트: 삽입/삭제 빈번
# - 덱: 양방향 삽입/삭제

# 3. 우선순위가 있을 때
# - 힙: 최댓값/최솟값 빠른 접근
# - 우선순위 큐: 작업 스케줄링

# 4. 계층 구조가 필요할 때
# - 트리: 파일 시스템, 조직도
# - 그래프: 네트워크, 관계
```

## 🔍 복잡도 분석표

| 자료구조 | 접근 | 검색 | 삽입 | 삭제 | 공간 |
|---------|------|------|------|------|------|
| 배열 | O(1) | O(n) | O(n) | O(n) | O(n) |
| 연결리스트 | O(n) | O(n) | O(1) | O(1) | O(n) |
| 스택 | O(n) | O(n) | O(1) | O(1) | O(n) |
| 큐 | O(n) | O(n) | O(1) | O(1) | O(n) |
| 해시테이블 | - | O(1)* | O(1)* | O(1)* | O(n) |
| BST | O(log n)* | O(log n)* | O(log n)* | O(log n)* | O(n) |
| 힙 | O(1) | O(n) | O(log n) | O(log n) | O(n) |

*평균 시간 복잡도

## 🎯 실무 활용 예시

### 1. 캐시 구현 (LRU Cache)
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key):
        if key in self.cache:
            self.cache.move_to_end(key)
            return self.cache[key]
        return -1
    
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        elif len(self.cache) >= self.capacity:
            self.cache.popitem(last=False)
        self.cache[key] = value
```

### 2. 자동완성 기능
```python
def autocomplete(trie, prefix, max_suggestions=5):
    suggestions = []
    
    def dfs(node, current_word):
        if len(suggestions) >= max_suggestions:
            return
        
        if node.is_end_of_word:
            suggestions.append(current_word)
        
        for char, child_node in node.children.items():
            dfs(child_node, current_word + char)
    
    # prefix까지 이동
    node = trie.root
    for char in prefix:
        if char not in node.children:
            return suggestions
        node = node.children[char]
    
    dfs(node, prefix)
    return suggestions
```

## 📝 체크리스트

- [ ] 배열과 연결리스트의 차이점 이해
- [ ] 스택과 큐의 구현 및 활용
- [ ] 이진 트리 순회 방법 숙지
- [ ] BST 삽입/삭제/검색 구현
- [ ] 해시 테이블 충돌 처리 방법
- [ ] 그래프 DFS/BFS 구현
- [ ] 힙과 우선순위 큐 활용
- [ ] 트라이 구조 이해 및 구현
- [ ] 각 자료구조의 시간복잡도 암기
- [ ] 실제 문제에 적절한 자료구조 선택

---

💡 **학습 팁**: 자료구조는 구현보다 언제 사용하는지가 더 중요합니다. 각 자료구조의 특성을 이해하고 실제 문제 해결에 적용해보세요!