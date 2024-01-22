export default {
  basicStatus: ["PENDING", "APPROVED", "REJECTED", "RECHECK", "ERROR"],
  bookStatus: [
    {
      status: "PENDING",
      key: "PENDING2",
      color: "#FFF2CC",
    },
    {
      status: "APPROVED",
      key: "APPROVED2",
      color: "#C6E0B4",
    },
    {
      status: "REJECTED",
      key: "REJECTED2",
      color: "#F4B084",
    },
    {
      status: "RECHECK",
      key: "RECHECK2",
      color: "orange",
    },
    {
      status: "ERROR",
      key: "ERROR2",
      color: "#D9D9D9",
    },
  ],
  mapColorWithStatus: function (_status) {
    let result = statusItems.find(({ status }) => status === _status);
    return result.color;
  },
};
