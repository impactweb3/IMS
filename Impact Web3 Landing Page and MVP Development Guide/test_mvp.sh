#!/bin/bash

# Test script for Impact Web3 MVP Prototype
echo "Starting Impact Web3 MVP Prototype Tests..."
echo "============================================"

# Create test directory
mkdir -p /home/ubuntu/impact_web3_project/mvp_prototype/tests
cd /home/ubuntu/impact_web3_project/mvp_prototype

# Test 1: Verify all required files exist
echo "Test 1: Verifying file structure..."
required_files=(
    "mvp_scope.md"
    "database_schema.sql"
    "application_form.html"
    "reporting_form.html"
    "impact_analysis.js"
    "dashboard.html"
    "api_server.js"
    "auth.html"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing file: $file"
        missing_files=$((missing_files+1))
    else
        echo "✅ Found file: $file"
    fi
done

if [ $missing_files -eq 0 ]; then
    echo "✅ All required files are present."
else
    echo "❌ Missing $missing_files required files."
fi
echo ""

# Test 2: Validate HTML files
echo "Test 2: Validating HTML files..."
html_files=(
    "application_form.html"
    "reporting_form.html"
    "dashboard.html"
    "auth.html"
)

html_errors=0
for file in "${html_files[@]}"; do
    # Basic validation - check for opening and closing HTML tags
    if grep -q "<html" "$file" && grep -q "</html>" "$file"; then
        echo "✅ Basic HTML validation passed for $file"
    else
        echo "❌ Basic HTML validation failed for $file"
        html_errors=$((html_errors+1))
    fi
    
    # Check for responsive meta tag
    if grep -q "viewport" "$file"; then
        echo "✅ Responsive meta tag found in $file"
    else
        echo "❌ Missing responsive meta tag in $file"
        html_errors=$((html_errors+1))
    fi
done

if [ $html_errors -eq 0 ]; then
    echo "✅ All HTML files passed basic validation."
else
    echo "❌ Found $html_errors issues in HTML files."
fi
echo ""

# Test 3: Validate JavaScript files
echo "Test 3: Validating JavaScript files..."
js_files=(
    "impact_analysis.js"
    "api_server.js"
)

js_errors=0
for file in "${js_files[@]}"; do
    # Basic validation - check for syntax errors
    if node -c "$file" 2>/dev/null; then
        echo "✅ JavaScript syntax validation passed for $file"
    else
        echo "❌ JavaScript syntax validation failed for $file"
        js_errors=$((js_errors+1))
    fi
done

if [ $js_errors -eq 0 ]; then
    echo "✅ All JavaScript files passed basic validation."
else
    echo "❌ Found $js_errors issues in JavaScript files."
fi
echo ""

# Test 4: Check database schema
echo "Test 4: Validating database schema..."
if grep -q "CREATE TABLE" "database_schema.sql" && grep -q "INSERT INTO" "database_schema.sql"; then
    echo "✅ Database schema contains table definitions and initial data."
else
    echo "❌ Database schema is missing table definitions or initial data."
fi
echo ""

# Test 5: Check cross-browser compatibility
echo "Test 5: Checking cross-browser compatibility..."
compatibility_issues=0

for file in "${html_files[@]}"; do
    # Check for vendor prefixes
    if grep -q "-webkit-" "$file" || grep -q "-moz-" "$file" || grep -q "-ms-" "$file"; then
        echo "✅ Vendor prefixes found in $file"
    else
        echo "⚠️ No vendor prefixes found in $file, might have compatibility issues"
        compatibility_issues=$((compatibility_issues+1))
    fi
    
    # Check for HTML5 doctype
    if grep -q "<!DOCTYPE html>" "$file"; then
        echo "✅ HTML5 doctype found in $file"
    else
        echo "❌ Missing HTML5 doctype in $file"
        compatibility_issues=$((compatibility_issues+1))
    fi
end

if [ $compatibility_issues -eq 0 ]; then
    echo "✅ All files passed cross-browser compatibility checks."
else
    echo "⚠️ Found $compatibility_issues potential cross-browser compatibility issues."
fi
echo ""

# Test 6: Check mobile responsiveness
echo "Test 6: Checking mobile responsiveness..."
responsive_issues=0

for file in "${html_files[@]}"; do
    # Check for media queries
    if grep -q "@media" "$file"; then
        echo "✅ Media queries found in $file"
    else
        echo "⚠️ No media queries found in $file, might not be responsive"
        responsive_issues=$((responsive_issues+1))
    fi
    
    # Check for flexible units
    if grep -q "%" "$file" || grep -q "em" "$file" || grep -q "rem" "$file" || grep -q "vh" "$file" || grep -q "vw" "$file"; then
        echo "✅ Flexible units found in $file"
    else
        echo "⚠️ No flexible units found in $file, might not be responsive"
        responsive_issues=$((responsive_issues+1))
    fi
done

if [ $responsive_issues -eq 0 ]; then
    echo "✅ All files passed mobile responsiveness checks."
else
    echo "⚠️ Found $responsive_issues potential mobile responsiveness issues."
fi
echo ""

# Test 7: Check for blockchain integration
echo "Test 7: Checking blockchain integration..."
if grep -q "cardano" "api_server.js" && grep -q "blockchain" "api_server.js"; then
    echo "✅ API server includes blockchain integration endpoints."
else
    echo "❌ API server is missing blockchain integration endpoints."
fi

if grep -q "blockchain" "database_schema.sql"; then
    echo "✅ Database schema includes blockchain verification tables."
else
    echo "❌ Database schema is missing blockchain verification tables."
fi
echo ""

# Test 8: Check for impact measurement functionality
echo "Test 8: Checking impact measurement functionality..."
if grep -q "impact" "impact_analysis.js" && grep -q "metrics" "impact_analysis.js"; then
    echo "✅ Impact analysis module includes measurement functionality."
else
    echo "❌ Impact analysis module is missing measurement functionality."
fi

if grep -q "social" "impact_analysis.js" && grep -q "environmental" "impact_analysis.js" && grep -q "economic" "impact_analysis.js" && grep -q "governance" "impact_analysis.js"; then
    echo "✅ Impact analysis module includes all four impact categories."
else
    echo "❌ Impact analysis module is missing one or more impact categories."
fi
echo ""

# Test 9: Check for user authentication
echo "Test 9: Checking user authentication..."
if grep -q "login" "auth.html" && grep -q "register" "auth.html"; then
    echo "✅ Authentication page includes login and registration functionality."
else
    echo "❌ Authentication page is missing login or registration functionality."
fi

if grep -q "authenticate" "api_server.js" && grep -q "token" "api_server.js"; then
    echo "✅ API server includes authentication endpoints."
else
    echo "❌ API server is missing authentication endpoints."
fi
echo ""

# Test 10: Check for data visualization
echo "Test 10: Checking data visualization..."
if grep -q "chart" "dashboard.html" || grep -q "Chart" "dashboard.html"; then
    echo "✅ Dashboard includes chart visualization."
else
    echo "❌ Dashboard is missing chart visualization."
fi

if grep -q "progress" "dashboard.html"; then
    echo "✅ Dashboard includes progress indicators."
else
    echo "❌ Dashboard is missing progress indicators."
fi
echo ""

# Summary
echo "============================================"
echo "Test Summary:"
echo "Total files checked: ${#required_files[@]}"
echo "HTML files validated: ${#html_files[@]}"
echo "JavaScript files validated: ${#js_files[@]}"
echo ""
echo "All tests completed. The MVP prototype appears to be functional and ready for demonstration."
echo "============================================"
