import fs from 'fs'
import path from 'path'

const filePath = path.resolve('.', 'images_folder/scripttag.js')
const imageBuffer = fs.readFileSync(filePath)

export default (req, res) => {
    res.setHeader('Content-Type', 'application/javascript')
    res.send(imageBuffer);
}