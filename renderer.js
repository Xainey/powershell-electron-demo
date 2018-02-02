// Require Dependencies
const $ = require('jquery');
const powershell = require('node-powershell');
const dt = require('datatables.net')();
const dtbs = require('datatables.net-bs4')(window, $);

// Get Global Variables
let remote = require('electron').remote;

// Helper to wrap a string in quotes
String.prototype.wrap = function () {
    return `'${this}'`;
}

$('#changeUser').click(() => {
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    let scriptPath = require("path").resolve(__dirname, './Convert-CredToJson.ps1')
    ps.addCommand(scriptPath, [])
    ps.invoke()
    .then(output => {
        console.log(output)
        // Set the global Variable
        remote.getGlobal('sharedObj').cred = JSON.parse(output)
        // Read the global variable
        console.log(remote.getGlobal('sharedObj').cred)
    })
    .catch(err => {
        console.dir(err);
        ps.dispose();
    })
})

$("#getDisk").click(() => {
    // Get the form input
    let computer = $('#computerName').val() || 'localhost'

    // Clear the Error Messages
    $('.alert-danger .message').html("")
    $('.alert-danger').hide()

    // Create the PS Instance
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    let commands = [{ ComputerName: computer.wrap() }]
    let cred = remote.getGlobal('sharedObj').cred

    // If global cred exists, seralize and push it to commands
    if (cred)
        commands.push({ JsonUser: JSON.stringify(cred).wrap() })

    // Load the gun
    let scriptPath = require("path").resolve(__dirname, './Get-Drives.ps1')
    ps.addCommand(scriptPath, commands)

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log(output)
        let data = JSON.parse(output)
        console.log(data)

        // In case when we get single object for one drive
        if (!(Array.isArray(data))) {
            data = [data]
        }

        // Catch Custom Errors
        if (data.Error) {
            $('.alert-danger .message').html(data.Error.Message)
            $('.alert-danger').show()
            return
        }

        // generate DataTables columns dynamically
        let columns = [];
        Object.keys(data[0]).forEach( key => columns.push({ title: key, data: key }) )
        console.log(columns)

        $('#output').DataTable({
            data: data,
            columns: columns,
            paging: false,
            searching: false,
            info: false,
            destroy: true  // or retrieve
        });
    })
    .catch(err => {
        console.error(err)
        $('.alert-danger .message').html(err)
        $('.alert-danger').show()
        ps.dispose()
    })

})