const express = require("express");
const Mock = require("mockjs");

const app = express();

const Random = Mock.Random;

Random.ctitle();

app.use(express.json());

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "content-type, token");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.post("/admin/edu/subject/save", (req, res, next) => {
  const { title, parentId } = req.body;

  console.log(title, parentId);
  res.json({
    code: 20000,
    success: true,
    data: {
      _id: Date.now(),
      title,
      parentId,
    },
    message: "",
  });
});

app.get("/admin/edu/subject/get/:parentId", (req, res, next) => {
  const { parentId } = req.params;
  const total = Random.integer(0, 5);
  const data = Mock.mock({
    total,
    [`items|${total}`]: [
      {
        "_id|+1": 100,
        title: "@ctitle(2,5)",
        parentId,
      },
    ],
  });
  if (total === 1) {
    data.items = [data.items];
  }
  res.json({
    code: 20000,
    success: true,
    data,
    message: "",
  });
});
app.get("/admin/edu/subject/:page/:limit", (req, res, next) => {
  const { page, limit } = req.params;
  const data = Mock.mock({
    total: Random.integer(+limit + 1, limit * 2),

    [`items|${limit}`]: [
      {
        "_id|+1": 1,
        title: "@ctitle(2,5)",
        parentId: 0,
      },
    ],
  });
  res.json({
    code: 20000,
    success: true,
    data,
    message: "",
  });
});

app.listen(9527, "localhost", (err) => {
  if (err) {
    console.log("服务器启动失败", err);
    return;
  }
  console.log("服务器启动成功了");
});
