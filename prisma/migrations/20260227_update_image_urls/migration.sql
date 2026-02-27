-- Update image URLs from images.tyler-grant.com to cdn.tyler-grant.com
UPDATE "ProjectImage"
SET url = REPLACE(url, 'images.tyler-grant.com', 'cdn.tyler-grant.com')
WHERE url LIKE '%images.tyler-grant.com%';

UPDATE "Receipt"
SET "imageUrl" = REPLACE("imageUrl", 'images.tyler-grant.com', 'cdn.tyler-grant.com')
WHERE "imageUrl" LIKE '%images.tyler-grant.com%';

UPDATE "User"
SET "profileImage" = REPLACE("profileImage", 'images.tyler-grant.com', 'cdn.tyler-grant.com')
WHERE "profileImage" LIKE '%images.tyler-grant.com%';
