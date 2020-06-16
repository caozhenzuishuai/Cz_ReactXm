import React, { useState } from "react";
import { Form, Tabs, Input, Button, Checkbox, Row, Col, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login, mobileLogin } from "@redux/actions/login";
import { reqSendCode } from "@api/acl/oauth";

import "./index.less";

const { TabPane } = Tabs;

const reg = /^[a-zA-Z0-9_]+$/;

// 定义表单校验规则
const rules = [
  {
    required: true,
    // message: "请输入数据"
  },
  { max: 15, message: "输入的长度不能超过15位" },
  { min: 4, message: "输入的长度不能小于4位" },
  {
    pattern: /^[a-zA-Z0-9_]+$/,
    message: "输入内容只能包含数字、英文和下划线",
  },
];

const TOTAL_TIME = 60;
// 倒计时
let countingDownTime = TOTAL_TIME;
function LoginForm({ login, mobileLogin, history }) {
  const [form] = Form.useForm();
  const [, setCountingDownTime] = useState(0);
  const [isSendCode, setIsSendCode] = useState(false);

  const [activeKey, setActiveKey] = useState("user");
  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  const validator = (rule, value) => {
    return new Promise((resolve, reject) => {
      if (!value) {
        return reject("请输入密码");
      }
      const len = value.length;

      if (len > 15) {
        return reject("输入的长度不能超过15位");
      }

      if (len < 4) {
        return reject("输入的长度不能小于4位");
      }

      if (!reg.test(value)) {
        return reject("输入内容只能包含数字、英文和下划线");
      }

      resolve();
    });
  };

  // 定义公共校验规则
  const validateMessages = {
    required: "请输入${name}!",
    /**
     types: {
      username: "${name} is not validate email!",
      password: "${name} is not a validate number!",
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  */
  };
  const finish = async (values) => {
    if (activeKey === "user") {
      form
        .validateFields(["username", "password", "rem"])
        .then(async (values) => {
          const { username, password, rem } = values;
          const token = await login(username, password);
          if (rem) {
            localStorage.setItem("user_token", token);
          }
          history.replace("/");
        });

      return;
    }

    form.validateFields(["mobile", "code", "rem"]).then(async (values) => {
      const { mobile, code, rem } = values;
      const token = await mobileLogin(mobile, code);
      if (rem) {
        localStorage.setItem("user_token", token);
      }
      history.replace("/");
    });
  };
  const countingDown = () => {
    const timer = setInterval(() => {
      countingDownTime--;
      if (countingDownTime <= 0) {
        clearInterval(timer);
        countingDownTime = TOTAL_TIME;
        setIsSendCode(false);
        return;
      }
      setCountingDownTime(countingDownTime);
    }, 1000);
  };

  // 点击发送验证码
  const sendCode = () => {
    form
      .validateFields(["mobile"])
      .then(async ({ mobile }) => {
        // 请求验证码
        await reqSendCode(mobile);
        // 成功
        setIsSendCode(true); // 已经发送
        countingDown();
        message.success("验证码发送成功~");
      })
      .catch((err) => {});
  };

  return (
    <Form
      form={form}
      validateMessages={validateMessages}
      initialValues={{ rem: "checked" }}
      // 注意button按钮的类型必须submit
      // onFinish={finish} // 问题会校验所有表单。
    >
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
        <TabPane tab="账户密码登录" key="user">
          <Form.Item name="username" rules={rules}>
            <Input prefix={<UserOutlined />} placeholder="用户名: admin" />
          </Form.Item>

          <Form.Item name="password" rules={rules}>
            <Input
              type="password"
              prefix={<LockOutlined />}
              placeholder="密码: 111111"
            />
          </Form.Item>
        </TabPane>
        <TabPane tab="手机号登录" key="mobile">
          <Form.Item
            name="mobile"
            // 表单校验
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\d{8})$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input prefix={<MobileOutlined />} placeholder="手机号" />
          </Form.Item>

          <Row justify="space-between">
            <Col>
              <Form.Item
                name="code"
                //表单校验
                rules={[
                  {
                    required: true,
                    message: "请输入验证码",
                  },
                  {
                    pattern: /^[0-9]{6}$/,
                    message: "请输入正确的验证码",
                  },
                ]}
              >
                <Input placeholder="验证码" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button onClick={sendCode} disabled={isSendCode}>
                  {isSendCode
                    ? `${countingDownTime}秒后可重发`
                    : "点击发送验证码"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <Row justify="space-between">
        <Col>
          <Form.Item name="rem" valuePropName="checked">
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button type="link">忘记密码</Button>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" onClick={finish} className="login-form-btn">
          登录
        </Button>
      </Form.Item>
      <Row justify="space-between">
        <Col>
          <Form.Item>
            <div className="login-form-icons">
              <span>其他登录方式</span>
              <GithubOutlined className="icons" />
              <WechatOutlined className="icons" />
              <QqOutlined className="icons" />
            </div>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button type="link">注册</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default withRouter(connect(null, { login, mobileLogin })(LoginForm));
