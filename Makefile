.PHONY: help server lint clean test docs

# Variables
PORT := 8000
DEV_PORT := 8080

help:
	@echo "5A AI Project - Available Commands"
	@echo "===================================="
	@echo ""
	@echo "make server        - Start web server on port $(PORT)"
	@echo "make dev           - Start dev server on port $(DEV_PORT)"
	@echo "make check-files   - Check project files"
	@echo "make stats         - Show project statistics"
	@echo "make clean         - Clean cache and temporary files"
	@echo "make test          - Run tests"
	@echo "make help          - Show this help"

server:
	@echo "Starting web server on http://localhost:$(PORT)"
	python3 -m http.server $(PORT)

dev:
	@echo "Starting dev server on http://localhost:$(DEV_PORT)"
	python3 -m http.server $(DEV_PORT)

check-files:
	@echo "Checking required files..."
	@test -f index.html && echo "✓ index.html" || echo "✗ index.html (missing)"
	@test -f 5a-core.js && echo "✓ 5a-core.js" || echo "✗ 5a-core.js (missing)"
	@test -f 5A-ai.js && echo "✓ 5A-ai.js" || echo "✗ 5A-ai.js (missing)"
	@test -f 5A-style.css && echo "✓ 5A-style.css" || echo "✗ 5A-style.css (missing)"
	@test -f manifest.json && echo "✓ manifest.json" || echo "✗ manifest.json (missing)"

stats:
	@echo "Project Statistics:"
	@echo "==================="
	@echo "JavaScript files: $$(find . -name '*.js' -type f | wc -l)"
	@echo "CSS files: $$(find . -name '*.css' -type f | wc -l)"
	@echo "HTML files: $$(find . -name '*.html' -type f | wc -l)"
	@echo "Total size: $$(du -sh . | cut -f1)"

clean:
	@echo "Cleaning cache and temporary files..."
	@rm -rf .cache/
	@rm -rf .parcel-cache/
	@rm -f *.tmp
	@echo "✓ Cleaned"

test:
	@echo "No tests configured yet"
	@echo "Configure tests in package.json"

lint:
	@echo "Running linter..."
	@eslint *.js 2>/dev/null || echo "ESLint not configured"
