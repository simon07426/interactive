document.addEventListener('DOMContentLoaded', () => {
    // Chat elements
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.send-btn');
    const toggleJsonBtn = document.querySelector('.toggle-json');
    
    // Quiz elements
    const options = document.querySelectorAll('.option');
    
    let showJson = false;
    let selectedOptions = new Map(); // Store selected options for each question

    // Quiz functionality
    options.forEach(option => {
        option.addEventListener('click', () => {
            const question = option.closest('.question');
            const questionId = question.dataset.questionId;
            const options = question.querySelectorAll('.option');
            
            // Remove selected class from all options in this question
            options.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Store the selected option
            selectedOptions.set(questionId, option.textContent);
            
            // Update the chat with the selected answer
            const questionText = question.querySelector('h3').textContent;
            const answer = option.textContent;
            addMessage('user', `Question: ${questionText}\nAnswer: ${answer}`);
            
            // Simulate bot response
            setTimeout(() => {
                const feedback = getQuizFeedback(questionId, answer);
                addMessage('bot', feedback);
            }, 1000);
        });
    });

    // Toggle JSON display
    toggleJsonBtn.addEventListener('click', () => {
        showJson = !showJson;
        const jsonDisplays = document.querySelectorAll('.json-display');
        jsonDisplays.forEach(display => {
            display.style.display = showJson ? 'block' : 'none';
        });
        toggleJsonBtn.innerHTML = showJson ? 
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg> Hide API Requests' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg> Show API Requests';
    });

    // Create timestamp
    function createTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Add message to chat
    function addMessage(sender, content, jsonData = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        const avatar = document.createElement('div');
        avatar.className = `avatar ${sender}-avatar`;
        avatar.textContent = sender === 'user' ? 'U' : 'B';
        
        const senderName = document.createElement('span');
        senderName.className = 'message-sender';
        senderName.textContent = sender === 'user' ? 'You' : 'Bot';
        
        messageHeader.appendChild(avatar);
        messageHeader.appendChild(senderName);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = createTimestamp();
        
        messageDiv.appendChild(messageHeader);
        messageDiv.appendChild(messageContent);
        
        if (jsonData && showJson) {
            const jsonDisplay = document.createElement('pre');
            jsonDisplay.className = 'json-display';
            jsonDisplay.textContent = JSON.stringify(jsonData, null, 2);
            messageDiv.appendChild(jsonDisplay);
        }
        
        messageDiv.appendChild(messageTime);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get quiz feedback
    function getQuizFeedback(questionId, answer) {
        const feedbackMap = {
            'q1': {
                'A': 'Correct! The primary goal of prompt engineering is indeed to create clear and effective instructions for AI models.',
                'B': 'Not quite. While reducing token usage is important, it\'s not the primary goal of prompt engineering.',
                'C': 'Incorrect. Prompt engineering is about creating effective instructions, not just about using the latest models.',
                'D': 'Not quite. While prompt engineering can help with model selection, its main focus is on creating effective instructions.'
            },
            'q2': {
                'A': 'Not quite. While being specific is important, it\'s not the only key principle of prompt engineering.',
                'B': 'Correct! The key principles of prompt engineering include being specific, providing context, and using clear instructions.',
                'C': 'Incorrect. Using technical jargon is actually discouraged in prompt engineering.',
                'D': 'Not quite. While these are good practices, they\'re not the core principles of prompt engineering.'
            },
            'q3': {
                'A': 'Not quite. While this is a good start, it could be more specific and structured.',
                'B': 'Correct! This prompt is specific, provides context, and has a clear structure.',
                'C': 'Incorrect. This prompt is too vague and doesn\'t provide enough context.',
                'D': 'Not quite. This prompt is too complex and might confuse the model.'
            }
        };
        
        return feedbackMap[questionId][answer] || 'Please select an answer.';
    }

    // Send message
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage('user', message);
        chatInput.value = '';
        resetInputHeight();

        // Disable input and show loading state
        chatInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<div class="spinner"></div>';

        try {
            // Simulate API call
            const response = await simulateApiCall(message);
            
            // Add bot response to chat
            addMessage('bot', response.message, response.json);
        } catch (error) {
            addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        } finally {
            // Re-enable input and reset button
            chatInput.disabled = false;
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
            chatInput.focus();
        }
    }

    // Simulate API call
    async function simulateApiCall(message) {
        return new Promise(resolve => {
            setTimeout(() => {
                const response = {
                    message: `I received your message: "${message}". This is a simulated response.`,
                    json: {
                        prompt: message,
                        response: "Simulated response",
                        timestamp: new Date().toISOString()
                    }
                };
                resolve(response);
            }, 1000);
        });
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    function resetInputHeight() {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    }

    chatInput.addEventListener('input', resetInputHeight);
    window.addEventListener('resize', resetInputHeight);
}); 