import express from 'express';
import csv from 'csvtojson';
import cors from 'cors';
import path from "path";

const app = express();

type Patient = {
    agemos: number,
    sex: number,
    weight: number,
    height: number,
    head_circumference: number
    bmi: number
}

app.use(express.json());

/**
 * The endpoint to hit in order to get the Z score
 */
app.post('/', async (req, res) => {
    const {
        patient,
        attribute
    } = req.body;

    const zScore = await calculateZScore(patient, attribute)

    if (typeof zScore === 'string') {
        res.status(500).json({
            error: zScore
        });
    } else {
        res.json({
            z_score: zScore
        });
    }
})

/**
 * Calculates the Z score based off of patient data and selected attribute
 *
 * @param {Patient} patient - The patient object
 * @param {string} attribute - The attribute that we want a z score based off of
 * @returns {float} - The z score
 */
const calculateZScore = async (patient: Patient, attribute: string) => {
    // If no sex is given for patient, we cannot properly parse the data
    if (!patient.sex) {
        return 'sex not defined'
    }

    // Get the file that we should be checking data for based off of attribute and agemos
    let file
    switch (attribute) {
        case 'weight':
            if (patient.agemos <= 36) {
                file = 'weight-for-age-infant.csv'
            } else {
                file = 'weight-for-age.csv'
            }
            break
        case 'height':
            if (patient.agemos <= 36) {
                file = 'length-for-age-infant.csv'
            } else {
                file = 'stature-for-age.csv'
            }
            break
        case 'head_circumference':
            if (patient.agemos <= 36) {
                file = 'head-circumference-for-age-infant.csv'
            }
            break
        case 'bmi':
            if (patient.agemos >= 24) {
                file = 'bmi-for-age.csv'
            }
            break
        default:
            break
    }

    // If there is no matching data, throw error
    if (!file) {
        return 'no matching dataset'
    }

    // The server file path
    const filePath = path.parse(path.resolve(__dirname, '../'))

    // Parse CSV to JSON
    const data = await csv().fromFile(`${filePath.dir}/${filePath.name}/data/${file}`);
    // Get Agemos and sex to compare against
    const entry = data.find(d => parseFloat(d.Agemos) === patient.agemos && parseInt(d.Sex, 10) === patient.sex)

    // If no entry was found, throw error
    if (!entry) {
        return 'no entry found'
    }

    // Get the X, M, S, and L variables for formula
    // @ts-ignore
    const X = parseFloat(patient[attribute])
    const M = parseFloat(entry.M)
    const S = parseFloat(entry.S)
    const L = parseFloat(entry.L)

    // If we have X, then we can actually perform calculations, otherwise throw error
    if (X) {
        if (L === 0) {
            // Z=ln(X/M)/S
            return Math.log(X / M) / S
        } else {
            // Z=(((X/M)^L) – 1)/LS
            let res = Math.pow(X / M, L)
            res = res - 1
            res = res / (L * S)
            return res
        }
    }

    return `Attribute not found for patient`

}

/**
 * Parse the given CSV and return as JSON
 */
app.post('/get-data', async (req, res) => {
    const { file } = req.body;
    try {
        // The server file path
        const filePath = path.parse(path.resolve(__dirname, '../'))

        // Parse CSV to JSON
        const data = await csv().fromFile(`${filePath.dir}/${filePath.name}/data/${file}.csv`);
        res.json(data);
    } catch {
        res.status(404).json('File not found.');
    }
})

module.exports = app;