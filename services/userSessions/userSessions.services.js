const userSessionModel = require("./userSessions.model");

module.exports = {
  createUserSession: async (data) => {
    try {
      const session = await userSessionModel.create(data);
      return session;
    } catch (error) {
      throw error;
    }
  },
};
