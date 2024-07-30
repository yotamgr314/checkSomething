const { dbConnection } = require("../db_connection");
const table_name_form = "tbl_106_distressedPetReport";
const common_info_table = "tbl_106_commonPetReportsInfo";

const distressedPetFormController = {
    async createDistressedPetReport(req, res) {
        console.log(req.user)
        const connection = await dbConnection.createConnection();
        const { pet_chip_number, the_prob_and_pet_condition, pet_distress_signs, photos, city, last_seen_address, how_to_help, urgency, date, category } = req.body;
        const user_id = req.user.id;
        if (!user_id || !pet_chip_number || !the_prob_and_pet_condition || !city || !last_seen_address || !how_to_help || !urgency || !date || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            await connection.beginTransaction();

            // Insert into common info table
            const [commonInfoResult] = await connection.execute(
                `INSERT INTO ${common_info_table} (user_id, pet_chip_number, photos, city, last_seen_address, date, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, pet_chip_number, photos, city, last_seen_address, date, category]
            );

            const common_info_report_id = commonInfoResult.insertId;

            // Insert into distressed pet report table
            await connection.execute(
                `INSERT INTO ${table_name_form} (common_info_report_id, the_prob_and_pet_condition, pet_distress_signs, how_to_help, urgency) VALUES (?, ?, ?, ?, ?)`,
                [common_info_report_id, the_prob_and_pet_condition, pet_distress_signs, how_to_help, urgency]
            );

            await connection.commit();
            connection.end();
            res.json({ message: "Distressed pet report created successfully" });
        } catch (error) {
            await connection.rollback();
            console.error("Error inserting data:", error);
            connection.end();
            res.status(500).json({ message: "Server error" });
        }
    },

    async submitDistressedPetReport(req, res) {
        console.log("Form submission received at: ", new Date().toISOString());
        console.log("Unique ID: ", req.body.unique_id);

        const { user_id, pet_chip_number, the_prob_and_pet_condition, pet_distress_signs, photos, city, last_seen_address, how_to_help, urgency, date, category } = req.body;

        if (!user_id || !pet_chip_number || !the_prob_and_pet_condition || !city || !last_seen_address || !how_to_help || !urgency || !date || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const connection = await dbConnection.createConnection();

            await connection.beginTransaction();

            // Insert into common info table
            const [commonInfoResult] = await connection.execute(
                `INSERT INTO ${common_info_table} (user_id, pet_chip_number, photos, city, last_seen_address, date, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, pet_chip_number, photos, city, last_seen_address, date, category]
            );

            const common_info_report_id = commonInfoResult.insertId;

            // Insert into distressed pet report table
            await connection.execute(
                `INSERT INTO ${table_name_form} (common_info_report_id, the_prob_and_pet_condition, pet_distress_signs, how_to_help, urgency) VALUES (?, ?, ?, ?, ?)`,
                [common_info_report_id, the_prob_and_pet_condition, pet_distress_signs, how_to_help, urgency]
            );

            await connection.commit();
            connection.end();
            res.json({ message: "Form submitted successfully" });
        } catch (error) {
            await connection.rollback();
            console.error("Error inserting data:", error);
            connection.end();
            res.status(500).json({ message: "Server error" });
        }
    },

    async getDistressedPetReports(req, res) {
        try {
            const connection = await dbConnection.createConnection();
            const [results] = await connection.execute(`
                SELECT dp.*, ci.*
                FROM ${table_name_form} dp
                JOIN ${common_info_table} ci ON dp.common_info_report_id = ci.id
            `);
            connection.end();
            res.json(results);
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    async getDistressedPetReportsByUser(req, res) {
        const { userId } = req.params;

        try {
            const connection = await dbConnection.createConnection();
            const [results] = await connection.execute(`
                SELECT dp.*, ci.*
                FROM ${table_name_form} dp
                JOIN ${common_info_table} ci ON dp.common_info_report_id = ci.id
                WHERE ci.user_id = ?
            `, [userId]);
            connection.end();
            res.json(results);
        } catch (error) {
            console.error("Error fetching data:", error);
            res.status(500).json({ message: "Server error" });
        }
    },

    async deleteDistressedPetReport(req, res) {
        const { reportId } = req.params;

        try {
            const connection = await dbConnection.createConnection();
            await connection.execute(`DELETE FROM ${table_name_form} WHERE common_info_report_id = ?`, [reportId]);
            await connection.execute(`DELETE FROM ${common_info_table} WHERE id = ?`, [reportId]);
            connection.end();
            res.json({ message: "Report deleted successfully" });
        } catch (error) {
            console.error("Error deleting data:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
};

module.exports = { distressedPetFormController };
