document.addEventListener("DOMContentLoaded", function() {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector("#uptime-table tbody");
      tbody.innerHTML = "";
      data.forEach(site => {
        const tr = document.createElement("tr");

        // Site name with link
        const siteNameTd = document.createElement("td");
        const link = document.createElement("a");
        link.href = site.url;
        link.textContent = site.name;
        link.target = "_blank";
        siteNameTd.appendChild(link);
        tr.appendChild(siteNameTd);

        // Status (up/down)
        const statusTd = document.createElement("td");
        statusTd.textContent = site.status;
        tr.appendChild(statusTd);

        // Response time
        const responseTimeTd = document.createElement("td");
        responseTimeTd.textContent = site.responseTime;
        tr.appendChild(responseTimeTd);

        // Last checked datetime (IST)
        const lastCheckedTd = document.createElement("td");
        lastCheckedTd.textContent = site.lastChecked;
        tr.appendChild(lastCheckedTd);

        // Last downtime datetime (IST)
        const lastDownTd = document.createElement("td");
        lastDownTd.textContent = site.lastDown || "N/A";
        tr.appendChild(lastDownTd);

        tbody.appendChild(tr);
      });
    })
    .catch(error => console.error("Error fetching data.json:", error));
});