@echo off
title ART_SHINERSSS - Auto Product Sync
color 0E
echo ============================================================
echo       ART_SHINERSSS - Automatic Product Scanner & Sync
echo ============================================================
echo.
echo Scanning folder: assets\images\products\ ...
echo.
python update_products.py
echo.
echo ============================================================
echo Finished! You can now refresh index.html or push to GitHub.
echo ============================================================
pause
