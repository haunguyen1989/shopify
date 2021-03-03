import fs from 'fs'
import path from 'path'

const filePath = path.resolve('.', 'images_folder/next.jpg')
const imageBuffer = fs.readFileSync(filePath)

export default (req, res) => {
    res.setHeader('Content-Type', 'image/jpg')
    res.send(imageBuffer);
}