const db = require("./db");
const helper = require("../helper");

const getList = async () => {
  const rows = await db.query(`SELECT * FROM user_list`);

  const data = helper.emptyOrRows(rows);
  return data;
};

const getUser = async (id) => {
  const rows = await db.query(`SELECT * FROM user_list WHERE user_id="${id}"`);

  const data = helper.emptyOrRows(rows);
  return data;
};

const checkIn = async (id, hall) => {
  const rows = await db.query(
    `UPDATE user_list SET hall=${hall}, status=1 WHERE user_id=${id}`
  );

  const data = helper.emptyOrRows(rows);
  return data;
  // if (data.changedRows === 0) {
  //   return { statusCode: 2 };
  // }
};

const checkOut = async (id) => {
  const rows = await db.query(
    `UPDATE user_list SET hall=null, status=0 WHERE user_id=${id}`
  );

  const data = helper.emptyOrRows(rows);
  return data;
};

const getCapacity = async (hall) => {
  const rows = await db.query(
    `SELECT COUNT(hall) from user_list WHERE hall=${hall}`
  );

  const data = helper.emptyOrRows(rows);
  return data;
};

module.exports = {
  getList,
  getUser,
  checkIn,
  checkOut,
  getCapacity,
};
