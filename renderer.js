// Require Dependencies
const $ = require('jquery');
const powershell = require('node-powershell');

// Testing PowerShell
$(document).ready(() => {

    // Create the PS Instance
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    // Load the gun
    ps.addCommand("./Test-Power", [
        { GigaWatts: 1.0 }
    ])

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log(output)
        console.log(JSON.parse(output))
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })

})