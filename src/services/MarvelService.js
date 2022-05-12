import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=44338feddb6196554b6dc439e066b3ff';
    const _baseOffset = 0;

    
    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=3&offset=${offset}&${_apiKey}`);
        return {
            newCharsList: res.data.results.map(_transformCharacter),
            totalChar: res.data.total
        };
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?nameStartsWith=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return {
            newComicsList: res.data.results.map(_transformComics),
            totalComics: res.data.total
        };
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (char) => {

        return {
            id: char.id,
            name: char.name,
            description: char.description ? char.description : 'Описание отсутствует...',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items 
        }
    }

    const _transformComics = (comics) => {

        return {
            id: comics.id,
            pageCount: comics.pageCount ? `${comics.pageCount} р.` : 'No information the number of page',
            description: comics.description ? comics.description : 'Описание отсутствует...',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            title: comics.title ? comics.title : null,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices[0].price > 0 ? comics.prices[0].price + '$' : 'Not available' 
        }
    }

    return {loading, error, getAllCharacters, getCharacter, getCharacterByName, getAllComics, getComic, clearError}
}

export default useMarvelService;