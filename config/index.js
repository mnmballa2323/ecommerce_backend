const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env') });

module.exports = {
    database_local: process.env.DATABASE_LOCAL,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    email: process.env.email,
    password: process.env.password,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    sender_mail: process.env.SENDER_MAIL,
    refresh_token: process.env.REFRESH_TOKEN,
    access_token: process.env.ACCESS_TOKEN,
};

