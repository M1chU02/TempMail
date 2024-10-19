document
  .getElementById("generateEmailBtn")
  .addEventListener("click", generateTempEmail);

let emailAddress = "";
let login = "";
let domain = "";

async function generateTempEmail() {
  const emailDisplay = document.getElementById("emailDisplay");
  const inbox = document.getElementById("inbox");
  inbox.innerHTML = ""; // Clear previous inbox

  try {
    // Generate a temporary email using the 1secmail API
    const emailResponse = await fetch(
      "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1"
    );
    const emails = await emailResponse.json();
    emailAddress = emails[0];

    // Extract the login and domain from the email
    [login, domain] = emailAddress.split("@");

    emailDisplay.innerText = `Your temporary email: ${emailAddress}`;

    // Periodically check for incoming messages
    setInterval(fetchInbox, 5000); // Fetch inbox every 5 seconds
  } catch (error) {
    emailDisplay.innerText = "Error generating email.";
    console.error("Error generating email:", error);
  }
}

async function fetchInbox() {
  try {
    const inboxResponse = await fetch(
      `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`
    );
    const inboxData = await inboxResponse.json();

    const inbox = document.getElementById("inbox");
    inbox.innerHTML = ""; // Clear old inbox messages

    if (inboxData.length === 0) {
      inbox.innerHTML = "<p class='empty-inbox'>Your inbox is empty.</p>";
    } else {
      for (const message of inboxData) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("inbox-item");

        // Fetch the full message content
        const messageResponse = await fetch(
          `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${message.id}`
        );
        const messageData = await messageResponse.json();

        messageElement.innerHTML = `
          <div class="message-header">
            <span class="message-from">${message.from}
            <span class="message-date">${new Date(
              message.date
            ).toLocaleString()}
          </div>
          <div class="message-subject">${message.subject}</div>
          <div class="message-content">${messageData.body}</div>`;
        inbox.appendChild(messageElement);
      }
    }
  } catch (error) {
    console.error("Error fetching inbox:", error);
  }
}

async function fetchMessageDetails(messageId) {
  try {
    const messageResponse = await fetch(
      `https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${messageId}`
    );
    const messageData = await messageResponse.json();

    alert(`Message Content: \n\n${messageData.body}`);
  } catch (error) {
    console.error("Error fetching message details:", error);
  }
}
