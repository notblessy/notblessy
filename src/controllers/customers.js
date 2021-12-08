import { nanoid } from "nanoid";
import Customer from "../models/customer";
import { validateAll } from "../utils/form";

export const all = async (req, res) => {
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 10;

  try {
    const customers = await Customer.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where("name", "LIKE", `${req.query.name}%`);
        }

        builder.whereNull("deleted_at");
      })
      .orderBy("id", "DESC")
      .page(page - 1, pageSize);

    return res.json({
      success: true,
      data: customers.results,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: customers.total,
        hasNext: page < Math.floor(customers.total / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
export const detail = async (req, res) => {
  try {
    const customer = await Customer.query()
      .findById(req.params.id)
      .whereNull("deleted_at")
      .first();

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

export const create = async (req, res) => {
  const rules = {
    name: "required",
    email: "required",
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    const customerId = nanoid();

    const customer = await Customer.query().insert({
      id: customerId,
      name: req.body.name,
      email: req.body.email,
    });

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Failed inserting data!",
    });
  }
};

export const edit = async (req, res) => {
  try {
    const customer = await Customer.query().patchAndFetchById(req.params.id, {
        name: req.body.name,
        email: req.body.email,
    });

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Failed inserting data!",
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const customer = await Customer.query().whereIn("id", req.body.ids).patch({
      deleted_at: new Date(),
    });

    return res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Failed deleting data!",
    });
  }
};
