import figmaExport from '../variables.json'
import {last, pathOr} from "ramda";
import {Collection, FigmaExport, Mode, Tokens} from "../types";
import {writeToFile} from "../utils";

const getTokenName = (name: string) => {
    const splittedName = name.split('/')
    return last(splittedName)
}

const getPrimitiveTokens = (collection: Collection) => {
    let primitiveTokens: Tokens = {}
    const [modeDefault] = collection.modes
    modeDefault.variables.forEach((variable) => {
        const name = variable.name
        const tokenName = getTokenName(name)
        const value = variable.value
        if (tokenName) {
            primitiveTokens = {...primitiveTokens, [tokenName]: value}
        }
    })
    return primitiveTokens
}

const getModeTokens = (mode: Mode, primitiveTokens: Tokens) => {
    let tokens: Record<string, any> = {}
    mode.variables.forEach((variable) => {
        const isAlias = variable.isAlias
        const name = variable.name
        const tokenName = getTokenName(name)
        if (isAlias) {
            const referencedBaseTokenName = getTokenName(variable.value?.name)
            if (tokenName && referencedBaseTokenName) {
                const value = primitiveTokens[referencedBaseTokenName]
                tokens = {...tokens, [tokenName]: value}
            }
        }
    })
    return tokens
}

const getSemanticTokens = (collection: Collection, primitiveTokens: Tokens) => {
    const [modeShop, modeBahag] = collection.modes
    const shopTokens = getModeTokens(modeShop, primitiveTokens)
    const bahagTokens = getModeTokens(modeBahag, primitiveTokens)
    return {...shopTokens, ...bahagTokens}
}

export const convertFigmaVariablesToDesignTokens = (variables: FigmaExport) => {
    let tokens: Tokens = {}
    const collections = pathOr([], ['collections'], variables)
    const [primitiveTokensCollection, semanticTokensCollection]: Collection[] = collections
    const primitiveTokens = getPrimitiveTokens(primitiveTokensCollection)
    const semanticTokens = getSemanticTokens(semanticTokensCollection, primitiveTokens)
    tokens = { ...primitiveTokens, ...semanticTokens }
    return tokens
}

const writeToJsonFile = () => {
    const tokens = convertFigmaVariablesToDesignTokens(figmaExport)
    writeToFile(JSON.stringify(tokens, null, 2), 'src/generated/design-tokens.json')
}

writeToJsonFile()