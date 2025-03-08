//
//  ViewTokenView.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import SwiftUI
import AVFoundation // Import AVFoundation to play sound

struct ViewTokenView: View {
    let token: Int
    let clinicID: Int // Pass the clinic ID from the previous view
    
    @State private var currentToken: Int? = nil
    @State private var upNextToken: Int? = nil
    @State private var errorMessage: String? = nil
    @State private var timer: Timer? = nil
    @State private var hasPlayedDing: Bool = false // To track if the ding sound has been played
    @State private var audioPlayer: AVAudioPlayer? // To play the ding sound

    var body: some View {
        VStack {
            Spacer()
            
            Text("Your Token")
                .font(.largeTitle)
                .padding()
//                .padding(.top, 200)
                .foregroundColor(token == currentToken ? .white : .primary) // Change text color to white if token matches
                
            
            Text("\(token)")
                .font(.system(size: 60, weight: .bold, design: .monospaced))
                .foregroundColor(token == currentToken ? .white : .accentColor) // Change text color to white if token matches
                .padding()
            
            
            // Display current and up-next tokens
            if let errorMessage = errorMessage {
                Text("Error: \(errorMessage)")
                    .font(.headline)
                    .foregroundColor(.red)
                    .padding()
            } else {
                if let currentToken = currentToken {
                    Text("Current Token: \(currentToken)")
                        .font(.headline)
                        .foregroundColor(token == currentToken ? .white : .primary) // Change text color to white if token matches
                        .padding()
                }
            }
            
            Spacer()
            if token == currentToken {
                Text("Please proceed to the reception")
                    .font(.subheadline)
                    .foregroundColor(token == currentToken ? .white : .gray) // Change text color to white if token matches
                    .padding()
                    .background(
                        Color.black
                            .opacity(0.8)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    )
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(token == currentToken ? Color.green : Color.clear) // Change background to green if token matches
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
        errorMessage = nil
        
        NetworkManager.shared.get(endpoint: "api/clinic/\(clinicID)/currentToken") { (result: Result<CurrentTokenContainer, Error>) in
            DispatchQueue.main.async {
                switch result {
                case .success(let container):
                    let newCurrentToken = container.data.currentToken
                    let newUpNextToken = container.data.upNextToken
                    
                    // Update tokens
                    currentToken = newCurrentToken
                    upNextToken = newUpNextToken
                    
                    // Play ding sound only once when token matches currentToken for the first time
                    if token == newCurrentToken && !hasPlayedDing {
                        playDingSound()
                        hasPlayedDing = true // Mark that the sound has been played
                    }
                case .failure(let error):
                    errorMessage = error.localizedDescription
                }
            }
        }
    }

    // Function to play ding sound
    private func playDingSound() {
        guard let soundURL = Bundle.main.url(forResource: "ding", withExtension: "mp3") else {
            print("Ding sound file not found")
            return
        }
        
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: soundURL)
            audioPlayer?.play()
        } catch {
            print("Failed to play ding sound: \(error.localizedDescription)")
        }
    }
}

#Preview {
    ViewTokenView(token: 10, clinicID: 1)
}
