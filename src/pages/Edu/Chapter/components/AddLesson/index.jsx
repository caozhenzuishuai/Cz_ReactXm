import React from "react";

import { Card, PageHeader, Form, Button, Input, Switch, message } from "antd";

import Upload from "@comps/Upload";

import { reqAddLesson } from "@api/edu/lesson";

import "./index.less";
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 5 },
};
export default function AddLesson({ location, history }) {
  const onFinish = async (values) => {
    const chapterId = location.state._id;
    await reqAddLesson({ ...values, chapterId });
    message.success("添加课时成功~");
    history.push("/edu/chapter/list");
  };

  const onBack = () => {
    history.push("/edu/chapter/list");
  };

  return (
    <Card
      title={
        <PageHeader
          className="add-lesson-header"
          onBack={onBack}
          title="新增课时"
        />
      }
    >
      <Form {...layout} onFinish={onFinish} initialValues={{ free: true }}>
        <Form.Item
          label="课时名称"
          name="title"
          rules={[{ required: true, message: "请输入课时名称~" }]} // 校验规则
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="是否免费"
          name="free"
          rules={[{ required: true, message: "请选择是否免费" }]}
          valuePropName="checked"
        >
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
        </Form.Item>

        <Form.Item
          name="video"
          rules={[{ required: true, message: "请上传视频" }]}
        >
          <Upload />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="add-lesson-btn">
            添加
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
