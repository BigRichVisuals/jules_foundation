ESBUILD = npx esbuild
ESBUILD_FLAGS = --bundle --platform=node --target=es2022 --format=esm --minify --out-extension:.js=.mjs

build-HealthFunction:
	mkdir -p "$(ARTIFACTS_DIR)/src/handlers"
	$(ESBUILD) src/handlers/health.ts $(ESBUILD_FLAGS) --outfile="$(ARTIFACTS_DIR)/src/handlers/health.mjs"

build-ContactFunction:
	mkdir -p "$(ARTIFACTS_DIR)/src/handlers"
	$(ESBUILD) src/handlers/contact.ts $(ESBUILD_FLAGS) --outfile="$(ARTIFACTS_DIR)/src/handlers/contact.mjs"

build-NewsletterFunction:
	mkdir -p "$(ARTIFACTS_DIR)/src/handlers"
	$(ESBUILD) src/handlers/newsletter.ts $(ESBUILD_FLAGS) --outfile="$(ARTIFACTS_DIR)/src/handlers/newsletter.mjs"
