param (
    [Parameter(Mandatory = $false)]
    [PSCredential] $Cred = (Get-Credential)
)

@{
    user = $Cred.UserName
    pass = $Cred.Password | ConvertFrom-SecureString
} | ConvertTo-Json -Compress