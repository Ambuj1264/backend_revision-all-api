const items = require("../../model/item");
const validate = require("../../utility/validation/index");
const constants = require("../../static/index");
const { response } = require("express");
const csv = require("csvtojson");
const fs = require("fs");
const { isValidObjectId } = require("mongoose");
const itemMenu = require("../../model/itemMenu");
const itemList = {
  create: async (req, res) => {
    try {
      let itemName = req.body.itemName;
      let itemValue = req.body.itemValue;
      let paid = req.body.paid;

      await validate.nullOrBlankAll(res, req.body, "itemName", "itemValue");
      if (res.headersSent) {
        return false;
      }
      let data = await new items({
        itemName: itemName,
        itemValue: itemValue,
        paid: paid,
      });
      data
        .save()
        .then((response) => {
          res.status(200).send({
            success: true,
            message: constants.responseMessages.added,
            result: response,
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: err.message,
          });
        });
    } catch (error) {
      console.log(error.stack);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: error.stack,
      });
    }
  },
  get: async (req, res) => {
    try {
      let id = req.body.id;
      await validate.nullOrBlankAll(res, req.body, "id");
      if (res.headersSent) {
        return false;
      }
      let findData = await items
        .findOne({ _id: id })
        .then((resposnse) => {
          res.status(200).send({
            success: false,
            message: constants.responseMessages.found,
            result: resposnse,
          });
        })
        .catch((error) => {
          console.log(error.stack);
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: error.stack,
          });
        });
    } catch (error) {
      console.log(error.stack);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: error.stack,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      let findData = await items
        .find({})
        .then((resposnse) => {
          res.status(200).send({
            success: false,
            message: constants.responseMessages.found,
            result: resposnse,
          });
        })
        .catch((error) => {
          console.log(error.stack);
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: error.stack,
          });
        });
    } catch (error) {
      console.log(error.stack);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: error.stack,
      });
    }
  },
  update: async (req, res) => {
    try {
      let toUpdate = req.body.toUpdate;
      let itemName = req.body.itemName;
      let itemValue = req.body.itemValue;
      let paid = req.body.paid;
      await validate.nullOrBlankAll(
        res,
        req.body,
        "itemName",
        "itemValue",
        "toUpdate"
      );
      if (res.headersSent) {
        return false;
      }
      let findDataAndUpdate = await items
        .findOneAndUpdate(
          { _id: toUpdate },
          {
            $set: {
              itemName: itemName,
              itemValue: itemValue,
              paid: paid,
            },
          },
          { new: true }
        )
        .then((resposnse) => {
          res.status(200).send({
            success: false,
            message: constants.responseMessages.found,
            result: resposnse,
          });
        })
        .catch((error) => {
          console.log(error.stack);
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: error.stack,
          });
        });
    } catch (error) {
      console.log(error.stack);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: error.stack,
      });
    }
  },
  delete: async (req, res) => {
    try {
      let id = req.body.id;
      await validate.nullOrBlankAll(res, req.body, "id");
      if (res.headersSent) {
        return false;
      }
      let findData = await items
        .findOneAndDelete({ _id: id })
        .then((resposnse) => {
          res.status(200).send({
            success: false,
            message: constants.responseMessages.delete,
            result: resposnse,
          });
        })
        .catch((error) => {
          console.log(error.stack);
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: error.stack,
          });
        });
    } catch (error) {
      console.log(error.stack);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: error.stack,
      });
    }
  },
  manager: async function (req, res, next) {
    /// serch object / first object
    var searchObj = {};
    var serchObjOr = [];
    var serchObjAnd = [];

    ///limit Object
    var limitObj = {};
    var middleObj = null;
    var startpoint = req.body.start;
    var limit = req.body.limit;
    var search = req.body.search;
    if ("search" in req.body) {
      search = search.trim();
    }
    if ((await validate.nullOrBlankInternal(startpoint)) == 0) {
      startpoint = constants.managers.startPoint;
    }
    if ((await validate.nullOrBlankInternal(limit)) == 0) {
      limit = constants.managers.limit;
    }
    if ((await validate.nullOrBlankInternal(sortBy)) === 0) {
      sortBy = constants.managers.sortBy;
    }
    limitObj.limit = limit;
    limitObj.skip = startpoint;
    var sortBy = req.body.sortBy;
    // searchObj.isDeleted = false;
    if ((await validate.nullOrBlankInternal(search)) != 0) {
      serchObjOr.push({
        itemName: { $regex: ".*" + search + ".*", $options: "i" },
      });
      serchObjOr.push({
        itemValue: { $regex: ".*" + search + ".*", $options: "i" },
      });
      serchObjOr.push({
        post: { $regex: ".*" + search + ".*", $options: "i" },
      });
      searchObj["$or"] = serchObjOr;
    }
    try {
      let count = await items.find(searchObj).countDocuments();
      console.log(searchObj, middleObj, limitObj);
      await items
        .find(searchObj, middleObj, limitObj)
        .sort(sortBy)
        .then((response) => {
          var responseObj = {};
          responseObj.response = response;
          responseObj.total = count;

          res.status(200).send({
            success: true,
            message: constants.responseMessages.found,
            result: responseObj,
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: err,
          });
        });
    } catch (e) {
      console.log("In Create Error", e);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: e,
      });
    }
  },
  filer: async function (req, res, next) {
    /// serch object / first object

    let itemName=req.body.itemName
    let itemNames = { itemName: { $regex: `${itemName}`, $options: "i" } };

    try {
      // let count = await items.find(searchObj).countDocuments();
      // console.log(searchObj, middleObj, limitObj)
      await items
        .find(itemNames, null, { limit: "2" })

        .then((response) => {
          console.log(response,
            "kkkkkkkkkkkkkkkkkkkkkkk");
          let responseObj = {};
          responseObj.response = response;
          // responseObj.total = count;

          res.status(200).send({
            success: true,
            message: constants.responseMessages.found,
            result: responseObj,
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: err,
          });
        });
    } catch (e) {
      console.log("In Create Error", e);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: e,
      });
    }
  },
  upload: async function (req, res, next) {
    let csvData;
    let fileToUpload = req.file.path;
    var jsonArr = [];
    fs.createReadStream(fileToUpload)
      .pipe(csv())
      .on("data", function (data) {
        csvData = data.toString("utf8");
        jsonArr.push(JSON.parse(csvData));
      })
      .on("end", async function () {
        console.log("end");
        try {
          for (var i = 0; i < jsonArr.length; i++) {
            let k = i;
            var data = await new items({
              itemValue: jsonArr[k].itemValue,
              itemName: jsonArr[k].itemName,
              paid: jsonArr[k].paid,
            });
            await data
              .save()
              .then((response) => {
                console.log(jsonArr, "jsonArr");
                if (jsonArr.length - 1 == k) {
                  res.status(200).send({
                    success: true,
                    message: constants.responseMessages.uploaded,
                    result: jsonArr,
                  });
                }
              })
              .catch((err) => {
                console.log("In Create Error", err);
                res.status(400).send({
                  success: false,
                  message: constants.someThingWentWrong.someThingWentWrong,
                  result: err,
                });
              });

            //   if (e) {
            //     console.log("In Create Error", e);
            //     res.status(400).send({
            //       success: false,
            //       message: constants.someThingWentWrong.someThingWentWrong,
            //       result: e,
            //     });
            //   } else {
            //     if (jsonArr.length - 1 == k) {
            //       res.status(200).send({
            //         success: true,
            //         message: constants.responseMessages.uploaded,
            //         result: jsonArr,
            //       });
            //     }
            //   }
            // });
          }
        } catch (e) {
          console.log("In Create Error", e);
          res.status(400).send({
            success: false,
            message: constants.responseMessages.somethingWentWrong,
            result: e,
          });
        }
      });
  },
  aggregates: async (req, res) => {
    let name = req.body.itemName;
    validate.nullOrBlankAll(res, req.body, "itemName");
    if (res.headersSent) {
      return false;
    }
    let DataAgg = await items.aggregate([
      {
        $match: { itemName: name },
      },
      {
        $group: {
          _id: "$itemName",
          data: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $project: {
          _id: 1,
          data: 1,
        },
      },

      {
        $addFields: {
          "data.state": 1,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);
    if (DataAgg) {
      res.status(200).send({
        success: true,
        message: constants.responseMessages.found,
        result: DataAgg,
      });
    } else {
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: "error happen",
      });
    }
  },
  itemMenuCreate: async (req, res) => {
    try {
      let dinner = req.body.dinner;
      let breakfast = req.body.breakfast;
      let itemDetails = req.body.itemDetails;

      await validate.nullOrBlankAll(
        res,
        req.body,
        "breakfast",
        "dinner",
        "itemDetails"
      );
      if (res.headersSent) {
        return false;
      }
      let data = await new itemMenu({
        dinner: dinner,
        breakfast: breakfast,
        itemDetails: itemDetails,
      });
      data
        .save()
        .then((response) => {
          res.status(200).send({
            success: true,
            message: constants.responseMessages.added,
            result: response,
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: false,
            message: constants.someThingWentWrong.notFound,
            result: err.message,
          });
        });
    } catch (error) {
      console.log(error.stack);
      res.status(400).send({
        success: false,
        message: constants.someThingWentWrong.someThingWentWrong,
        result: error.stack,
      });
    }
  },
  population: async (req, res) => {
    let id = req.body.id;

    let populate = await itemMenu.findById(id).populate("itemDetails");
    res.status(200).send(populate);
  },
};

module.exports = itemList;
