#!/bin/bash
# Script to deploy Typing Master Free to GitHub Pages

echo "🚀 Deploying Typing Master Free to GitHub..."

# Ensure we are in the repo directory
cd "$(dirname "$0")"

# Check if repo is clean
git add .
git commit -m "Update Typing Master Free: $(date)" 2>/dev/null || true

# Test SSH connection
if ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH Authentication successful!"
    git remote set-url origin git@github.com:pankajmarch45-ux/typing-master-free.git
    git push -u origin main
    echo "🎉 Pushed to GitHub via SSH!"
else
    echo "⚠️ SSH key not yet authorized on GitHub. Trying HTTPS..."
    git remote set-url origin https://github.com/pankajmarch45-ux/typing-master-free.git
    git push -u origin main
fi

echo ""
echo "🌐 After pushing, go to: https://github.com/pankajmarch45-ux/typing-master-free/settings/pages"
echo "Select Branch: 'main' and click Save."
echo "Your site will be live at: https://pankajmarch45-ux.github.io/typing-master-free/"
