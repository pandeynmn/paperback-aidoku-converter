// Referenced from Aidoku swift project

export type AidokuBackup = {
    library?: Library[]
    history?: History[]
    manga?: Manga[]
    chapters?: Chapter[]
    trackItems?: string[]
    categories?: string[]
    sources?: string[]
    date: number
    name?: string
    version?: string
}

export interface History {
    dateRead: number
    sourceId: string
    chapterId: string
    mangaId: string
    progress?: number
    total?: number
    completed: boolean
}

export interface Manga {
    id: string
    sourceId: string
    title: string
    author?: string
    artist?: string
    desc?: string
    tags?: string[]
    cover?: string
    url?: string
    status: number
    nsfw: number
    viewer: number
}

export interface Chapter {
    volume?: number
    mangaId: string
    lang: string
    id: string
    scanlator?: string
    title?: string
    sourceId: string
    dateUploaded?: number
    chapter?: number
    sourceOrder: number
}

export interface Library {
    lastOpened: number
    lastUpdated: number
    lastRead?: number
    dateAdded: number
    categories: string[]
    mangaId: string
    sourceId: string
}
