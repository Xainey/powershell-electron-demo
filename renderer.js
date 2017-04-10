// Require Dependencies
const $ = require('jquery');
const powershell = require('node-powershell');

// Testing PowerShell
$("#getDisk").click(() => {
    // Get the form input
    let computer = $('#computerName').val() || 'localhost'

    // Create the PS Instance
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    // Load the gun
    ps.addCommand("./Get-Drives", [
        { ComputerName: computer }
    ])

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log(output)
        console.log(JSON.parse(output))
        $('#output').html(output)
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })

})