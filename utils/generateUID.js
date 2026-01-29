const Counter = require("../models/Counter");

async function generateUID() {
  const counter = await Counter.findOneAndUpdate(
    { name: "container_uid" },     // sequence name
    { $inc: { seq: 1 } },           // atomic increment
    {
      new: true,
      upsert: true,                 // create if not exists
    }
  );

  return `UID-${counter.seq}`;
}

module.exports = generateUID;
