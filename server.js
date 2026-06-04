<div class="search-container" style="max-width: 600px; margin: 20px auto; font-family: sans-serif;">
  <input 
    type="text" 
    id="cloudboxQuery" 
    placeholder="Scan Cloudbox storage nodes..." 
    style="width: 100%; padding: 12px; border: 2px solid #0052cc; border-radius: 6px; font-size: 16px;"
  >
  <button 
    onclick="triggerCloudboxSearch()" 
    style="margin-top: 10px; width: 100%; padding: 12px; background: #0052cc; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;"
  >
    Execute Semantic Search
  </button>
  
  <div id="searchResultsDisplay" style="margin-top: 20px;"></div>
</div>

<script>
async function triggerCloudboxSearch() {
  const queryToken = document.getElementById('cloudboxQuery').value;
  const displayArea = document.getElementById('searchResultsDisplay');
  
  if (!queryToken.trim()) {
    displayArea.innerHTML = "<p style='color: red;'>Please enter a search term.</p>";
    return;
  }
  
  displayArea.innerHTML = "<p style='color: #666;'>Scanning local storage clusters...</p>";
  
  try {
    // Hits your Express backend broker running on port 5000
    const response = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryToken, limit: 5 })
    });
    
    const data = await response.json();
    
    if (data.success && data.count > 0) {
      displayArea.innerHTML = data.results.map(item => `
        <div style="background: #f4f5f7; padding: 12px; margin-bottom: 8px; border-radius: 4px; border-left: 4px solid #0052cc;">
          <strong>${item.fileName || 'Indexed Object'}</strong>
          <p style="margin: 4px 0 0; font-size: 14px; color: #333;">${item.snippet || 'No preview summary available.'}</p>
        </div>
      `).join('');
    } else {
      displayArea.innerHTML = "<p>No matches located across active Cloudbox clusters.</p>";
    }
  } catch (err) {
    displayArea.innerHTML = "<p style='color: red;'>Error connecting to backend engine. Ensure localhost:5000 is active.</p>";
  }
}
</script>