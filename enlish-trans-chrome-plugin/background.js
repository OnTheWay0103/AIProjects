chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'translate') {
    const params = new URLSearchParams(request.params);
    
    fetch(`https://openapi.youdao.com/api?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ success: true, data: data });
    })
    .catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    
    return true; // 保持消息通道打开
  }
});
