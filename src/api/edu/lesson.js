import request from "@utils/request";

const BASE_URL = "/admin/edu/lesson";

export function reqGetLessonList(chapterId) {
  return request({
    url: `${BASE_URL}/get/${chapterId}`,
    method: "GET",
  });
}
export function reqAddLesson({ chapterId, title, free, video }) {
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data: {
      chapterId,
      title,
      free,
      video,
    },
  });
}
