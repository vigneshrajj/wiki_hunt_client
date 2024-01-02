import { Autocomplete, Box, Grid, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Article from './Article';
import { useGetSavedArticles, useGetTags } from '../api/api';
import { SavedArticle } from '../types/types';

const Saved = () => {
    const [articles, setArticles] = useState<SavedArticle[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { getSavedArticles } = useGetSavedArticles();
    const { getTags, tagsData } = useGetTags();

    useEffect(() => {
        getTags();
    }, [])

    useEffect(() => {
        setTags(tagsData.tag.map((tag: any) => tag.name));
    }, [tagsData])

    useEffect(() => {
        getSavedArticles(selectedTags).then((res: any) => {
            setArticles(res.data.saved_articles.map((article: any) => {
                return {...article, tags: article.article_tags.map((tag: any) => tag.tag)};
            }));
        });
    }, [selectedTags])

  return (
    <>
        <Autocomplete
            multiple
            options={tags}
            onChange={(_e, val) => setSelectedTags(val)}
            filterSelectedOptions
            sx={{ mx: 2 }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Filter by tags"
                />
            )}
        />
        <Box>
            <Grid container>
                {articles.length ? articles.map((article) => (
                    <Grid item key={article.id} xs={6}>
                        <Article {...{
                            pageid: article.id, 
                            title: article.title, 
                            snippet: article.snippet, 
                            fullurl: article.url, 
                            tags: article.tags, 
                            isStored: true,
                            allTags: tags,
                        }} />
                    </Grid>
                )) : (
                    <Stack py={2} alignItems={'center'} width={'100%'}>No results</Stack>
                  )}
            </Grid>
        </Box>
    </>
  )
}

export default Saved