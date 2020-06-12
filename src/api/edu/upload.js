import request from "@utils/request";

export function reqGetUploadToken() {
  return request({
    url: `/uploadtoken`,
    method: "GET",
  });
}
