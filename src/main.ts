import "dotenv/config";

import { connectMongoDB } from "./infrastructure/database/mongoose/connection";
import { createExpressApp } from "./infrastructure/web/express-app";

const bootstrap = async () => {
	await connectMongoDB();

	const app = createExpressApp();

	const PORT = process.env.PORT || 3000;

	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
};

bootstrap();