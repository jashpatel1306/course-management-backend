
const createError = require("http-errors");
const modulesModel = require("./modules.model");

module.exports = {
  addDefaultModules: async () => {
    try {
      const modulesCount = await modulesModel.count();
      if (modulesCount === 0) {
        const defaultModules = [
          {
            name: "Module 1",
            id: "module1",
          },
        ];

        const addModules = await modulesModel.insertMany(defaultModules);
        if (!addModules) {
          throw createError(500, "Internal Server Error");
        }
      }
    } catch (err) {
      throw createError(500, "Internal Server Error");
    }
  },
};
