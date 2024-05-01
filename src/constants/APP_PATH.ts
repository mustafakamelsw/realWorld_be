export const IMAGES_PATH = '/src/images';

export const USERS_URLs = {
  MAIN_PATH: '/api/users',
  LOGIN: '/login',
  REGISTER: '/',
  UPDATE: '/',
};

export const CURRENT_USER = {
  MAIN_PATH: '/api/user',
  UPDATE: '/',
  GET_CURRENT: '/',
};

export const PROFILE_URLS = {
  MAIN_PATH: '/api/profiles',
  GET_PROFILE: '/:username',
  FOLLOW_USER: '/:username/follow',
  UNFOLLOW_USER: '/:username/follow',
};

export const ARTICLE_URLS = {
  MAIN_PATH: '/api/articles',
  GET_ARTICLE: '/:slug',
  CREATE_ARTICLE: '/',
  UPDATE_ARTICLE: '/:slug',
  GET_ARTICLES: '',
  // DELETE_ARTICLE: '/:slug',
  // FAVORITE_ARTICLE: '/:slug/favorite',
  // UNFAVORITE_ARTICLE: '/:slug/favorite',
  // GET_FEED: '/feed',
  // GET_TAGS: '/tags',
  // GET_TAG: '/tags/:tag',
  // GET_SEARCH: '/search',
  // GET_COMMENTS: '/:slug/comments',
  // CREATE_COMMENT: '/:slug/comments',
  // UPDATE_COMMENT: '/:slug/comments/:commentId',
  // DELETE_COMMENT: '/:slug/comments/:commentId',
  // GET_AUTHOR: '/:username/articles',
  // GET_AUTHOR_FEED: '/:username/feed',
};

export const TAG_URLS = {
  MAIN_PATH: '/api/tags',
  GET_TAGS: '/',
  CREATE_TAG: '/create',
};
