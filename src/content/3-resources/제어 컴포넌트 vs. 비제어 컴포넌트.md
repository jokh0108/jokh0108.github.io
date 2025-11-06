
form을 사용하는 상황.

제어 컴포넌트의 경우
- value와 onChange를 state, setState로 렌더링을 **제어**할 수 있다.
- 그런데, 한 부모 컴포넌트 아래서 useState를 여러개 두면서 여러 input을 제어하는 상황일 경우, 한 input의 입력 값 변경으로 setState가 호출되면, 다른 input들이 리렌더링 되어버리는 상황이 벌어진다.
- React.memo를 사용해서 input을 감싸면 value가 변동되지 않으니 해결될 것 같지만, onChange에 넘기는 callback도 새로운 참조로 형성되기 때문에 모두 useCallback(callback, []) 처리해줘야한다.
- 매우 번거롭다.

비제어 컴포넌트의 경우
- ref를 넘겨서 dom을 조작해서 value를 가져와야한다. 
- 그런데 React 렌더링이랑 관련이 없기 때문에 리렌더링을 일으키지 않는다.(브라우저랑 react랑 다르게 생각해야함.)

React-Hook-Form
- RHF은 기본적으로 비제어 컴포넌트를 사용하므로 렌더링에 최적화되어있다.


그렇다면 제어 컴포넌트는 언제? 
- setState할 때 새로운 값을 커스터마이징할 때