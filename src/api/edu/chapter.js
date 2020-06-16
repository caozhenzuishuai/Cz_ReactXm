import request from "@utils/request";

//公共前缀
const BASE_URL = "/admin/edu/chapter";

//所有课程数据
export function reqGetChapterList({ page, limit, courseId }) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
    params: {
      courseId,
    },
  });
}

//批量删除章节
export function reqBatchRemoveChapterList(idList) {
  return request({
    url: `${BASE_URL}/batchRemove`,
    method: "DELETE",
    data: {
      idList,
    },
  });
}
