import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button, message } from "antd";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";

import { reqGetAllTeacherList } from "@api/edu/teacher";
import { reqGetAllSubjectList, reqGetSubSubjectList } from "@api/edu/subject";
import { getCourseList } from "../../redux";

import "./index.less";

const { Option } = Select;

function SearchForm({ getCourseList, getSearchFormData }) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [teachers, subjects] = await Promise.all([
        reqGetAllTeacherList(),
        reqGetAllSubjectList(),
      ]);
      setTeachers(teachers);
      console.log("sssss" + subjects);

      const data = subjects.map((subject) => {
        return {
          value: subject._id,
          label: subject.title,
          isLeaf: false,
        };
      });
      setSubjects(data);
    };
    fetchData();
  }, []);

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const { items } = await reqGetSubSubjectList(targetOption.value);

    targetOption.loading = false;

    if (items.length) {
      targetOption.children = items.map((item) => {
        return {
          value: item._id,
          label: item.title,
        };
      });
    } else {
      targetOption.isLeaf = true;
    }
    setSubjects([...subjects]);
  };
  const resetForm = () => {
    form.resetFields();
  };

  const onFinish = async (values) => {
    const { title, teacherId, subject = [] } = values;
    let subjectId, subjectParentId;

    if (subject.length === 1) {
      subjectParentId = "0";
      subjectId = subject[0];
    } else if (subject.length === 2) {
      subjectParentId = subject[0];
      subjectId = subject[1];
    }
    await getCourseList({
      title,
      teacherId,
      page: 1,
      limit: 10,
      subjectId,
      subjectParentId,
    });

    getSearchFormData({ title, teacherId, subjectId, subjectParentId });

    message.success("查询课程分类数据成功~");
  };

  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      <Form.Item
        name="title"
        label={intl.formatMessage({
          id: "title",
        })}
      >
        <Input
          placeholder={intl.formatMessage({
            id: "title",
          })}
          style={{ width: 250, marginRight: 20 }}
        />
      </Form.Item>
      <Form.Item name="teacherId" label={<FormattedMessage id="teacher" />}>
        <Select
          allowClear
          placeholder={<FormattedMessage id="teacher" />}
          style={{ width: 250, marginRight: 20 }}
        >
          {teachers.map((teacher) => {
            return (
              <Option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="subject" label={<FormattedMessage id="subject" />}>
        <Cascader
          style={{ width: 250, marginRight: 20 }}
          options={subjects}
          loadData={loadData}
          changeOnSelect
          placeholder={intl.formatMessage({
            id: "subject",
          })}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          <FormattedMessage id="searchBtn" />
        </Button>
        <Button onClick={resetForm}>
          <FormattedMessage id="resetBtn" />
        </Button>
      </Form.Item>
    </Form>
  );
}

export default connect(null, { getCourseList })(SearchForm);
