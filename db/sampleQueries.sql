\c nc_news_test

SELECT articles.* ,COUNT (comments.article_id) ::INT AS comment_count
FROM articles 
LEFT JOIN comments ON comments.article_id = articles.article_id
WHERE articles.article_id = comments.article_id
GROUP BY articles.article_id
ORDER BY created_at DESC;