export interface Article {
    pageid: number;
    snippet: string;
    title: string;
    fullurl: string;
    tags?: string[];
}

export interface SavedArticle {
    id: number;
    snippet: string;
    title: string;
    url: string;
    tags?: string[];
}

export type ArticleProps = Article & {
    isSaved?: boolean;
    isStored?: boolean;
    allTags?: string[];
} 