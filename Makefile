TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =

install:
	@npm install --registry=http://registry.npm.taobao.org

test: install
	@NODE_ENV=test ./node_modules/.bin/mocha --harmony\
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
    --require should \
		$(MOCHA_OPTS) \
		$(TESTS)

test-cov cov: install
	@-NODE_ENV=test node --harmony\
		node_modules/.bin/istanbul cover --preserve-comments \
		./node_modules/.bin/_mocha \
		-- -u exports \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
    --require should \
		$(MOCHA_OPTS) \
		$(TESTS)

test-all: install test cov

autod: install
	@./node_modules/.bin/autod -w --prefix "~" \
  -D mocha,should,istanbul-harmony
	@$(MAKE) install

.PHONY: test
