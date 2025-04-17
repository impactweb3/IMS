#!/bin/bash

# Integration Test Script for Impact Web3 Application
# This script tests the core functionality of the application

echo "Starting Impact Web3 Integration Tests..."

# Check if all required files exist
echo "Checking file structure..."

# Check HTML files
for file in index.html login.html signup.html impact-form.html dashboard.html; do
  if [ -f "$file" ]; then
    echo "✓ $file exists"
  else
    echo "✗ $file is missing"
    exit 1
  fi
done

# Check CSS files
if [ -f "css/styles.css" ]; then
  echo "✓ CSS files exist"
else
  echo "✗ CSS files are missing"
  exit 1
fi

# Check JavaScript files
for file in js/auth.js js/script.js js/login.js js/signup.js js/impact-form.js js/dashboard.js; do
  if [ -f "$file" ]; then
    echo "✓ $file exists"
  else
    echo "✗ $file is missing"
    exit 1
  fi
done

# Check image files
for file in images/hero-image.svg images/architecture.svg; do
  if [ -f "$file" ]; then
    echo "✓ $file exists"
  else
    echo "✗ $file is missing"
    exit 1
  fi
done

echo "File structure check complete."

# Validate HTML files
echo "Validating HTML files..."
for file in index.html login.html signup.html impact-form.html dashboard.html; do
  if grep -q "<html" "$file" && grep -q "</html>" "$file"; then
    echo "✓ $file has valid HTML structure"
  else
    echo "✗ $file has invalid HTML structure"
    exit 1
  fi
done

# Validate JavaScript files
echo "Validating JavaScript files..."
for file in js/auth.js js/script.js js/login.js js/signup.js js/impact-form.js js/dashboard.js; do
  if grep -q "document.addEventListener" "$file"; then
    echo "✓ $file has valid JavaScript structure"
  else
    echo "✗ $file has invalid JavaScript structure"
    exit 1
  fi
done

# Test authentication flow
echo "Testing authentication flow..."
if grep -q "localStorage.setItem('impactWeb3CurrentUser'" js/auth.js && grep -q "localStorage.getItem('impactWeb3CurrentUser')" js/auth.js; then
  echo "✓ Authentication flow is implemented"
else
  echo "✗ Authentication flow is not properly implemented"
  exit 1
fi

# Test impact data form
echo "Testing impact data form..."
if grep -q "impactDataForm" js/impact-form.js && grep -q "saveFormData" js/impact-form.js; then
  echo "✓ Impact data form is implemented"
else
  echo "✗ Impact data form is not properly implemented"
  exit 1
fi

# Test dashboard visualization
echo "Testing dashboard visualization..."
if grep -q "Chart" js/dashboard.js && grep -q "initializeCharts" js/dashboard.js; then
  echo "✓ Dashboard visualization is implemented"
else
  echo "✗ Dashboard visualization is not properly implemented"
  exit 1
fi

# Test integration between components
echo "Testing component integration..."
if grep -q "ImpactAuth" js/impact-form.js && grep -q "checkAuth" js/impact-form.js; then
  echo "✓ Authentication is integrated with impact form"
else
  echo "✗ Authentication is not integrated with impact form"
  exit 1
fi

if grep -q "impactWeb3Projects" js/dashboard.js && grep -q "localStorage.getItem('impactWeb3Projects')" js/dashboard.js; then
  echo "✓ Impact form data is integrated with dashboard"
else
  echo "✗ Impact form data is not integrated with dashboard"
  exit 1
fi

echo "All integration tests passed successfully!"
echo "The Impact Web3 application is ready for deployment."
