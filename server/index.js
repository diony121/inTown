import app from "./app.js";
import client from "./db/client.js";
import seed from "./db/seed.js";

const init = async () => {
  const PORT = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");
  
  if (process.env.NODE_ENV !== "production") {
  await seed();
  }

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
};

init();
