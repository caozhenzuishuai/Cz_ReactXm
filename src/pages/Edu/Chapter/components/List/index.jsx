import React, { Component } from "react";
import { Button, Tooltip, Alert, Table, Modal, message } from "antd";
import {
  PlusOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Player from "griffith";
import screenfull from "screenfull";

import { getLessonList, batchRemoveLessonList } from "../../redux";

import "./index.less";

// withRouter：给非路由组件传递路由组件的三大属性
@withRouter
@connect((state) => ({ chapters: state.chapter.chapters }), {
  getLessonList,
  batchRemoveLessonList,
})
class List extends Component {
  state = {
    expandedRowKeys: [],
    selectedRowKeys: [],
    isShowVideoModal: false,
    lesson: {},
  };

  handleExpandedRowsChange = (expandedRowKeys) => {
    const length = expandedRowKeys.length;
    if (length > this.state.expandedRowKeys.length) {
      const lastKey = expandedRowKeys[length - 1];
      this.props.getLessonList(lastKey);
    }

    this.setState({
      expandedRowKeys,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };
  showAddLesson = (chapter) => {
    return () => {
      this.props.history.push("/edu/chapter/addlesson", chapter);
    };
  };

  showVideoModal = (lesson) => {
    return () => {
      this.setState({
        isShowVideoModal: true,
        lesson,
      });
    };
  };

  hidden = () => {
    this.setState({
      isShowVideoModal: false,
      lesson: {},
    });
  };
  batchRemove = async () => {
    const { selectedRowKeys } = this.state;
    const {
      chapters: { items: chapters },
      batchRemoveLessonList,
    } = this.props;
    const ids = Array.prototype.slice.call(selectedRowKeys);
    const chapterIds = [];

    chapters.forEach((chapter) => {
      const index = ids.indexOf(chapter._id);
      if (index > -1) {
        const [id] = ids.splice(index, 1);
        chapterIds.push(id);
      }
    });

    await batchRemoveLessonList(ids);

    message.success("批量删除数据成功~");
  };
  screenfull = () => {
    const dom = this.props.fullscreenRef.current;
    screenfull.toggle(dom);
  };

  render() {
    const { chapters } = this.props;
    const {
      expandedRowKeys,
      isShowVideoModal,
      lesson,
      selectedRowKeys,
    } = this.state;

    const columns = [
      {
        title: "名称",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        key: "free",
        render: (free) => {
          return free === undefined ? "" : free ? "是" : "否";
        },
      },
      {
        title: "视频",
        key: "video",
        render: (lesson) => {
          return (
            "video" in lesson && (
              <Tooltip title="预览视频">
                <Button onClick={this.showVideoModal(lesson)}>
                  <EyeOutlined />
                </Button>
              </Tooltip>
            )
          );
        },
      },
      {
        title: "操作",
        key: "action",
        width: 250,
        render: (data) => {
          return (
            <>
              {"free" in data ? null : (
                <Tooltip title="新增课时">
                  <Button
                    type="primary"
                    className="chapter-btn"
                    onClick={this.showAddLesson(data)}
                  >
                    <PlusOutlined />
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="更新">
                <Button
                  type="primary"

                  // onClick={this.showUpdateSubject(subject)}
                >
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  type="danger"
                  className="subject-btn"
                  // onClick={this.delSubject(subject)}
                >
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </>
          );
        },
      },
    ];

    return (
      <div className="chapter-list">
        <div className="chapter-list-header">
          <h5>课程章节列表</h5>
          <div>
            <Button type="primary">
              <PlusOutlined />
              新增课程
            </Button>
            <Button type="danger" onClick={this.batchRemove}>
              批量删除
            </Button>
            <Tooltip title="全屏">
              <FullscreenOutlined onClick={this.screenfull} />
            </Tooltip>
            <Tooltip title="刷新">
              <ReloadOutlined />
            </Tooltip>
            <Tooltip title="设置">
              <SettingOutlined />
            </Tooltip>
          </div>
        </div>
        <Alert
          message={`已选择 ${selectedRowKeys.length} 项`}
          type="info"
          showIcon
        />
        <Table
          className="chapter-list-table"
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: this.handleExpandedRowsChange,
          }}
          dataSource={chapters.items}
          rowKey="_id"
          pagination={{
            total: chapters.total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
          }}
        />

        <Modal
          title={lesson.title}
          visible={isShowVideoModal}
          onCancel={this.hidden}
          footer={null}
          centered
          destroyOnClose={true}
        >
          <Player
            sources={{
              hd: {
                // bitrate: 1000,
                // duration: 128,
                // format: "mp4",
                // height: 468,
                // width: 864,
                // size: 20000,
                play_url: lesson.video,
              },
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default List;
