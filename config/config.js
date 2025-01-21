require('dotenv').config({path:'../.env'});

// console.log(process.env.DB_HOST)

//  module.exports = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres"
//   } ,
// test: {
  // username: process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //     database: process.env.DB_NAME,
  //     host: process.env.DB_HOST,
  //     port: process.env.DB_PORT,
  //     dialect: "postgres"
//   logging: false, 
// }
// }
module.exports = {
  development: {
    username: 'postgres.lwexkwmbxaijvlgziqbc',
    password: 'DOfSDgVhamZcSyRA',
    database: 'postgres',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    dialect: "postgres"
  } ,
  test:{
    username: 'postgres.lwexkwmbxaijvlgziqbc',
    password: 'DOfSDgVhamZcSyRA',
    database: 'postgres',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 5432,
    dialect: "postgres",
    logging: false
  }
}