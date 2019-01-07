// const {createDeployment, Machine, githubKeys} = require('@quilt/quilt');
const app = require('./app');
const quilt = require('@quilt/quilt');

// Create a new deployment.
// Using unique Namespaces will allow multiple Quilt instances to run on the
// same cloud provider account without conflict.
// Also defines the set of addresses that are allowed to access Quilt VMs.
const deployment = quilt.createDeployment({
    namespace: "tsaianson-nginx"
});

// Setup the infrastructure.
const baseMachine = new quilt.Machine({
    provider: "Amazon",
    size: "m4.large",
    preemptible: true,
    // Replace with your GitHub username to allow logging into machines.
    sshKeys: quilt.githubKeys("TsaiAnson"),
});

// Create a Nginx Docker container
const webTier = new quilt.Container('web_tier', 'mchang6137/nginx_factorial:latest');

quilt.publicInternet.allowFrom(webTier, 80);
webTier.allowFrom(quilt.publicInternet, 80);
webTier.allowFrom(quilt.publicInternet, 443);
webTier.allowFrom(quilt.publicInternet, 53);
webTier.allowFrom(quilt.publicInternet, 8080);
webTier.allowFrom(quilt.publicInternet, 8081);
webTier.allowFrom(quilt.publicInternet, 4040);

quilt.publicInternet.allowFrom(webTier, 8080);
quilt.publicInternet.allowFrom(webTier, 8081);
quilt.publicInternet.allowFrom(webTier, 80);
quilt.publicInternet.allowFrom(webTier, 53);
quilt.publicInternet.allowFrom(webTier, 443);
quilt.publicInternet.allowFrom(webTier, 4040);

// Create Master and Worker Machines.
deployment.deploy(baseMachine.asMaster())
deployment.deploy(baseMachine.asWorker());

deployment.deploy(webTier);
