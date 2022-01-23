/* eslint-disable no-undef */
(function(window){
  window.utils = window.utils || {};
  const utils = window.utils;

  utils.requestMarkdownPreview = async (markdown) => {
    try {
      const response = await fetch("/markdown-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({markdown})
      })

      const json = await response.json();
      
      return json.html;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
})(window)
