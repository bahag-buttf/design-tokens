import fs from "fs";

export const writeToFile = (content: any, filePath: string) => {
    fs.writeFileSync(filePath, content);
}