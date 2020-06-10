import React, { Component } from "react";

import { Button, Table } from "antd";

import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";

import { reqGetSubjectList } from "@api/edu/subject";

import "./index.less";
export default class Subject extends Component {
  state = {
    subjects: {
      total: 0,
      items: [],
    },
  };

  componentDidMount() {
    this.getSubjectList(1, 10);
  }
  getSubjectList = async (page, limit) => {
    const result = await reqGetSubjectList(page, limit);
    this.setState({
      subjects: result,
    });
  };
  render() {
    const { subjects } = this.state;
    console.log(subjects);

    const columns = [
      {
        title: "分类名称",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        width: 200,
        render: () => (
          <>
            <Button type="primary">
              <FormOutlined />
            </Button>
            <Button type="danger" className="subject-btn">
              <DeleteOutlined />
            </Button>
          </>
        ),
      },
    ];

    return (
      <div className="subject">
        <Button type="primary" className="subject-btn">
          <PlusOutlined />
          新建
        </Button>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>{record.description}</p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
          dataSource={subjects.items}
          rowKey="_id"
          pagination={{
            total: subjects.total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
            onChange: this.getSubjectList,
            onShowSizeChange: this.getSubjectList,
          }}
        />
      </div>
    );
  }
}
