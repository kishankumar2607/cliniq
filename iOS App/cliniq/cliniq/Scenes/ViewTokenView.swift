import SwiftUI
import AVFoundation // Import AVFoundation to play sound

struct ViewTokenView: View {
    @Binding var token: Int?
    let clinic: Clinic // Pass the clinic ID from the previous view
    
    @State private var currentToken: Int? = nil
    @State private var upNextToken: Int? = nil
    @State private var errorMessage: String? = nil
    @State private var timer: Timer? = nil
    @State private var hasPlayedDing: Bool = false // To track if the ding sound has been played
    @State private var audioPlayer: AVAudioPlayer? // To play the ding sound
    @State private var isBreathing: Bool = false // To control the breath animation
    @State private var estimatedTime: String? = nil // To store the estimated time

    var body: some View {
        VStack {
            Spacer()
            
            Text(clinic.name)
                .foregroundColor(token == currentToken ? .white : .accentColor)
                .opacity(0.6)
            
            Text("Your Token")
                .font(.largeTitle)
                .padding()
                .foregroundColor(token == currentToken ? .white : .primary) // Change text color to white if token matches
                
            
            if let token {
                Text("\(token)")
                    .font(.system(size: 60, weight: .bold, design: .monospaced))
                    .foregroundColor(token == currentToken ? .white : .accentColor) // Change text color to white if token matches
                    .padding()
            }
            
            // Display current and up-next tokens
            if let errorMessage = errorMessage {
                Text("\(errorMessage)")
                    .font(.headline)
                    .foregroundColor(.red)
                    .opacity(0.6)
                    .padding()
            } else {
                if let currentToken = currentToken {
                    VStack {
                        Text("Current Token: \(currentToken)")
                            .font(.headline)
                            .foregroundColor(token == currentToken ? .white : .primary) // Change text color to white if token matches
                            .padding()
                        
                        // Display estimated time
                        if let estimatedTime = estimatedTime {
                            Text("Estimated Time: \(estimatedTime)")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                                .padding()
                        }
                    }
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
        .background(
            Group {
                if token == currentToken {
                    Color.green
                        .ignoresSafeArea()
                        .saturation(isBreathing ? 1 : 1.5)
                        .animation(
                            Animation.easeInOut(duration: 1.5)
                                .repeatForever(autoreverses: true),
                            value: isBreathing
                        )
                } else {
                    Color.clear // No animation when background is white
                }
            }
        )
        .onAppear {
            startTimer()
            if token == currentToken {
                isBreathing = true // Start breath animation if token matches
            }
        }
        .onDisappear {
            stopTimer()
            isBreathing = false // Stop breath animation
        }
        .onChange(of: currentToken) { newCurrentToken in
            if token == newCurrentToken {
                isBreathing = true // Start breath animation when token matches
            } else {
                isBreathing = false // Stop breath animation when token does not match
            }
            calculateEstimatedTime(currentToken: newCurrentToken)
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
        
        NetworkManager.shared.get(endpoint: "api/clinic/\(clinic.clinicID)/currentToken") { (result: Result<CurrentTokenContainer, Error>) in
            DispatchQueue.main.async {
                switch result {
                case .success(let container):
                    if container.error != nil {
                        errorMessage = container.error
                        return
                    } else if container.data != nil {
                        let newCurrentToken = container.data!.currentToken
                        
                        // Update tokens
                        currentToken = newCurrentToken
                        
                        // Calculate estimated time
                        calculateEstimatedTime(currentToken: newCurrentToken)
                        
                        // Play ding sound only once when token matches currentToken for the first time
                        if token == newCurrentToken && !hasPlayedDing {
                            playDingSound()
                            hasPlayedDing = true // Mark that the sound has been played
                        }
                    }
                case .failure(let error):
                    errorMessage = error.localizedDescription
                }
            }
        }
    }

    // Function to calculate estimated time
    private func calculateEstimatedTime(currentToken: Int?) {
        guard let token = token, let currentToken = currentToken, token > currentToken else {
            estimatedTime = nil
            return
        }
        
        let tokenDifference = token - currentToken
        let minutesToAdd = tokenDifference * 5 // Assuming each token takes 5 minutes
        
        let calendar = Calendar.current
        if let estimatedDate = calendar.date(byAdding: .minute, value: minutesToAdd, to: Date()) {
            let dateFormatter = DateFormatter()
            dateFormatter.timeStyle = .short
            estimatedTime = dateFormatter.string(from: estimatedDate)
        } else {
            estimatedTime = nil
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
    ViewTokenView(token: .constant(10), clinic: .init(clinicID: 0, name: "Some clinic", address: "some address", phone: "456789"))
}
