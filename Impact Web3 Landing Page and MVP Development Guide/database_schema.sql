-- Database Schema for Impact Web3 Measurement System

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'proposer', 'evaluator', 'community')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    funding_round VARCHAR(50),
    status VARCHAR(20) NOT NULL CHECK (status IN ('proposed', 'funded', 'in_progress', 'completed', 'cancelled')),
    funding_amount DECIMAL(15, 2),
    start_date DATE,
    end_date DATE,
    blockchain_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Impact Categories Table
CREATE TABLE impact_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    parent_category_id INTEGER REFERENCES impact_categories(category_id),
    category_type VARCHAR(20) NOT NULL CHECK (category_type IN ('social', 'environmental', 'economic', 'governance'))
);

-- Metrics Table
CREATE TABLE metrics (
    metric_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES impact_categories(category_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    data_type VARCHAR(20) NOT NULL CHECK (data_type IN ('numeric', 'percentage', 'boolean', 'text')),
    is_required BOOLEAN DEFAULT FALSE
);

-- Application Form Responses Table
CREATE TABLE application_responses (
    response_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id),
    submitted_by INTEGER REFERENCES users(user_id),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved', 'rejected'))
);

-- Application Metric Values Table
CREATE TABLE application_metric_values (
    value_id SERIAL PRIMARY KEY,
    response_id INTEGER REFERENCES application_responses(response_id),
    metric_id INTEGER REFERENCES metrics(metric_id),
    numeric_value DECIMAL(15, 2),
    percentage_value DECIMAL(5, 2),
    boolean_value BOOLEAN,
    text_value TEXT,
    target_value DECIMAL(15, 2),
    notes TEXT
);

-- Reporting Form Responses Table
CREATE TABLE reporting_responses (
    response_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id),
    submitted_by INTEGER REFERENCES users(user_id),
    reporting_period_start DATE,
    reporting_period_end DATE,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved', 'rejected'))
);

-- Reporting Metric Values Table
CREATE TABLE reporting_metric_values (
    value_id SERIAL PRIMARY KEY,
    response_id INTEGER REFERENCES reporting_responses(response_id),
    metric_id INTEGER REFERENCES metrics(metric_id),
    numeric_value DECIMAL(15, 2),
    percentage_value DECIMAL(5, 2),
    boolean_value BOOLEAN,
    text_value TEXT,
    target_value DECIMAL(15, 2),
    actual_value DECIMAL(15, 2),
    variance DECIMAL(15, 2),
    notes TEXT
);

-- Blockchain Verification Table
CREATE TABLE blockchain_verifications (
    verification_id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(project_id),
    response_id INTEGER,
    response_type VARCHAR(20) NOT NULL CHECK (response_type IN ('application', 'reporting')),
    blockchain_type VARCHAR(20) NOT NULL CHECK (blockchain_type IN ('cardano', 'midnight', 'evm')),
    transaction_hash VARCHAR(255),
    verification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification_status VARCHAR(20) NOT NULL CHECK (verification_status IN ('pending', 'verified', 'failed')),
    verification_data JSONB
);

-- Comments and Feedback Table
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    project_id INTEGER REFERENCES projects(project_id),
    response_id INTEGER,
    response_type VARCHAR(20) CHECK (response_type IN ('application', 'reporting')),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard Settings Table
CREATE TABLE dashboard_settings (
    setting_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    dashboard_type VARCHAR(20) NOT NULL CHECK (dashboard_type IN ('admin', 'proposer', 'evaluator', 'public')),
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log Table
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    action_details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data: Impact Categories
INSERT INTO impact_categories (name, description, category_type) VALUES
('Community Development', 'Impact on community growth and development', 'social'),
('Job Creation', 'Creation of employment opportunities', 'social'),
('Social Inclusion', 'Inclusion of marginalized or underrepresented groups', 'social'),
('Education/Awareness', 'Educational initiatives and awareness campaigns', 'social'),
('Carbon Footprint', 'Impact on carbon emissions and climate change', 'environmental'),
('Resource Efficiency', 'Efficient use of natural resources', 'environmental'),
('Biodiversity', 'Impact on biodiversity and ecosystems', 'environmental'),
('Waste Management', 'Management and reduction of waste', 'environmental'),
('Economic Growth', 'Contribution to economic growth and development', 'economic'),
('Income Generation', 'Creation of income opportunities', 'economic'),
('Poverty Alleviation', 'Reduction of poverty and economic hardship', 'economic'),
('Financial Inclusion', 'Inclusion in financial systems and services', 'economic'),
('Transparency', 'Promotion of transparency in processes and decisions', 'governance'),
('Accountability', 'Establishment of accountability mechanisms', 'governance'),
('Stakeholder Engagement', 'Engagement with relevant stakeholders', 'governance'),
('Compliance', 'Compliance with regulations and standards', 'governance');

-- Initial Data: Metrics
INSERT INTO metrics (category_id, name, description, unit, data_type, is_required) VALUES
(1, 'Number of community members engaged', 'Total number of community members actively engaged in the project', 'people', 'numeric', true),
(2, 'Direct jobs created', 'Number of direct jobs created by the project', 'jobs', 'numeric', true),
(2, 'Indirect jobs created', 'Number of indirect jobs created by the project', 'jobs', 'numeric', false),
(3, 'Percentage of underrepresented groups included', 'Percentage of participants from underrepresented groups', '%', 'percentage', true),
(4, 'Number of educational events conducted', 'Number of educational events or workshops conducted', 'events', 'numeric', true),
(4, 'Number of participants in educational programs', 'Total number of participants in educational programs', 'people', 'numeric', true),
(5, 'Carbon footprint reduction', 'Reduction in carbon footprint achieved', 'tons CO2', 'numeric', true),
(5, 'Percentage of renewable energy used', 'Percentage of energy from renewable sources', '%', 'percentage', true),
(6, 'Resource usage efficiency improvement', 'Improvement in resource usage efficiency', '%', 'percentage', true),
(7, 'Biodiversity impact assessment', 'Assessment of impact on biodiversity', 'text', 'text', false),
(8, 'Waste reduction achieved', 'Amount of waste reduction achieved', 'tons', 'numeric', true),
(9, 'Economic value generated', 'Total economic value generated by the project', 'USD', 'numeric', true),
(10, 'Average income increase for participants', 'Average increase in income for project participants', '%', 'percentage', true),
(11, 'Number of people lifted out of poverty', 'Number of people whose economic situation improved above poverty line', 'people', 'numeric', false),
(12, 'Number of new wallet addresses created', 'Number of new blockchain wallet addresses created in underserved regions', 'wallets', 'numeric', true),
(12, 'Transaction volume in underserved regions', 'Volume of transactions in underserved regions', 'USD', 'numeric', false),
(13, 'Transparency score', 'Score measuring the transparency of the project', 'score', 'numeric', true),
(14, 'Accountability mechanisms implemented', 'Number of accountability mechanisms implemented', 'count', 'numeric', true),
(15, 'Number of stakeholders engaged', 'Number of stakeholders actively engaged in the project', 'stakeholders', 'numeric', true),
(16, 'Compliance with standards', 'Level of compliance with relevant standards and regulations', '%', 'percentage', true);
