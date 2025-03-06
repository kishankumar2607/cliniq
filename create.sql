CREATE DATABASE IF NOT EXISTS cliniq;

USE cliniq;

CREATE TABLE Admin (
    admin_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO Admin (email, password_hash) VALUES
('admin@mail.com', '123456');


CREATE TABLE Clinic (
    clinic_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO Clinic (name, address, phone, email) VALUES
('KW Clinic', '123 Main St, Fairway, Kitchener, ON', '416-123-4567', 'kwclinic@mail.com'),
('Waterloo Clinic', '456 Elm St, Waterloo, ON', '604-987-6543', 'waterlooclinic@mail.com');


CREATE TABLE Patient (
    patient_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(50) NOT NULL, -- Male, Female, Non-binary, Prefer not to say
    address TEXT NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    health_card_number VARCHAR(50), -- OHIP number or equivalent
    is_international_student BOOLEAN DEFAULT FALSE,
    student_id VARCHAR(50), -- Student ID for international students
    emergency_contact_name VARCHAR(255),
    emergency_contact_relationship VARCHAR(255),
    emergency_contact_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO Patient (
    first_name, last_name, date_of_birth, gender, address, phone_number, email, password_hash,
    health_card_number, is_international_student, student_id, emergency_contact_name,
    emergency_contact_relationship, emergency_contact_number
) VALUES
('John', 'Doe', '1990-05-15', 'Male', '123 Main St, Toronto, ON', '416-111-2222', 'john.doe@example.com', '******',
 '1234-567-890', FALSE, NULL, 'Jane Doe', 'Spouse', '416-999-8888'),

('Jane', 'Smith', '1985-10-20', 'Female', '456 Elm St, Vancouver, BC', '604-333-4444', 'jane.smith@example.com', '********',
 '9876-543-210', TRUE, 'S1234567', 'John Smith', 'Parent', '604-777-6666');



CREATE TABLE Visit (
    visit_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES Patient(patient_id) ON DELETE CASCADE,
    clinic_id INT REFERENCES Clinic(clinic_id) ON DELETE CASCADE,
    visit_date TIMESTAMP NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO Visit (patient_id, clinic_id, visit_date, notes) VALUES
(1, 1, '2023-10-01 10:00:00', 'Routine checkup'),
(2, 2, '2023-10-02 11:00:00', 'Follow-up appointment');