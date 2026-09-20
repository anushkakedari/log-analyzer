# Security

## Secrets and environment files

- Never commit `.env` files or other files that contain real credentials.
- Copy `.env.example` files to `.env` locally and fill in values there.
- Keep secrets in environment variables (or a secret manager), not in source code.

## Docker Compose

- Do not place secret values in `docker-compose.yml` or Dockerfiles.
- Local Compose may load secrets from ignored files such as `backend/.env` via `env_file`.

## Credential exposure

If credentials are ever committed, logged, or otherwise exposed, rotate them before any production or public deployment. Treat leaked keys as compromised.
