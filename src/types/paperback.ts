// Generated using QuickType https://app.quicktype.io/

export type PBBackup = {
    library: Library[]
    sourceMangas: SourceMangas[]
    chapterMarkers: ChapterMarker[]
    backupSchemaVersion: number
    date: number
    tabs: any[]
    version: string
    sourceRepositories: SourceRepository[]
    activeSources: ActiveSource[]
}

export interface ActiveSource {
    author: string
    desc: string
    website: string
    id: string
    tags: ActiveSourceTag[]
    repo: string
    websiteBaseURL: string
    version: string
    icon: string
    name: string
}

export interface ActiveSourceTag {
    type: string
    text: string
}

export interface Library {
    lastRead: number
    manga: Manga
    lastUpdated: number
    dateBookmarked: number
    libraryTabs: LibraryTabs[]
    updates: number
}

export interface LibraryTabs {
    id: string
    name: string
    sortOrder: number
}

export interface Manga {
    id: string
    rating?: number
    covers: any[]
    author: string
    tags: MangaTag[]
    desc: string
    titles: string[]
    image: string
    additionalInfo: AdditionalInfo
    hentai: boolean
    artist: string
    status: string
    banner?: string
}

export interface AdditionalInfo {
    langFlag: string
    users: string
    langName: string
    avgRating: string
    views: string
    follows: string
}

export interface MangaTag {
    id: string
    label: string
    tags: TagTag[]
}

export interface TagTag {
    id: string
    value: string
}

export interface SourceMangas {
    mangaId: string
    id: string
    manga: Manga
    originalInfo: Manga
    sourceId: string
}

export interface SourceRepository {
    name: string
    url: string
}

export interface ChapterMarker {
    totalPages: number
    lastPage: number
    chapter: Chapter
    completed: boolean
    time: number
    hidden: boolean
}

export interface Chapter {
    chapNum: number
    mangaId: string
    volume: number
    id: string
    time: number
    sortingIndex: number
    sourceId: string
    group: string
    langCode: string
    name: string
}
