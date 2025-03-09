document.addEventListener("DOMContentLoaded", function() {
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

        // Response Time
        const responseTimeDiv = document.createElement("div");
        responseTimeDiv.classList.add("response-time");
        responseTimeDiv.textContent = "Response Time: " + site.responseTime;
        card.appendChild(responseTimeDiv);

        // Last Checked (IST)
        const lastCheckedDiv = document.createElement("div");
        lastCheckedDiv.classList.add("last-checked");
        lastCheckedDiv.textContent = "Last Checked (IST): " + site.lastChecked;
        card.appendChild(lastCheckedDiv);

        // Last Down (IST)
        const lastDownDiv = document.createElement("div");
        lastDownDiv.classList.add("last-down");
        lastDownDiv.textContent = "Last Down (IST): " + (site.lastDown || "N/A");
        card.appendChild(lastDownDiv);

        container.appendChild(card);
      });
    })
    .catch(error => console.error("Error fetching data.json:", error));
});