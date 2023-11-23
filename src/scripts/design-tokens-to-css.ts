import figmaExport from '../variables.json'
import {convertFigmaVariablesToDesignTokens} from "./figma-to-design-tokens";
import {writeToFile} from "../utils";
import {FigmaExport} from "../types";

const convertDesignTokensToCssVariables = (variables: FigmaExport) => {
    const designTokens = convertFigmaVariablesToDesignTokens(variables)


    let cssContent = ':root {\n';

    Object.keys(designTokens).forEach(token => {
        const value = designTokens[token];
        if (typeof value === "object") {
            cssContent += `  ${token}: rgba(${value.r}, ${value.g}, ${value.b}, ${value.a});\n`;
        } else {
            cssContent += `  ${token}: ${value};\n`;
        }
    });

    cssContent += '}';
    return cssContent
}

const writeToCssFile = () => {
    const cssContent = convertDesignTokensToCssVariables(figmaExport)
    writeToFile(cssContent, 'src/generated/design-tokens.css')
}

writeToCssFile()