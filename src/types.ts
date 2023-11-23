export interface FigmaExport {
    version: string
    metadata: Metadata
    collections: Collection[]
}

export interface Metadata {}

export interface Collection {
    name: string
    modes: Mode[]
}

export interface Mode {
    name: string
    variables: Variable[]
}

export interface Variable {
    name: string
    type: string
    isAlias: boolean
    value: any
}

export type Tokens = Record<string, any>