import { ARRANGEMENT, ARRANGEMENTS, USERS } from 'services/serviceTypes'
import { postAuthenticated, getAuthenticated } from 'services/request'
import * as ArrangementSchema from 'schema/arrangementSchema.json'
import Ajv from 'ajv'

let ajv = new Ajv()
const arrangementValidation = ajv.compile(ArrangementSchema)

export const getArrangement = (arrangementId) => {
    return getAuthenticated({
        url: ARRANGEMENT + "/" + arrangementId
    })
}

export const updateArrangement = (arrangement) => {
    // Test arrangement based on json validation
    let valid = arrangementValidation(arrangement)
    if (valid) {
        return postAuthenticated({
            url: ARRANGEMENT + "/" + arrangement._id,
            data: arrangement
        })
    }
    return Promise.reject("Arrangement was not valid")
}

export const getAllArrangements = (googleId) => {
    return getAuthenticated({
        url: USERS + "/" + googleId + ARRANGEMENTS,
    });
}

export const getExportArrangement = (arrangement, type) => {
    return getAuthenticated({
        url: `${ARRANGEMENT}/${arrangement._id}/export/${type}`
    })
}

export default getArrangement;