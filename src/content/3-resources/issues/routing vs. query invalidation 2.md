## 문제 상황
react router와 tanstack query를 이용하는 상황이다. 특정 이벤트 발생시 query invalidation과 navigate 조합을 사용하는 경우가 많은데 이럴 때 비동기 타임이 문제가 생기곤 한다. 

예를 들면, 로그인/로그아웃을 하고 다음과 같이 invalidate 후 home으로 naviagate할 때
```
queryClient.invalidateQuries({ queryKey: ['session'] });
navigate('/')
```
invalidate가 끝나기 전에 navigate가 되어버려서 리렌더링이 되지 않는 이슈가 생긴다

## 해결 방안
1. invalidateQueries는 promise가 아니므로 promise에 해당하는 refetchQueries를 사용한다.