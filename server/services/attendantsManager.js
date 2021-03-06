const db = require("./db");
const helper = require("../helper");

const getUserActvity = async (id) => {
  const rows = await db.query(
    `
      SELECT user_activity.user_id, user_list.user_name, user_activity.hall_name, user_activity.checkin_status, user_activity.activity_time
      FROM user_activity
      INNER JOIN user_list
      ON user_activity.user_id=user_list.user_id
      AND user_activity.user_id="${id}";
    `
  );

  const data = helper.emptyOrRows(rows);
  return data;
};

const checkIn = async (id, hall) => {
  const queryUserInfo = await db.query(
    `SELECT * FROM user_list WHERE user_id = "${id}";`
  );
  [{ checkin_status, hall_name: currentHall }] = queryUserInfo;

  const queryHallSize = await db.query(
    `SELECT * FROM hall WHERE hall_name = "${hall}";`
  );
  [{ hall_capacity, hall_max_capacity }] = queryHallSize;

  if (hall_capacity === hall_max_capacity) {
    return {
      statusCode: "004",
      message: "Hall full",
    };
  }

  if (queryUserInfo.length === 0) {
    return {
      statusCode: "003",
      message: "User not found",
    };
  }

  if (checkin_status === 1 && currentHall !== hall) {
    return {
      statusCode: "002",
      message: `User not checked out from another hall, please checkout from hall [${currentHall}]`,
    };
  }

  const rows = await db.query(
    `UPDATE user_list SET hall_name="${hall}", checkin_status=1 WHERE user_id="${id}";`
  );

  const data = helper.emptyOrRows(rows);

  if (data.changedRows === 0) {
    return {
      data: data,
      statusCode: "001",
      message: "User has already checked in",
    };
  }

  await db.query(
    `INSERT INTO user_activity (user_id, hall_name, checkin_status, activity_time) VALUES ("${id}", "${hall}", 1, now());`
  );

  await db.query(
    `UPDATE hall SET hall_capacity = hall_capacity + 1 WHERE hall_name="${hall}";`
  );

  return {
    data: data,
    statusCode: "000",
    message: "Checkin Success",
  };
};

const checkOut = async (id, hall) => {
  const queryUserInfo = await db.query(
    `SELECT * FROM user_list WHERE user_id = "${id}";`
  );
  [{ checkin_status, hall_name: currentHall }] = queryUserInfo;

  if (queryUserInfo.length === 0) {
    return {
      statusCode: "003",
      message: "User not found",
    };
  }

  if (currentHall !== hall) {
    return {
      statusCode: "002",
      message: "User has not checked in to this hall",
    };
  }

  const rows = await db.query(
    `UPDATE user_list SET hall_name=null, checkin_status=0 WHERE user_id="${id}";`
  );

  const data = helper.emptyOrRows(rows);

  await db.query(
    `INSERT INTO user_activity (user_id, hall_name, checkin_status, activity_time) VALUES ("${id}", "${hall}", 0, now());`
  );

  await db.query(
    `UPDATE hall SET hall_capacity = hall_capacity - 1 WHERE hall_name="${hall}";`
  );

  return {
    data: data,
    statusCode: "000",
    message: "Checkout Success",
  };
};

const getCapacity = async (hall) => {
  const rows = await db.query(
    `SELECT hall_capacity, hall_max_capacity from hall WHERE hall_name="${hall}";`
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
  getUserActvity,
  checkIn,
  checkOut,
  getCapacity,
  addUser,
};
