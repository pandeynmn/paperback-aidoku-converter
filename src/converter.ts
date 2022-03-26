import {
    PBBackup,
    AidokuManga,
    AidokuBackup,
    AidokuLibrary,
    AidokuChapter,
    AidokuHistory
} from './types';

export function convertPaperback(rawJson: string): AidokuBackup {
    const aidokuObject: AidokuBackup = {
        history: [],
        manga: [],
        chapters: [],
        library: [],
        sources: [],
        date: 0,
        name: 'Paperback Backup',
        version: 'pb-aidoku-v0.0.1'
    }

    const pbObj: PBBackup = JSON.parse(rawJson)
    const paperbackIdSet: Set<string> = new Set<string>()
    const mangaIdSet: Set<string> = new Set<string>()
    const aidokuSourcesSet: Set<string> = new Set<string>()

    aidokuObject.date = pbObj.date + 978307200 // convert apple format to epoch

    for (const item of pbObj.library) {
        for (const manga of pbObj.sourceMangas) {
            if (manga.manga.id == item.manga.id) {
                mangaIdSet.add(manga.mangaId)
                break
            }
        }
        paperbackIdSet.add(item.manga.id)
    }

    for (const item of pbObj.sourceMangas) {
        if (!paperbackIdSet.has(item.manga.id)) {
            continue
        }
        const sourceId = getAidokuSourceId(item.sourceId)
        if (sourceId === '_unknown') {
            continue
        }
        aidokuSourcesSet.add(sourceId)
        if (item.mangaId.length < 10 && sourceId == 'multi.mangadex') {
            // console.error( `OLD MangaDex ID MIGRTE: ${item.mangaId} - ${item.manga.titles[0]}`)
            continue
        }

        const aidokuLibraryItem: AidokuLibrary = {
            mangaId: item.mangaId ?? '',
            lastUpdated: 0,
            categories: [],
            dateAdded: 0,
            sourceId: sourceId,
            lastOpened: 0
        }

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
            status: item.manga.status == 'Ongoing' ? 1 : 0,
        }
        aidokuObject.library.push(aidokuLibraryItem)
        aidokuObject.manga  .push(aidokuMangaItem)
    }

    for (const item of pbObj.chapterMarkers) {
        if (!item.chapter) {
            console.log(item)
            continue
        }
        if (!mangaIdSet.has(item.chapter.mangaId)) {
            continue
        }
        const sourceId = getAidokuSourceId(item.chapter.sourceId)
        if (sourceId === '_unknown') {
            continue
        }
        aidokuSourcesSet.add(sourceId)
        if (item.chapter.mangaId.length < 10 && sourceId == 'multi.mangadex') {
            continue
        }

        const aidokuChapterItem: AidokuChapter = {
            volume: item.chapter.volume   ?? '',
            mangaId: item.chapter.mangaId ?? '',
            lang: item.chapter.langCode   ?? '',
            id: item.chapter.id           ?? '',
            scanlator: item.chapter.group ?? '',
            title: item.chapter.name == '' ? 'Chapter ' + item.chapter.chapNum.toString() : item.chapter.name,
            sourceId: sourceId,
            dateUploaded: item.chapter.time + 978307200,
            chapter: item.chapter.chapNum ?? 0,
            sourceOrder: Math.abs(item.chapter.sortingIndex) ?? 0,
        }
        const aidokuHistoryItem: AidokuHistory = {
            progress: item.lastPage,
            mangaId: item.chapter.mangaId ?? '',
            chapterId: item.chapter.id    ?? '',
            completed: item.completed,
            sourceId: sourceId,
            dateRead: item.time + 978307200
        }
        aidokuObject.chapters.push(aidokuChapterItem)
        aidokuObject.history.push(aidokuHistoryItem)
    }

    aidokuObject.sources = Array.from(aidokuSourcesSet)

    return aidokuObject;
}

function getAidokuSourceId(sourceId: string): string {
    switch (sourceId) {
        case 'MangaLife':
        case 'MangaSee':
            return 'en.nepnep'
        case 'MangaDex':
            return 'multi.mangadex'
        default:
            return '_unknown'
    }
}