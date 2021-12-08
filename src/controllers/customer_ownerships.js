import { nanoid } from "nanoid";
import { paramCase } from "change-case";
import CustomerOwnership from "../models/customer_ownership";
import Customer from "../models/customer";
import Shoe from "../models/shoe";
import { validateAll } from "../utils/form";

export const all = async (req, res) => {
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 10;

  try {
    const customerOwnerships = await CustomerOwnership.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where("name", "LIKE", `${req.query.name}%`);
        }

        builder.whereNull("deleted_at");
      })
      .orderBy("id", "DESC")
      .withGraphFetched("[shoe, customer]")
      .page(page - 1, pageSize);

    return res.json({
      success: true,
      data: customerOwnerships.results,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: customerOwnerships.total,
        hasNext: page < Math.floor(customerOwnerships.total / pageSize),
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
    const customerOwnership = await CustomerOwnership.query()
      .findById(req.params.id)
      .whereNull("deleted_at")
      .withGraphFetched("[shoe, customer]")
      .first();

    return res.json({
      success: true,
      data: customerOwnership,
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
    shoe_id: "required",
    customer_id: "required",
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  try {
    
    const shoe = await Shoe.query()
      .findById(req.body.shoe_id)
      .whereNull("deleted_at")
      .first();

    const customer = await Customer.query()
      .findById(req.body.customer_id)
      .whereNull("deleted_at")
      .first();

    if ( !shoe ) {
      return res.json({
        success: false,
        message: "Shoe is not found",
      });
    }

    if ( !customer ) {
        return res.json({
          success: false,
          message: "Customer is not found",
        });
      }

    const customerOwnership = await CustomerOwnership.query().insert({
      serial_number: `${nanoid()}-${paramCase(shoe.name)}`,
      shoe_id: req.body.shoe_id,
      customer_id: req.body.customer_id,
      bought_at: new Date(),
    });

    return res.json({
      success: true,
      data: customerOwnership,
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
    const shoe = await Shoe.query().patchAndFetchById(req.params.id, {
      category_id: req.body.category_id,
      name: req.body.name,
      slug: `${nanoid()}-${paramCase(req.body.name)}`,
      picture: req.body.picture,
      description: req.body.description,
      serie: req.body.serie,
    });

    return res.json({
      success: true,
      data: shoe,
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
    const shoe = await Shoe.query().whereIn("id", req.body.ids).patch({
      deleted_at: new Date(),
    });

    return res.json({
      success: true,
      data: shoe,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Failed deleting data!",
    });
  }
};
