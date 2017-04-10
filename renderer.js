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
    ps.addCommand("Get-Process -Name electron")

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log(output)
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })

})