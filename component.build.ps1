task AfterSetVetsion -After SetVersion {
    Set-BowerVersion -Path . -Version $Version
}