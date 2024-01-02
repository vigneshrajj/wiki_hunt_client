import { BookmarkAddOutlined, BookmarkAddedOutlined, OpenInNewRounded } from "@mui/icons-material";
import { Autocomplete, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAddTag, useRemoveTag, useSaveArticle } from "../api/api";
import { Article } from "../types/types";

type ArticleProps = Article & {
    isSaved?: boolean;
    isStored?: boolean;
    allTags?: string[];
} 

function Article({ pageid, title, fullurl, snippet, isSaved, isStored, tags, allTags }: ArticleProps) {
    const [saveStatus, setSaveStatus] = useState(false); 
    const [selectedTags, setSelectedTags] = useState<string[]>(tags || []);

    const { saveArticle } = useSaveArticle();
    const { addTag } = useAddTag();
    const { removeTag } = useRemoveTag();

    const handleSave = async () => {
        const res = await saveArticle({ title, fullurl, snippet, pageid });
        if (res.errors) return;
        setSaveStatus(true);
    }

    const handleTagUpdate = (_event: React.SyntheticEvent, value: string[], reason: string) => {
        switch(reason) {
            case 'createOption':
            case 'selectOption':
                const selectedTag = value.filter(tag => selectedTags.indexOf(tag) == -1)[0];
                addTag(selectedTag, pageid);
                break;
            case 'removeOption':
                const removedTag = selectedTags.filter(tag => value.indexOf(tag) == -1)[0];
                removeTag(removedTag, pageid);
        }

        setSelectedTags(value);
    }

    return (
        <Box sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 2, boxShadow: 1, m: 2, p: 2 }}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography component={'h5'}>
                    <Box sx={{ fontWeight: 'bold', fontSize: 'h5.fontSize' }}>{title}</Box>
                </Typography>
                <a target="_blank" href={fullurl}>
                    <OpenInNewRounded sx={{ color: 'black' }} />
                </a>
            </Stack>
            <div style={{ padding: '1rem 0' }} dangerouslySetInnerHTML={{ __html: snippet || '' }}></div>
            {isStored && (
                <Autocomplete
                    multiple
                    size="small"
                    options={allTags || []}
                    value={selectedTags}
                    onChange={handleTagUpdate}
                    filterSelectedOptions
                    freeSolo
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Add tags"
                        />
                    )}
                />
            )}
            {!isStored && (<Stack direction={'row'} justifyContent={'end'} alignItems={'start'}>
                {(!saveStatus && !isSaved) ? (<Button onClick={handleSave} variant="outlined" endIcon={<BookmarkAddOutlined />}>Save</Button>)
                : (<Button variant="outlined" color="success" endIcon={<BookmarkAddedOutlined />}>Saved</Button>)}
            </Stack>)}
        </Box>
    );
}

export default Article;