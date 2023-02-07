/* Tabs Script*/
jQuery(function () {

  chrome.runtime.getBackgroundPage(function (backgroundPage) {
    var x = JSON.parse(backgroundPage.jsonData);
    if (x.length > 0) {
        var result = "";
        x.forEach((value, index, array) => {
          result += `<tr><td>${value.order.join(", ")}</td>
                  <td>${value.SERF}</td>
                  <td>${value.device}</td>
                  <td>${value.pDomClass}</td>
                  <td>${value.cDomClass}</td>
                  <td>${value.total}</td></tr>`;
        });
      }
      document.querySelector("#tableBody").innerHTML = result;
  });

});

