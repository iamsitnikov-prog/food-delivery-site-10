CREATE TABLE IF NOT EXISTS post_reactions (
    slug VARCHAR(160) PRIMARY KEY,
    likes INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_likes ON post_reactions(likes DESC);