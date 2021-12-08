import { nanoid } from "nanoid";
import { paramCase } from "change-case";
import Shoe from "../models/shoe";
import { validateAll } from "../utils/form";

export const all = async (req, res) => {
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 10;

  try {
    const shoes = await Shoe.query()
      .where((builder) => {
        if (req.query.name) {
          builder.where("name", "LIKE", `${req.query.name}%`);
        }

        builder.whereNull("deleted_at");
      })
      .orderBy("id", "DESC")
      .withGraphFetched("shoe_category")
      .page(page - 1, pageSize);

    return res.json({
      success: true,
      data: shoes.results,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: shoes.total,
        hasNext: page < Math.floor(shoes.total / pageSize),
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
    const shoe = await Shoe.query()
      .findById(req.params.id)
      .whereNull("deleted_at")
      .withGraphFetched("shoe_category")
      .first();

    return res.json({
      success: true,
      data: shoe,
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
    picture: "required",
  };

  const errors = await validateAll(req.body, rules);
  if (errors) {
    return res.json({
      success: false,
      message: errors,
    });
  }

  const serie = `${nanoid()}-${paramCase(req.body.name)}`;

  try {
    const shoe = await Shoe.query().insert({
      category_id: req.body.category_id,
      name: req.body.name,
      slug: serie,
      picture: req.body.picture,
      description: req.body.description,
      serie: serie,
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
