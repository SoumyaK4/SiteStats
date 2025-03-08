#!/usr/bin/env python3
import json
import requests
from datetime import datetime
import pytz
import os

# Constants and configuration
SITES_FILE = "sites.json"
HTML_FILE = "index.html"
TIMEZONE = "Asia/Kolkata"
IST = pytz.timezone(TIMEZONE)

def load_sites():
    with open(SITES_FILE, "r") as f:
        return json.load(f)

def save_sites(sites):
    with open(SITES_FILE, "w") as f:
        json.dump(sites, f, indent=2)

def check_site(site):
    """Returns a tuple: (status, response_time in ms, current_check_time (IST))"""
    check_time = datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S")
    try:
        response = requests.get(site["url"], timeout=10)
        response_time = int(response.elapsed.total_seconds() * 1000)
        # Assume status 200 is "up"
        if response.status_code == 200:
            return ("up", response_time, check_time)
        else:
            return ("down", response_time, check_time)
    except requests.RequestException:
        # In case of timeout or error, mark as down
        return ("down", "N/A", check_time)

def generate_table_rows(sites, results):
    """Generate HTML rows for each site."""
    rows = ""
    for site, result in zip(sites, results):
        status, response_time, last_checked = result
        # Update last_down if the site is down; otherwise, keep previous value.
        if status == "down":
            site["last_down"] = last_checked
        last_down = site.get("last_down", "N/A") or "N/A"
        status_html = f'<span class="{status}">{status.upper()}</span>'
        row = f"""
        <tr>
          <td><a href="{site['url']}" target="_blank">{site['name']}</a></td>
          <td>{status_html}</td>
          <td>{response_time}</td>
          <td>{last_checked}</td>
          <td>{last_down}</td>
        </tr>
        """
        rows += row
    return rows

def update_html(table_rows):
    """Update the index.html by replacing the tbody content."""
    # Read the existing HTML content
    with open(HTML_FILE, "r") as f:
        html_content = f.read()
    # Replace content inside <tbody id="uptime-data">...</tbody>
    start_tag = '<tbody id="uptime-data">'
    end_tag = '</tbody>'
    start_index = html_content.find(start_tag)
    if start_index == -1:
        print("Cannot find the tbody tag to update.")
        return
    start_index += len(start_tag)
    end_index = html_content.find(end_tag, start_index)
    new_html = html_content[:start_index] + "\n" + table_rows + "\n" + html_content[end_index:]
    with open(HTML_FILE, "w") as f:
        f.write(new_html)

def main():
    sites = load_sites()
    results = []
    for site in sites:
        result = check_site(site)
        results.append(result)
    table_rows = generate_table_rows(sites, results)
    update_html(table_rows)
    save_sites(sites)
    print("Uptime dashboard updated.")

if __name__ == "__main__":
    main()
