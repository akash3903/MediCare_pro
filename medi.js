class MediCareApp {
    constructor() {
        this.chatMessages = [];
        this.uploadedFiles = [];
        this.appointments = [];
        this.cartItems = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFileUpload();
        this.setupChat();
        console.log('MediCare Pro initialized successfully');
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Chat input enter key
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Appointment form submission
        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.bookAppointment();
            });
        }
    }

    setupFileUpload() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        if (dropZone && fileInput) {
            // Drag and drop functionality
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        const filesList = document.getElementById('filesList');
        const uploadedFilesDiv = document.getElementById('uploadedFiles');

        Array.from(files).forEach(file => {
            if (this.validateFile(file)) {
                this.uploadedFiles.push(file);
                this.displayUploadedFile(file, filesList);
                this.analyzeReport(file);
            }
        });

        if (uploadedFilesDiv && this.uploadedFiles.length > 0) {
            uploadedFilesDiv.classList.remove('hidden');
        }
    }

    validateFile(file) {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            this.showNotification('Please upload PDF, JPG, or PNG files only.', 'error');
            return false;
        }

        if (file.size > maxSize) {
            this.showNotification('File size should be less than 10MB.', 'error');
            return false;
        }

        return true;
    }

    displayUploadedFile(file, container) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        
        fileDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-file-${this.getFileIcon(file.type)} text-blue-600 mr-3"></i>
                <div>
                    <p class="font-medium">${file.name}</p>
                    <p class="text-sm text-gray-500">${this.formatFileSize(file.size)}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-green-600 text-sm">
                    <i class="fas fa-check mr-1"></i>Uploaded
                </span>
                <button onclick="mediCare.removeFile('${file.name}')" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(fileDiv);
    }

    getFileIcon(fileType) {
        if (fileType === 'application/pdf') return 'pdf';
        if (fileType.startsWith('image/')) return 'image';
        return 'alt';
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
    }

    analyzeReport(file) {
        // Simulate AI analysis
        setTimeout(() => {
            const analysis = this.generateReportAnalysis(file.name);
            this.addChatMessage(analysis, 'bot');
            this.showNotification('Report analysis completed!', 'success');
        }, 2000);
    }

    generateReportAnalysis(fileName) {
        const analyses = [
            {
                type: 'Blood Test',
                findings: 'Your blood test shows normal white blood cell count. Slight elevation in cholesterol levels detected. Recommend dietary modifications and regular exercise.',
                recommendations: ['Reduce saturated fat intake', 'Exercise 30 minutes daily', 'Follow up in 3 months'],
                urgency: 'Low'
            },
            {
                type: 'X-Ray',
                findings: 'Chest X-ray appears normal. No signs of pneumonia or other respiratory issues. Clear lung fields observed.',
                recommendations: ['Continue regular check-ups', 'Maintain healthy lifestyle', 'No immediate action required'],
                urgency: 'None'
            },
            {
                type: 'ECG',
                findings: 'ECG shows normal sinus rhythm. Heart rate within normal range. No signs of arrhythmia detected.',
                recommendations: ['Continue current medications if any', 'Regular cardio exercise', 'Annual cardiac check-up'],
                urgency: 'Low'
            }
        ];

        const randomAnalysis = analyses[Math.floor(Math.random() * analyses.length)];
        
        return `
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 class="font-semibold text-blue-800 mb-2">
                    <i class="fas fa-microscope mr-2"></i>AI Analysis: ${randomAnalysis.type}
                </h4>
                <div class="mb-3">
                    <p class="text-sm text-gray-700"><strong>Findings:</strong></p>
                    <p class="text-sm text-gray-600">${randomAnalysis.findings}</p>
                </div>
                <div class="mb-3">
                    <p class="text-sm text-gray-700"><strong>Recommendations:</strong></p>
                    <ul class="text-sm text-gray-600 list-disc list-inside">
                        ${randomAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-xs px-2 py-1 rounded-full ${this.getUrgencyColor(randomAnalysis.urgency)}">
                        ${randomAnalysis.urgency} Priority
                    </span>
                    <button onclick="mediCare.scheduleFollowUp()" class="text-blue-600 hover:text-blue-800 text-sm">
                        <i class="fas fa-calendar mr-1"></i>Schedule Follow-up
                    </button>
                </div>
            </div>
        `;
    }

    getUrgencyColor(urgency) {
        switch(urgency.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    setupChat() {
        // Initialize chat with welcome message
        const welcomeMessage = "Hello! I'm your AI medical assistant. I can help you with:\n\n• Analyzing medical reports\n• Providing health recommendations\n• Scheduling appointments\n• Emergency guidance\n\nHow can I assist you today?";
        
        // Don't add welcome message again if already present
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages && chatMessages.children.length <= 1) {
            // Welcome message is already in HTML
        }
    }

    toggleChatbot() {
        const modal = document.getElementById('chatbotModal');
        if (modal.classList.contains('hidden')) {
            modal.classList.remove('hidden');
            document.getElementById('chatInput').focus();
        } else {
            modal.classList.add('hidden');
        }
    }

    openChatbot() {
        document.getElementById('chatbotModal').classList.remove('hidden');
        document.getElementById('chatInput').focus();
    }

    closeChatbot() {
        document.getElementById('chatbotModal').classList.add('hidden');
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            this.addChatMessage(message, 'user');
            input.value = '';
            
            // Simulate AI thinking
            this.addTypingIndicator();
            
            setTimeout(() => {
                this.removeTypingIndicator();
                const response = this.generateAIResponse(message);
                this.addChatMessage(response, 'bot');
            }, 1500);
        }
    }

    quickMessage(message) {
        document.getElementById('chatInput').value = message;
        this.sendMessage();
    }

    addChatMessage(message, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : ''}`;
        
        const isHTML = message.includes('<');
        
        messageDiv.innerHTML = `
            <div class="inline-block max-w-xs lg:max-w-sm p-3 rounded-lg ${
                sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 shadow-md border'
            }">
                ${isHTML ? message : `<p class="text-sm">${message}</p>`}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'mb-4';
        typingDiv.innerHTML = `
            <div class="inline-block bg-gray-200 p-3 rounded-lg">
                <div class="typing-indicator flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Emergency responses
        if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('help')) {
            return `
                <div class="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                    <h4 class="font-semibold text-red-800 mb-2">🚨 Emergency Response</h4>
                    <p class="text-sm text-gray-700 mb-3">If this is a medical emergency, please call 911 immediately.</p>
                    <div class="space-y-2">
                        <button onclick="mediCare.startVideoCall()" class="w-full bg-red-600 text-white py-2 px-4 rounded text-sm hover:bg-red-700">
                            🎥 Emergency Video Call
                        </button>
                        <button onclick="mediCare.callEmergency()" class="w-full bg-red-800 text-white py-2 px-4 rounded text-sm hover:bg-red-900">
                            📞 Call 911
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Symptoms responses
        if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('fever') || lowerMessage.includes('vomit')) {
            return this.generateSymptomResponse(lowerMessage);
        }
        
        // Report analysis
        if (lowerMessage.includes('report') || lowerMessage.includes('analyze') || lowerMessage.includes('test result')) {
            return `I can analyze your medical reports! Please upload your reports using the upload section above, and I'll provide detailed analysis with recommendations. Supported formats: PDF, JPG, PNG.`;
        }
        
        // Appointment booking
        if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
            return `
                <div class="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                    <h4 class="font-semibold text-green-800 mb-2">📅 Book Appointment</h4>
                    <p class="text-sm text-gray-700 mb-3">I can help you schedule an appointment with our doctors.</p>
                    <button onclick="mediCare.showBooking()" class="bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700">
                        Book Now
                    </button>
                </div>
            `;
        }
        
        // Medicine queries
        if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('drug')) {
            return `
                <div class="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                    <h4 class="font-semibold text-purple-800 mb-2">💊 Medicine Information</h4>
                    <p class="text-sm text-gray-700 mb-3">You can browse and order medicines from our store with free delivery.</p>
                    <button onclick="document.getElementById('store').scrollIntoView({behavior: 'smooth'})" class="bg-purple-600 text-white py-2 px-4 rounded text-sm hover:bg-purple-700">
                        Visit Store
                    </button>
                </div>
            `;
        }
        
        // Default helpful response
        return `I understand you're asking about "${message}". As your AI medical assistant, I can help with:

• 🔬 Medical report analysis
• 💊 Medicine information and ordering
• 📅 Appointment scheduling
• 🎥 Video consultations
• 🚨 Emergency guidance

Please let me know what specific help you need, or upload your medical reports for detailed analysis.`;
    }

    generateSymptomResponse(symptoms) {
        const commonSymptoms = {
            'vomit': {
                advice: 'For vomiting, try sipping small amounts of clear fluids like water or ginger tea. Avoid solid foods until vomiting stops.',
                remedies: ['Stay hydrated with small sips', 'Try ginger tea', 'Rest in upright position', 'Avoid dairy and fatty foods'],
                warning: 'Consult a doctor if vomiting persists for more than 24 hours or if you have severe dehydration.'
            },
            'fever': {
                advice: 'For fever, rest and stay hydrated. You can take over-the-counter fever reducers if needed.',
                remedies: ['Drink plenty of fluids', 'Rest in cool environment', 'Use cool compress', 'Take acetaminophen if needed'],
                warning: 'Seek immediate medical attention if fever exceeds 103°F (39.4°C) or persists for more than 3 days.'
            },
            'pain': {
                advice: 'The treatment for pain depends on its location and severity. Can you describe where you feel pain?',
                remedies: ['Apply ice or heat as appropriate', 'Take over-the-counter pain relievers', 'Rest the affected area', 'Gentle stretching if muscular'],
                warning: 'Seek immediate care for severe pain, chest pain, or pain with other concerning symptoms.'
            }
        };

        const symptom = Object.keys(commonSymptoms).find(key => symptoms.includes(key));
        const response = symptom ? commonSymptoms[symptom] : {
            advice: 'I understand you\'re experiencing symptoms. Please describe them in more detail so I can provide better guidance.',
            remedies: ['Rest and stay hydrated', 'Monitor your symptoms', 'Take your temperature if possible', 'Avoid strenuous activities'],
            warning: 'Contact a healthcare provider if symptoms worsen or persist.'
        };

        return `
            <div class="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
                <h4 class="font-semibold text-yellow-800 mb-2">🩺 Symptom Assessment</h4>
                <p class="text-sm text-gray-700 mb-3">${response.advice}</p>
                
                <div class="mb-3">
                    <p class="text-sm font-medium text-gray-700">Immediate remedies:</p>
                    <ul class="text-xs text-gray-600 list-disc list-inside mt-1">
                        ${response.remedies.map(remedy => `<li>${remedy}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="bg-red-100 p-2 rounded text-xs text-red-800 mb-3">
                    ⚠️ ${response.warning}
                </div>
                
                <div class="flex space-x-2">
                    <button onclick="mediCare.startVideoCall()" class="bg-green-600 text-white py-1 px-3 rounded text-xs hover:bg-green-700">
                        Video Consult
                    </button>
                    <button onclick="mediCare.showBooking()" class="bg-blue-600 text-white py-1 px-3 rounded text-xs hover:bg-blue-700">
                        Book Appointment
                    </button>
                </div>
            </div>
        `;
    }

    startVideoCall() {
        const modal = document.getElementById('videoCallModal');
        modal.classList.remove('hidden');
        this.showNotification('Connecting to doctor...', 'info');
        
        // Simulate connection
        setTimeout(() => {
            this.showNotification('Connected! Doctor will join shortly.', 'success');
        }, 3000);
    }

    endVideoCall() {
        const modal = document.getElementById('videoCallModal');
        modal.classList.add('hidden');
        this.showNotification('Video call ended', 'info');
    }

    callEmergency() {
        // In a real app, this would trigger actual emergency services
        alert('Emergency services contacted! Help is on the way. Stay calm and follow any instructions given.');
    }

    showBooking() {
        document.getElementById('appointments').scrollIntoView({ behavior: 'smooth' });
        this.showNotification('Please fill out the appointment form below', 'info');
    }

    bookAppointment() {
        const form = document.getElementById('appointmentForm');
        const formData = new FormData(form);
        
        // Simulate booking
        const appointmentId = 'APT-' + Date.now();
        this.appointments.push({
            id: appointmentId,
            name: formData.get('name') || 'Patient',
            date: new Date().toLocaleDateString(),
            status: 'confirmed'
        });
        
        this.showNotification('Appointment booked successfully! Confirmation ID: ' + appointmentId, 'success');
        form.reset();
    }

    scheduleFollowUp() {
        this.showBooking();
        this.addChatMessage('Great! Please fill out the appointment form to schedule your follow-up visit.', 'bot');
    }

    removeFile(fileName) {
        this.uploadedFiles = this.uploadedFiles.filter(file => file.name !== fileName);
        // Refresh the file list display
        const filesList = document.getElementById('filesList');
        const uploadedFilesDiv = document.getElementById('uploadedFiles');
        
        if (filesList) {
            filesList.innerHTML = '';
            this.uploadedFiles.forEach(file => {
                this.displayUploadedFile(file, filesList);
            });
        }
        
        if (this.uploadedFiles.length === 0 && uploadedFilesDiv) {
            uploadedFilesDiv.classList.add('hidden');
        }
        
        this.showNotification('File removed successfully', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white',
            warning: 'bg-yellow-500 text-black'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-sm">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-lg">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Global functions for onclick handlers
function toggleChatbot() {
    mediCare.toggleChatbot();
}

function openChatbot() {
    mediCare.openChatbot();
}

function closeChatbot() {
    mediCare.closeChatbot();
}

function sendMessage() {
    mediCare.sendMessage();
}

function quickMessage(message) {
    mediCare.quickMessage(message);
}

function startVideoCall() {
    mediCare.startVideoCall();
}

function endVideoCall() {
    mediCare.endVideoCall();
}

function showBooking() {
    mediCare.showBooking();
}

// Initialize the app
const mediCare = new MediCareApp();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MediCareApp;
}