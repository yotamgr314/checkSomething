console.log("check");

const { dbConnection } = require("../db_connection");
const table_name_form = "tbl_106_lostPetReport";
const table_common_name = "tbl_106_commonPetReportsInfo";

const formController = {
    async createLostPetReport(req, res) {
        const connection = await dbConnection.createConnection();
        const {pet_name, pet_chip_number, pet_behavior, photos, city, last_seen_address, more_information } = req.body;
        const user_id = req.user.id;
        await connection.execute(
            `INSERT INTO ${table_name_form} (pet_name, pet_chip_number, pet_behavior, photos, city, last_seen_address, more_information) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [pet_name, user_id, pet_chip_number, pet_behavior, photos, city, last_seen_address, more_information]
        );
        connection.end();
        res.json({ message: "Pet created successfully" });
    },

    async submitLostPetReport(req, res) {
        console.log("Form submission received at: ", new Date().toISOString());
        console.log("Unique ID: ", req.body.unique_id);

        let connection;
        try {
            connection = await dbConnection.createConnection();
            const { pet_name, pet_chip_number, pet_behavior, photos, city, last_seen_address, more_information, category, date } = req.body;
            const user_id = req.user.id;
            console.log("Received data:", {
                pet_name,
                user_id,
                pet_chip_number,
                pet_behavior,
                photos,
                city,
                last_seen_address,
                more_information,
                category,
                date
            });

            if (!pet_name || !user_id || !pet_chip_number || !pet_behavior || !photos || !city || !last_seen_address || !more_information || !category || !date) {
                console.log("Validation failed");
                return res.status(400).json({ message: "All fields are required" });
            }

            // Insert into common info table
            const [commonInfoResult] = await connection.execute(
                `INSERT INTO ${table_common_name} (user_id, pet_chip_number, photos, city, last_seen_address, date, category) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, pet_chip_number, photos, city, last_seen_address, date, category]
            );

            const common_info_report_id = commonInfoResult.insertId;

            // Insert into distressed pet report table
            const [result] = await connection.execute(
                `INSERT INTO ${table_name_form} (common_info_report_id, pet_name, pet_behavior, more_information) VALUES (?, ?, ?, ?)`,
                [common_info_report_id, pet_name, pet_behavior, more_information]
            );
            

            console.log("Insert result:", result);
            res.json({ message: "Form submitted successfully" });
        } catch (error) {
            console.error("Error inserting data:", error);
            res.status(500).json({ message: "Server error" });
        } finally {
            if (connection) {
                try {
                    connection.end();
                } catch (endError) {
                    console.error("Error closing the connection:", endError);
                }
            }
        }
    }
};

module.exports = { formController };
