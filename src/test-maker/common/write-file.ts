import fs from "fs"
export function writeFile(filename: string, jsonObject: Object){
    fs.writeFileSync(filename,JSON.stringify(jsonObject))
}