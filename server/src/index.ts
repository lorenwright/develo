import express from 'express';
import csv from 'csvtojson';

const app = express();
const PORT = 3000;

type Patient = {
    agemos: number,
    sex: number,
    weight: number,
    height: number,
    head_circumference: number
    bmi: number
}

app.use(express.json());
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
    if (!patient.sex) {
        return 'sex not defined'
    }

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

    if (!file) {
        return 'no matching dataset'
    }

    const data = await csv().fromFile(process.env.PWD + '/data/' + file);
    const entry = data.find(d => parseFloat(d.Agemos) === patient.agemos && parseInt(d.Sex, 10) === patient.sex)

    if (!entry) {
        return 'no entry found'
    }

    // @ts-ignore
    const X = parseFloat(patient[attribute])
    const M = parseFloat(entry.M)
    const S = parseFloat(entry.S)
    const L = parseFloat(entry.L)

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

// start the Express server
app.listen( PORT, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ PORT }` );
} );