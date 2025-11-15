#!/bin/bash

echo "🧹 Cleaning up compiled files..."
echo ""

# Count files before cleanup
JS_COUNT=$(find src -name "*.js" -type f 2>/dev/null | wc -l | tr -d ' ')
DTS_COUNT=$(find src -name "*.d.ts" -type f 2>/dev/null | wc -l | tr -d ' ')
MAP_COUNT=$(find src -name "*.js.map" -type f 2>/dev/null | wc -l | tr -d ' ')

echo "Found:"
echo "  - $JS_COUNT .js files"
echo "  - $DTS_COUNT .d.ts files"
echo "  - $MAP_COUNT .map files"
echo ""

if [ "$JS_COUNT" -eq 0 ] && [ "$DTS_COUNT" -eq 0 ] && [ "$MAP_COUNT" -eq 0 ]; then
    echo "✅ No compiled files found in src/ directory"
    exit 0
fi

read -p "Delete these files? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deleting..."
    
    # Remove .js files
    find src -name "*.js" -type f -delete
    
    # Remove .d.ts files
    find src -name "*.d.ts" -type f -delete
    
    # Remove .js.map files
    find src -name "*.js.map" -type f -delete
    
    echo ""
    echo "✅ Cleanup complete!"
    echo ""
    echo "📝 Note: Run 'npm run build' to compile TypeScript to the dist/ folder"
else
    echo ""
    echo "❌ Cleanup cancelled"
fi
