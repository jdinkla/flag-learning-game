# justfile for flag-learning-game — common workflow shortcuts
# Run `just --list` to see all targets
# Typical loop: `just install` once, then `just dev`

# --- Dev ---

[group('dev')]
[doc("Show available commands")]
default:
    @just --list --unsorted

[group('dev')]
[doc("Install dependencies (clean, reproducible)")]
install:
    npm ci

[group('dev')]
[doc("Install/update dependencies (writes lockfile)")]
add *ARGS:
    npm install {{ARGS}}

[group('dev')]
[doc("Start the Vite dev server on http://localhost:5173")]
dev:
    npm run dev

# --- Build ---

[group('build')]
[doc("Production build to dist/")]
build:
    npm run build

[group('build')]
[doc("Serve the production build locally")]
preview: build
    npm run preview

[group('build')]
[doc("Remove build output and installed dependencies")]
clean:
    rm -rf dist node_modules
