// (() => {
//   const fetchText = () => {
//     const element = document.getElementsByClassName("ReactModalPortal");
//     const lastElement = element[element.length - 1];
//     const Company_Name = lastElement?.getElementsByTagName("a")[0]?.innerHTML;
//     const My_Name = lastElement?.getElementsByTagName("h4")[1]?.innerHTML;
//     const Role = lastElement
//       ?.getElementsByTagName("h4")[0]
//       ?.innerHTML?.replace(/\([^()]*\)/g, "");
//     return { Company_Name, My_Name, Role };
//   };
// const setText=() => {
//   const { Company_Name, My_Name, Role } = fetchText();
//   chrome.storage.sync.get(["default_template"], (items) => {
//     document.getElementById("form-input--userNote").value +=
//       items.default_template.value
//         .replaceAll("{name}", My_Name)
//         .replaceAll("{role}", Role)
//         .replaceAll("{company}", Company_Name);
//   });
// }
// setText()
//   chrome.runtime.onMessage.addListener(function (request) {
//     if (request.type === "TEXT") {
//       setTimeout(setText(), 700);
//     }
//   });
// })();


(() => {
  function applyDefaultTemplate(textarea) {
    if (textarea.getAttribute("data-default-applied")) {
      return; // Default template has already been applied
    }
    const fetchText = () => {
      const element = document.getElementsByClassName("ReactModalPortal");
      const lastElement = element[element.length - 1];
      const Company_Name = lastElement?.getElementsByTagName("a")[0]?.innerHTML;
      const My_Name = lastElement?.getElementsByTagName("h4")[1]?.innerHTML;
      const Role = lastElement
        ?.getElementsByTagName("h4")[0]
        ?.innerHTML?.replace(/\([^()]*\)/g, "");
      return { Company_Name, My_Name, Role };
    };
    setTimeout(() => {
      const { Company_Name, My_Name, Role } = fetchText();
      chrome.storage.sync.get(["default_template"], (items) => {
        textarea.value = textarea.innerHTML = items.default_template.value
          .replaceAll("{name}", My_Name)
          .replaceAll("{role}", Role)
          .replaceAll("{company}", Company_Name);
        textarea.setAttribute("data-default-applied", true); // Mark as default applied
      });
    }, 500);
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if(document.querySelector("textarea#form-input--userNote")){
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
         
            const textarea = document.querySelector("textarea#form-input--userNote");
            // if(textarea.innerText==='')
            setTimeout(applyDefaultTemplate(textarea),500)
          
        });
      }
    }
    });
 
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();

window.addEventListener("beforeunload", (event) => {
  observer.disconnect();
  event.preventDefault();
  event.returnValue = ""; // This is required for some browsers
});
