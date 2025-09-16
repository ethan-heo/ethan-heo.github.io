/**
 *
 * @param searchQuery 검색할 문자열
 * @description 입력받은 문자열이 검색 가능한 문자열 유무를 반환한다.
 * @returns
 */
const validateSearchQuery = (searchQuery: string): boolean => {
    if (searchQuery.trim().length === 0) {
        return false;
    }

    return true;
};

export default validateSearchQuery;
