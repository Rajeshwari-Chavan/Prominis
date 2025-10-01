-- Create database schema for Prominis

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    bio TEXT,
    avatar VARCHAR(255),
    role ENUM('REQUESTER', 'TASKER', 'ADMIN') NOT NULL,
    status ENUM('ACTIVE', 'SUSPENDED', 'PENDING', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    deadline TIMESTAMP NOT NULL,
    location VARCHAR(100),
    status ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    requester_id BIGINT NOT NULL,
    assigned_tasker_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_tasker_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Job skills table
CREATE TABLE job_skills (
    job_id BIGINT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (job_id, skill),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    proposal TEXT NOT NULL,
    proposed_amount DECIMAL(10,2) NOT NULL,
    proposed_deadline TIMESTAMP NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') NOT NULL DEFAULT 'PENDING',
    job_id BIGINT NOT NULL,
    tasker_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (tasker_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    job_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    reviewee_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- File resources table
CREATE TABLE file_resources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    job_id BIGINT NULL,
    user_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit logs table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    resource_id BIGINT NULL,
    resource_type VARCHAR(50) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    user_id BIGINT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Payment transactions table
CREATE TABLE payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    type ENUM('JOB_PAYMENT', 'COMMISSION', 'REFUND', 'WITHDRAWAL') NOT NULL,
    job_id BIGINT NULL,
    payer_id BIGINT NOT NULL,
    payee_id BIGINT NULL,
    payment_method VARCHAR(50) NULL,
    external_transaction_id VARCHAR(100) NULL,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (payee_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_jobs_requester ON jobs(requester_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_deadline ON jobs(deadline);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_tasker ON applications(tasker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_payment_transactions_payer ON payment_transactions(payer_id);
CREATE INDEX idx_payment_transactions_payee ON payment_transactions(payee_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
