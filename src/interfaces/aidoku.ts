export interface AidokuBackup {
	history: History[];
	manga: Manga[];
	date: number;
	version: string;
	chapters: Chapter[];
	library: Library[];
}

export interface History {
	progress: number;
	mangaId: string;
	chapterId: string;
	completed: boolean;
	sourceId: string;
	dateRead: number;
}

export interface Manga {
	id: string;
	lastUpdate: number;
	author: string;
	url: string;
	nsfw: number;
	tags: string[];
	title: string;
	sourceId: string;
	desc: string;
	cover: string;
	viewer: number;
	status: number;
}

export interface Chapter {
	volume?: number;
	mangaId: string;
	lang: string;
	id: string;
	scanlator: string;
	title?: string;
	sourceId: string;
	dateUploaded: number;
	chapter: number;
	sourceOrder: number;
}

export interface Library {
	mangaId: string;
	lastUpdated: number;
	categories: any[];
	dateAdded: number;
	sourceId: string;
	lastOpened: number;
}
