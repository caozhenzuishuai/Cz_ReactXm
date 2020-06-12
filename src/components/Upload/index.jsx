import React, { Component } from "react";
import {
  Button,
  // as 重命名
  Upload as AntdUpload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as qiniu from "qiniu-js";
import { nanoid } from "nanoid";

import { reqGetUploadToken } from "@api/edu/upload";

import qiniuConfig from "@conf/qiniu";

const MAX_VIDEO_SIZE = 35 * 1024 * 1024;

/*
  上传七牛云 SDK 文档: https://developer.qiniu.com/kodo/sdk/1283/javascript
  上传凭证：https://developer.qiniu.com/kodo/manual/1208/upload-token
*/

export default class Upload extends Component {
  getUploadToken = () => {
    try {
      const { uploadToken, expires } = JSON.parse(
        localStorage.getItem("upload_token")
      );
      if (!this.isValidUploadToken(expires)) {
        throw new Error("uploadToken过期了~");
      }

      return {
        uploadToken,
        expires,
      };
    } catch {
      return {
        uploadToken: "",
        expires: 0,
      };
    }
  };
  state = {
    ...this.getUploadToken(),
    isUploadSuccess: false,
  };

  fetchUploadToken = async () => {
    const { uploadToken, expires } = await reqGetUploadToken();
    this.saveUploadToken(uploadToken, expires);
  };
  isValidUploadToken = (expires) => {
    return expires > Date.now();
  };
  saveUploadToken = (uploadToken, expires) => {
    const data = {
      uploadToken,
      expires: Date.now() + expires * 1000 - 5 * 60 * 1000,
    };
    this.setState(data);
    localStorage.setItem("upload_token", JSON.stringify(data));
  };

  /**
   * 上传之前触发的函数
   * @param {*} file 当前上传的文件
   * @param {*} fileList 上传的文件列表（包含之前上传和当前上传~）
   * @return {Boolean|Promise} 返回值false/reject就终止上传，其他情况就继续上传
   */
  beforeUpload = (file, fileList) => {
    return new Promise(async (resolve, reject) => {
      if (file.size > MAX_VIDEO_SIZE) {
        message.warn("上传视频不能超过35mb");
        return reject();
      }
      const { expires } = this.state;

      if (!this.isValidUploadToken(expires)) {
        await this.fetchUploadToken();
      }
      resolve(file);
    });
  };
  customRequest = ({ file, onProgress, onSuccess, onError }) => {
    const { uploadToken } = this.state;
    // console.log(uploadToken);
    const key = nanoid(10);
    const putExtra = {
      fname: "",
      mimeType: ["video/mp4"],
    };
    const config = {
      // 当前对象存储库位于区域（华东 华南 华北...）
      // qiniu.region.z0: 代表华东区域
      // qiniu.region.z1: 代表华北区域
      // qiniu.region.z2: 代表华南区域
      // qiniu.region.na0: 代表北美区域
      // qiniu.region.as0: 代表东南亚区域
      region: qiniuConfig.region,
    };
    const observable = qiniu.upload(file, key, uploadToken, putExtra, config);
    const observer = {
      next(res) {
        const percent = res.total.percent.toFixed(2);
        onProgress({ percent }, file);
      },
      error(err) {
        onError(err);
        message.error("上传视频失败~");
      },
      complete: (res) => {
        onSuccess(res);
        message.success("上传视频成功~");
        const video = qiniuConfig.prefix_url + res.key;
        this.props.onChange(video);
        this.setState({
          isUploadSuccess: true,
        });
      },
    };
    this.subscription = observable.subscribe(observer);
  };

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  remove = () => {
    this.subscription && this.subscription.unsubscribe();
    this.props.onChange("");
    this.setState({
      isUploadSuccess: false,
    });
  };

  render() {
    const { isUploadSuccess } = this.state;
    return (
      <AntdUpload
        accept="video/mp4"
        listType="picture"
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
        onRemove={this.remove}
      >
        {isUploadSuccess ? null : (
          <Button>
            <UploadOutlined /> 上传视频
          </Button>
        )}
      </AntdUpload>
    );
  }
}
