const { dbConnection } = require("../db_connection")

const table_name_lostPetReport = "tbl_106_lostPetReport";
const table_name_distressedPetReport = "tbl_106_distressedPetReport";
const table_name_commonPetReportsInfo = "tbl_106_commonPetReportsInfo";
const petsController = {
    async getAllReports(req, res) {
        const connection = await dbConnection.createConnection();
        const [pets] = await connection.execute(`SELECT * FROM ${table_name_lostPetReport}`);
        connection.end();
        res.json(pets);
    },
    async getReportById(req, res) {
        const connection = await dbConnection.createConnection();
        const [pet] = await connection.execute(`SELECT * FROM ${table_name_lostPetReport} WHERE user_id = ?`, [req.params.id]);
        connection.end();
        res.json(pet);
    },
    async updateReport(req, res) {
        const connection = await dbConnection.createConnection();
        const { pet_name, pet_chip_number, pet_behavior, city, last_seen_address, more_information,date } = req.body;
        await connection.execute(`UPDATE ${table_name_lostPetReport} SET pet_name = ?, pet_behavior = ?, more_information = ? WHERE common_info_report_id = ?`, [pet_name, pet_behavior, more_information, req.params.id]);
        await connection.execute(`UPDATE ${table_name_commonPetReportsInfo} SET city = ?, last_seen_address = ?, pet_chip_number = ?, date = ? WHERE id = ?`, [city, last_seen_address, pet_chip_number, date, req.params.id]);
        connection.end();
        res.json({message: "report updated successfully"});
    },
    async deleteReport(req, res) {
        const connection = await dbConnection.createConnection();
        await connection.execute(`DELETE FROM ${table_name_lostPetReport} WHERE common_info_report_id= ?`, [req.params.id]);
        await connection.execute(`DELETE FROM ${table_name_commonPetReportsInfo} WHERE id= ?`, [req.params.id]);
        connection.end();
        res.json({message: "Pet deleted successfully"});
    },
    async innerJoinUsersLostPets(req, res) {
        const connection = await dbConnection.createConnection();
        const [LostPets] = await connection.execute(`SELECT LP.*, CP.*, U.UserName, U.UserImage FROM ${table_name_lostPetReport} LP INNER JOIN tbl_106_commonPetReportsInfo CP ON LP.common_info_report_id = CP.id inner join tbl_106_users U on CP.user_id = U.UserId`);
        connection.end();
        res.json(LostPets);
    },
    async innerJoinUsersDistressedPets(req, res) {
        const connection = await dbConnection.createConnection();
        const [DistressedPets] = await connection.execute(`SELECT DP.*, CP.*, U.UserName, U.UserImage FROM ${table_name_distressedPetReport} DP INNER JOIN tbl_106_commonPetReportsInfo CP ON DP.common_info_report_id = CP.id inner join tbl_106_users U on CP.user_id = U.UserId`);
        connection.end();
        res.json(DistressedPets);
    }

}
module.exports = { petsController };