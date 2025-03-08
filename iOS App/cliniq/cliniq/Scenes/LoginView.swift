import SwiftUI

struct LoginView: View {
    @Binding var isLoggedIn: Bool // Binding to control login state
    @State private var email: String = "bibin@mail.com" // Dummy data
    @State private var password: String = "123456" // Dummy data
    @State private var isLoading: Bool = false
    @State private var showAlert: Bool = false
    @State private var alertMessage: String = ""
    @State private var isRegistered: Bool = false // To control navigation to RegisterView
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                // Logo
                Image("logo") // Replace with your logo
                    .resizable()
                    .scaledToFit()
                    .frame(width: 200, height: 100)
                    .foregroundColor(.accentColor)
                    .padding(.top, 50)
                
                // Email Field
                Text("Email")
                    .frame(maxWidth: .infinity, alignment: .leading)
                TextField("Enter your email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                
                // Password Field
                Text("Password")
                    .frame(maxWidth: .infinity, alignment: .leading)
                SecureField("Enter your password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Login Button
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .padding()
                } else {
                    Button(action: login) {
                        Text("Login")
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.accentColor)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                    }
                    .disabled(!isFormValid)
                }
                
                // Link to RegisterView
                NavigationLink(destination: RegisterView(isRegistered: $isRegistered), isActive: $isRegistered) {
                    Text("Don't have an account? Register")
                        .foregroundColor(.accentColor)
                }
                
                Spacer()
            }
            .padding()
            .navigationTitle("‎ ")
            .alert(isPresented: $showAlert) {
                Alert(title: Text("Login"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
            }
            .navigationDestination(isPresented: $isLoggedIn) {
                TabViewContainer(isLoggedIn: $isLoggedIn)
            }
            
        }
    }
    
    // MARK: - Validation
    
    private var isFormValid: Bool {
        !email.isEmpty && !password.isEmpty && isValidEmail(email)
    }
    
    private func isValidEmail(_ email: String) -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return emailPredicate.evaluate(with: email)
    }
    
    // MARK: - Login Function
    
    private func login() {
        guard isFormValid else {
            alertMessage = "Please enter a valid email and password."
            showAlert = true
            return
        }
        
        isLoading = true
        
        let loginParam = LoginParam(email: email, password: password)
        
        NetworkManager.shared.post(endpoint: "api/auth/patient/login", body: loginParam) { (result: Result<LoginResponse, Error>) in
            isLoading = false
            switch result {
            case .success(let loginResponse):
                do {
                    if loginResponse.data == nil {
                        alertMessage = loginResponse.error ?? "Failed due to unknown reason"
                        showAlert = true
                    } else {
                        try KeychainWrapper.shared.save(loginResponse.data, forKey: "user")
                        isLoggedIn = true // Navigate to TabView
                    }
                    
                } catch {
                    alertMessage = "Failed to save user data: \(error.localizedDescription)"
                    showAlert = true
                }
            case .failure(let error):
                alertMessage = "Login failed: \(error.localizedDescription)"
                showAlert = true
            }
        }
    }
}
