"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use(express_1.default.json());
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patient, attribute } = req.body;
    const zScore = yield calculateZScore(patient, attribute);
    if (typeof zScore === 'string') {
        res.status(500).json({
            error: zScore
        });
    }
    else {
        res.json({
            z_score: zScore
        });
    }
}));
app.get('/get-data', (0, cors_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, csvtojson_1.default)().fromFile(process.env.PWD + '/data/' + req.query.file + '.csv');
    res.json(data);
}));
/**
 * Calculates the Z score based off of patient data and selected attribute
 *
 * @param {Patient} patient - The patient object
 * @param {string} attribute - The attribute that we want a z score based off of
 * @returns {float} - The z score
 */
const calculateZScore = (patient, attribute) => __awaiter(void 0, void 0, void 0, function* () {
    if (!patient.sex) {
        return 'sex not defined';
    }
    let file;
    switch (attribute) {
        case 'weight':
            if (patient.agemos <= 36) {
                file = 'weight-for-age-infant.csv';
            }
            else {
                file = 'weight-for-age.csv';
            }
            break;
        case 'height':
            if (patient.agemos <= 36) {
                file = 'length-for-age-infant.csv';
            }
            else {
                file = 'stature-for-age.csv';
            }
            break;
        case 'head_circumference':
            if (patient.agemos <= 36) {
                file = 'head-circumference-for-age-infant.csv';
            }
            break;
        case 'bmi':
            if (patient.agemos >= 24) {
                file = 'bmi-for-age.csv';
            }
            break;
        default:
            break;
    }
    if (!file) {
        return 'no matching dataset';
    }
    const data = yield (0, csvtojson_1.default)().fromFile(process.env.PWD + '/data/' + file);
    const entry = data.find(d => parseFloat(d.Agemos) === patient.agemos && parseInt(d.Sex, 10) === patient.sex);
    if (!entry) {
        return 'no entry found';
    }
    // @ts-ignore
    const X = parseFloat(patient[attribute]);
    const M = parseFloat(entry.M);
    const S = parseFloat(entry.S);
    const L = parseFloat(entry.L);
    if (X) {
        if (L === 0) {
            // Z=ln(X/M)/S
            return Math.log(X / M) / S;
        }
        else {
            // Z=(((X/M)^L) – 1)/LS
            let res = Math.pow(X / M, L);
            res = res - 1;
            res = res / (L * S);
            return res;
        }
    }
    return `Attribute not found for patient`;
});
// start the Express server
app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map