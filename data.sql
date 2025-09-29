USE usof;

-- Clear existing data (in correct order to respect foreign key constraints)
DELETE FROM refresh_tokens;
DELETE FROM notification;
DELETE FROM subscription;
DELETE FROM favorite;
DELETE FROM likes;
DELETE FROM comments;
DELETE FROM post_categories;
DELETE FROM posts;
DELETE FROM categories;
DELETE FROM users;

-- Reset auto-increment counters
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;
ALTER TABLE posts AUTO_INCREMENT = 1;
ALTER TABLE comments AUTO_INCREMENT = 1;
ALTER TABLE likes AUTO_INCREMENT = 1;
ALTER TABLE refresh_tokens AUTO_INCREMENT = 1;

-- Insert 5 users (1 admin, 4 regular users)
INSERT INTO users (login, password, full_name, email, avatar, rating, role, email_confirmed) VALUES
('admin_user', '$2b$10$z6iw6TbAqoxKzEqPqrOflulcNa.uCPniLtMSMkS1fy2nMlBXN34fm', 'Administrator User', 'admin@usof.com', 'admin_avatar.png', 100, 'admin', TRUE),
('john_doe', '$2b$10$z6iw6TbAqoxKzEqPqrOflulcNa.uCPniLtMSMkS1fy2nMlBXN34fm', 'John Doe', 'john.doe@example.com', 'john_avatar.png', 85, 'user', TRUE),
('jane_smith', '$2b$10$z6iw6TbAqoxKzEqPqrOflulcNa.uCPniLtMSMkS1fy2nMlBXN34fm', 'Jane Smith', 'jane.smith@example.com', 'jane_avatar.png', 92, 'user', TRUE),
('mike_wilson', '$2b$10$z6iw6TbAqoxKzEqPqrOflulcNa.uCPniLtMSMkS1fy2nMlBXN34fm', 'Mike Wilson', 'mike.wilson@example.com', 'mike_avatar.png', 78, 'user', TRUE),
('sarah_johnson', '$$2b$10$z6iw6TbAqoxKzEqPqrOflulcNa.uCPniLtMSMkS1fy2nMlBXN34fm', 'Sarah Johnson', 'sarah.johnson@example.com', 'sarah_avatar.png', 67, 'user', FALSE);

-- Insert 5 categories
INSERT INTO categories (title, description) VALUES
('Technology', 'Discussions about latest technology trends, gadgets, and innovations'),
('Programming', 'Code-related discussions, tutorials, and programming help'),
('Web Development', 'Frontend, backend, and full-stack web development topics'),
('Mobile Apps', 'Mobile application development for iOS and Android platforms'),
('Data Science', 'Machine learning, AI, data analysis, and big data discussions');

-- Insert 5 posts
INSERT INTO posts (author_id, title, content, status, ban_status) VALUES
(2, 'Getting Started with React Hooks', 'React Hooks have revolutionized the way we write React components. In this post, I will explain the basics of useState and useEffect hooks and how they can simplify your code.', 'active', FALSE),
(3, 'Best Practices for Node.js Development', 'Node.js is a powerful runtime for JavaScript on the server side. Here are some best practices I have learned over the years that can help you write better Node.js applications.', 'active', FALSE),
(4, 'Introduction to Machine Learning', 'Machine learning is becoming increasingly important in today technology landscape. This post covers the fundamental concepts and algorithms that every developer should know.', 'active', FALSE),
(5, 'Building Mobile Apps with React Native', 'React Native allows you to build mobile applications using React. Learn how to set up your development environment and create your first cross-platform mobile app.', 'active', FALSE),
(1, 'Platform Announcement: New Features Coming Soon', 'We are excited to announce several new features that will be rolling out over the next few months. Stay tuned for updates on enhanced user experience and new tools.', 'active', FALSE);

-- Insert post_categories (linking posts to categories)
INSERT INTO post_categories (post_id, category_id) VALUES
(1, 2), -- React Hooks -> Programming
(1, 3), -- React Hooks -> Web Development
(2, 2), -- Node.js -> Programming
(2, 3), -- Node.js -> Web Development
(3, 5), -- ML -> Data Science
(3, 1), -- ML -> Technology
(4, 4), -- React Native -> Mobile Apps
(4, 2), -- React Native -> Programming
(5, 1); -- Announcement -> Technology

-- Insert 5 comments
INSERT INTO comments (author_id, post_id, content) VALUES
(3, 1, 'Great explanation of React Hooks! The useState example really helped me understand the concept better.'),
(4, 1, 'I have been struggling with useEffect cleanup. Could you write a follow-up post about that?'),
(2, 2, 'These Node.js best practices are spot on. I especially agree with the point about error handling.'),
(5, 3, 'As someone new to machine learning, this introduction was very helpful. Looking forward to more content!'),
(1, 4, 'Excellent tutorial on React Native. We are considering featuring this in our official documentation.');

-- Insert 5 likes on posts
INSERT INTO likes (author_id, post_id, type) VALUES
(1, 1, 'like'),    -- Admin likes React Hooks post
(3, 2, 'like'),    -- Jane likes Node.js post
(4, 3, 'like'),    -- Mike likes ML post
(5, 4, 'like'),    -- Sarah likes React Native post
(2, 5, 'like');    -- John likes announcement post

-- Insert 5 likes on comments
INSERT INTO likes (author_id, comment_id, type) VALUES
(1, 1, 'like'),    -- Admin likes Jane comment
(2, 2, 'like'),    -- John likes Mike comment
(5, 3, 'like'),    -- Sarah likes John comment
(3, 4, 'like'),    -- Jane likes Sarah comment
(4, 5, 'like');    -- Mike likes Admin comment

-- Insert 5 favorites
INSERT INTO favorite (user_id, post_id) VALUES
(2, 3),    -- John favorites ML post
(3, 1),    -- Jane favorites React Hooks post
(4, 2),    -- Mike favorites Node.js post
(5, 4),    -- Sarah favorites React Native post
(1, 2);    -- Admin favorites Node.js post

-- Insert 5 subscriptions
INSERT INTO subscription (user_id, post_id) VALUES
(2, 1),    -- John subscribes to React Hooks post
(3, 2),    -- Jane subscribes to Node.js post
(4, 3),    -- Mike subscribes to ML post
(5, 4),    -- Sarah subscribes to React Native post
(1, 1);    -- Admin subscribes to React Hooks post

-- Insert 5 notifications
INSERT INTO notification (user_id, post_id) VALUES
(2, 1),    -- John has notification for React Hooks post
(3, 2),    -- Jane has notification for Node.js post
(4, 3),    -- Mike has notification for ML post
(5, 4),    -- Sarah has notification for React Native post
(1, 5);    -- Admin has notification for announcement post
