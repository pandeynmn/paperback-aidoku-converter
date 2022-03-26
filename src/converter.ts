import { PBBackup, AidokuManga, AidokuBackup, AidokuLibrary, AidokuChapter, AidokuHistory } from './types';

export const convertPaperback = (pbObj: PBBackup): AidokuBackup => {
	const aidokuObject: AidokuBackup = {
		history: [],
		manga: [],
		date: 0,
		version: 'pb-aidoku-v0.0.1',
		chapters: [],
		library: []
	};

	const paperbackIdSet: Set<string> = new Set<string>();

	for (const item of pbObj.library) {
		paperbackIdSet.add(item.manga.id);
	}

	for (const item of pbObj.sourceMangas) {
		if (!paperbackIdSet.has(item.manga.id)) continue;

		const sourceId = getAidokuSourceId(item.sourceId);
		if (sourceId === '_unknown') continue;

		if (item.mangaId.length < 10 && sourceId == 'multi.mangadex') continue;

		const aidokuLibraryItem: AidokuLibrary = {
			mangaId: item.mangaId ?? '',
			lastUpdated: 0,
			categories: [],
			dateAdded: 0,
			sourceId: sourceId,
			lastOpened: 0
		};

		const aidokuMangaItem: AidokuManga = {
			id: item.mangaId ?? '',
			lastUpdate: 0,
			author: item.manga.author,
			url: '',
			nsfw: item.manga.hentai ? 1 : 0,
			tags: [],
			title: item.manga.titles[0],
			sourceId: sourceId,
			desc: item.manga.desc,
			cover: item.manga.image,
			viewer: Number(item.manga.additionalInfo.views ?? '0'),
			status: item.manga.status == 'Ongoing' ? 1 : 0
		};

		aidokuObject.library.push(aidokuLibraryItem);
		aidokuObject.manga.push(aidokuMangaItem);
	}

	for (const item of pbObj.chapterMarkers) {
		if (!paperbackIdSet.has(item.chapter.mangaId)) continue;

		const sourceId = getAidokuSourceId(item.chapter.sourceId);
		if (sourceId === '_unknown') continue;

		if (item.chapter.mangaId.length < 10 && sourceId == 'multi.mangadex') continue;

		const aidokuChapterItem: AidokuChapter = {
			volume: item.chapter.volume ?? '',
			mangaId: item.chapter.mangaId ?? '',
			lang: item.chapter.langCode ?? '',
			id: item.chapter.id ?? '',
			scanlator: item.chapter.group ?? '',
			title: item.chapter.name == '' ? 'Chapter ' + item.chapter.chapNum.toString() : item.chapter.name,
			sourceId: sourceId,
			dateUploaded: 0,
			chapter: item.chapter.chapNum ?? 0,
			sourceOrder: 0
		};

		const aidokuHistoryItem: AidokuHistory = {
			progress: item.lastPage,
			mangaId: item.chapter.mangaId ?? '',
			chapterId: item.chapter.id ?? '',
			completed: item.completed,
			sourceId: item.chapter.sourceId,
			dateRead: item.time // may need to change this if the date format is different
		};

		aidokuObject.chapters.push(aidokuChapterItem);
		aidokuObject.history.push(aidokuHistoryItem);
	}

	return aidokuObject;
};

function getAidokuSourceId(sourceId: string): string {
	switch (sourceId) {
		case 'MangaLife':
		case 'MangaSee':
			return 'en.nepnep';
		case 'MangaDex':
			return 'multi.mangadex';
		default:
			return '_unknown';
	}
}
