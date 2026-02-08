# Script to add motivational-toast.js to student pages

$pages = @(
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
        
        # Check if motivational-toast.js is already added
        if ($content -notmatch "motivational-toast\.js") {
            # Determine the correct path
            $scriptPath = '../assets/dist/motivational-toast.js'
            
            $scriptLine = "`n    <!-- Motivational Messages -->`n    <script src=`"$scriptPath`"></script>"
            
            # Add before </body>
            $content = $content -replace '</body>', "$scriptLine`n</body>"
            
            # Save the file
            Set-Content -Path $page -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✅ Added motivational-toast.js to $page" -ForegroundColor Green
        } else {
            Write-Host "⏭️  Skipped $page (already has motivational-toast.js)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ File not found: $page" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done!" -ForegroundColor Cyan
