const db = require("./db");
const helper = require("../helper");

const getList = async () => {
  const rows = await db.query(`SELECT * FROM user_list;`);

  const data = helper.emptyOrRows(rows);
  return data;
};

const getUser = async (id) => {
  const rows = await db.query(`SELECT * FROM user_list WHERE user_id="${id}";`);

  const data = helper.emptyOrRows(rows);
  return data;
};

const checkIn = async (id, name, hall) => {
  const rows = await db.query(
    `UPDATE user_list SET hall=${hall}, checkin_status=1 WHERE user_id="${id}";`
  );

  const data = helper.emptyOrRows(rows);

  if (data.changedRows === 0) {
    return {
      data: data,
      statusCode: 1,
      message: "User not found or has already checked in",
    };
  }

  await db.query(
    `INSERT INTO user_activity (user_id, user_name, hall, checkin_status, activity_time) VALUES ("${id}", "${name}", ${hall}, 1, now());`
  );

  return {
    data: data,
    statusCode: 0,
    message: "Checkin Success",
  };
};

const checkOut = async (id, name, hall) => {
  const rows = await db.query(
    `UPDATE user_list SET hall=null, checkin_status=0 WHERE user_id="${id}";`
  );

  const data = helper.emptyOrRows(rows);

  if (data.changedRows === 0) {
    return {
      data: data,
      statusCode: 1,
      message: "User not found or has already checked out",
    };
  }

  await db.query(
    `INSERT INTO user_activity (user_id, user_name, hall, checkin_status, activity_time) VALUES ("${id}", "${name}", ${hall}, 0, now());`
  );

  return {
    data: data,
    statusCode: 0,
    message: "Checkout Success",
  };
};

const getCapacity = async (hall) => {
  const rows = await db.query(
    `SELECT COUNT(hall) as hallCapacity from user_list WHERE hall=${hall};`
  );

  const data = helper.emptyOrRows(rows);
  return data;
};

const addUser = async (id, name) => {
  const rows = await db.query(
    `INSERT INTO user_list (user_id, user_name, status) VALUES ("${id}", "${name}", 0);`
  );

  const data = helper.emptyOrRows(rows);
  return {
    data: data,
    status: 0,
    message: "Add Success",
  };
};

module.exports = {
  getList,
  getUser,
  checkIn,
  checkOut,
  getCapacity,
  addUser,
};
