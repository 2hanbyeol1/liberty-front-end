import Header from '../../component/common/Header';
import Footer from '../../component/common/Footer';
import {
  EmptyListExpression,
  PageMoveButton,
  PageNumberButton,
  QuestionContainer,
  QuestionListHeader,
  QuestionListRowSmallItem,
  QuestionListRowTitle,
  QuestionListTable,
  QuestionListTableBodyRow,
  QuestionListTableBodyWriteTimestamp,
  QuestionListTableHeader,
  QuestionListTableHeaderSmallItem,
  PageNumberButtonWrapper,
  QuestionPageButton,
  QuestionPageButtonWrapper,
  QuestionTableHeaderMiddleItem,
} from '../../component/question/QuestionComponent';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { HTML_EDITOR_MODE } from '../../global/Constants';
import { getQuestionList } from '../../axios/question/QuestionsList';
import { convertQuestionStatus } from '../../utils';
import uuid from 'react-uuid';
import { QUESTION_DETAIL, QUESTION_EDITOR } from '../../constants/path';

export default function QuestionList() {
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(0);

  const [data, setData] = useState([]);

  const pageSize = 10;

  const effect = async () => {
    try {
      const list = await getQuestionList(pageNum, pageSize);
      let count = 0;
      let number = 1 + pageNum * pageSize;

      while (count < list.data.contents.length) {
        list.data.contents[count].no = number + count;
        count++;
      }
      setData(list.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    effect();
  }, [pageNum]);

  const moveToEditorPageButtonClicked = () => {
    navigate(QUESTION_EDITOR, {
      state: {
        mode: HTML_EDITOR_MODE.ADD,
      },
    });
  };
  const moveToDetailPageButtonClicked = (id) => {
    navigate(`${QUESTION_DETAIL}/${id}`);
  };

  const createPageNumberButton = () => {
    if (data === undefined) return undefined;
    const array = new Array();
    for (let i = data.startPage; i <= data.lastPage; i++) array.push(i);
    return array;
  };

  const pageNumberButtonClicked = (id) => {
    setPageNum(id - 1);
  };
  const pageNumberMinusButtonClicked = () => {
    if (pageNum === 0) return;
    setPageNum((prev) => prev - 1);
  };
  const pageNumberPlusButtonClicked = () => {
    if (pageNum === data.totalPage - 1) return;
    setPageNum((prev) => prev + 1);
  };

  return (
    <>
      <Header />
      <QuestionContainer>
        <QuestionListHeader>1:1문의</QuestionListHeader>
        <QuestionListTable>
          <thead>
            <QuestionListTableHeader>
              <QuestionListTableHeaderSmallItem>No</QuestionListTableHeaderSmallItem>
              <th>제목</th>
              <QuestionListTableHeaderSmallItem>상태</QuestionListTableHeaderSmallItem>
              <QuestionTableHeaderMiddleItem>작성시간</QuestionTableHeaderMiddleItem>
            </QuestionListTableHeader>
          </thead>
          <tbody>
            {data.contents?.length !== 0 ? (
              data.contents?.map((d) => {
                return (
                  <QuestionListTableBodyRow
                    key={d.id}
                    onClick={() => moveToDetailPageButtonClicked(d.id)}
                  >
                    <QuestionListRowSmallItem>{d.no}</QuestionListRowSmallItem>
                    <QuestionListRowTitle>{d.title}</QuestionListRowTitle>
                    <QuestionListRowSmallItem>
                      {convertQuestionStatus(d.status)}
                    </QuestionListRowSmallItem>
                    <QuestionListTableBodyWriteTimestamp>
                      {d.createdAt}
                    </QuestionListTableBodyWriteTimestamp>
                  </QuestionListTableBodyRow>
                );
              })
            ) : (
              <></>
            )}
          </tbody>
        </QuestionListTable>
        {data.contents?.length === 0 ? (
          <EmptyListExpression key={uuid()}>등록된 문의가 없습니다</EmptyListExpression>
        ) : (
          <PageNumberButtonWrapper key={uuid()}>
            <PageMoveButton onClick={pageNumberMinusButtonClicked}>&lt;</PageMoveButton>
            {createPageNumberButton()?.map((i) => (
              <PageNumberButton
                key={i}
                isCurrentPage={i === data.currentPage}
                onClick={() => pageNumberButtonClicked(i)}
              >
                {i}
              </PageNumberButton>
            ))}
            <PageMoveButton onClick={pageNumberPlusButtonClicked}>&gt;</PageMoveButton>
          </PageNumberButtonWrapper>
        )}
        <QuestionPageButtonWrapper>
          <QuestionPageButton onClick={moveToEditorPageButtonClicked}>문의 작성</QuestionPageButton>
        </QuestionPageButtonWrapper>
      </QuestionContainer>
      <Footer />
    </>
  );
}
