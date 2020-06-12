import React, { Component } from "react";
import { Button, Tooltip, Alert, Table, Modal } from "antd";
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

import { getLessonList } from "../../redux";

import "./index.less";

// withRouter：给非路由组件传递路由组件的三大属性
@withRouter
@connect((state) => ({ chapters: state.chapter.chapters }), { getLessonList })
class List extends Component {
  state = {
    expandedRowKeys: [],
    isShowVideoModal: false, // Modal显示&隐藏
    lesson: {}, // 显示的数据
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

  showAddLesson = (chapter) => {
    return () => {
      // 默认情况下不是路由组件，没有三大属性
      // 解决：需要三大属性 --> withRouter
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

  render() {
    const { chapters } = this.props;
    const { expandedRowKeys, isShowVideoModal, lesson } = this.state;

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
            <Button type="danger">批量删除</Button>
            <Tooltip title="全屏">
              <FullscreenOutlined />
            </Tooltip>
            <Tooltip title="刷新">
              <ReloadOutlined />
            </Tooltip>
            <Tooltip title="设置">
              <SettingOutlined />
            </Tooltip>
          </div>
        </div>
        <Alert message="已选择 0 项" type="info" showIcon />
        <Table
          className="chapter-list-table"
          columns={columns} // 决定列头
          expandable={{
            // 内部默认会使用children作为展开的子菜单
            // 也就是说，如果要展开的数据有children属性，才会有展开图标，就会作为子菜单展开~
            // 负责展开行
            // 展开哪些行？[行的key值, 行的key值...]
            // [_id, _id]
            expandedRowKeys,
            // 展开行触发的方法。
            // 将展开的行[1, 2, 3]作为参数传入
            onExpandedRowsChange: this.handleExpandedRowsChange,
          }}
          dataSource={chapters.items} // 决定每一行显示的数据
          rowKey="_id" // 指定key属性的值是_id
          pagination={{
            // current, // 当前页数
            // pageSize, // 每页条数
            total: chapters.total, // 数据总数
            showQuickJumper: true, // 是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数量
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
            // onChange: this.getSubjectList, // 页码发生变化触发的回调
            // onShowSizeChange: this.getFirstPageSubjectList,
          }}
        />

        <Modal
          title={lesson.title} // 标题
          visible={isShowVideoModal} // 显示&隐藏
          onCancel={this.hidden}
          footer={null}
          centered // 垂直居中
          destroyOnClose={true} // 关闭时销毁子元素
        >
          {/* https://github.com/zhihu/griffith/blob/master/README-zh-Hans.md */}
          <Player
            // id="video"
            // duration={128}
            // cover="http://localhost:3000/static/media/logo.ba1f87ec.png" // 封面图
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
