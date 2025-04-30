// TypeScript implementation for the chatbot
import 'emoji-mart';

// Declare the EmojiMart global namespace for TypeScript
declare global {
  interface Window {
    EmojiMart: {
      Picker: new (options: any) => any;
    };
  }
}

// Define interfaces for our data structures
interface UserData {
  message: string | null;
  file: {
    data: string | null;
    mime_type: string | null;
  };
}

interface ChatHistoryItem {
  role: string;
  parts: { text: string }[];
}

// Define API constants that don't depend on DOM elements
const API_KEY = 'AIzaSyCxMm-De978GPOJYH381pMzM41-GPUwBxg';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Initialize variables that will be set after DOM is loaded
let messageInput: HTMLTextAreaElement;
let chatBody: HTMLDivElement;
let sendMessageButton: HTMLButtonElement;
let fileInput: HTMLInputElement;
let fileUploadWrapper: HTMLDivElement;
let fileCancelButton: HTMLButtonElement;
let chatbotToggler: HTMLButtonElement;
let closeChatbot: HTMLButtonElement;
let emojiPickerButton: HTMLButtonElement;
let initialInputHeight: number;

const userData: UserData = {
  message: null,
  file: {
    data: null,
    mime_type: null
  }
};

const chatHistory: ChatHistoryItem[] = [];

const createMessageElement = (content: string, ...classes: string[]): HTMLDivElement => {
  const div = document.createElement('div');
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const generateBotResponse = async (incomingMessageDiv: HTMLDivElement): Promise<void> => {
  const messageElement = incomingMessageDiv.querySelector(".message-text") as HTMLDivElement;
  
  chatHistory.push({
    role: "user",
    parts: [{ text: userData.message || "User sent an image" }]
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: chatHistory.map(item => ({
        role: item.role,
        parts: item.parts
      }))
    })
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error?.message || "API request failed");

    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();

    messageElement.innerText = apiResponseText;

    chatHistory.push({
      role: "model",
      parts: [{ text: apiResponseText }]
    });

  } catch (error: any) {
    console.error("API Error:", error);
    messageElement.innerText = `Sorry, I couldn't process your request: ${error.message}`;
    messageElement.style.color = "#ff0000";
  } finally {
    userData.file = { data: null, mime_type: null };
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: "smooth"
    });
  }
};

const handleOutgoingMessage = (e: Event): void => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  
  if (!userData.message && !userData.file.data) return;

  const messageContent = `
    ${userData.message ? `<div class="message-text">${userData.message}</div>` : ''}
    ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>` : ""}
  `;

  const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
  chatBody.appendChild(outgoingMessageDiv);

  messageInput.value = "";
  fileUploadWrapper.classList.remove("file-uploaded");
  const previewImage = fileUploadWrapper.querySelector("img") as HTMLImageElement;
  if (previewImage) previewImage.src = "#";
  messageInput.dispatchEvent(new Event("input"));
  sendMessageButton.style.display = "none"; // Hide button after sending

  chatBody.scrollTo({
    top: chatBody.scrollHeight,
    behavior: "smooth"
  });

  setTimeout(() => {
    const botMessageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
      <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
    </svg>
    <div class="message-text">
      <div class="thinking-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>`;

    const incomingMessageDiv = createMessageElement(botMessageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);

    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: "smooth"
    });

    generateBotResponse(incomingMessageDiv);
  }, 600);
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements after the document is loaded
  messageInput = document.querySelector('.message-input') as HTMLTextAreaElement;
  chatBody = document.querySelector('.chat-body') as HTMLDivElement;
  sendMessageButton = document.querySelector("#send-message") as HTMLButtonElement;
  fileInput = document.querySelector("#file-input") as HTMLInputElement;
  fileUploadWrapper = document.querySelector(".file-upload-wrapper") as HTMLDivElement;
  fileCancelButton = document.querySelector(".file-cancel") as HTMLButtonElement;
  chatbotToggler = document.querySelector("#chatbot-toggler") as HTMLButtonElement;
  closeChatbot = document.querySelector("#close-chatbot") as HTMLButtonElement;
  emojiPickerButton = document.querySelector("#emoji-picker") as HTMLButtonElement;
  
  // Initialize height after elements are available
  if (messageInput) {
    initialInputHeight = messageInput.scrollHeight;
  }

  // Check if all required elements are found
  if (!messageInput || !chatBody || !sendMessageButton || !fileInput || 
      !fileUploadWrapper || !fileCancelButton || !chatbotToggler || 
      !emojiPickerButton) {
    console.error('Required DOM elements not found');
    return;
  }

  messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    const chatForm = document.querySelector(".chat-form") as HTMLFormElement;
    if (chatForm) {
      chatForm.style.borderRadius = 
        messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
    }
    
    // Show send button when typing or if there's a file
    const hasContent = messageInput.value.trim().length > 0 || userData.file.data !== null;
    sendMessageButton.style.display = hasContent ? "flex" : "none";
  });

  messageInput.addEventListener("keydown", (e: KeyboardEvent) => {
    const userMessage = (e.target as HTMLTextAreaElement).value.trim();
    if (e.key === "Enter" && (userMessage || userData.file.data) && !e.shiftKey && window.innerWidth > 768) {
      handleOutgoingMessage(e);
    }
  });

  fileInput.addEventListener("change", () => {
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imgElement = fileUploadWrapper.querySelector("img") as HTMLImageElement;
      if (imgElement && e.target && typeof e.target.result === 'string') {
        imgElement.src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
        userData.file = {
          data: base64String,
          mime_type: file.type
        };
        fileInput.value = "";
        sendMessageButton.style.display = "flex"; // Show button when file is selected
      } else {
        console.error("Image element not found in file-upload-wrapper or invalid data");
      }
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    
    reader.readAsDataURL(file);
  });

  fileCancelButton.addEventListener("click", () => {
    userData.file = { data: null, mime_type: null };
    fileUploadWrapper.classList.remove("file-uploaded");
    const imgElement = fileUploadWrapper.querySelector("img") as HTMLImageElement;
    if (imgElement) imgElement.src = "#";
    sendMessageButton.style.display = messageInput.value.trim() ? "flex" : "none"; // Update button visibility
  });

  try {
    // Initialize emoji picker
    const picker = new window.EmojiMart.Picker({
      theme: 'light',
      skinTonePosition: 'none',
      previewPosition: 'none',
      onEmojiSelect: (emoji: { native: string }) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        if (start !== null && end !== null) {
          messageInput.setRangeText(emoji.native, start, end, "end");
          messageInput.focus();
        }
      }
    });

    emojiPickerButton.addEventListener("click", () => {
      document.body.classList.toggle("show-emoji-picker");
    });

    const chatFooter = document.querySelector(".chat-footer");
    if (chatFooter && picker) {
      chatFooter.appendChild(picker);
    }
  } catch (error) {
    console.error("Error initializing emoji picker:", error);
  }

  sendMessageButton.addEventListener("click", handleOutgoingMessage);
  
  const fileUploadButton = document.querySelector("#file-upload");
  if (fileUploadButton) {
    fileUploadButton.addEventListener("click", () => fileInput.click());
  }

  // Ensure send button is hidden when chatbot opens
  chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
    sendMessageButton.style.display = "none"; // Explicitly hide button when chatbot opens
  });

  const closeChatbotButton = document.querySelector("#close-chatbot");
  if (closeChatbotButton) {
    closeChatbotButton.addEventListener("click", () => 
      document.body.classList.remove("show-chatbot")
    );
  }

  // Initially hide the send button when the script loads
  sendMessageButton.style.display = "none";
});

