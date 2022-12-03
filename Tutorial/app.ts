const param = new URLSearchParams(window.location.search);

let output = document.getElementById("output")!;

output.innerHTML = param.get("x")!;
