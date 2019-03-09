import { ARRANGEMENT, ARRANGEMENTS, EXPORT_ARRANGEMENT } from 'services/serviceTypes'
import { get, post } from 'services/request'
import * as ArrangementSchema from 'schema/arrangementSchema.json'
import * as Ajv from 'ajv'

let ajv = new Ajv()
const arrangementValidation = ajv.compile(ArrangementSchema)

export const getArrangement = (arrangementId) => {
    return get({url: ARRANGEMENT + "/" + arrangementId})
}

export const updateArrangement = (arrangement) => {
    // Test arrangement based on json validation
    let valid = arrangementValidation(arrangement)
    if (valid) {
        return post({
            url: EXPORT_ARRANGEMENT,
            data: arrangement
        })
    }
    return Promise.reject("Arrangement was not valid")
}

export const getAllArrangements = (googleId) => {
    return get({url: ARRANGEMENTS + "/" + googleId});
}

export default getArrangement;