import {
    PBBackup,
    AidokuManga,
    AidokuBackup,
    AidokuLibrary,
    AidokuChapter,
    AidokuHistory
} from './types';

export function convertPaperback(rawJson: string): AidokuBackup {
    const date_str = new Date(Date.now()).toISOString().split('T')[0]
    const aidokuObject: AidokuBackup = {
        history: [],
        manga: [],
        chapters: [],
        library: [],
        sources: [],
        date: 0,
        name: `Paperback Backup ${date_str}`,
        version: 'pb-aidoku-v23.1.0'
    }

    const pbObj: PBBackup = JSON.parse(rawJson)
    const paperbackIdSet: Set<string> = new Set<string>()
    const mangaIdSet: Set<string> = new Set<string>()
    const aidokuSourcesSet: Set<string> = new Set<string>()

    aidokuObject.date = pbObj.date + 978307200 // convert apple format to epoch

    for (const item of pbObj.library) {
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
        if (item.mangaId.length < 10 && sourceId == 'multi.mangadex') {
            // console.error( `OLD MangaDex ID MIGRTE: ${item.mangaId} - ${item.manga.titles[0]}`)
            continue
        }
        mangaIdSet.add(item.mangaId)
        aidokuSourcesSet.add(sourceId)

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
            nsfw: item.manga.hentai ? 2 : 0,
            tags: [],
            title: item.manga.titles[0],
            sourceId: sourceId,
            desc: item.manga.desc,
            cover: item.manga.image,
            viewer: 0,
            status: getStatus(item.manga.status ?? ''),
        }
        aidokuObject.library.push(aidokuLibraryItem)
        aidokuObject.manga  .push(aidokuMangaItem)
    }

    for (const item of pbObj.chapterMarkers) {
        if (!item.chapter) {
            continue
        }
        if (!mangaIdSet.has(item.chapter.mangaId)) {
            continue
        }
        const sourceId = getAidokuSourceId(item.chapter.sourceId)
        if (sourceId === '_unknown') {
            continue
        }
        if (item.chapter.mangaId.length < 10 && sourceId == 'multi.mangadex') {
            continue
        }
        aidokuSourcesSet.add(sourceId)

        const sourceOrder = new Int16Array(1)
        sourceOrder[0] = Math.abs(item.chapter.sortingIndex)

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
            sourceOrder: sourceOrder[0] ?? 0,
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
    switch (sourceId.toLowerCase()) {
        case '':
            return 'en.tcbscans'
        case '':
            return 'en.voidscans'
        case '':
            return 'en.luminousscans'
        case '':
            return 'id.mangkomik'
        case '':
            return 'en.manhwafreak'
        case '':
            return 'en.acescans'
        case '':
            return 'ar.swatmanga'
        case '':
            return 'en.readkomik'
        case '':
            return 'id.westmanga'
        case '':
            return 'fr.blackarmy'
        case '':
            return 'ar.aresmanga'
        case '':
            return 'en.manhwax'
        case '':
            return 'multi.flamescans'
        case '':
            return 'id.komikucom'
        case '':
            return 'id.komiktap'
        case '':
            return 'id.masterkomik'
        case '':
            return 'en.cosmicscans'
        case '':
            return 'multi.kraw'
        case '':
            return 'en.realmscans'
        case '':
            return 'en.kumascans'
        case '':
            return 'id.mangasusu'
        case '':
            return 'id.manhwaindo'
        case '':
            return 'id.kiryuu'
        case '':
            return 'ar.mangasol'
        case '':
            return 'multi.mangagenki'
        case '':
            return 'es.acescans'
        case '':
            return 'id.manhwaland'
        case '':
            return 'id.kanzenin'
        case '':
            return 'fr.sushiscan'
        case '':
            return 'multi.asurascans'
        case '':
            return 'vi.yurineko'
        case '':
            return 'en.koushoku'
        case '':
            return 'vi.lkdtt'
        case '':
            return 'vi.teamojisan'
        case '':
            return 'vi.truyentranhlh'
        case '':
            return 'vi.phemanga'
        case '':
            return 'en.lhtranslation'
        case '':
            return 'en.setsuscans'
        case '':
            return 'multi.leviatanscans'
        case '':
            return 'vi.fecomic'
        case '':
            return 'id.reaperscansid'
        case '':
            return 'en.nightcomic'
        case '':
            return 'en.resetscans'
        case '':
            return 'en.twilightscans'
        case '':
            return 'vi.yocomic'
        case '':
            return 'en.isekaiscan'
        case '':
            return 'vi.hentaicube'
        case '':
            return 'en.mangatx'
        case '':
            return 'id.manhwaid'
        case '':
            return 'en.toonily'
        case '':
            return 'en.lilymanga'
        case '':
            return 'en.coloredmanga'
        case '':
            return 'en.manhuaplus'
        case '':
            return 'en.reaperscans'
        case '':
            return 'en.reaperscans'
        case '':
            return 'vi.blogtruyen'
        case '':
            return 'multi.batoto'
        case '':
            return 'zh.dmzj'
        case '':
            return 'ru.yaoi-chan'
        case '':
            return 'ru.hentai-chan'
        case '':
            return 'ru.manga-chan'
        case '':
            return 'vi.truyentranh8'
        case '':
            return 'en.mangazuki'
        case '':
            return 'en.fallen-angels'
        case '':
            return 'pt-br.mangadoor'
        case '':
            return 'en.readcomicsonline'
        case '':
            return 'ko.mangazukiraws'
        case '':
            return 'tr.mangahanta'
        case '':
            return 'pt-br.gekkouhentai'
        case '':
            return 'id.komikid'
        case '':
            return 'pl.phoenix-scans'
        case '':
            return 'bg.utsukushii'
        case '':
            return 'ar.onma'
        case '':
            return 'pt-br.animaregia'
        case '':
            return 'en.manhwasmen'
        case '':
            return 'id.mangaid'
        case '':
            return 'en.hentaifox'
        case 'mangadex':
            return 'multi.mangadex'
        case '':
            return 'en.mangapill'
        case '':
            return 'en.readm'
        case '':
            return 'en.readcomicsfree'
        case '':
            return 'vi.truyentranhaudio'
        case '':
            return 'en.comiconlinefree'
        case '':
            return 'vi.nettruyen'
        case '':
            return 'vi.truyenqq'
        case '':
            return 'en.xoxocomics'
        case '':
            return 'en.readcomicsbook'
        case '':
            return 'multi.nhentai'
        case '':
            return 'en.dynastyscans'
        case '':
            return 'en.webtoon'
        case '':
            return 'en.nana'
        case '':
            return 'en.mangabat'
        case '':
            return 'en.manganato'
        case '':
            return 'multi.xkcd'
        case '':
            return 'multi.otakusan'
        case '':
            return 'multi.myrockmanga'
        case '':
            return 'zh.manhuagui'
        case 'mangalife':
        case 'mangasee':
            return 'en.nepnep'
        case '':
            return 'en.assortedscans'
        case '':
            return 'en.arcrelight'
        default:
            return '_unknown'
    }
}

function getStatus(status: string): number {
    switch (status.toLowerCase()) {
        case 'ongoing':
            return 1
        case 'completed':
            return 2
        case 'abandoned':
            return 4
        case 'haitus':
            return 4
        case 'unknown':
            return 0
        default:
            return 1
    }
}

function convertMangaId(mangaid: string, source: string): string {
    if (source == '') {

    }

    return ""
}
