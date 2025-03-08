//
//  ViewTokenView.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import SwiftUI

struct ViewTokenView: View {
    let token: Int
    let clinicID: Int // Pass the clinic ID from the previous view
    
    @State private var currentToken: Int? = nil
    @State private var upNextToken: Int? = nil
    @State private var isLoading: Bool = false
    @State private var errorMessage: String? = nil
    @State private var timer: Timer? = nil

    var body: some View {
        VStack {
            Text("Your Token")
                .font(.largeTitle)
                .padding()
            
            Text("\(token)")
                .font(.system(size: 60, weight: .bold, design: .monospaced))
                .foregroundColor(.accentColor)
                .padding()
            
            Text("Please proceed to the clinic reception.")
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding()
            
            // Display current and up-next tokens
            if isLoading {
                ProgressView()
                    .padding()
            } else if let errorMessage = errorMessage {
                Text("Error: \(errorMessage)")
                    .font(.headline)
                    .foregroundColor(.red)
                    .padding()
            } else {
                if let currentToken = currentToken {
                    Text("Current Token: \(currentToken)")
                        .font(.headline)
                        .padding()
                }
                
                if let upNextToken = upNextToken {
                    Text("Up Next Token: \(upNextToken)")
                        .font(.headline)
                        .padding()
                }
            }
            
            Spacer()
        }
        .onAppear {
            startTimer()
        }
        .onDisappear {
            stopTimer()
        }
    }

    // Function to start the timer
    private func startTimer() {
        // Fetch data immediately when the view appears
        fetchCurrentToken()
        
        // Start a timer to fetch data every 5 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 5.0, repeats: true) { _ in
            fetchCurrentToken()
        }
    }

    // Function to stop the timer
    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }

    // Function to fetch current and up-next tokens
    private func fetchCurrentToken() {
        isLoading = true
        errorMessage = nil
        
        NetworkManager.shared.get(endpoint: "api/clinic/\(clinicID)/currentToken") { (result: Result<CurrentTokenContainer, Error>) in
            DispatchQueue.main.async {
                isLoading = false
                
                switch result {
                case .success(let container):
                    currentToken = container.data.currentToken
                    upNextToken = container.data.upNextToken
                case .failure(let error):
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}

#Preview {
    ViewTokenView(token: 10, clinicID: 1)
}
