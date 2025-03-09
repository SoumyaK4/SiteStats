document.addEventListener("DOMContentLoaded", function() {
  // Helper function to format dates as dd/mm/yy, HH:MM:SS
  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  }

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("cards-container");
      container.innerHTML = "";
      data.forEach(site => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Site Name with Link
        const siteName = document.createElement("h2");
        const link = document.createElement("a");
        link.href = site.url;
        link.textContent = site.name;
        link.target = "_blank";
        siteName.appendChild(link);
        card.appendChild(siteName);

        // Status with Emoji and Color
        const statusDiv = document.createElement("div");
        statusDiv.classList.add("status");
        let statusText, statusClass;
        if (site.status === "up") {
          statusText = "👍 Up";
          statusClass = "status-up";
        } else if (site.status === "slow") {
          statusText = "⚠️ Slow";
          statusClass = "status-slow";
        } else if (site.status === "down") {
          statusText = "👎 Down";
          statusClass = "status-down";
        }
        statusDiv.textContent = statusText;
        statusDiv.classList.add(statusClass);
        card.appendChild(statusDiv);

        // Optional: Description field (if exists)
        if (site.description) {
          const descriptionDiv = document.createElement("div");
          descriptionDiv.classList.add("description");
          descriptionDiv.textContent = "Description: " + site.description;
          card.appendChild(descriptionDiv);
        }

        // Response Time
        const responseTimeDiv = document.createElement("div");
        responseTimeDiv.classList.add("response-time");
        responseTimeDiv.textContent = "Response Time: " + site.responseTime;
        card.appendChild(responseTimeDiv);

        // Last Checked (IST) with formatted date and time
        const lastCheckedDiv = document.createElement("div");
        lastCheckedDiv.classList.add("last-checked");
        lastCheckedDiv.textContent = "Last Checked (IST): " + formatDate(site.lastChecked);
        card.appendChild(lastCheckedDiv);

        // Last Down (IST) with formatted date and time
        const lastDownDiv = document.createElement("div");
        lastDownDiv.classList.add("last-down");
        lastDownDiv.textContent = "Last Down (IST): " + (site.lastDown ? formatDate(site.lastDown) : "N/A");
        card.appendChild(lastDownDiv);

        container.appendChild(card);
      });
    })
    .catch(error => console.error("Error fetching data.json:", error));
});
