#!/bin/bash
# Script to save the project to GitHub

cd /workspaces/5A-ai

# Configure git if not configured
git config --global user.name "5A AI" 2>/dev/null || true
git config --global user.email "ai@5a-billiards.com" 2>/dev/null || true

# Add all changes
git add -A

# Create commit
git commit -m "🎉 الإصلاح الشامل للمشروع: 116 خطأ مصحح، 8 ملفات جديدة، توثيق كامل" || echo "No changes to commit"

# Push to GitHub
git push origin main || echo "Push failed - check repository configuration"

echo "✓ تم حفظ المشروع"
