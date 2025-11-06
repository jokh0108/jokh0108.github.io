# 알고리즘 학습 로드맵 (1일 속성 과정)

## 📚 출처
- [LeetCode Study Guide](https://leetcode.com/explore/)
- [GeeksforGeeks Algorithms](https://www.geeksforgeeks.org/fundamentals-of-algorithms/)
- [Introduction to Algorithms - CLRS](https://mitpress.mit.edu/books/introduction-algorithms)
- [Algorithm Design Manual - Skiena](http://algorist.com/)

## 🎯 학습 목표
- 기본 알고리즘의 동작 원리와 시간복잡도 이해
- 문제 해결을 위한 알고리즘 설계 패턴 습득
- 코딩테스트 대비 핵심 알고리즘 구현 능력
- 실무에서 활용 가능한 최적화 기법 학습

## 📋 1일 학습 계획 (8시간)

### 1단계: 정렬과 탐색 알고리즘 (2시간)
#### 1.1 정렬 알고리즘 (1시간 30분)
```python
# 1. 버블 정렬 - O(n²)
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# 2. 선택 정렬 - O(n²)
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# 3. 삽입 정렬 - O(n²), 부분적으로 정렬된 배열에 효율적
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# 4. 병합 정렬 - O(n log n)
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# 5. 퀵 정렬 - 평균 O(n log n), 최악 O(n²)
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# 6. 힙 정렬 - O(n log n)
def heap_sort(arr):
    import heapq
    heapq.heapify(arr)
    return [heapq.heappop(arr) for _ in range(len(arr))]

# 7. 계수 정렬 - O(n + k), k는 최대값
def counting_sort(arr, max_val):
    count = [0] * (max_val + 1)
    
    for num in arr:
        count[num] += 1
    
    result = []
    for i in range(max_val + 1):
        result.extend([i] * count[i])
    
    return result
```

#### 1.2 탐색 알고리즘 (30분)
```python
# 1. 선형 탐색 - O(n)
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# 2. 이진 탐색 - O(log n)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# 3. 이진 탐색 (재귀)
def binary_search_recursive(arr, target, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# 4. 삼분 탐색 (Ternary Search) - O(log n)
def ternary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid1 = left + (right - left) // 3
        mid2 = right - (right - left) // 3
        
        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2
        
        if target < arr[mid1]:
            right = mid1 - 1
        elif target > arr[mid2]:
            left = mid2 + 1
        else:
            left = mid1 + 1
            right = mid2 - 1
    
    return -1
```

### 2단계: 동적 계획법과 그리디 (2시간)
#### 2.1 동적 계획법 (DP) (1시간 30분)
```python
# 1. 피보나치 수열
# 재귀 (비효율적) - O(2^n)
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n-1) + fibonacci_recursive(n-2)

# 메모이제이션 - O(n)
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]

# 바텀업 DP - O(n)
def fibonacci_dp(n):
    if n <= 1:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

# 공간 최적화 - O(1)
def fibonacci_optimized(n):
    if n <= 1:
        return n
    
    prev2, prev1 = 0, 1
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1

# 2. 배낭 문제 (0-1 Knapsack)
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    dp[i-1][w],  # 현재 아이템을 선택하지 않음
                    dp[i-1][w-weights[i-1]] + values[i-1]  # 현재 아이템 선택
                )
            else:
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]

# 3. 최장 증가 부분 수열 (LIS)
def longest_increasing_subsequence(arr):
    n = len(arr)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

# 4. 편집 거리 (Edit Distance)
def edit_distance(str1, str2):
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # 초기화
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(
                    dp[i-1][j],    # 삭제
                    dp[i][j-1],    # 삽입
                    dp[i-1][j-1]   # 교체
                )
    
    return dp[m][n]

# 5. 동전 문제 (Coin Change)
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

#### 2.2 그리디 알고리즘 (30분)
```python
# 1. 활동 선택 문제 (Activity Selection)
def activity_selection(start, end):
    n = len(start)
    activities = list(range(n))
    activities.sort(key=lambda x: end[x])
    
    selected = [activities[0]]
    last_end = end[activities[0]]
    
    for i in range(1, n):
        if start[activities[i]] >= last_end:
            selected.append(activities[i])
            last_end = end[activities[i]]
    
    return selected

# 2. 분할 가능 배낭 문제
def fractional_knapsack(weights, values, capacity):
    n = len(weights)
    items = [(values[i] / weights[i], weights[i], values[i], i) 
             for i in range(n)]
    items.sort(reverse=True)  # 가치/무게 비율로 정렬
    
    total_value = 0
    for ratio, weight, value, idx in items:
        if capacity >= weight:
            capacity -= weight
            total_value += value
        else:
            total_value += ratio * capacity
            break
    
    return total_value

# 3. 최소 스패닝 트리 (Kruskal's Algorithm)
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True

def kruskal_mst(n, edges):
    edges.sort(key=lambda x: x[2])  # 가중치로 정렬
    uf = UnionFind(n)
    mst = []
    total_weight = 0
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst.append((u, v, weight))
            total_weight += weight
            if len(mst) == n - 1:
                break
    
    return mst, total_weight
```

### 3단계: 그래프 알고리즘 (2시간)
#### 3.1 그래프 순회 (1시간)
```python
from collections import defaultdict, deque

class Graph:
    def __init__(self):
        self.graph = defaultdict(list)
        self.vertices = set()
    
    def add_edge(self, u, v, directed=False):
        self.graph[u].append(v)
        if not directed:
            self.graph[v].append(u)
        self.vertices.update([u, v])
    
    # 깊이 우선 탐색 (DFS)
    def dfs(self, start, visited=None):
        if visited is None:
            visited = set()
        
        visited.add(start)
        print(start, end=' ')
        
        for neighbor in self.graph[start]:
            if neighbor not in visited:
                self.dfs(neighbor, visited)
        
        return visited
    
    # DFS (스택 사용)
    def dfs_iterative(self, start):
        visited = set()
        stack = [start]
        
        while stack:
            vertex = stack.pop()
            if vertex not in visited:
                visited.add(vertex)
                print(vertex, end=' ')
                stack.extend(neighbor for neighbor in self.graph[vertex] 
                           if neighbor not in visited)
        
        return visited
    
    # 너비 우선 탐색 (BFS)
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
        
        return visited
    
    # 위상 정렬 (Topological Sort)
    def topological_sort(self):
        in_degree = {v: 0 for v in self.vertices}
        
        for u in self.graph:
            for v in self.graph[u]:
                in_degree[v] += 1
        
        queue = deque([v for v in in_degree if in_degree[v] == 0])
        result = []
        
        while queue:
            vertex = queue.popleft()
            result.append(vertex)
            
            for neighbor in self.graph[vertex]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        return result if len(result) == len(self.vertices) else None
    
    # 사이클 검출 (방향 그래프)
    def has_cycle_directed(self):
        WHITE, GRAY, BLACK = 0, 1, 2
        color = {v: WHITE for v in self.vertices}
        
        def dfs_cycle(node):
            color[node] = GRAY
            
            for neighbor in self.graph[node]:
                if color[neighbor] == GRAY:
                    return True
                if color[neighbor] == WHITE and dfs_cycle(neighbor):
                    return True
            
            color[node] = BLACK
            return False
        
        for vertex in self.vertices:
            if color[vertex] == WHITE:
                if dfs_cycle(vertex):
                    return True
        
        return False
```

#### 3.2 최단 경로 알고리즘 (1시간)
```python
import heapq

# 1. 다익스트라 알고리즘 - O((V + E) log V)
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    visited = set()
    
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        
        if current_node in visited:
            continue
        
        visited.add(current_node)
        
        for neighbor, weight in graph[current_node]:
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances

# 2. 벨만-포드 알고리즘 - O(VE)
def bellman_ford(graph, start):
    vertices = set()
    edges = []
    
    for u in graph:
        vertices.add(u)
        for v, weight in graph[u]:
            vertices.add(v)
            edges.append((u, v, weight))
    
    distances = {v: float('inf') for v in vertices}
    distances[start] = 0
    
    # V-1 번 반복
    for _ in range(len(vertices) - 1):
        for u, v, weight in edges:
            if distances[u] != float('inf') and distances[u] + weight < distances[v]:
                distances[v] = distances[u] + weight
    
    # 음수 사이클 검출
    for u, v, weight in edges:
        if distances[u] != float('inf') and distances[u] + weight < distances[v]:
            return None  # 음수 사이클 존재
    
    return distances

# 3. 플로이드-워셜 알고리즘 - O(V³)
def floyd_warshall(graph):
    vertices = list(graph.keys())
    n = len(vertices)
    dist = {}
    
    # 초기화
    for i in vertices:
        dist[i] = {}
        for j in vertices:
            if i == j:
                dist[i][j] = 0
            else:
                dist[i][j] = float('inf')
    
    # 직접 연결된 간선 추가
    for u in graph:
        for v, weight in graph[u]:
            dist[u][v] = weight
    
    # 플로이드-워셜 알고리즘
    for k in vertices:
        for i in vertices:
            for j in vertices:
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist

# 4. A* 알고리즘 (휴리스틱 사용)
def a_star(graph, start, goal, heuristic):
    open_set = [(0, start)]
    came_from = {}
    g_score = {node: float('inf') for node in graph}
    g_score[start] = 0
    f_score = {node: float('inf') for node in graph}
    f_score[start] = heuristic(start, goal)
    
    while open_set:
        current = heapq.heappop(open_set)[1]
        
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]
        
        for neighbor, weight in graph[current]:
            tentative_g_score = g_score[current] + weight
            
            if tentative_g_score < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, goal)
                heapq.heappush(open_set, (f_score[neighbor], neighbor))
    
    return None
```

### 4단계: 고급 알고리즘과 최적화 (2시간)
#### 4.1 분할 정복과 백트래킹 (1시간)
```python
# 1. 분할 정복 - 최대 부배열 합
def max_subarray_sum(arr):
    def max_crossing_sum(arr, left, mid, right):
        left_sum = float('-inf')
        current_sum = 0
        for i in range(mid, left - 1, -1):
            current_sum += arr[i]
            left_sum = max(left_sum, current_sum)
        
        right_sum = float('-inf')
        current_sum = 0
        for i in range(mid + 1, right + 1):
            current_sum += arr[i]
            right_sum = max(right_sum, current_sum)
        
        return left_sum + right_sum
    
    def max_subarray_recursive(arr, left, right):
        if left == right:
            return arr[left]
        
        mid = (left + right) // 2
        
        return max(
            max_subarray_recursive(arr, left, mid),
            max_subarray_recursive(arr, mid + 1, right),
            max_crossing_sum(arr, left, mid, right)
        )
    
    return max_subarray_recursive(arr, 0, len(arr) - 1)

# 2. 백트래킹 - N-Queens 문제
def n_queens(n):
    def is_safe(board, row, col):
        # 같은 열 검사
        for i in range(row):
            if board[i] == col:
                return False
        
        # 대각선 검사
        for i in range(row):
            if abs(board[i] - col) == abs(i - row):
                return False
        
        return True
    
    def solve(board, row):
        if row == n:
            solutions.append(board[:])
            return
        
        for col in range(n):
            if is_safe(board, row, col):
                board[row] = col
                solve(board, row + 1)
                board[row] = -1
    
    solutions = []
    board = [-1] * n
    solve(board, 0)
    return solutions

# 3. 부분집합 합 문제
def subset_sum(arr, target):
    def backtrack(index, current_sum, path):
        if current_sum == target:
            solutions.append(path[:])
            return
        
        if index >= len(arr) or current_sum > target:
            return
        
        # 현재 원소 포함
        path.append(arr[index])
        backtrack(index + 1, current_sum + arr[index], path)
        path.pop()
        
        # 현재 원소 제외
        backtrack(index + 1, current_sum, path)
    
    solutions = []
    backtrack(0, 0, [])
    return solutions

# 4. 순열 생성
def generate_permutations(arr):
    def backtrack(path):
        if len(path) == len(arr):
            result.append(path[:])
            return
        
        for i in range(len(arr)):
            if arr[i] not in path:
                path.append(arr[i])
                backtrack(path)
                path.pop()
    
    result = []
    backtrack([])
    return result
```

#### 4.2 고급 최적화 기법 (1시간)
```python
# 1. 슬라이딩 윈도우
def max_sum_subarray(arr, k):
    if len(arr) < k:
        return -1
    
    # 첫 번째 윈도우의 합
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # 슬라이딩 윈도우
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# 2. 투 포인터 기법
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]

# 3. 빠른 거듭제곱
def power(base, exp, mod=None):
    if exp == 0:
        return 1
    
    if exp % 2 == 0:
        half_power = power(base, exp // 2, mod)
        result = half_power * half_power
    else:
        result = base * power(base, exp - 1, mod)
    
    return result % mod if mod else result

# 4. 유클리드 호제법 (최대공약수)
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return (a * b) // gcd(a, b)

# 5. 소수 판별 (밀러-라빈 테스트)
def is_prime(n, k=5):
    if n < 2:
        return False
    if n == 2 or n == 3:
        return True
    if n % 2 == 0:
        return False
    
    # n-1을 d * 2^r로 분해
    r = 0
    d = n - 1
    while d % 2 == 0:
        r += 1
        d //= 2
    
    # k번 테스트
    for _ in range(k):
        a = random.randrange(2, n - 1)
        x = pow(a, d, n)
        
        if x == 1 or x == n - 1:
            continue
        
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    
    return True
```

## 📊 알고리즘 복잡도 비교표

| 알고리즘 | 최선 | 평균 | 최악 | 공간복잡도 | 안정성 |
|---------|------|------|------|------------|--------|
| 버블 정렬 | O(n) | O(n²) | O(n²) | O(1) | 안정 |
| 선택 정렬 | O(n²) | O(n²) | O(n²) | O(1) | 불안정 |
| 삽입 정렬 | O(n) | O(n²) | O(n²) | O(1) | 안정 |
| 병합 정렬 | O(n log n) | O(n log n) | O(n log n) | O(n) | 안정 |
| 퀵 정렬 | O(n log n) | O(n log n) | O(n²) | O(log n) | 불안정 |
| 힙 정렬 | O(n log n) | O(n log n) | O(n log n) | O(1) | 불안정 |

## 🎯 문제 해결 전략

### 1. 문제 유형별 접근법
```python
# 패턴 인식 가이드
problem_patterns = {
    "배열 순회": "이중 반복문, 슬라이딩 윈도우",
    "최적해 찾기": "동적 계획법, 그리디",
    "경로 탐색": "DFS, BFS, 다익스트라",
    "조합 생성": "백트래킹, 재귀",
    "문자열 처리": "투 포인터, KMP",
    "구간 쿼리": "세그먼트 트리, 펜윅 트리"
}
```

### 2. 최적화 체크리스트
- [ ] 시간복잡도를 줄일 수 있는가?
- [ ] 공간복잡도를 개선할 수 있는가?
- [ ] 특수한 자료구조가 도움이 되는가?
- [ ] 수학적 성질을 활용할 수 있는가?
- [ ] 분할 정복으로 해결 가능한가?

## 🏆 실전 연습 문제

### 초급 (기본 구현)
1. 두 수의 합 찾기
2. 배열에서 최댓값/최솟값
3. 문자열 뒤집기
4. 팩토리얼 계산
5. 피보나치 수열

### 중급 (알고리즘 응용)
1. 이진 탐색 구현
2. 병합 정렬 구현
3. 최장 공통 부분 수열
4. 동전 거스름돈 문제
5. 섬의 개수 구하기

### 고급 (복합 문제)
1. 외판원 순회 문제
2. 최대 유량 문제
3. 문자열 매칭 (KMP)
4. 최소 비용 최대 유량
5. 세그먼트 트리 응용

## 📚 학습 리소스

### 온라인 저지
- **LeetCode**: 코딩 인터뷰 대비
- **백준**: 한국어 문제
- **Codeforces**: 경진대회 스타일
- **HackerRank**: 기업 코딩테스트

### 참고 도서
- "알고리즘 문제 해결 전략" - 구종만
- "프로그래밍 대회에서 배우는 알고리즘과 자료구조" - 와타노베 유타카

## 📝 체크리스트

- [ ] 기본 정렬 알고리즘 5개 이상 구현
- [ ] 이진 탐색과 변형 알고리즘 이해
- [ ] 동적 계획법 핵심 문제 3개 해결
- [ ] 그래프 DFS/BFS 구현
- [ ] 최단 경로 알고리즘 2개 이상 학습
- [ ] 백트래킹 문제 해결 경험
- [ ] 각 알고리즘의 시간복잡도 암기
- [ ] 실전 문제 20개 이상 해결

---

💡 **성공 비결**: 알고리즘은 반복 학습이 핵심입니다. 매일 1-2문제씩 꾸준히 풀고, 틀린 문제는 여러 번 다시 풀어보세요!