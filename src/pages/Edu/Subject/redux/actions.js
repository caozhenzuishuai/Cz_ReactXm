import {
  reqGetSubjectList,
  reqGetSubSubjectList,
  reqUpdateSubject,
} from "@api/edu/subject";
import {
  GET_SUBJECT_LIST,
  GET_SUB_SUBJECT_LIST,
  UPDATE_SUBJECT,
} from "./constants";

const getSubjectListSync = (subjectList) => ({
  type: GET_SUBJECT_LIST,
  data: subjectList,
});

export const getSubjectList = (page, limit) => {
  return (dispatch) => {
    return reqGetSubjectList(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response.items;
    });
  };
};
const getSubSubjectListSync = (data) => ({
  type: GET_SUB_SUBJECT_LIST,
  data,
});

export const getSubSubjectList = (parentId) => {
  return (dispatch) => {
    return reqGetSubSubjectList(parentId).then((response) => {
      dispatch(
        getSubSubjectListSync({ parentId, subSubjectList: response.items })
      );
      return response;
    });
  };
};
const updateSubjectSync = (subject) => ({
  type: UPDATE_SUBJECT,
  data: subject,
});

export const updateSubject = (title, id) => {
  return (dispatch) => {
    return reqUpdateSubject(title, id).then((response) => {
      const subject = { title, _id: id };
      dispatch(updateSubjectSync(subject));
      return subject;
    });
  };
};
