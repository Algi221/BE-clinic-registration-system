@echo off
echo Starting database setup...
echo Running Prisma DB Push...
npx prisma db push
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to connect to the database.
    echo Please ensure your MySQL server (XAMPP/Laragon) is running on port 3306.
    echo Check your .env file in the "be" directory.
    pause
    exit /b %errorlevel%
)
echo.
echo Running Database Seed...
npm run seed
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Seeding failed.
    echo Please check the error message above.
    pause
    exit /b %errorlevel%
)
echo.
echo Database setup completed successfully!
pause
