const mongoose = require('mongoose');

const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/weatherwise';

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || LOCAL_MONGO_URI;

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Primary MongoDB connection failed (${primaryUri}): ${error.message}`);

    if (primaryUri !== LOCAL_MONGO_URI) {
      try {
        const fallbackConn = await mongoose.connect(LOCAL_MONGO_URI);
        console.log(`MongoDB Connected via local fallback: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`Local MongoDB fallback failed (${LOCAL_MONGO_URI}): ${fallbackError.message}`);
        return null;
      }
    }

    console.error(`MongoDB connection unavailable at ${LOCAL_MONGO_URI}`);
    return null;
  }
};

module.exports = connectDB;
