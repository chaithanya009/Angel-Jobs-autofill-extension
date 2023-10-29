// (() => {
//   const fetchText = () => {
//     const element = document.getElementsByClassName("ReactModalPortal");
//     const elementWithClassName = element[element.length - 1];
//     const Company_Name = elementWithClassName?.getElementsByTagName("a")[0]?.innerHTML;
//     const My_Name = elementWithClassName?.getElementsByTagName("h4")[1]?.innerHTML;
//     const Role = elementWithClassName
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
      const paths = [
        "/html/body/div[7]",
        "/html/body/div[6]",
        "/html/body/div[5]",
        "/html/body/div[4]",
        "/html/body/div[3]",
      ];
      const className = "ReactModalPortal";
      let elementWithClassName;
      let Company_Name, My_Name, Role;

      for (let path of paths) {
        const element = document.evaluate(
          path,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (
          element &&
          element.classList.contains(className) &&
          element.hasChildNodes()
        ) {
          elementWithClassName = element;

          // First logic
          Company_Name = document.evaluate(
            "div/div/div/div/div[1]/div[2]/h3/a",
            elementWithClassName,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue?.innerHTML;

          My_Name = "name no longer supports type it manually";

          Role = document
            .evaluate(
              "div/div/div/div/div[1]/h4",
              elementWithClassName,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            )
            .singleNodeValue?.innerHTML.replace(/\([^()]*\)/g, "");

          if (Company_Name && Role) {
            return { Company_Name, My_Name, Role };
          }

          // Second logic
          Company_Name = document.evaluate(
            "div/div/div/div/div[2]/div[2]/div[1]/div[1]",
            elementWithClassName,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue?.innerHTML;

          Role = document
            .evaluate(
              "div/div/div/div/div[2]/div[2]/div[2]/div/span[1]",
              elementWithClassName,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            )
            .singleNodeValue?.innerHTML?.replace(/\([^()]*\)/g, "");

          if (Company_Name && Role) {
            return { Company_Name, My_Name, Role };
          }
        }
      }
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
    }, 1000);
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          const textareas = document.querySelectorAll("textarea");
          textareas.forEach((textarea) => {
            if (textarea.id.startsWith("form-input--")) {
              setTimeout(applyDefaultTemplate(textarea), 1000);
            }
          });
        });
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
