//
//  RegisterView.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//


import SwiftUI

struct RegisterView: View {
    @Binding var isRegistered: Bool // Binding to control navigation back to LoginView
    @State private var firstName: String = "Bibin"
    @State private var lastName: String = "Tom"
    @State private var dateOfBirth: String = "1990-01-01"
    @State private var gender: String = "Male"
    @State private var address: String = "123 Main St"
    @State private var phoneNumber: String = "123-456-7890"
    @State private var email: String = "bibintomj@gmail.com"
    @State private var password: String = "123456"
    @State private var healthCardNumber: String = "HC123456789"
    @State private var isInternationalStudent: Bool = false
    @State private var studentID: String = "S1234567"
    @State private var emergencyContactName: String = "Jane Doe"
    @State private var emergencyContactNumber: String = "987-654-3210"
    @State private var emergencyContactRelationship: String = "Spouse"
    
    @State private var isLoading: Bool = false
    @State private var showAlert: Bool = false
    @State private var alertMessage: String = ""
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // First Name
                Text("First Name".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your first name", text: $firstName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Last Name
                Text("Last Name".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your last name", text: $lastName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Date of Birth
                Text("Date of Birth (YYYY-MM-DD)".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your date of birth", text: $dateOfBirth)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Gender
                Text("Gender".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your gender", text: $gender)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Address
                Text("Address".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your address", text: $address)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Phone Number
                Text("Phone Number".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your phone number", text: $phoneNumber)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Email
                Text("Email".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Password
                Text("Password".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                SecureField("Enter your password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Health Card Number
                Text("Health Card Number".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your health card number", text: $healthCardNumber)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // International Student
                Toggle("International Student", isOn: $isInternationalStudent)
                    .toggleStyle(SwitchToggleStyle(tint: .accentColor))
                
                // Student ID
                Text("Student ID".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter your student ID", text: $studentID)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Emergency Contact Name
                Text("Emergency Contact Name".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter emergency contact name", text: $emergencyContactName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Emergency Contact Number
                Text("Emergency Contact Number".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter emergency contact number", text: $emergencyContactNumber)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Emergency Contact Relationship
                Text("Emergency Contact Relationship".uppercased())
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .font(.subheadline)
                    .opacity(0.5)
                TextField("Enter emergency contact relationship", text: $emergencyContactRelationship)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Register Button
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .padding()
                } else {
                    Button(action: registerUser) {
                        Text("Register")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.accentColor)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                    .disabled(!isFormValid)
                }
            }
            .padding()
        }
        .navigationTitle("Register")
        .alert(isPresented: $showAlert) {
            Alert(title: Text("Registration"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
        }
    }
    
    // MARK: - Validation
    
    private var isFormValid: Bool {
        !firstName.isEmpty &&
        !lastName.isEmpty &&
        !dateOfBirth.isEmpty &&
        !gender.isEmpty &&
        !address.isEmpty &&
        !phoneNumber.isEmpty &&
        !email.isEmpty &&
        !password.isEmpty &&
        !healthCardNumber.isEmpty &&
        !studentID.isEmpty &&
        !emergencyContactName.isEmpty &&
        !emergencyContactNumber.isEmpty &&
        !emergencyContactRelationship.isEmpty &&
        isValidEmail(email) &&
        isValidDate(dateOfBirth)
    }
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    private func isValidDate(_ date: String) -> Bool {
        let dateRegex = "^\\d{4}-\\d{2}-\\d{2}$"
        let datePredicate = NSPredicate(format: "SELF MATCHES %@", dateRegex)
        return datePredicate.evaluate(with: date)
    }
    
    // MARK: - Register User
    
    private func registerUser() {
        guard isFormValid else {
            alertMessage = "Please fill all fields correctly."
            showAlert = true
            return
        }
        
        isLoading = true
        
        let userToRegister = UserToRegister(
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            address: address,
            phoneNumber: phoneNumber,
            email: email,
            password: password,
            healthCardNumber: healthCardNumber,
            isInternationalStudent: isInternationalStudent,
            studentID: studentID,
            emergencyContactName: emergencyContactName,
            emergencyContactNumber: emergencyContactNumber,
            emergencyContactRelationship: emergencyContactRelationship
        )
        
        NetworkManager.shared.post(endpoint: "api/auth/patient/register", body: userToRegister) { (result: Result<UserContainer, Error>) in
            isLoading = false
            switch result {
            case .success(let userContainer):
                if let user = userContainer.user {
                    do {
                        try KeychainWrapper.shared.save(user, forKey: "user")
//                        alertMessage = "Registration successful!"
//                        showAlert = true
                        isRegistered = false // Navigate back to LoginView
                    } catch {
                        alertMessage = "Failed to save user data: \(error.localizedDescription)"
                        showAlert = true
                    }
                } else {
                    alertMessage = "No user data found in response."
                    showAlert = true
                    isRegistered = true
                }
            case .failure(let error):
                alertMessage = "Registration failed: \(error.localizedDescription)"
                showAlert = true
                isRegistered = true
            }
        }
    }
}

#Preview {
    RegisterView(isRegistered: .constant(false))
}
