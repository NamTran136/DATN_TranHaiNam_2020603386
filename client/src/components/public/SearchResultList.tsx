import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { searchStart } from '../../store/features/searchSlice';


const SearchResultList = () => {
  const {results} = useAppSelector((state) => state.search);
   const dispatch = useAppDispatch();
  return (
    <div style={{display: results.length > 0 ? 'block' : 'none'}} className="results-list">
      {results.map((result) => {
        return (
          <div className="" key={result.id} onClick={() => dispatch(searchStart())}>
            <Link to={`/book/${result.id}`}>{result.title}</Link>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResultList