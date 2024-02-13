/* eslint-disable prefer-const */
import {
    PBBackup,
    AidokuManga,
    AidokuBackup,
    AidokuLibrary,
    AidokuChapter,
    AidokuHistory
} from './types'

export function convertPaperback(rawJson: string): AidokuBackup {
    const pbObj: PBBackup = JSON.parse(rawJson)

    const aidokuCategoriesSet: Set<string> = new Set<string>()
    pbObj.library.forEach((item) => {
        item.libraryTabs.forEach((i) => {
            aidokuCategoriesSet.add(i.name)
        })
    })

    let history: AidokuHistory[] = []
    let manga: AidokuManga[] = []
    let chapters: AidokuChapter[] = []
    let library: AidokuLibrary[] = []

    const paperbackIdSet: Set<string> = new Set<string>()
    const paperbackIdTabDic: Record<string, string[]> = {}
    const mangaIdSet: Set<string> = new Set<string>()
    const aidokuSourcesSet: Set<string> = new Set<string>()

    for (const item of pbObj.library) {
        if (!item.manga.id) {
            continue
        }
        paperbackIdSet.add(item.manga.id)
        paperbackIdTabDic[item.manga.id] = item.libraryTabs.map((obj) => obj.name)
    }

    for (const item of pbObj.sourceMangas) {
        if (!item.sourceId || !item.mangaId || !paperbackIdSet.has(item.manga.id)) {
            continue
        }

        const sourceId = item.sourceId + ' [MIGRATE ME]'

        const aidokuLibraryItem: AidokuLibrary = {
            lastOpened: new Date().getTime(),
            lastUpdated: new Date().getTime(),
            dateAdded: new Date().getTime(),
            categories: paperbackIdTabDic[item.manga.id] ?? [],
            mangaId: item.mangaId,
            sourceId: sourceId
        }

        const aidokuMangaItem: AidokuManga = {
            id: item.mangaId,
            sourceId: sourceId,
            title: item.manga.titles[0],
            cover: item.manga.image,
            status: 1,
            nsfw: 0,
            viewer: 1
        }

        mangaIdSet.add(item.mangaId)
        aidokuSourcesSet.add(sourceId)

        library.push(aidokuLibraryItem)
        manga.push(aidokuMangaItem)
    }

    for (const item of pbObj.chapterMarkers) {
        if (!item.chapter || !mangaIdSet.has(item.chapter.mangaId)) {
            continue
        }
        const sourceId = item.chapter.sourceId + ' [MIGRATE ME]'
        aidokuSourcesSet.add(sourceId)

        const sourceOrder = new Int16Array(1)
        sourceOrder[0] = Math.abs(item.chapter.sortingIndex)
        sourceOrder[0] = Math.abs(sourceOrder[0])

        const aidokuChapterItem: AidokuChapter = {
            volume: item.chapter.volume ? item.chapter.volume : undefined,
            mangaId: item.chapter.mangaId,
            lang: item.chapter.langCode ?? 'en',
            id: item.chapter.id ?? '',
            scanlator: item.chapter.group ? item.chapter.group : undefined,
            title: item.chapter.name ? item.chapter.name : undefined,
            sourceId: sourceId,
            dateUploaded: item.chapter.time + 978307200,
            chapter: item.chapter.chapNum ? item.chapter.chapNum : undefined,
            sourceOrder: Math.abs(sourceOrder[0]) ?? 0
        }
        const aidokuHistoryItem: AidokuHistory = {
            dateRead: item.time + 978307200,
            sourceId: sourceId,
            chapterId: item.chapter.id,
            mangaId: item.chapter.mangaId,
            progress: -1,
            total: 0,
            completed: true
        }

        chapters.push(aidokuChapterItem)
        history.push(aidokuHistoryItem)
    }

    let sources = Array.from(aidokuSourcesSet)
    const aidokuObject: AidokuBackup = {
        history: history.length ? history : undefined,
        manga: manga.length ? manga : undefined,
        chapters: chapters.length ? chapters : undefined,
        library: library.length ? library : undefined,
        sources: sources.length ? sources : undefined,
        date: new Date().getTime(),
        name: `[kingbri.nmn.v4] Paperback Backup`,
        version: 'kingbri.nmn.v4',
        categories: Array.from(aidokuCategoriesSet)
    }
    return aidokuObject
}

// plutil -convert xml1 aidoku.json -o out.plist &&  plutil -convert binary1 out.plist -o back.aib && rm out.plist
