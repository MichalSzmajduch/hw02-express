import contactsService from "../service/contacts.service.js";
const get = async (req, res, next) => {
  try {
    const results = await contactsService.getAll();
    return res.json({
      status: "success",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (error) {
    next(error);
    console.error(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await contactsService.getOne(id);
    if (!results) {
      return res.status(404).json({
        status: "not-found",
        code: 404,
        data: {
          message: "Contact not found",
        },
      });
    } else {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact: results,
        },
      });
    }
  } catch (error) {
    next(error);
    return res.status(400).json({
      status: "error",
      code: 400,
      data: {
        message: error.message,
      },
    });
  }
};

async function create(req, res, next) {
  try {
    const { body, user } = req;
    const results = await contactsService.create({ ...body, owner: user._id });
    return res.json({
      status: "success",
      code: 200,
      data: {
        contact: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
}

const update = async (req, res, next) => {
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const { id } = req.params;
    const { body, user } = req;
    const results = await contactsService.update(id, user._id, body);
    return res.json({
      status: "success",
      code: 200,
      data: {
        contact: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { body, params, user } = req;
    const { id } = params;
    const { favorite } = body;
    const results = await contactsService.updateFavorite(
      id,
      user._id,
      favorite
    );
    return res.json({
      status: "success",
      code: 200,
      data: {
        contact: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const results = await contactsService.remove(id, user._id);
    return res.json({
      status: "success",
      code: 200,
      data: {
        id,
        data: {
          contact: results,
        },
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export default {
  get,
  getById,
  create,
  update,
  updateFavorite,
  remove,
};
