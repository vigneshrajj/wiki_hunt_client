import { SearchOutlined } from '@mui/icons-material';
import { Box, Grid, InputAdornment, Pagination, Stack, TextField } from '@mui/material';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import Article from './Article';
import { useGetSavedArticles, useSearchArticles } from '../api/api';

const itemsPerPage = 8;

function calculatePagination(page: number, itemsPerPage: number) {
  page = Math.max(1, page);
  itemsPerPage = Math.max(1, itemsPerPage);

  const offset = (page - 1) * itemsPerPage;
  const limit = itemsPerPage;

  return { limit, offset };
}

function calculateTotalPages(totalResults: number, itemsPerPage: number) {
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return Math.max(1, totalPages);
}

function Search() {
  const socket = useRef<WebSocket | null>(null);
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { searchArticles } = useSearchArticles();
  
  const { getSavedArticles } = useGetSavedArticles();
  
  useEffect(() => {
    getSavedArticles().then(res => setSavedArticles(res.data.saved_articles.map((a: any) => a.id)));
    socket.current = new WebSocket(import.meta.env.VITE_PUBLIC_WEBSOCKET_BASE_URL);
    socket.current.onopen = () => console.log('connected to ws');
    const socketCurrent = socket.current;

    socket.current.onmessage = (data: any) => {
      const res = JSON.parse(data.data);
      setArticles(res.articles);
      setTotalPages(calculateTotalPages(res.total_results, itemsPerPage));
    };

    return () => {
      socketCurrent.close();
    }
  }, [])

  function requestArticles(query: string, page = 1) {
    const { limit, offset } = calculatePagination(page, itemsPerPage);

    if (import.meta.env.PROD) {
      searchArticles(query, limit, offset).then((res) => {
        setArticles(res.data.articles);
        setTotalPages(calculateTotalPages(res.data.total_results, itemsPerPage));
      });

      return;
    }
    
    if (!socket.current) return;
    socket.current.send(JSON.stringify({
        'type': 'search',
        'query': query,
        'limit': limit,
        'offset': offset,
    }));
  }
  
  const debouncedRequest = useCallback(debounce(requestArticles, 500), []);

  return (
    <>
      <Box sx={{ mx: 2 }}>
      <TextField
        fullWidth
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
          debouncedRequest(e.target.value);
        }}
        placeholder='Search a Wikipedia article...'
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
      ></TextField>

      </Box>
      <Box>
        <Grid container>
          {articles.length ? articles.map((article: any) => (
            <Grid item xs={6} key={article.pageid}>
              <Article {...article} isSaved={savedArticles.includes(article.pageid)} />
            </Grid>
          )) : (
            <Stack py={2} alignItems={'center'} width={'100%'}>No results</Stack>
          )}
        </Grid>
      </Box>
      <Stack py={2} alignItems={'center'} width={'100%'}>
        <Pagination count={totalPages} page={page} onChange={(e, val) => {
          setPage(val);
          requestArticles(query, val);
        }} />
      </Stack>
    </>
  )
}

export default Search;
