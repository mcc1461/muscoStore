"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// Firm Controller:

const Firm = require("../models/firm");
const formatPhoneNumber = require("../utils/formatPhoneNumber");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Firm);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Firm),
      data,
    });
  },

  create: async (req, res) => {
    if (req.body.phone) {
      req.body.formattedPhone = formatPhoneNumber(req.body.phone); // Add a formattedPhone field
    }

    const data = await Firm.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    const data = await Firm.findOne({ _id: req.params.id });
    if (data) {
      data.formattedPhone = formatPhoneNumber(data.phone); // Format the phone number for the response
    }

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    if (req.body.phone) {
      req.body.formattedPhone = formatPhoneNumber(req.body.phone); // Add a formattedPhone field
    }

    const data = await Firm.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data,
      new: await Firm.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    const data = await Firm.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
