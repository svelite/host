import { getId } from "../db/helpers.js";

export function generateApiKey() {
    return `sv-${getId()}-${getId()}-${getId()}`
}