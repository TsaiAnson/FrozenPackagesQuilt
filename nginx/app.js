var image = "nginx:1.10"

exports.New = function(port) {
    port = port || 80;
    if (typeof port !== 'number') {
        throw new Error("port must be a number");
    }

    // Create a Nginx Docker container, encapsulating it within the service "web_tier".
    var webTier = new Service("web_tier", [
            new Container(image).withFiles({
                "/etc/nginx/conf.d/default.conf": buildConfig(port),
            })
    ]);
    publicInternet.connect(port, webTier);

    return webTier;
}

function buildConfig(port) {
    var template = read("./default.tmpl");
    return applyTemplate(template, {"port": port});
}

// applyTemplate replaces the keys defined by `vars` with their corresponding
// values in `template`. A variable is denoted in the template using {{key}}.
function applyTemplate(template, vars) {
    for (k in vars) {
        template = template.replace("{{"+k+"}}", vars[k]);
    }
    return template;
}