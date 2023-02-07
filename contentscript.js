var visit_url = "";
localStorage["toolbarDisplay"] = "on";
// MutationObserver configuration data: Listen for "childList" mutations in the specified element and its descendants
var SERP = {
  AMP_results: 0,
  Answers: 0,
  Events: 0,
};
var display = false;
var passingObject = [];
var config = {
  childList: true,
  subtree: true,
  attributes: true,
};

var eventsDataObj = {};
var answerDataObj = {};
var ampDataObj = {};

var regex = /<a.*?>[^<]*<\/a>/;
// Traverse 'rootNode' and its descendants and modify '<a>' tags
function modifyLinks(rootNode) {
  var nodes = [rootNode];
  var replace = "";
  while (nodes.length > 0) {
    var node = nodes.shift();

    // EVENT START
    if (node.tagName == "DIV" && node.className == "rl_feature") {
      var elems = document.getElementsByTagName("*");
      elems = Array.from(elems);
      var order = [];
      elems.forEach(function (n, idx) {
        if (n.tagName == "DIV" && n.className == "rl_feature") {
          order.push(idx);
        }
      });
      eventsDataObj = {
        order: order,
        SERF: "Events",
        device: "Desktop",
        pDomClass: document.querySelector(".rl_feature").parentElement
          .className,
        cDomClass: ".rl_feature",
        total: document.querySelectorAll(".rl_feature").length,
      };

      replace =
        '<div class="ob-search-store-logo" style="float:left;margin-left: 14%;height: 19px;">\r\n  <img src=\'' +
        chrome.extension.getURL("images/tick0.png") +
        "' width='20' height='20' > </div>";
      replace +=
        '<div class="ob-search-cashback-text" style="float:left;margin-left: 14px;margin-right: 14%;color: #f43632 !important;font-size: 15px;">Events</div><br/>\r\n';
      replace += node.innerHTML;
      node.innerHTML = replace;
    } else {
      // If the current node has children, queue them for further processing, ignoring any '<script>' tags.
      [].slice.call(node.children).forEach(function (childNode) {
        if (childNode.tagName != "SCRIPT") {
          nodes.push(childNode);
        }
      });
    }
    // EVENT END

    // ANSWER BOX START
    if (
      node.tagName == "DIV" &&
      node.className == "kp-blk cUnQKe Wnoohf OJXvsb"
    ) {
      var order = [];
      var elems = document.getElementsByTagName("*");
      elems = Array.from(elems);
      var idx = elems.findIndex(function (n) {
        return (
          n.tagName == "DIV" && n.className == "kp-blk cUnQKe Wnoohf OJXvsb"
        );
      });
      order.push(idx);

      answerDataObj = {
        order: order,
        SERF: "Answer box",
        device: "Desktop",
        pDomClass: document.querySelector(".kp-blk.cUnQKe.Wnoohf.OJXvsb")
          .parentElement.className,
        cDomClass: ".kp-blk .cUnQKe .Wnoohf .OJXvsb",
        total: document.querySelectorAll(".kp-blk.cUnQKe.Wnoohf.OJXvsb").length,
      };

      replace =
        '<div class="ob-search-store-logo" style="float:left;margin-right: 10px;height: 19px;">\r\n  <img src=\'' +
        chrome.extension.getURL("images/tick0.png") +
        "' width='20' height='20' > </div>";
      replace +=
        '<div class="ob-search-cashback-text" style="float:left;color: #f43632 !important;font-size: 15px;">ANSWER BOX</div><br/>\r\n';
      replace += node.innerHTML;
      node.innerHTML = replace;
    }
    // ANSWER BOX END

    // AMP start
    if (node.className == "ZseVEf QzoJOb") {
      var elems = document.getElementsByTagName("*");
      elems = Array.from(elems);
      var order = [];
      elems.forEach(function (n, idx) {
        if (n.className == "ZseVEf QzoJOb") {
          order.push(idx);
        }
      });
      ampDataObj = {
        order: order,
        SERF: "AMP result",
        device: "Desktop",
        pDomClass: document.querySelector(".ZseVEf.QzoJOb").parentElement
          .className,
        cDomClass: ".ZseVEf .QzoJOb",
        total: document.querySelectorAll(".ZseVEf.QzoJOb").length,
      };

      replace =
        '<div class="ob-search-store-logo" style="float:left;margin-right: 10px;height: 19px;">\r\n  <img src=\'' +
        chrome.extension.getURL("images/tick0.png") +
        "' width='20' height='20' > </div>";
      replace +=
        '<div class="ob-search-cashback-text" style="float:left;color: #f43632 !important;font-size: 15px;">Events</div><br/>\r\n';
      replace += node.innerHTML;
      node.innerHTML = replace;
    }
  }
  // AMP end
  display = true;
}
// Observer1: Looks for 'div.search'
var observer1 = new MutationObserver(function (mutations) {
  // For each MutationRecord in 'mutations'...
  mutations.some(function (mutation) {
    // ...if nodes have beed added...
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // ...look for 'div#search'
      var node = mutation.target.querySelector("div#cnt");
      if (node) {
        // 'div#search' found; stop observer 1 and start observer 2
        observer1.disconnect();
        observer2.observe(node, config);
        if (regex.test(node.innerHTML)) {
          // Modify any '<a>' elements already in the current node
          modifyLinks(node);
        }
        return true;
      }
    }
  });
});
// Observer2: Listens for '<a>' elements insertion
var observer2 = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.addedNodes) {
      [].slice.call(mutation.addedNodes).forEach(function (node) {
        // If 'node' or any of its desctants are '<a>'...
        if (regex.test(node.outerHTML)) {
          // ...do something with them
          modifyLinks(node);
        }
      });
    }
  });
});

/* Start observing 'body' for 'div#search' */
observer1.observe(document.body, config);
setInterval(function () {
  if (display == true) {
    if (
      typeof eventsDataObj != "undefined" &&
      Object.keys(eventsDataObj).length > 0
    ) {
      passingObject.push(eventsDataObj);
    }

    if (
      typeof answerDataObj != "undefined" &&
      Object.keys(answerDataObj).length > 0
    ) {
      passingObject.push(answerDataObj);
    }

    if (
      typeof ampDataObj != "undefined" &&
      Object.keys(ampDataObj).length > 0
    ) {
      passingObject.push(ampDataObj);
    }

    chrome.runtime.sendMessage({type: "showData", data: passingObject});
    display = false;
  }
}, 2000);

