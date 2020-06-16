import React, { Component } from "react";
import { Card, Button, DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

const tabList = [
  {
    key: "sales",
    tab: "销售量",
  },
  {
    key: "visits",
    tab: "访问量",
  },
];
const contentList = {
  sales: <p>sales content</p>,
  visits: <p>visits content</p>,
};
const dateFormat = "YYYY-MM-DD";

export default class Sales extends Component {
  state = {
    tabKey: "sales",
    datePicker: "day",
    rangeTime: [
      moment(moment().format(dateFormat), dateFormat),
      moment(moment().format(dateFormat), dateFormat),
    ],
  };
  onTabChange = (tabKey) => {
    this.setState({ tabKey });
  };

  rangePickerChange = (dates, dateStrings) => {
    // console.log(dates);
    this.setState({
      rangeTime: dates,
    });
  };

  changeDatePicker = (datePicker) => {
    return () => {
      const time = moment(moment().format(dateFormat), dateFormat);
      let rangeTime = null;

      switch (datePicker) {
        case "year":
          rangeTime = [
            time,
            moment(moment().add(1, "y").format(dateFormat), dateFormat),
          ];
          break;
        case "mouth":
          rangeTime = [
            time,
            moment(moment().add(1, "M").format(dateFormat), dateFormat),
          ];
          break;
        case "week":
          rangeTime = [
            time,
            moment(moment().add(7, "d").format(dateFormat), dateFormat),
          ];
          break;
        default:
          rangeTime = [time, time];
          break;
      }

      // console.log(rangeTime);
      this.setState({
        datePicker,
        rangeTime,
      });
    };
  };

  render() {
    const { tabKey, datePicker, rangeTime } = this.state;
    const extra = (
      <div>
        <Button
          type={datePicker === "day" ? "link" : "text"}
          onClick={this.changeDatePicker("day")}
        >
          今日
        </Button>
        <Button
          type={datePicker === "week" ? "link" : "text"}
          onClick={this.changeDatePicker("week")}
        >
          本周
        </Button>
        <Button
          type={datePicker === "mouth" ? "link" : "text"}
          onClick={this.changeDatePicker("mouth")}
        >
          本月
        </Button>
        <Button
          type={datePicker === "year" ? "link" : "text"}
          onClick={this.changeDatePicker("year")}
        >
          本年
        </Button>
        <RangePicker value={rangeTime} onChange={this.rangePickerChange} />
      </div>
    );

    return (
      <Card
        style={{ width: "100%", marginBottom: 20 }}
        tabList={tabList}
        activeTabKey={tabKey}
        tabBarExtraContent={extra}
        onTabChange={this.onTabChange}
      >
        {contentList[tabKey]}
      </Card>
    );
  }
}
