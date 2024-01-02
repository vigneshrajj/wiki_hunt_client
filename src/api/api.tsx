import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Article } from "../types/types";
import axios from "axios";

// Queries
const GET_USER = gql`
query GetUser {
    whoami {
        id
    }
}`;


const SIGN_IN = gql`
mutation SignIn($username: String!, $password: String!) {
    tokenAuth(password: $password, username: $username) {
      refreshToken
      token
    }
}
`;
const SIGN_UP = gql`
mutation SignUp($email: String!, $password: String!, $username: String!) {
  createUser(email: $email, password: $password, username: $username) {
    refreshToken
    token
  }
}
`;

const REFRESH_TOKEN = gql`
mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      refreshExpiresIn
      refreshToken
      token
    }
  }
`;

const SAVE_ARTICLE = gql`
mutation SaveArticle($pageid: Int!, $snippet: String!, $title: String!, $fullurl: String!) {
    insert_saved_articles_one(object: {snippet: $snippet, title: $title, url: $fullurl, id: $pageid}) {
      id
    }
}
`;

const GET_SAVED_ARTICLES = gql`
query GetSavedArticles {
    saved_articles {
      article_tags {
        tag
      }
      id
      snippet
      url
      title
    }
  }
`;

const GET_SAVED_ARTICLES_BY_TAGS = gql`
query GetSavedArticles($tags: [String!]) {
    saved_articles(where: {article_tags: {tag: {_in: $tags}}}) {
      article_tags {
        tag
      }
      id
      snippet
      url
      title
    }
}
`;

const GET_TAGS = gql`
query GetTags {
    tag {
      name
    }
}
`;

const ADD_TAG = gql`
mutation AddTag($tag: String!, $articleId: Int!) {
  insert_article_tag_one(object: {article_id: $articleId, tags: {data: {name: $tag}, on_conflict: {constraint: tag_pkey, update_columns: name}}}) {
    id
  }
}
`;

const REMOVE_TAG = gql`
mutation RemoveTag($articleId: Int!, $tag: String!) {
  delete_article_tag(where: {tag: {_eq: $tag}, _and: {article_id: {_eq: $articleId}}}) {
    affected_rows
  }
}
`;

// APIs
export function useUser() {
    const [queryFn, { error }] = useLazyQuery(GET_USER);

    const getUser = async () => {
        const res = await queryFn({ fetchPolicy: 'network-only' });
        if (error || res.error) return null;
        return res.data;
    }

    return {getUser};
}

export function useSignin() {
    const [mutateFn, { error }] = useMutation(SIGN_IN);

    const signin = async (username: string, password: string) => {
        const res = await mutateFn({
            variables: {username, password},
        });
        if (error || res.errors) return res.errors;
        localStorage.setItem('refreshToken', res.data.tokenAuth.refreshToken);
        localStorage.setItem('token', res.data.tokenAuth.token);
        return res;
    }
    return {signin};
}

export function useSignup() {
    const [mutateFn, { error }] = useMutation(SIGN_UP);

    const signup = async (username: string, email: string, password: string) => {
        const res = await mutateFn({
            variables: {username, password, email},
        });
        if (error || res.errors) return res.errors;
        localStorage.setItem('refreshToken', res.data.createUser.refreshToken);
        localStorage.setItem('token', res.data.createUser.token);
        return res.data;
    }
    return { signup };
}

export function useRefreshToken() {
    const [mutateFn, { error }] = useMutation(REFRESH_TOKEN);

    const refreshToken = async (token: string) => {
        const res = await mutateFn({
            variables: { refreshToken: token },
        });

        if (error || res.errors) return res.errors;
        localStorage.setItem('refreshToken', res.data.refreshToken.refreshToken);
        localStorage.setItem('token', res.data.refreshToken.token);
        return res.data;
    }

    return { refreshToken };
}

export function useLogout() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.setItem('refreshToken', '');
        localStorage.setItem('token', '');
        setTimeout(() => navigate('/auth/signin'), 0);
    }

    return { logout };
}

export function useSaveArticle() {
    const [mutateFn] = useMutation(SAVE_ARTICLE);

    const saveArticle = async (article: Article) => {
        const res = await mutateFn({
            variables: {...article},
        });
        return res;
    }

    return { saveArticle };
}

export function useGetSavedArticles() {
    const [queryFn] = useLazyQuery(GET_SAVED_ARTICLES, { fetchPolicy: 'network-only'});
    const [queryFn2] = useLazyQuery(GET_SAVED_ARTICLES_BY_TAGS, { fetchPolicy: 'network-only'});

    const getSavedArticles = async (tags?: string[]) => {
        let res;
        
        if (!tags || !tags.length) res = await queryFn();
        else res = await queryFn2({
            variables: { tags }
        });

        return res;
    }

    return {getSavedArticles};
}

export function useGetTags() {
    const [queryFn, { data }] = useLazyQuery(GET_TAGS, {
        pollInterval: 500,
    });

    const getTags = async () => {
        const res = await queryFn();
        return res;
    }

    return {getTags, tagsData: data };
}

export function useAddTag() {
    const [mutateFn] = useMutation(ADD_TAG);

    const addTag = async (tag: string, articleId: number) => {
        const res = await mutateFn({
            variables: {tag, articleId},
        });
        return res;
    }

    return { addTag };
}

export function useRemoveTag() {
    const [mutateFn] = useMutation(REMOVE_TAG);

    const removeTag = async (tag: string, articleId: number) => {
        const res = await mutateFn({
            variables: {tag, articleId},
        });
        return res;
    }

    return { removeTag };
}

export function useSearchArticles() {
    const searchArticles = async (query: string, limit: number, offset: number) => {
        const res = await axios.post(import.meta.env.VITE_PUBLIC_HTTP_API_BASE_URL + '/api/search-article', {
            query,
            limit,
            offset,
        })
        return res;
    }
    return { searchArticles };
}