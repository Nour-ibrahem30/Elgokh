# Script to add responsive.css to all HTML pages

$pages = @(
    "public/pages/profile.html",
    "public/pages/videos.html",
    "public/pages/exams.html",
    "public/pages/materials.html",
    "public/pages/notes.html",
    "public/pages/video-player.html",
    "public/pages/exam-player.html",
    "public/pages/login.html"
)

$responsiveLine = '    <link rel="stylesheet" href="../assets/css/responsive.css">'

foreach ($page in $pages) {
    if (Test-Path $page) {
        $content = Get-Content $page -Raw -Encoding UTF8
        
        # Check if responsive.css is already added
        if ($content -notmatch "responsive\.css") {
            # Find the last CSS link and add responsive.css after it
            $content = $content -replace '(<link rel="stylesheet"[^>]+>)(?![\s\S]*<link rel="stylesheet")', "`$1`n$responsiveLine"
            
            # Save the file
            Set-Content -Path $page -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✅ Added responsive.css to $page" -ForegroundColor Green
        } else {
            Write-Host "⏭️  Skipped $page (already has responsive.css)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ File not found: $page" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done!" -ForegroundColor Cyan
