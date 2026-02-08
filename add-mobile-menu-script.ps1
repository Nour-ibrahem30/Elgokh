# Script to add mobile-menu.js to all HTML pages

$pages = @(
    "index.html",
    "public/pages/profile.html",
    "public/pages/videos.html",
    "public/pages/exams.html",
    "public/pages/materials.html",
    "public/pages/notes.html",
    "public/pages/video-player.html",
    "public/pages/exam-player.html"
)

foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw -Encoding UTF8
        
        # Check if mobile-menu.js is already added
        if ($content -notmatch "mobile-menu\.js") {
            # Determine the correct path based on file location
            if ($page -eq "index.html") {
                $scriptPath = 'public/assets/js/mobile-menu.js'
            } else {
                $scriptPath = '../assets/js/mobile-menu.js'
            }
            
            $scriptLine = "`n    <!-- Mobile Menu Script -->`n    <script src=`"$scriptPath`"></script>"
            
            # Add before </body>
            $content = $content -replace '</body>', "$scriptLine`n</body>"
            
            # Save the file
            Set-Content -Path $page -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✅ Added mobile-menu.js to $page" -ForegroundColor Green
        } else {
            Write-Host "⏭️  Skipped $page (already has mobile-menu.js)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ File not found: $page" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done!" -ForegroundColor Cyan
