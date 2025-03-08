//
//  ClinicsView.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import SwiftUI

struct ClinicsView: View {
    @State private var clinics: [Clinic] = []
    @State private var isLoading: Bool = false
    @State private var showAlert: Bool = false
    @State private var alertMessage: String = ""
    
    var body: some View {
        NavigationStack {
            if isLoading {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle())
                    .padding()
            } else {
                List(clinics) { clinic in
                    NavigationLink(destination: ClinicDetailView(clinic: clinic)) {
                        VStack(alignment: .leading) {
                            Text(clinic.name)
                                .font(.headline)
                            Text(clinic.address)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                            Text(clinic.phone)
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                }
                .navigationTitle("Clinics")
            }
        }
        .onAppear {
            fetchClinics()
        }
        .alert(isPresented: $showAlert) {
            Alert(title: Text("Error"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
        }
    }
    
    // Fetch clinics from API
    private func fetchClinics() {
        isLoading = true
        NetworkManager.shared.get(endpoint: "api/clinic/all") { (result: Result<ClinicContainer, Error>) in
            isLoading = false
            switch result {
            case .success(let clinicContainer):
                clinics = clinicContainer.data
            case .failure(let error):
                alertMessage = "Failed to fetch clinics: \(error.localizedDescription)"
                showAlert = true
            }
        }
    }
}

#Preview {
    ClinicsView()
}
