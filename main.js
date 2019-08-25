const http = require("http");
const fs = require("fs");


const port = process.env.PORT || 8080;

function route_html(request, response, filename) {
  fs.readFile(`templates/${filename}`, function (error, data) {
    if (error) {
      route_500(request, response, error);
      return;
    }

    response.writeHead(200, {"Content-type" : "text/html"});
    response.write(data);
    response.end();
    console.log(`Responded to: '${request.url}' 200`);
  });
};

function route_css(request, response, filename) {
  fs.readFile(`static/styles/${filename}`, function (error, data) {
    if (error) {
      route_404(request, response, error);
      return;
    }

    response.writeHead(200, {"Content-type" : "text/css"});
    response.write(data);
    response.end();
    console.log(`Responded to: '${request.url}' 200`);
  });
};

function route_script(request, response, filename) {
  fs.readFile(`static/scripts/${filename}`, function (error, data) {
    if (error) {
      route_404(request, response, error);
      return;
    }

    response.writeHead(200, {"Content-type" : "application/javascript"});
    response.write(data);
    response.end();
    console.log(`Responded to: '${request.url}' 200`);
  });
};

function route_image(request, response, name) {
  fs.readFile(`static/images/${name}`, function (error, data) {
    if (error) {
      route_404(request, response, error);
      return;
    }

    if (name.split(".")[1] == "jpg") {
      response.writeHead(200, {"Content-type" : "image/jpeg"});
    }
    else if (name.split(".")[1] == "png") {
      response.writeHead(200, {"Content-type" : "image/png"});
    }

    response.write(data);
    response.end();
    console.log(`Responded to: '${request.url}' 200`)
  });
};

function route_svg(request, response, name) {
  fs.readFile(`static/icons/${name}`, function (error, data) {
    if (error) {
      route_404(request, response, error);
      return;
    }

    response.writeHead(200, {"Content-type" : "image/svg+xml"});
    response.write(data);
    response.end();
    console.log(`Responded to: '${request.url}' 200`)
  });
};

function route_font(request, response, name) {
  fs.readFile(`static/fonts/${name}`, function (error, data) {
    if (error) {
      route_404(request, response, error);
      return;
    }

    response.writeHead(200, {"Content-type" : "application/octet-stream"});
    response.write(data);
    response.end();
    console.log(`Responded to: '${request.url}' 200`);
  });
};

function route_download(request, response, operating_sys) {
  fs.readFile(`game/${operating_sys}/game.zip`, function (error, data) {
    if (error) {
      route_404(request, response, error);
      return;
    }

    response.writeHead(200, {"Content-type" : "application/zip"});
    response.write(data);
    response.end();
    console.log(`Responded to: '${request.url}' 200`);
  });
};

function route_404(request, response, error) {
  response.writeHead(404, {"Content-type" : "text/plain"});
  response.write("Not found");
  response.end();
  console.log(`Responded to: '${request.url}' Error: ${error} 404`);
};

function route_500(request, response, error) {
  response.writeHead(500);
  response.write("Internal server error");
  response.end();
  console.log(`Responded to: '${request.url}' Error: ${error} 500`);
};


console.log(`Server is runing on: ${port}`)

const server = http.createServer((request, response) => {
  let url = request.url;
  let path = url.split("/");


  if (url == "/") {
    route_html(request, response, "index.html");
  }

  else if (url == "/snake") {
    route_html(request, response, "snake.html");
  }

  else if (path[1] == "styles") {
    route_css(request, response, path[2]);
  }

  else if (path[1] == "scripts") {
    route_script(request, response, path[2]);
  }

  else if (path[1] == "image") {
    route_image(request, response, path[2]);
  }

  else if (path[1] == "svg") {
    route_svg(request, response, path[2]);
  }

  else if (path[1] == "fonts") {
    route_font(request, response, path[2]);
  }

  else if (path[1] == "download") {
    route_download(request, response, path[2])
  }

  else {
    route_404(request, response, "Unknown URL");
  }
});

server.listen(port);
