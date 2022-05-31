import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess}= useMarvelService();

    const updateChar = () => {
        const {charId} = props;
        if(!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    useEffect(() => {
            updateChar();
    }, [props.charId]);

    

    return (
            <div className="char__info">
                {setContent(process, View, char)}
            </div>
    )
}

const View = ({data}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = data;

    let classObjecFit = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? 'obj-fit-char-list-item' : null;
    
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} className={classObjecFit}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.length > 0 ? null : 'Комиксы отсутствуют'
                }
                {
                    comics.map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}


export default CharInfo;