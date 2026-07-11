$content = Get-Content -Raw "index.html" -Encoding UTF8

# Remove inline styles inside curso-card elements
$content = $content -replace ' style="margin-top: auto; border-top: 1px solid rgba\(0,0,0,0\.1\); padding-top: 1rem;"', ''
$content = $content -replace ' style="list-style: none; padding: 0; margin: 0 0 1rem 0; color: rgba\(0,0,0,0\.7\); line-height: 1\.6;"', ' class="curso-features-list"'
$content = $content -replace ' style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba\(0,0,0,0\.1\); padding-bottom: 0\.4rem; margin-bottom: 0\.4rem; font-size: 14px;"', ' class="curso-feature-item"'
$content = $content -replace ' style="display: flex; justify-content: space-between; font-size: 14px;"', ' class="curso-feature-item"'
$content = $content -replace ' style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0\.5rem;"', ' class="curso-price-wrapper"'

# Testimonios section
$content = $content -replace ' style="translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1;"', ''
$content = $content -replace ' style="margin: 24px 0 0 0;"', ''

# Replace hero inline styles not caught by python
$content = $content -replace ' style="translate: none; rotate: none; scale: none; transform: translate\(0px, 0px\); opacity: 1;"', ''

Set-Content -Path "index.html" -Value $content -Encoding UTF8
Write-Output "Done"
