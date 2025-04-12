document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const toggleJsonBtn = document.getElementById('toggle-json');
    
    // State
    let showJson = false;
    
    // Toggle JSON display
    toggleJsonBtn.addEventListener('click', () => {
        showJson = !showJson;
        toggleJsonBtn.textContent = showJson ? "Hide API Requests" : "Show API Requests";
        
        // Update the toggle button icon
        toggleJsonBtn.innerHTML = showJson 
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg> Hide API Requests`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg> Show API Requests`;
    });
    
    // Function to create timestamp
    function getTimestamp() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // Function to add message to chat
    function addMessage(content, isUser, jsonContent = null, feedbackType = null, score = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        
        const avatar = document.createElement('div');
        avatar.className = `avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`;
        avatar.textContent = isUser ? 'Y' : 'A';
        
        const sender = document.createElement('div');
        sender.className = 'message-sender';
        sender.textContent = isUser ? 'You' : 'Assistant';
        
        if (score !== null) {
            const scoreIndicator = document.createElement('span');
            scoreIndicator.className = `score-indicator score-${score < 4 ? 'low' : score < 7 ? 'medium' : 'high'}`;
            scoreIndicator.textContent = `Score: ${score}/10`;
            sender.appendChild(scoreIndicator);
        }
        
        messageHeader.appendChild(avatar);
        messageHeader.appendChild(sender);
        messageDiv.appendChild(messageHeader);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        messageDiv.appendChild(messageContent);
        
        if (jsonContent && showJson) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'json-toggle-btn';
            toggleBtn.textContent = 'Show JSON';
            messageContent.appendChild(document.createElement('br'));
            messageContent.appendChild(toggleBtn);
            
            const jsonDisplay = document.createElement('pre');
            jsonDisplay.className = 'json-display';
            jsonDisplay.style.display = 'none';
            jsonDisplay.textContent = JSON.stringify(jsonContent, null, 2);
            messageContent.appendChild(jsonDisplay);
            
            toggleBtn.addEventListener('click', () => {
                const isHidden = jsonDisplay.style.display === 'none';
                jsonDisplay.style.display = isHidden ? 'block' : 'none';
                toggleBtn.textContent = isHidden ? 'Hide JSON' : 'Show JSON';
            });
        }
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = getTimestamp();
        messageDiv.appendChild(messageTime);
        
        if (feedbackType && !isUser) {
            const feedbackTags = document.createElement('div');
            feedbackTags.className = 'feedback-tags';
            
            if (feedbackType.includes('clarity')) {
                const clarityTag = document.createElement('span');
                clarityTag.className = 'feedback-tag tag-clarity';
                clarityTag.textContent = 'Clarity';
                feedbackTags.appendChild(clarityTag);
            }
            
            if (feedbackType.includes('specificity')) {
                const specificityTag = document.createElement('span');
                specificityTag.className = 'feedback-tag tag-specificity';
                specificityTag.textContent = 'Specificity';
                feedbackTags.appendChild(specificityTag);
            }
            
            if (feedbackType.includes('directness')) {
                const directnessTag = document.createElement('span');
                directnessTag.className = 'feedback-tag tag-directness';
                directnessTag.textContent = 'Directness';
                feedbackTags.appendChild(directnessTag);
            }
            
            if (feedbackType.includes('structure')) {
                const structureTag = document.createElement('span');
                structureTag.className = 'feedback-tag tag-structure';
                structureTag.textContent = 'Structure';
                feedbackTags.appendChild(structureTag);
            }
            
            messageDiv.appendChild(feedbackTags);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to wrap user prompt with instructions
    function wrapPromptWithInstructions(prompt) {
        return {
            messages: [
                {
                    role: "system",
                    content: `You are a helpful and constructive mentor, guiding users on how to improve their prompts for better AI interactions.
                    
Behavior & Personality:
* Act as a helpful and constructive mentor, guiding users on how to improve their prompts.
* Maintain a supportive, non-judgmental tone while providing clear and actionable feedback.
* Encourage iterative learning, suggesting improvements while recognizing well-structured prompts.
* Adapt responses based on user experience level (beginner-friendly explanations vs. advanced refinements).

Functionality & Response Strategy:
1. Analyze Prompt Clarity
   * Check if the prompt is too vague or ambiguous.
   * Offer examples of clearer phrasing when necessary.
2. Assess Specificity
   * Identify general or undefined terms (e.g., "something", "thing").
   * Suggest more precise wording for better AI responses.
3. Evaluate Directness
   * Advise users to remove unnecessary politeness like "Can you" or "Could you" for stronger prompts.
4. Encourage Structured Prompts
   * Praise step-by-step or well-structured prompts.
   * Offer templates or example prompts when needed.
5. Provide Scoring & Improvement Tips
   * Give a score (e.g., 1-10) with reasons for improvement.
   * Suggest one small change at a time to refine the user's prompt.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        };
    }
    
    // Function to analyze feedback type from response
    function analyzeFeedbackType(response) {
        const feedbackTypes = [];
        
        if (/unclear|vague|ambiguous|clarity|specific goal/i.test(response)) {
            feedbackTypes.push('clarity');
        }
        
        if (/specific|details|more information|undefined terms/i.test(response)) {
            feedbackTypes.push('specificity');
        }
        
        if (/direct|unnecessary politeness|can you|could you/i.test(response)) {
            feedbackTypes.push('directness');
        }
        
        if (/structure|step-by-step|organize|format|template/i.test(response)) {
            feedbackTypes.push('structure');
        }
        
        return feedbackTypes.length > 0 ? feedbackTypes : ['clarity', 'specificity'];
    }
    
    // Function to extract score from response
    function extractScore(response) {
        const scoreRegex = /score[:\s]*(\d+)[\/\s]*10/i;
        const match = response.match(scoreRegex);
        return match ? parseInt(match[1]) : null;
    }
    
    // Function to make API call to ChatGPT
    async function callChatGPT(prompt) {
        // This would be replaced with your actual API call
        // For demo purposes, using a simplified simulation
        const API_KEY = "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"; // This would be hardcoded in your backend
        
        // In a real implementation, this would be a fetch call to the OpenAI API
        // For this demo, we're simulating the API response
        
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Prompt analysis patterns
        const isVague = prompt.length < 20 || /tell me about|explain|what is|how to/i.test(prompt) && prompt.split(' ').length < 5;
        const hasUndefinedTerms = /something|thing|stuff|information/i.test(prompt);
        const hasPoliteness = /could you|can you|please|would you|i would like|i want/i.test(prompt);
        const isWellStructured = /step[- ]by[- ]step|first|second|then|finally|1\.|2\./i.test(prompt) || prompt.includes('\n') || prompt.length > 100;
        
        let score = 5; // Default medium score
        
        if (isVague) score -= 2;
        if (hasUndefinedTerms) score -= 1;
        if (hasPoliteness) score -= 1;
        if (isWellStructured) score += 3;
        
        // Ensure score is within 1-10 range
        score = Math.max(1, Math.min(10, score));
        
        let response;
        
        if (score <= 3) {
            response = `Your prompt is quite vague and could benefit from more specificity. I'd give it a score of ${score}/10.\n\nTry to clearly define what you're looking for and be more specific about your requirements. Instead of asking "${prompt}", consider something like: "${prompt} with specific examples of [relevant topic] and explain the implications for [specific field/application]."`;
        } else if (score <= 6) {
            response = `Your prompt is okay but could be more direct and specific. I'd give it a score of ${score}/10.\n\nTry removing unnecessary politeness phrases like "Can you" or "Could you" and be more specific about what you want. A more effective version might be: "${prompt.replace(/can you |could you |please |i would like you to /i, '')}" with additional details about [format/scope/purpose].`;
        } else {
            response = `Great prompt! It's clear, specific, and well-structured. I'd give it a score of ${score}/10.\n\nYou've provided good direction. If you wanted to make it even better, you could consider adding: [specific detail relevant to prompt type].`;
        }
        
        return {
            success: true,
            data: {
                choices: [{
                    message: {
                        content: response
                    }
                }]
            }
        };
    }
    
    // Send message function
    async function sendMessage() {
        const userPrompt = chatInput.value.trim();
        if (!userPrompt) return;
        
        // Add user message to chat
        addMessage(userPrompt, true);
        chatInput.value = '';
        
        // Disable send button and show loading state
        sendBtn.disabled = true;
        sendBtn.innerHTML = 'Sending <div class="spinner"></div>';
        
        try {
            // Wrap prompt with instructions
            const wrappedPrompt = wrapPromptWithInstructions(userPrompt);
            
            // Add thinking message
            const thinkingDiv = document.createElement('div');
            thinkingDiv.className = 'message bot';
            thinkingDiv.innerHTML = `
                <div class="message-header">
                    <div class="avatar bot-avatar">A</div>
                    <div class="message-sender">Assistant</div>
                </div>
                <div class="message-content">
                    Analyzing your prompt...
                </div>
                <div class="message-time">${getTimestamp()}</div>
            `;
            chatMessages.appendChild(thinkingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Call API
            const response = await callChatGPT(userPrompt);
            
            // Remove thinking message
            chatMessages.removeChild(thinkingDiv);
            
            if (response.success) {
                const botResponse = response.data.choices[0].message.content;
                const feedbackType = analyzeFeedbackType(botResponse);
                const score = extractScore(botResponse);
                
                // Add bot response to chat
                addMessage(botResponse, false, wrappedPrompt, feedbackType, score);
            } else {
                // Handle error
                addMessage("Sorry, I couldn't process your prompt. Please try again.", false);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage("Sorry, an error occurred. Please try again.", false);
        } finally {
            // Re-enable send button
            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Send <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
        }
    }
    
    // Send button click event
    sendBtn.addEventListener('click', sendMessage);
    
    // Enter key event for chat input
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}); 