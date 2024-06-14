.PHONY: install start stop

install:
	docker network create ai-toolkit-network || true

start:
	docker compose up -d

build:
	docker compose build

stop:
	docker compose down
