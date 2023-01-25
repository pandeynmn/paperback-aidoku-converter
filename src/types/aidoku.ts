// Generated using QuickType https://app.quicktype.io/

export type AidokuBackup = {
    library:  Library[];
    history:  History[];
    manga:    Manga[];
    chapters: Chapter[];
    sources:  string[];
    date:     number;
    name?:    string;
    version:  string;
    categories?: string[];
}

export interface History {
    progress:  number;
    mangaId:   string;
    chapterId: string;
    completed: boolean;
    sourceId:  string;
    dateRead:  number;
}

export interface Manga {
    id:         string;
    lastUpdate: number;
    author:     string;
    url:        string;
    nsfw:       number;
    tags:       string[];
    title:      string;
    sourceId:   string;
    desc:       string;
    cover:      string;
    viewer:     number;
    status:     number;
}

export interface Chapter {
    volume?:      number;
    mangaId:      string;
    lang:         string;
    id:           string;
    scanlator:    string;
    title?:       string;
    sourceId:     string;
    dateUploaded: number;
    chapter:      number;
    sourceOrder:  number;
}

export interface Library {
    mangaId:     string;
    lastUpdated: number;
    categories:  string[];
    dateAdded:   number;
    sourceId:    string;
    lastOpened:  number;
}