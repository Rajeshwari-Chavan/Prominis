-- Seed data for Prominis demo

-- Insert demo users
INSERT INTO users (first_name, last_name, email, password, role, status, email_verified) VALUES
('John', 'Doe', 'requester@promin.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'REQUESTER', 'ACTIVE', TRUE),
('Jane', 'Smith', 'tasker@promin.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TASKER', 'ACTIVE', TRUE),
('Admin', 'User', 'admin@promin.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'ACTIVE', TRUE),
('Alice', 'Johnson', 'alice@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'REQUESTER', 'ACTIVE', TRUE),
('Bob', 'Wilson', 'bob@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TASKER', 'ACTIVE', TRUE),
('Carol', 'Brown', 'carol@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TASKER', 'ACTIVE', TRUE);

-- Insert demo jobs
INSERT INTO jobs (title, description, budget, deadline, location, status, requester_id) VALUES
('Website Redesign', 'I need a complete redesign of my company website. The current site is outdated and not mobile-friendly. Looking for a modern, responsive design with clean UI/UX.', 1500.00, DATE_ADD(NOW(), INTERVAL 14 DAY), 'Remote', 'OPEN', 1),
('Logo Design', 'Need a professional logo for my new startup. The company is in the tech industry. Looking for something modern and memorable.', 300.00, DATE_ADD(NOW(), INTERVAL 7 DAY), 'Remote', 'OPEN', 1),
('Content Writing', 'I need 10 blog posts written for my marketing blog. Each post should be 1000-1500 words on various business topics.', 800.00, DATE_ADD(NOW(), INTERVAL 21 DAY), 'Remote', 'OPEN', 4),
('Mobile App Development', 'Looking for a developer to create a simple mobile app for iOS and Android. The app should have user authentication and basic CRUD operations.', 5000.00, DATE_ADD(NOW(), INTERVAL 30 DAY), 'Remote', 'OPEN', 1),
('Social Media Management', 'Need someone to manage my social media accounts for the next 3 months. Should include content creation, posting, and engagement.', 1200.00, DATE_ADD(NOW(), INTERVAL 90 DAY), 'Remote', 'OPEN', 4),
('Data Analysis', 'I have a dataset that needs analysis and visualization. Looking for someone with experience in Python, pandas, and matplotlib.', 600.00, DATE_ADD(NOW(), INTERVAL 10 DAY), 'Remote', 'IN_PROGRESS', 1),
('Video Editing', 'Need a video editor to create promotional videos for my business. I have raw footage that needs to be edited and polished.', 400.00, DATE_ADD(NOW(), INTERVAL 5 DAY), 'Remote', 'COMPLETED', 4);

-- Insert job skills
INSERT INTO job_skills (job_id, skill) VALUES
(1, 'Web Development'),
(1, 'UI/UX Design'),
(1, 'Responsive Design'),
(2, 'Graphic Design'),
(2, 'Logo Design'),
(2, 'Branding'),
(3, 'Content Writing'),
(3, 'Blog Writing'),
(3, 'SEO'),
(4, 'Mobile Development'),
(4, 'iOS Development'),
(4, 'Android Development'),
(5, 'Social Media Marketing'),
(5, 'Content Creation'),
(6, 'Data Analysis'),
(6, 'Python'),
(6, 'Data Visualization'),
(7, 'Video Editing'),
(7, 'Adobe Premiere'),
(7, 'Motion Graphics');

-- Insert demo applications
INSERT INTO applications (proposal, proposed_amount, proposed_deadline, status, job_id, tasker_id) VALUES
('I have 5+ years of experience in web design and development. I can create a modern, responsive website that will help your business stand out. I will deliver the project within 10 days.', 1200.00, DATE_ADD(NOW(), INTERVAL 10 DAY), 'PENDING', 1, 2),
('I am a professional graphic designer with expertise in logo design and branding. I can create a unique logo that represents your tech startup perfectly.', 250.00, DATE_ADD(NOW(), INTERVAL 5 DAY), 'PENDING', 2, 5),
('I am a content writer with experience in business and marketing topics. I can write engaging blog posts that will help drive traffic to your website.', 700.00, DATE_ADD(NOW(), INTERVAL 18 DAY), 'PENDING', 3, 6),
('I have extensive experience in mobile app development for both iOS and Android. I can deliver a high-quality app within your timeline.', 4500.00, DATE_ADD(NOW(), INTERVAL 25 DAY), 'PENDING', 4, 2),
('I am a social media expert with proven results in growing business accounts. I can help increase your online presence and engagement.', 1000.00, DATE_ADD(NOW(), INTERVAL 85 DAY), 'PENDING', 5, 6),
('I am a data scientist with expertise in Python and data visualization. I can provide detailed analysis and create compelling visualizations.', 550.00, DATE_ADD(NOW(), INTERVAL 8 DAY), 'ACCEPTED', 6, 5);

-- Insert demo reviews
INSERT INTO reviews (rating, comment, job_id, reviewer_id, reviewee_id) VALUES
(5, 'Excellent work! The video was edited perfectly and delivered on time. Highly recommended.', 7, 4, 6),
(4, 'Good quality work, but communication could have been better. Overall satisfied with the result.', 7, 4, 2),
(5, 'Outstanding data analysis and visualization. The insights provided were very valuable for our business.', 6, 1, 5);

-- Insert demo audit logs
INSERT INTO audit_logs (action, details, user_id, ip_address) VALUES
('LOGIN', 'User logged in successfully', 1, '192.168.1.100'),
('CREATE_JOB', 'Created new job: Website Redesign', 1, '192.168.1.100'),
('LOGIN', 'User logged in successfully', 2, '192.168.1.101'),
('APPLY_JOB', 'Applied for job: Website Redesign', 2, '192.168.1.101'),
('LOGIN', 'User logged in successfully', 3, '192.168.1.102'),
('VIEW_ANALYTICS', 'Viewed platform analytics', 3, '192.168.1.102');

-- Insert demo payment transactions
INSERT INTO payment_transactions (transaction_id, amount, status, type, job_id, payer_id, payee_id) VALUES
('TXN_001', 400.00, 'COMPLETED', 'JOB_PAYMENT', 7, 4, 6),
('TXN_002', 40.00, 'COMPLETED', 'COMMISSION', 7, 4, NULL),
('TXN_003', 600.00, 'COMPLETED', 'JOB_PAYMENT', 6, 1, 5),
('TXN_004', 60.00, 'COMPLETED', 'COMMISSION', 6, 1, NULL);
