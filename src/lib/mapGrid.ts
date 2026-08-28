/**
 * 격자의 칸이 그릴 테두리 방향을 배치 순서대로 적어 둔 값이다.
 *
 * 한 선을 한 칸만 그려야 선이 겹쳐 어긋나 보이는 일이 없다. 그래서 칸은 자기
 * 왼쪽과 위쪽만 그리고, 첫 열과 첫 행에서는 해당 방향을 그리지 않는다.
 * 격자 위아래의 바깥선은 컨테이너가 맡고 좌우 바깥선은 그리지 않는다.
 *
 * 좁은 화면은 두 열이고 중심 글이 첫 행 전체를 차지한다. 넓은 화면은 세 열이고
 * 중심 글이 첫 열에서 두 행을 차지한다. 배치가 이렇게 갈리므로 방향도 화면 폭에
 * 따라 나눠 적는다.
 */
export const MAP_EDGE_CLASSES = [
  '',
  'border-t wide:border-t-0 wide:border-l',
  'border-t border-l wide:border-t-0',
  'border-t wide:border-l',
  'border-t border-l',
];

/** 글이 모자라도 격자 모양을 지키기 위해 항상 채우는 칸 수. */
export const MAP_CELL_COUNT = MAP_EDGE_CLASSES.length;
