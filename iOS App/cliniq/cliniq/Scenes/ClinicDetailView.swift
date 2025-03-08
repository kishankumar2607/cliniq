//
//  ClinicDetailsView.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import SwiftUI

struct ClinicDetailView: View {
    let clinic: Clinic
    @State private var visitReason: String = ""
    @State private var isLoading: Bool = false
    @State private var showAlert: Bool = false
    @State private var alertMessage: String = ""
    @State private var token: Int? = nil
    
    var body: some View {
        VStack(spacing: 20) {
            // Clinic Details
            VStack(alignment: .leading, spacing: 10) {
                Text(clinic.name)
                    .font(.title)
                Text(clinic.address)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                Text(clinic.phone)
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }
            .padding()
            
            // Visit Reason
            TextField("Enter visit reason", text: $visitReason)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()
            
            // Get Token Button
            if isLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle())
                    .padding()
            } else {
                Button(action: getToken) {
                    Text("Get Token")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.accentColor)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .disabled(visitReason.isEmpty)
            }
            
            Spacer()
        }
        .padding()
        .navigationTitle("Clinic Details")
        .alert(isPresented: $showAlert) {
            Alert(title: Text("Error"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
        }
        .background(
            NavigationLink(destination: ViewTokenView(token: token ?? 0, clinicID: clinic.clinicID), isActive: Binding<Bool>(
                get: { token != nil },
                set: { _ in }
            )) {
                EmptyView()
            }
        )
    }
    
    // Get Token API Call
    private func getToken() {
        guard !visitReason.isEmpty else {
            alertMessage = "Please enter a visit reason."
            showAlert = true
            return
        }
        
        isLoading = true
        
        // Format the date to the required string format
        let dateFormatter = ISO8601DateFormatter()
        let visitDateString = dateFormatter.string(from: Date())
        
        let getTokenParam = GetTokenParam(
            patientID: 1, // Replace with actual patient ID
            visitDate: visitDateString, // Formatted date string
            visitReason: visitReason
        )
        
        NetworkManager.shared.post(endpoint: "api/clinic/\(clinic.clinicID)/getToken", body: getTokenParam) { (result: Result<TokenResponse, Error>) in
            isLoading = false
            switch result {
            case .success(let tokenResponse):
                if tokenResponse.token == nil {
                    alertMessage = "Failed to get token: \(tokenResponse.error ?? "Unknown error")"
                    showAlert = true
                } else {
                    token = tokenResponse.token // Navigate to ViewTokenView
                }
                
            case .failure(let error):
                alertMessage = "Failed to get token: \(error.localizedDescription)"
                showAlert = true
            }
        }
    }
}

#Preview {
    ClinicDetailView(clinic: Clinic(clinicID: 1, name: "Test Clinic", address: "123 Main St", phone: "123-456-7890"))
}
