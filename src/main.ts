import "dotenv/config";

import { connectMongoDB } from "./infrastructure/database/mongoose/connection";
import { createExpressApp } from "./infrastructure/web/express-app";

const bootstrap = async () => {
  await connectMongoDB();

  const app = createExpressApp();

  const BASE_URL = process.env.BASE_URL;
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => console.log(`Server running on ${BASE_URL}:${PORT}`));
};

bootstrap();